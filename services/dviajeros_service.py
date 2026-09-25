# services/dviajeros_service.py
# Cuba Travel & Consular Assistant
# Servicio D'Viajeros.
# No inventa requisitos oficiales.
# VERIFY / UNKNOWN se conservan como estados de verificación.

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from rules_engine import (
    RuleCategory,
    RuleStatus,
    evaluate_category,
)

DATA_FILE = (
    Path(__file__).resolve().parent.parent
    / "data"
    / "dviajeros.json"
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


def get_dviajeros_data() -> Dict[str, Any]:
    return _load_data()


def _find_modules(
    data: Dict[str, Any],
) -> List[Any]:

    for key in (
        "modules",
        "modulos",
        "dviajeros_modules",
        "workflow",
        "steps",
    ):
        value = data.get(key)

        if isinstance(value, list):
            return value

        if isinstance(value, dict):
            return [
                {
                    "id": str(k),
                    **(
                        v
                        if isinstance(v, dict)
                        else {"value": v}
                    ),
                }
                for k, v in value.items()
            ]

    return []


def get_dviajeros_modules() -> List[Dict[str, Any]]:
    data = _load_data()
    raw = _find_modules(data)

    result: List[Dict[str, Any]] = []

    for index, module in enumerate(
        raw,
        1,
    ):
        if isinstance(module, dict):
            item = dict(module)

            module_id = (
                item.get("id")
                or item.get("module_id")
                or item.get("key")
                or f"module-{index}"
            )

            name = (
                item.get("name")
                or item.get("title")
                or item.get("module")
                or str(module_id)
            )

            item["id"] = str(module_id)
            item["name"] = str(name)

        else:
            item = {
                "id": f"module-{index}",
                "name": str(module),
            }

        result.append(
            _serialize(item)
        )

    if result:
        return result

    return [
        {
            "id": "personal_information",
            "name": "PERSONAL_INFORMATION",
            "status": "NOT_STARTED",
        },
        {
            "id": "migration",
            "name": "MIGRATION",
            "status": "NOT_STARTED",
        },
        {
            "id": "health",
            "name": "HEALTH",
            "status": "NOT_STARTED",
        },
        {
            "id": "customs",
            "name": "CUSTOMS",
            "status": "NOT_STARTED",
        },
        {
            "id": "review",
            "name": "REVIEW",
            "status": "NOT_STARTED",
        },
        {
            "id": "submission_or_official_portal",
            "name": "SUBMISSION_OR_OFFICIAL_PORTAL",
            "status": "NOT_STARTED",
        },
    ]


def dviajeros_modules() -> List[Dict[str, Any]]:
    """
    Alias de compatibilidad utilizado por main.py.
    """
    return get_dviajeros_modules()


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
            RuleCategory.DVIAJEROS,
        )

    except TypeError:
        try:
            result = evaluate_category(
                profile=profile,
                category=RuleCategory.DVIAJEROS,
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
        status = (
            item.get("status")
            or item.get("rule_status")
            or "UNKNOWN"
        )

        rule_id = (
            item.get("id")
            or item.get("rule_id")
            or item.get("key")
            or f"dviajeros-rule-{index}"
        )

        title = (
            item.get("title")
            or item.get("name")
            or item.get("description")
            or "D'Viajeros requirement"
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

    else:
        status = getattr(
            item,
            "status",
            None,
        )

        rule_id = (
            getattr(item, "id", None)
            or getattr(item, "rule_id", None)
            or f"dviajeros-rule-{index}"
        )

        title = (
            getattr(item, "title", None)
            or getattr(item, "name", None)
            or getattr(item, "description", None)
            or "D'Viajeros requirement"
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

    return {
        "id": str(rule_id),
        "title": str(title),
        "description": str(description),
        "status": _status(status),
        "source": _serialize(source),
    }


def evaluate_dviajeros(
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
        "modules": get_dviajeros_modules(),
        "confirmed": confirmed,
        "verification": verification,
        "unknown": unknown,
        "requires_verification": bool(
            verification or unknown
        ),
        "official_portal": (
            "https://dviajeros.mitrans.gob.cu/"
        ),
        "official_qr_generated": False,
        "app_issues_official_document": False,
    }


def evaluate_dviajeros_profile(
    profile: Any,
) -> Dict[str, Any]:
    return evaluate_dviajeros(profile)


def get_dviajeros_checklist(
    profile: Any,
) -> Dict[str, Any]:

    result = evaluate_dviajeros(
        profile
    )

    modules = []

    for module in result.get(
        "modules",
        [],
    ):
        item = dict(module)

        item.setdefault(
            "status",
            "NOT_STARTED",
        )

        item.setdefault(
            "completed",
            False,
        )

        modules.append(item)

    result["checklist"] = modules
    return result


def dviajeros_statuses() -> List[str]:
    return [
        "NOT_STARTED",
        "IN_PROGRESS",
        "READY_FOR_OFFICIAL_FORM",
        "COMPLETED",
        "VERIFY",
        "INCOMPLETE",
    ]


def get_dviajeros_statuses() -> List[str]:
    return dviajeros_statuses()


def dviajeros_workflow() -> List[str]:
    data = _load_data()

    for key in (
        "workflow",
        "flujo",
        "steps",
    ):
        value = data.get(key)

        if isinstance(value, list):
            return [
                str(
                    item.get("name")
                    or item.get("id")
                    or item
                )
                if isinstance(item, dict)
                else str(item)
                for item in value
            ]

    return [
        "PERSONAL_INFORMATION",
        "MIGRATION",
        "HEALTH",
        "CUSTOMS",
        "REVIEW",
        "SUBMISSION_OR_OFFICIAL_PORTAL",
    ]


def get_dviajeros_workflow() -> List[str]:
    return dviajeros_workflow()


def dviajeros_summary(
    profile: Any,
) -> Dict[str, Any]:

    result = evaluate_dviajeros(
        profile
    )

    return {
        "status": result.get("status"),
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
        "modules": len(
            result.get(
                "modules",
                [],
            )
        ),
        "requires_verification": result.get(
            "requires_verification",
            True,
        ),
    }


__all__ = [
    "get_dviajeros_data",
    "get_dviajeros_modules",
    "dviajeros_modules",
    "evaluate_dviajeros",
    "evaluate_dviajeros_profile",
    "get_dviajeros_checklist",
    "dviajeros_statuses",
    "get_dviajeros_statuses",
    "dviajeros_workflow",
    "get_dviajeros_workflow",
    "dviajeros_summary",
]
