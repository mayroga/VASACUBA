# services/document_service.py
# Cuba Travel & Consular Assistant
# Servicio de documentos del viajero.
#
# IMPORTANTE:
# - No contiene requisitos oficiales hardcodeados.
# - Las reglas oficiales permanecen en rules_engine.py y data/*.json.
# - VERIFY / UNKNOWN nunca se convierten artificialmente en confirmados.
# - Este servicio organiza, revisa y completa información documental.
# - NO emite documentos oficiales ni certifica cumplimiento legal.

from __future__ import annotations

from typing import Any, Dict, List, Optional

from rules_engine import (
    RuleCategory,
    RuleStatus,
    evaluate_category,
)


def _status_value(value: Any) -> str:
    """Convierte Enum u otros valores de estado a texto."""
    if value is None:
        return RuleStatus.UNKNOWN.value

    if isinstance(value, RuleStatus):
        return value.value

    return str(getattr(value, "value", value)).lower()


def _serialize(value: Any) -> Any:
    """Serialización defensiva para respuestas JSON."""
    if value is None:
        return None

    if isinstance(value, (str, int, float, bool)):
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
    """Normaliza dict, Pydantic, dataclass u objeto compatible."""
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


def _result_status(result: Any) -> str:
    if isinstance(result, dict):
        return _status_value(result.get("status"))

    return _status_value(getattr(result, "status", None))


def _result_source(result: Any) -> Any:
    if isinstance(result, dict):
        return result.get("source") or result.get("sources")

    return getattr(result, "source", None) or getattr(result, "sources", None)


def _result_id(result: Any, fallback: str) -> str:
    if isinstance(result, dict):
        value = result.get("rule_id") or result.get("id")
    else:
        value = getattr(result, "rule_id", None) or getattr(result, "id", None)

    return str(value or fallback)


def _result_title(result: Any) -> str:
    if isinstance(result, dict):
        value = (
            result.get("title")
            or result.get("name")
            or result.get("description")
            or "Document"
        )
    else:
        value = (
            getattr(result, "title", None)
            or getattr(result, "name", None)
            or getattr(result, "description", None)
            or "Document"
        )

    return str(value)


def _result_description(result: Any) -> str:
    if isinstance(result, dict):
        value = (
            result.get("message")
            or result.get("description")
            or result.get("title")
            or "Review this document requirement."
        )
    else:
        value = (
            getattr(result, "message", None)
            or getattr(result, "description", None)
            or getattr(result, "title", None)
            or "Review this document requirement."
        )

    return str(value)


def _evaluate_category(
    profile: Dict[str, Any],
    category: Any,
) -> List[Any]:
    """Evalúa una categoría del motor central."""
    try:
        results = evaluate_category(profile, category)
    except TypeError:
        results = evaluate_category(
            profile=profile,
            category=category,
        )

    if results is None:
        return []

    if isinstance(results, (list, tuple)):
        return list(results)

    return [results]


def _document_categories() -> List[Any]:
    """
    Obtiene las categorías documentales disponibles en el motor.

    Se mantienen defensivamente para que el servicio funcione incluso
    si una versión del Enum no contiene una categoría opcional.
    """
    categories: List[Any] = []

    for name in (
        "DOCUMENTS",
        "PASSPORT",
        "VISA",
        "EVISA",
        "DVIAJEROS",
        "MINOR",
        "CONSULAR",
        "TRAVEL",
        "US_CUBA",
    ):
        category = getattr(RuleCategory, name, None)

        if category is not None and category not in categories:
            categories.append(category)

    return categories


def evaluate_documents(profile: Any) -> Dict[str, Any]:
    """
    Evalúa las reglas relacionadas con documentación.

    Las reglas específicas permanecen en los archivos JSON.
    """
    profile_data = _profile_dict(profile)

    all_results: List[Any] = []
    category_results: Dict[str, List[Any]] = {}

    for category in _document_categories():
        results = _evaluate_category(profile_data, category)

        category_name = (
            category.value
            if hasattr(category, "value")
            else str(category)
        )

        category_results[category_name] = [
            _serialize(result)
            for result in results
        ]

        all_results.extend(results)

    confirmed: List[Any] = []
    conditional: List[Any] = []
    verify: List[Any] = []
    unknown: List[Any] = []
    expired: List[Any] = []

    seen = set()

    for result in all_results:
        serialized = _serialize(result)

        # Evita duplicar exactamente la misma regla si aparece
        # en más de una categoría.
        if isinstance(serialized, dict):
            identity = (
                serialized.get("rule_id")
                or serialized.get("id")
                or repr(serialized)
            )
        else:
            identity = repr(serialized)

        if identity in seen:
            continue

        seen.add(identity)

        status = _result_status(result)

        if status == RuleStatus.ACTIVE.value:
            confirmed.append(serialized)

        elif status == RuleStatus.CONDITIONAL.value:
            conditional.append(serialized)

        elif status == RuleStatus.VERIFY.value:
            verify.append(serialized)

        elif status == RuleStatus.EXPIRED.value:
            expired.append(serialized)

        else:
            unknown.append(serialized)

    if unknown:
        overall_status = RuleStatus.UNKNOWN.value
    elif verify or conditional:
        overall_status = RuleStatus.VERIFY.value
    elif expired:
        overall_status = RuleStatus.VERIFY.value
    else:
        overall_status = RuleStatus.ACTIVE.value

    return {
        "status": overall_status,
        "profile": profile_data,
        "results": [
            _serialize(result)
            for result in all_results
        ],
        "categories": category_results,
        "confirmed": confirmed,
        "conditional": conditional,
        "verify": verify,
        "unknown": unknown,
        "expired": expired,
        "requires_verification": bool(
            verify or conditional or unknown or expired
        ),
        "can_continue": not bool(unknown),
        "service_scope": [
            "document_review",
            "document_checklist",
            "document_inventory",
        ],
        "does_not_issue_documents": True,
        "does_not_certify_legal_compliance": True,
    }


def check_documents(profile: Any) -> Dict[str, Any]:
    """Alias de compatibilidad para la API."""
    return evaluate_documents(profile)


def evaluate(profile: Any) -> Dict[str, Any]:
    """Alias corto para consumidores internos."""
    return evaluate_documents(profile)


def build_document_checklist(profile: Any) -> Dict[str, Any]:
    """
    Construye una checklist documental a partir de las reglas evaluadas.
    """
    result = evaluate_documents(profile)

    items: List[Dict[str, Any]] = []
    seen = set()

    for index, rule in enumerate(result["results"], start=1):
        if not isinstance(rule, dict):
            continue

        rule_id = str(
            rule.get("rule_id")
            or rule.get("id")
            or f"document-{index}"
        )

        if rule_id in seen:
            continue

        seen.add(rule_id)

        status = _status_value(rule.get("status"))

        if status == RuleStatus.ACTIVE.value:
            item_status = "CONFIRMED"

        elif status in {
            RuleStatus.CONDITIONAL.value,
            RuleStatus.VERIFY.value,
            RuleStatus.EXPIRED.value,
        }:
            item_status = "VERIFY"

        else:
            item_status = "UNKNOWN"

        items.append(
            {
                "id": rule_id,
                "title": _result_title(rule),
                "description": _result_description(rule),
                "status": item_status,
                "completed": False,
                "source": _serialize(
                    rule.get("source") or rule.get("sources")
                ),
            }
        )

    return {
        "status": result["status"],
        "items": items,
        "total": len(items),
        "confirmed": sum(
            1
            for item in items
            if item["status"] == "CONFIRMED"
        ),
        "requires_verification": sum(
            1
            for item in items
            if item["status"] in {"VERIFY", "UNKNOWN"}
        ),
        "does_not_issue_documents": True,
    }


def get_document_inventory(profile: Any) -> Dict[str, Any]:
    """
    Devuelve un inventario organizado de las reglas documentales
    encontradas para el perfil.
    """
    result = evaluate_documents(profile)

    inventory: List[Dict[str, Any]] = []
    seen = set()

    for index, rule in enumerate(result["results"], start=1):
        if not isinstance(rule, dict):
            continue

        rule_id = str(
            rule.get("rule_id")
            or rule.get("id")
            or f"document-{index}"
        )

        if rule_id in seen:
            continue

        seen.add(rule_id)

        inventory.append(
            {
                "id": rule_id,
                "title": _result_title(rule),
                "status": _status_value(rule.get("status")),
                "description": _result_description(rule),
                "source": _serialize(
                    rule.get("source") or rule.get("sources")
                ),
            }
        )

    return {
        "status": result["status"],
        "count": len(inventory),
        "documents": inventory,
        "requires_verification": result["requires_verification"],
    }


def complete_document_checklist(
    profile: Any,
    completed: Optional[Any] = None,
) -> Dict[str, Any]:
    """
    Aplica el estado de completado proporcionado por el usuario
    a la checklist generada por las reglas.

    No convierte VERIFY/UNKNOWN en confirmado.
    """
    checklist = build_document_checklist(profile)

    if completed is None:
        completed = []

    if isinstance(completed, dict):
        completed_ids = {
            str(key)
            for key, value in completed.items()
            if bool(value)
        }
    elif isinstance(completed, (list, tuple, set)):
        completed_ids = {str(value) for value in completed}
    else:
        completed_ids = set()

    for item in checklist["items"]:
        item["completed"] = (
            item["id"] in completed_ids
            and item["status"] == "CONFIRMED"
        )

    checklist["completed"] = sum(
        1
        for item in checklist["items"]
        if item["completed"]
    )

    checklist["pending"] = checklist["total"] - checklist["completed"]

    checklist["ready"] = (
        checklist["pending"] == 0
        and not checklist["requires_verification"]
    )

    return checklist


def validate_document_input(profile: Any) -> Dict[str, Any]:
    """
    Validación mínima del perfil para poder ejecutar la revisión
    documental. No sustituye la evaluación de reglas.
    """
    data = _profile_dict(profile)
    missing: List[str] = []

    if not data:
        missing.append("profile")

    if not data.get("nationality"):
        missing.append("nationality")

    if data.get("age") is None:
        missing.append("age")

    return {
        "valid": not missing,
        "missing": missing,
        "status": (
            RuleStatus.UNKNOWN.value
            if missing
            else RuleStatus.ACTIVE.value
        ),
    }


def get_document_sources(profile: Any = None) -> List[Any]:
    """
    Extrae las fuentes asociadas a las reglas documentales.
    """
    result = evaluate_documents(profile or {})

    sources: List[Any] = []
    seen = set()

    for rule in result["results"]:
        if not isinstance(rule, dict):
            continue

        source = rule.get("source") or rule.get("sources")

        if source is None:
            continue

        values = source if isinstance(source, list) else [source]

        for value in values:
            serialized = _serialize(value)

            if isinstance(serialized, dict):
                key = (
                    serialized.get("url")
                    or serialized.get("id")
                    or serialized.get("name")
                    or repr(serialized)
                )
            else:
                key = str(serialized)

            if key in seen:
                continue

            seen.add(key)
            sources.append(serialized)

    return sources


def documents_summary(profile: Any) -> Dict[str, Any]:
    """Resumen compacto para frontend/API."""
    result = evaluate_documents(profile)

    return {
        "status": result["status"],
        "requires_verification": result["requires_verification"],
        "can_continue": result["can_continue"],
        "confirmed_count": len(result["confirmed"]),
        "verification_count": len(result["verify"]),
        "unknown_count": len(result["unknown"]),
        "conditional_count": len(result["conditional"]),
        "expired_count": len(result["expired"]),
        "category_count": len(result["categories"]),
    }


__all__ = [
    "evaluate_documents",
    "check_documents",
    "evaluate",
    "build_document_checklist",
    "get_document_inventory",
    "complete_document_checklist",
    "validate_document_input",
    "get_document_sources",
    "documents_summary",
]
