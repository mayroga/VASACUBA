# services/document_service.py
# Cuba Travel & Consular Assistant
# Servicio de documentos.
# No inventa requisitos oficiales.
# VERIFY / UNKNOWN nunca se convierten en CONFIRMED.

from __future__ import annotations

from typing import Any, Dict, List

from rules_engine import (
    RuleCategory,
    RuleStatus,
    evaluate_category,
    build_checklist as engine_build_checklist,
)


def _value(value: Any) -> str:
    if value is None:
        return ""
    return str(getattr(value, "value", value)).lower().strip()


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
        return profile.model_dump(exclude_none=True)
    if hasattr(profile, "to_dict"):
        data = profile.to_dict()
        return data if isinstance(data, dict) else {}
    if hasattr(profile, "__dict__"):
        return {
            k: v
            for k, v in vars(profile).items()
            if not str(k).startswith("_")
        }
    return {}


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


def _item_id(item: Any, fallback: str) -> str:
    if isinstance(item, dict):
        value = (
            item.get("id")
            or item.get("document_id")
            or item.get("rule_id")
            or item.get("key")
        )
    else:
        value = (
            getattr(item, "id", None)
            or getattr(item, "document_id", None)
            or getattr(item, "rule_id", None)
            or getattr(item, "key", None)
        )
    return str(value or fallback)


def _title(item: Any) -> str:
    if isinstance(item, dict):
        return str(
            item.get("title")
            or item.get("name")
            or item.get("document")
            or item.get("description")
            or "Document"
        )

    return str(
        getattr(item, "title", None)
        or getattr(item, "name", None)
        or getattr(item, "document", None)
        or getattr(item, "description", None)
        or "Document"
    )


def _description(item: Any) -> str:
    if isinstance(item, dict):
        return str(
            item.get("description")
            or item.get("message")
            or item.get("title")
            or ""
        )

    return str(
        getattr(item, "description", None)
        or getattr(item, "message", None)
        or getattr(item, "title", None)
        or ""
    )


def _source(item: Any) -> Any:
    if isinstance(item, dict):
        return item.get("source") or item.get("sources")

    return (
        getattr(item, "source", None)
        or getattr(item, "sources", None)
    )


def _normalize_items(
    raw: Any,
    category: Any = None,
) -> List[Dict[str, Any]]:
    if raw is None:
        return []

    if isinstance(raw, dict):
        if isinstance(raw.get("items"), list):
            raw = raw["items"]
        elif isinstance(raw.get("documents"), list):
            raw = raw["documents"]
        elif isinstance(raw.get("checklist"), list):
            raw = raw["checklist"]
        elif isinstance(raw.get("results"), list):
            raw = raw["results"]
        else:
            raw = [raw]

    elif not isinstance(raw, (list, tuple)):
        raw = [raw]

    result: List[Dict[str, Any]] = []

    for index, item in enumerate(raw, 1):

        if isinstance(item, dict):
            source_status = (
                item.get("status")
                or item.get("rule_status")
            )

            status = item.get("document_status")

            if not status:
                status = (
                    _status(source_status)
                    if source_status is not None
                    else "VERIFY"
                )

            document_id = (
                item.get("id")
                or item.get("document_id")
                or item.get("rule_id")
                or f"document-{index}"
            )

            title = (
                item.get("title")
                or item.get("name")
                or item.get("document")
                or item.get("description")
                or "Document"
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

            completed = bool(
                item.get("completed", False)
            )

        else:
            source_status = getattr(
                item,
                "status",
                None,
            )

            status = _status(source_status)
            document_id = _item_id(
                item,
                f"document-{index}",
            )
            title = _title(item)
            description = _description(item)
            source = _source(item)

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

            completed = bool(
                getattr(
                    item,
                    "completed",
                    False,
                )
            )

        if status != "CONFIRMED":
            completed = False

        result.append(
            {
                "id": str(document_id),
                "title": str(title),
                "description": str(description),
                "status": str(status).upper(),
                "required": required,
                "completed": completed,
                "source": _serialize(source),
                "category": (
                    _value(category)
                    if category is not None
                    else None
                ),
            }
        )

    return result


def _category_items(
    profile: Dict[str, Any],
    category: Any,
) -> List[Dict[str, Any]]:
    try:
        raw = evaluate_category(
            profile,
            category,
        )
    except TypeError:
        try:
            raw = evaluate_category(
                profile=profile,
                category=category,
            )
        except Exception:
            raw = []
    except Exception:
        raw = []

    return _normalize_items(
        raw,
        category,
    )


def evaluate_documents(
    profile: Any,
    category: Any = None,
) -> Dict[str, Any]:
    data = _profile(profile)

    if category is not None:
        items = _category_items(
            data,
            category,
        )
    else:
        items = []

        for category_item in RuleCategory:
            items.extend(
                _category_items(
                    data,
                    category_item,
                )
            )

    return _finalize(
        items,
        data,
        category,
    )


def evaluate_complete_travel_documents(
    profile: Any,
) -> Dict[str, Any]:
    return evaluate_documents(profile)


def evaluate_document_inventory(
    profile: Any,
) -> Dict[str, Any]:
    """
    Compatibilidad para main.py.

    Devuelve el inventario documental generado
    a partir de las reglas existentes.
    No inventa documentos ni requisitos.
    """
    result = evaluate_documents(profile)

    documents = result.get(
        "documents",
        result.get("items", []),
    )

    return {
        **result,
        "documents": documents,
        "items": documents,
        "inventory": documents,
        "document_inventory": documents,
        "total_documents": len(documents),
    }


def evaluate_travel_documents(
    profile: Any,
) -> Dict[str, Any]:
    return evaluate_complete_travel_documents(
        profile
    )


def get_documents(
    profile: Any,
    category: Any = None,
) -> Dict[str, Any]:
    return evaluate_documents(
        profile,
        category,
    )


def build_document_checklist(
    profile: Any,
    category: Any = None,
) -> Dict[str, Any]:

    data = _profile(profile)

    try:
        raw = (
            engine_build_checklist(data)
            if category is None
            else engine_build_checklist(
                data,
                category,
            )
        )

        items = _normalize_items(
            raw,
            category,
        )

        if items:
            return _finalize(
                items,
                data,
                category,
            )

    except (TypeError, AttributeError):
        pass
    except Exception:
        pass

    return evaluate_documents(
        data,
        category,
    )


def get_document_checklist(
    profile: Any,
    category: Any = None,
) -> Dict[str, Any]:
    return build_document_checklist(
        profile,
        category,
    )


def document_categories() -> List[str]:
    return [
        _value(category)
        for category in RuleCategory
    ]


def get_document_categories() -> List[str]:
    return document_categories()


def _finalize(
    items: List[Dict[str, Any]],
    profile: Dict[str, Any],
    category: Any = None,
) -> Dict[str, Any]:

    unique: List[Dict[str, Any]] = []
    seen = set()

    for item in items:
        item_id = str(
            item.get("id", "")
        )

        if item_id in seen:
            continue

        seen.add(item_id)
        unique.append(item)

    confirmed = sum(
        item.get("status") == "CONFIRMED"
        for item in unique
    )

    verification = sum(
        item.get("status") == "VERIFY"
        for item in unique
    )

    unknown = sum(
        item.get("status") == "UNKNOWN"
        for item in unique
    )

    required = sum(
        bool(item.get("required"))
        for item in unique
    )

    completed = sum(
        bool(item.get("completed"))
        for item in unique
    )

    if unknown:
        status = RuleStatus.UNKNOWN.value
    elif verification:
        status = RuleStatus.VERIFY.value
    else:
        status = RuleStatus.ACTIVE.value

    return {
        "status": status,
        "category": (
            _value(category)
            if category is not None
            else None
        ),
        "profile": profile,
        "documents": unique,
        "items": unique,
        "inventory": unique,
        "document_inventory": unique,
        "total": len(unique),
        "total_documents": len(unique),
        "required": required,
        "confirmed": confirmed,
        "verification": verification,
        "unknown": unknown,
        "completed": completed,
        "pending": len(unique) - completed,
        "requires_verification": bool(
            verification or unknown
        ),
        "ready": (
            len(unique) > 0
            and completed == len(unique)
            and verification == 0
            and unknown == 0
        ),
    }


def update_documents(
    documents: Any,
    completed: Any = None,
) -> Dict[str, Any]:

    if isinstance(documents, dict):
        result = dict(documents)
        items = list(
            result.get("documents")
            or result.get("items")
            or result.get("inventory")
            or []
        )

    elif isinstance(documents, list):
        result = {}
        items = list(documents)

    else:
        result = {}
        items = []

    if completed is None:
        completed = []

    if isinstance(completed, dict):
        completed_ids = {
            str(k)
            for k, v in completed.items()
            if bool(v)
        }

    elif isinstance(
        completed,
        (list, tuple, set),
    ):
        completed_ids = {
            str(v)
            for v in completed
        }

    else:
        completed_ids = set()

    normalized: List[Dict[str, Any]] = []

    for index, item in enumerate(
        items,
        1,
    ):
        if not isinstance(item, dict):
            continue

        item = dict(item)

        item_id = str(
            item.get("id")
            or item.get("document_id")
            or f"document-{index}"
        )

        status = str(
            item.get("status")
            or "UNKNOWN"
        ).upper()

        item["id"] = item_id
        item["status"] = status
        item["completed"] = (
            item_id in completed_ids
            and status == "CONFIRMED"
        )

        normalized.append(item)

    return _finalize(
        normalized,
        result.get("profile") or {},
        result.get("category"),
    )


def reset_documents(
    documents: Any,
) -> Dict[str, Any]:

    if isinstance(documents, dict):
        result = dict(documents)
        items = list(
            result.get("documents")
            or result.get("items")
            or result.get("inventory")
            or []
        )

    elif isinstance(documents, list):
        result = {}
        items = list(documents)

    else:
        result = {}
        items = []

    for item in items:
        if isinstance(item, dict):
            item["completed"] = False

    return _finalize(
        [
            item
            for item in items
            if isinstance(item, dict)
        ],
        result.get("profile") or {},
        result.get("category"),
    )


def document_progress(
    documents: Any,
) -> Dict[str, Any]:

    if isinstance(documents, dict):
        items = (
            documents.get("documents")
            or documents.get("items")
            or documents.get("inventory")
            or []
        )

    elif isinstance(documents, list):
        items = documents

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
        and str(
            item.get("status", "")
        ).upper() == "VERIFY"
    )

    unknown = sum(
        1
        for item in items
        if isinstance(item, dict)
        and str(
            item.get("status", "")
        ).upper() == "UNKNOWN"
    )

    return {
        "total": total,
        "completed": completed,
        "pending": total - completed,
        "verification": verification,
        "unknown": unknown,
        "percentage": (
            round(
                completed / total * 100,
                2,
            )
            if total
            else 0
        ),
        "ready": (
            total > 0
            and completed == total
            and verification == 0
            and unknown == 0
        ),
    }


def documents_summary(
    documents: Any,
) -> Dict[str, Any]:

    progress = document_progress(
        documents
    )

    status = None

    if isinstance(documents, dict):
        status = documents.get("status")

    return {
        "status": status,
        **progress,
    }


__all__ = [
    "evaluate_documents",
    "evaluate_complete_travel_documents",
    "evaluate_document_inventory",
    "evaluate_travel_documents",
    "get_documents",
    "build_document_checklist",
    "get_document_checklist",
    "document_categories",
    "get_document_categories",
    "update_documents",
    "reset_documents",
    "document_progress",
    "documents_summary",
]
