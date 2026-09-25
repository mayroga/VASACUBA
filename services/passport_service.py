# services/passport_service.py
# Cuba Travel & Consular Assistant
# Servicio de pasaporte cubano.
# No inventa requisitos oficiales.
# VERIFY / UNKNOWN nunca se convierten en CONFIRMED.
# La aplicación orienta y prepara; no emite pasaportes.

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

from rules_engine import (
    RuleCategory,
    RuleStatus,
    evaluate_category,
)

DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "cuba_passport.json"
)


def _value(value: Any) -> str:
    if value is None:
        return ""
    return str(
        getattr(value, "value", value)
    ).lower().strip()


def _serialize(value: Any) -> Any:
    if value is None or isinstance(
        value,
        (str, int, float, bool),
    ):
        return value

    if isinstance(value, dict):
        return {
            str(k): _serialize(v)
            for k, v in value.items()
        }

    if isinstance(
        value,
        (list, tuple, set),
    ):
        return [
            _serialize(v)
            for v in value
        ]

    if hasattr(value, "model_dump"):
        return _serialize(
            value.model_dump()
        )

    if hasattr(value, "to_dict"):
        return _serialize(
            value.to_dict()
        )

    if hasattr(value, "__dict__"):
        return {
            str(k): _serialize(v)
            for k, v in vars(value).items()
            if not str(k).startswith("_")
        }

    return str(value)


def _profile(profile: Any) -> Dict[str, Any]:
    if profile is None:
        return {}

    if isinstance(profile, dict):
        return dict(profile)

    if hasattr(profile, "model_dump"):
        return profile.model_dump(
            exclude_none=True
        )

    if hasattr(profile, "to_dict"):
        data = profile.to_dict()
        return (
            data
            if isinstance(data, dict)
            else {}
        )

    if hasattr(profile, "__dict__"):
        return {
            str(k): v
            for k, v in vars(profile).items()
            if not str(k).startswith("_")
        }

    return {}


def _load_data() -> Dict[str, Any]:
    try:
        if not DATA_FILE.exists():
            return {}

        with DATA_FILE.open(
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        return (
            data
            if isinstance(data, dict)
            else {}
        )

    except (
        OSError,
        ValueError,
        TypeError,
    ):
        return {}


def get_passport_data() -> Dict[str, Any]:
    return _load_data()


def _status(value: Any) -> str:
    raw = _value(value)

    if raw == RuleStatus.ACTIVE.value:
        return "CONFIRMED"

    if raw in {
        RuleStatus.CONDITIONAL.value,
        RuleStatus.VERIFY.value,
        RuleStatus.EXPIRED.value,
    }:
        return "VERIFY"

    return "UNKNOWN"


def _evaluate_rules(
    profile: Dict[str, Any],
) -> List[Any]:

    try:
        result = evaluate_category(
            profile,
            RuleCategory.PASSPORT,
        )

    except TypeError:
        try:
            result = evaluate_category(
                profile=profile,
                category=RuleCategory.PASSPORT,
            )
        except Exception:
            result = []

    except Exception:
        result = []

    if result is None:
        return []

    if isinstance(
        result,
        (list, tuple),
    ):
        return list(result)

    return [result]


def _normalize_rule(
    item: Any,
    index: int,
) -> Dict[str, Any]:

    if isinstance(item, dict):
        source_status = (
            item.get("status")
            or item.get("rule_status")
            or "UNKNOWN"
        )

        rule_id = (
            item.get("id")
            or item.get("rule_id")
            or item.get("key")
            or f"passport-rule-{index}"
        )

        title = (
            item.get("title")
            or item.get("name")
            or item.get("description")
            or "Passport requirement"
        )

        description = (
            item.get("description")
            or item.get("message")
            or title
        )

        source = (
            item.get("source")
            or item.get("sources")
        )

        required = bool(
            item.get(
                "required",
                item.get("mandatory", False),
            )
        )

    else:
        source_status = getattr(
            item,
            "status",
            None,
        )

        rule_id = (
            getattr(item, "id", None)
            or getattr(item, "rule_id", None)
            or f"passport-rule-{index}"
        )

        title = (
            getattr(item, "title", None)
            or getattr(item, "name", None)
            or getattr(item, "description", None)
            or "Passport requirement"
        )

        description = (
            getattr(item, "description", None)
            or getattr(item, "message", None)
            or title
        )

        source = (
            getattr(item, "source", None)
            or getattr(item, "sources", None)
        )

        required = bool(
            getattr(
                item,
                "required",
                getattr(
                    item,
                    "mandatory",
                    False,
                ),
            )
        )

    return {
        "id": str(rule_id),
        "title": str(title),
        "description": str(description),
        "status": _status(source_status),
        "required": required,
        "source": _serialize(source),
    }


def evaluate_passport(
    profile: Any,
) -> Dict[str, Any]:

    data = _profile(profile)

    rules = [
        _normalize_rule(
            item,
            index,
        )
        for index, item in enumerate(
            _evaluate_rules(data),
            1,
        )
    ]

    confirmed = sum(
        item["status"] == "CONFIRMED"
        for item in rules
    )

    verification = sum(
        item["status"] == "VERIFY"
        for item in rules
    )

    unknown = sum(
        item["status"] == "UNKNOWN"
        for item in rules
    )

    if unknown:
        status = RuleStatus.UNKNOWN.value
    elif verification:
        status = RuleStatus.VERIFY.value
    else:
        status = RuleStatus.ACTIVE.value

    return {
        "status": status,
        "profile": data,
        "rules": rules,
        "checklist": rules,
        "confirmed": confirmed,
        "verification": verification,
        "unknown": unknown,
        "requires_verification": bool(
            verification or unknown
        ),
        "official_document_issued": False,
        "app_issues_passport": False,
    }


def evaluate_passport_profile(
    profile: Any,
) -> Dict[str, Any]:
    return evaluate_passport(profile)


def get_passport_checklist(
    profile: Any,
) -> Dict[str, Any]:
    result = evaluate_passport(profile)

    items = []

    for item in result.get(
        "rules",
        [],
    ):
        entry = dict(item)
        entry.setdefault(
            "completed",
            False,
        )
        items.append(entry)

    result["checklist"] = items
    result["items"] = items
    result["total"] = len(items)

    result["completed"] = sum(
        bool(item.get("completed"))
        for item in items
    )

    result["pending"] = (
        result["total"]
        - result["completed"]
    )

    return result


def passport_checklist(
    profile: Any,
) -> Dict[str, Any]:
    """
    Alias de compatibilidad utilizado por main.py.
    """
    return get_passport_checklist(profile)


def build_passport_checklist(
    profile: Any,
) -> Dict[str, Any]:
    return get_passport_checklist(profile)


def passport_status(
    profile: Any,
) -> Dict[str, Any]:
    return evaluate_passport(profile)


def get_passport_status(
    profile: Any,
) -> Dict[str, Any]:
    return evaluate_passport(profile)


def passport_types() -> List[str]:
    data = _load_data()

    for key in (
        "passport_types",
        "types",
        "tramitations",
        "tramites",
    ):
        value = data.get(key)

        if isinstance(value, list):
            return [
                (
                    str(
                        item.get("id")
                        or item.get("name")
                        or item.get("title")
                    )
                    if isinstance(item, dict)
                    else str(item)
                )
                for item in value
            ]

        if isinstance(value, dict):
            return [
                str(key_name)
                for key_name in value.keys()
            ]

    return [
        "new",
        "renewal",
        "lost",
        "stolen",
        "damaged",
        "minor",
        "abroad",
    ]


def get_passport_types() -> List[str]:
    return passport_types()


def passport_summary(
    profile: Any,
) -> Dict[str, Any]:

    result = evaluate_passport(
        profile
    )

    return {
        "status": result.get(
            "status"
        ),
        "confirmed": result.get(
            "confirmed",
            0,
        ),
        "verification": result.get(
            "verification",
            0,
        ),
        "unknown": result.get(
            "unknown",
            0,
        ),
        "requires_verification": result.get(
            "requires_verification",
            True,
        ),
    }


def complete_passport_item(
    profile: Any,
    item_id: str,
) -> Dict[str, Any]:

    result = get_passport_checklist(
        profile
    )

    target = str(
        item_id
    ).strip().lower()

    for item in result.get(
        "checklist",
        [],
    ):
        current = str(
            item.get("id", "")
        ).strip().lower()

        if current == target:
            if item.get("status") == "CONFIRMED":
                item["completed"] = True

    result["completed"] = sum(
        bool(item.get("completed"))
        for item in result.get(
            "checklist",
            [],
        )
    )

    result["pending"] = (
        result.get("total", 0)
        - result["completed"]
    )

    return result


__all__ = [
    "get_passport_data",
    "evaluate_passport",
    "evaluate_passport_profile",
    "get_passport_checklist",
    "passport_checklist",
    "build_passport_checklist",
    "passport_status",
    "get_passport_status",
    "passport_types",
    "get_passport_types",
    "passport_summary",
    "complete_passport_item",
]
