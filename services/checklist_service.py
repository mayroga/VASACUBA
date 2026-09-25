# services/checklist_service.py
# Cuba Travel & Consular Assistant
# Servicio central de checklists.
#
# Las reglas oficiales permanecen en rules_engine.py y data/*.json.
# Este servicio no inventa requisitos.
# VERIFY / UNKNOWN nunca se convierten en CONFIRMED.
# "completed" representa una acción del usuario, no una aprobación oficial.
# Este servicio no certifica cumplimiento legal.

from __future__ import annotations

from typing import Any, Dict, List

from rules_engine import (
    RuleCategory,
    RuleStatus,
    build_checklist as engine_build_checklist,
    evaluate_category,
)


def _status_value(value: Any) -> str:
    if value is None:
        return RuleStatus.UNKNOWN.value
    if isinstance(value, RuleStatus):
        return value.value
    return str(getattr(value, "value", value)).lower()


def _serialize(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value

    if isinstance(value, dict):
        return {str(k): _serialize(v) for k, v in value.items()}

    if isinstance(value, (list, tuple, set)):
        return [_serialize(v) for v in value]

    if hasattr(value, "model_dump"):
        return _serialize(value.model_dump())

    if hasattr(value, "to_dict"):
        return _serialize(value.to_dict())

    if hasattr(value, "__dataclass_fields__"):
        from dataclasses import asdict
        return _serialize(asdict(value))

    if hasattr(value, "__dict__"):
        return {
            str(k): _serialize(v)
            for k, v in vars(value).items()
            if not str(k).startswith("_")
        }

    return str(value)


def _profile_dict(profile: Any) -> Dict[str, Any]:
    if profile is None:
        return {}

    if isinstance(profile, dict):
        return dict(profile)

    if hasattr(profile, "model_dump"):
        return profile.model_dump(exclude_none=True)

    if hasattr(profile, "to_dict"):
        value = profile.to_dict()
        return value if isinstance(value, dict) else {}

    if hasattr(profile, "__dict__"):
        return {
            key: value
            for key, value in vars(profile).items()
            if not key.startswith("_")
        }

    return {}


def _category_value(category: Any) -> str:
    if category is None:
        return ""
    return str(getattr(category, "value", category)).lower()


def _normalize_category(category: Any) -> Any:
    if category is None:
        return None

    if isinstance(category, RuleCategory):
        return category

    raw = str(category).strip().lower()

    for item in RuleCategory:
        if raw in {
            str(item.value).lower(),
            str(item.name).lower(),
        }:
            return item

    return category


def _rule_id(item: Any, fallback: str) -> str:
    if isinstance(item, dict):
        value = (
            item.get("rule_id")
            or item.get("id")
            or item.get("key")
        )
    else:
        value = (
            getattr(item, "rule_id", None)
            or getattr(item, "id", None)
            or getattr(item, "key", None)
        )

    return str(value or fallback)


def _rule_title(item: Any) -> str:
    if isinstance(item, dict):
        value = (
            item.get("title")
            or item.get("name")
            or item.get("description")
            or "Checklist item"
        )
    else:
        value = (
            getattr(item, "title", None)
            or getattr(item, "name", None)
            or getattr(item, "description", None)
            or "Checklist item"
        )

    return str(value)


def _rule_description(item: Any) -> str:
    if isinstance(item, dict):
        value = (
            item.get("message")
            or item.get("description")
            or item.get("title")
            or ""
        )
    else:
        value = (
            getattr(item, "message", None)
            or getattr(item, "description", None)
            or getattr(item, "title", None)
            or ""
        )

    return str(value)


def _rule_source(item: Any) -> Any:
    if isinstance(item, dict):
        return item.get("source") or item.get("sources")

    return getattr(item, "source", None) or getattr(item, "sources", None)


def _item_status(status: Any) -> str:
    value = _status_value(status)

    if value == RuleStatus.ACTIVE.value:
        return "CONFIRMED"

    if value in {
        RuleStatus.CONDITIONAL.value,
        RuleStatus.VERIFY.value,
        RuleStatus.EXPIRED.value,
    }:
        return "VERIFY"

    return "UNKNOWN"


def _evaluate_category(
    profile: Dict[str, Any],
    category: Any,
) -> List[Any]:
    try:
        result = evaluate_category(profile, category)
    except TypeError:
        result = evaluate_category(
            profile=profile,
            category=category,
        )

    if result is None:
        return []

    if isinstance(result, (list, tuple)):
        return list(result)

    return [result]


def _engine_checklist(
    profile: Dict[str, Any],
    category: Any = None,
) -> Any:
    try:
        if category is None:
            return engine_build_checklist(profile)

        return engine_build_checklist(
            profile,
            category,
        )

    except (TypeError, AttributeError):
        try:
            if category is None:
                return engine_build_checklist(
                    profile=profile,
                )

            return engine_build_checklist(
                profile=profile,
                category=category,
            )

        except (TypeError, AttributeError):
            return None


def _normalize_engine_items(
    raw: Any,
    category: Any = None,
) -> List[Dict[str, Any]]:
    if raw is None:
        return []

    if isinstance(raw, dict):
        if isinstance(raw.get("items"), list):
            raw_items = raw["items"]
        elif isinstance(raw.get("checklist"), list):
            raw_items = raw["checklist"]
        elif isinstance(raw.get("results"), list):
            raw_items = raw["results"]
        else:
            raw_items = [raw]

    elif isinstance(raw, (list, tuple)):
        raw_items = list(raw)

    else:
        raw_items = [raw]

    items: List[Dict[str, Any]] = []

    for index, item in enumerate(raw_items, start=1):
        if isinstance(item, dict):
            source_status = (
                item.get("status")
                or item.get("rule_status")
            )

            status = (
                item.get("checklist_status")
                or (
                    _item_status(source_status)
                    if source_status is not None
                    else "VERIFY"
                )
            )

            item_id = (
                item.get("id")
                or item.get("rule_id")
                or f"checklist-{index}"
            )

            title = (
                item.get("title")
                or item.get("name")
                or item.get("description")
                or "Checklist item"
            )

            description = (
                item.get("description")
                or item.get("message")
                or title
            )

            source = item.get("source") or item.get("sources")
            completed = bool(item.get("completed", False))

        else:
            source_status = getattr(item, "status", None)
            status = _item_status(source_status)
            item_id = _rule_id(item, f"checklist-{index}")
            title = _rule_title(item)
            description = _rule_description(item)
            source = _rule_source(item)
            completed = bool(getattr(item, "completed", False))

        if status != "CONFIRMED":
            completed = False

        items.append(
            {
                "id": str(item_id),
                "title": str(title),
                "description": str(description),
                "status": str(status),
                "completed": completed,
                "source": _serialize(source),
                "category": (
                    _category_value(category)
                    if category is not None
                    else None
                ),
            }
        )

    return items


def _deduplicate_items(
    items: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    output: List[Dict[str, Any]] = []
    seen = set()

    for item in items:
        item_id = str(item.get("id", ""))

        if item_id in seen:
            continue

        seen.add(item_id)
        output.append(item)

    return output


def build_checklist(
    profile: Any,
    category: Any = None,
) -> Dict[str, Any]:
    profile_data = _profile_dict(profile)
    normalized_category = _normalize_category(category)

    raw = _engine_checklist(
        profile_data,
        normalized_category,
    )

    items = _normalize_engine_items(
        raw,
        normalized_category,
    )

    if not items:
        if normalized_category is not None:
            items = _normalize_engine_items(
                _evaluate_category(
                    profile_data,
                    normalized_category,
                ),
                normalized_category,
            )
        else:
            for category_item in RuleCategory:
                items.extend(
                    _normalize_engine_items(
                        _evaluate_category(
                            profile_data,
                            category_item,
                        ),
                        category_item,
                    )
                )

    return _finalize_checklist(
        items=_deduplicate_items(items),
        profile=profile_data,
        category=normalized_category,
    )


def get_checklist(
    profile: Any,
    category: Any = None,
) -> Dict[str, Any]:
    return build_checklist(profile, category)


def build_category_checklist(
    profile: Any,
    category: Any,
) -> Dict[str, Any]:
    return build_checklist(profile, category)


def generate_category_checklist(
    profile: Any,
    category: Any,
) -> Dict[str, Any]:
    return build_category_checklist(profile, category)


def _finalize_checklist(
    items: List[Dict[str, Any]],
    profile: Dict[str, Any],
    category: Any = None,
) -> Dict[str, Any]:
    confirmed = sum(
        1 for item in items
        if item["status"] == "CONFIRMED"
    )

    verification = sum(
        1 for item in items
        if item["status"] == "VERIFY"
    )

    unknown = sum(
        1 for item in items
        if item["status"] == "UNKNOWN"
    )

    completed = sum(
        1 for item in items
        if item["completed"]
    )

    if unknown:
        status = RuleStatus.UNKNOWN.value
    elif verification:
        status = RuleStatus.VERIFY.value
    else:
        status = RuleStatus.ACTIVE.value

    category_value = (
        _category_value(category)
        if category is not None
        else None
    )

    return {
        "status": status,
        "category": category_value,
        "profile": profile,
        "items": items,
        "total": len(items),
        "confirmed": confirmed,
        "verification": verification,
        "unknown": unknown,
        "completed": completed,
        "pending": len(items) - completed,
        "requires_verification": bool(
            verification or unknown
        ),
        "ready": (
            len(items) > 0
            and completed == len(items)
            and verification == 0
            and unknown == 0
        ),
    }


def update_checklist(
    checklist: Any,
    completed: Any = None,
) -> Dict[str, Any]:
    if isinstance(checklist, dict):
        result = dict(checklist)
        items = list(result.get("items") or [])

    elif isinstance(checklist, list):
        result = {}
        items = list(checklist)

    else:
        result = {}
        items = []

    if completed is None:
        completed = []

    if isinstance(completed, dict):
        completed_ids = {
            str(key)
            for key, value in completed.items()
            if bool(value)
        }

    elif isinstance(completed, (list, tuple, set)):
        completed_ids = {
            str(value)
            for value in completed
        }

    else:
        completed_ids = set()

    normalized_items: List[Dict[str, Any]] = []

    for index, item in enumerate(items, start=1):
        if not isinstance(item, dict):
            continue

        normalized = dict(item)

        item_id = str(
            normalized.get("id")
            or normalized.get("rule_id")
            or f"checklist-{index}"
        )

        normalized["id"] = item_id

        status = _item_status(
            normalized.get("rule_status")
            or normalized.get("status")
        )

        existing_status = str(
            normalized.get("status") or ""
        ).upper()

        if existing_status in {
            "CONFIRMED",
            "VERIFY",
            "UNKNOWN",
        }:
            status = existing_status

        normalized["status"] = status
        normalized["completed"] = (
            item_id in completed_ids
            and status == "CONFIRMED"
        )

        normalized_items.append(normalized)

    return _finalize_checklist(
        items=normalized_items,
        profile=result.get("profile") or {},
        category=result.get("category"),
    )


def reset_checklist(
    checklist: Any,
) -> Dict[str, Any]:
    if isinstance(checklist, dict):
        result = dict(checklist)
        items = list(result.get("items") or [])

    elif isinstance(checklist, list):
        result = {}
        items = list(checklist)

    else:
        result = {}
        items = []

    for item in items:
        if isinstance(item, dict):
            item["completed"] = False

    return _finalize_checklist(
        items=[
            item for item in items
            if isinstance(item, dict)
        ],
        profile=result.get("profile") or {},
        category=result.get("category"),
    )


def complete_checklist(
    checklist: Any,
) -> Dict[str, Any]:
    if isinstance(checklist, dict):
        result = dict(checklist)
        items = list(result.get("items") or [])

    elif isinstance(checklist, list):
        result = {}
        items = list(checklist)

    else:
        result = {}
        items = []

    for item in items:
        if not isinstance(item, dict):
            continue

        item["completed"] = (
            str(item.get("status") or "").upper()
            == "CONFIRMED"
        )

    return _finalize_checklist(
        items=[
            item for item in items
            if isinstance(item, dict)
        ],
        profile=result.get("profile") or {},
        category=result.get("category"),
    )


def get_checklist_categories() -> List[str]:
    return [
        _category_value(category)
        for category in RuleCategory
    ]


def checklist_categories() -> List[str]:
    return get_checklist_categories()


def checklist_progress(checklist: Any) -> Dict[str, Any]:
    if isinstance(checklist, dict):
        items = checklist.get("items") or []
    elif isinstance(checklist, list):
        items = checklist
    else:
        items = []

    total = len(items)

    completed = sum(
        1
        for item in items
        if isinstance(item, dict)
        and bool(item.get("completed"))
    )

    verification = sum(
        1
        for item in items
        if isinstance(item, dict)
        and str(item.get("status", "")).upper() == "VERIFY"
    )

    unknown = sum(
        1
        for item in items
        if isinstance(item, dict)
        and str(item.get("status", "")).upper() == "UNKNOWN"
    )

    percentage = (
        round((completed / total) * 100, 2)
        if total
        else 0
    )

    return {
        "total": total,
        "completed": completed,
        "pending": total - completed,
        "verification": verification,
        "unknown": unknown,
        "percentage": percentage,
        "ready": (
            total > 0
            and completed == total
            and verification == 0
            and unknown == 0
        ),
    }


def merge_checklist_state(
    checklist: Any,
    state: Any = None,
) -> Dict[str, Any]:
    """
    Compatible con:
    - lista de IDs completados
    - {id: true/false}
    - {completed: [...]}
    - {items: [...]}
    - {checklist: [...], completed: [...]}
    - {profile: {...}, checklist: [...]}
    """

    if isinstance(checklist, dict) and state is None:
        if "checklist" in checklist:
            payload = checklist
            raw_checklist = payload.get("checklist")

            if isinstance(raw_checklist, dict):
                base = dict(raw_checklist)

            elif isinstance(raw_checklist, list):
                base = {
                    "items": list(raw_checklist),
                    "profile": payload.get("profile") or {},
                    "category": payload.get("category"),
                }

            else:
                base = {
                    "profile": payload.get("profile") or {},
                    "category": payload.get("category"),
                    "items": [],
                }

            completed = payload.get("completed")

            if completed is None and isinstance(
                payload.get("state"),
                dict,
            ):
                completed = payload["state"].get("completed")

            return update_checklist(
                base,
                completed or [],
            )

        return checklist

    if state is None:
        if isinstance(checklist, list):
            return {"items": checklist}

        if isinstance(checklist, dict):
            return checklist

        return build_checklist({})

    if isinstance(state, dict):
        if "completed" in state:
            completed = state["completed"]

        elif (
            "items" in state
            and isinstance(state["items"], list)
        ):
            completed = [
                item.get("id")
                for item in state["items"]
                if (
                    isinstance(item, dict)
                    and item.get("completed")
                )
            ]

        else:
            completed = state

    else:
        completed = state

    if isinstance(checklist, dict):
        base = dict(checklist)
    else:
        base = {
            "items": list(checklist or []),
        }

    return update_checklist(
        base,
        completed,
    )


def checklist_summary(
    checklist: Any,
) -> Dict[str, Any]:
    progress = checklist_progress(checklist)

    status = None

    if isinstance(checklist, dict):
        status = checklist.get("status")

    return {
        "status": status,
        **progress,
    }


__all__ = [
    "build_checklist",
    "get_checklist",
    "build_category_checklist",
    "generate_category_checklist",
    "update_checklist",
    "reset_checklist",
    "complete_checklist",
    "get_checklist_categories",
    "checklist_categories",
    "checklist_progress",
    "merge_checklist_state",
    "checklist_summary",
]
