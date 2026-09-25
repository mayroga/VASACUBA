# services/visa_service.py
# Cuba Travel & Consular Assistant
# Servicio de visa / eVisa para Cuba.
#
# IMPORTANTE:
# - Este archivo NO contiene requisitos oficiales hardcodeados.
# - Las reglas oficiales provienen de rules_engine.py y data/cuba_visa.json.
# - VERIFY / UNKNOWN deben conservarse cuando el motor no pueda confirmar
#   una condición.
# - Este servicio evalúa, prepara y organiza información.
# - NO emite, aprueba ni genera visas o eVisas oficiales.

from __future__ import annotations

from typing import Any, Dict, List, Optional

from rules_engine import (
    RuleCategory,
    RuleStatus,
    evaluate_category,
)


CATEGORY = RuleCategory.VISA


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


def _evaluate(profile: Any) -> List[Any]:
    """Evalúa las reglas de visa mediante el motor central."""
    data = _profile_dict(profile)

    try:
        results = evaluate_category(data, CATEGORY)
    except TypeError:
        results = evaluate_category(
            profile=data,
            category=CATEGORY,
        )

    if results is None:
        return []

    if isinstance(results, (list, tuple)):
        return list(results)

    return [results]


def evaluate_visa(profile: Any) -> Dict[str, Any]:
    """
    Evaluación completa de visa/eVisa.

    No agrega requisitos oficiales.
    Solo interpreta las reglas existentes en data/cuba_visa.json.
    """
    profile_data = _profile_dict(profile)
    results = _evaluate(profile_data)

    serialized_results = [_serialize(item) for item in results]

    confirmed: List[Any] = []
    conditional: List[Any] = []
    verify: List[Any] = []
    unknown: List[Any] = []
    expired: List[Any] = []

    for result in results:
        serialized = _serialize(result)
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
        "category": (
            CATEGORY.value
            if hasattr(CATEGORY, "value")
            else str(CATEGORY)
        ),
        "status": overall_status,
        "profile": profile_data,
        "results": serialized_results,
        "confirmed": confirmed,
        "conditional": conditional,
        "verify": verify,
        "unknown": unknown,
        "expired": expired,
        "requires_verification": bool(
            verify or conditional or unknown or expired
        ),
        "can_continue": not bool(unknown),
        "official_portal": "https://evisacuba.cu/",
        "official_action": "VERIFY_WITH_OFFICIAL_CUBAN_SOURCE",
        "service_scope": [
            "evaluate",
            "prepare",
            "check",
            "checklist",
            "official_portal",
        ],
        "does_not_issue_visa": True,
    }


def check_visa(profile: Any) -> Dict[str, Any]:
    """Alias de compatibilidad para la API."""
    return evaluate_visa(profile)


def evaluate(profile: Any) -> Dict[str, Any]:
    """Alias corto para consumidores internos."""
    return evaluate_visa(profile)


def get_visa_status(profile: Any) -> Dict[str, Any]:
    """Devuelve únicamente el estado general de la evaluación."""
    result = evaluate_visa(profile)

    return {
        "category": result["category"],
        "status": result["status"],
        "requires_verification": result["requires_verification"],
        "can_continue": result["can_continue"],
        "official_portal": result["official_portal"],
        "official_action": result["official_action"],
        "does_not_issue_visa": True,
    }


def get_visa_checklist(profile: Any) -> Dict[str, Any]:
    """
    Construye una checklist a partir de las reglas evaluadas.

    No crea documentos, tarifas, plazos ni requisitos que no estén
    presentes en el repositorio de reglas.
    """
    result = evaluate_visa(profile)

    items: List[Dict[str, Any]] = []

    for index, rule in enumerate(result["results"], start=1):
        if not isinstance(rule, dict):
            continue

        status = _status_value(rule.get("status"))

        item_id = (
            rule.get("rule_id")
            or rule.get("id")
            or f"visa-{index}"
        )

        title = (
            rule.get("title")
            or rule.get("name")
            or rule.get("description")
            or "Visa requirement"
        )

        description = (
            rule.get("message")
            or rule.get("description")
            or title
        )

        source = rule.get("source") or rule.get("sources")

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
                "id": str(item_id),
                "title": str(title),
                "description": str(description),
                "status": item_status,
                "completed": False,
                "source": _serialize(source),
            }
        )

    return {
        "category": result["category"],
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
        "official_portal": result["official_portal"],
        "does_not_issue_visa": True,
    }


def get_official_visa_portal() -> Dict[str, Any]:
    """
    Devuelve el portal oficial de eVisa configurado en las reglas
    del proyecto.
    """
    return {
        "name": "Cuba eVisa",
        "url": "https://evisacuba.cu/",
        "official": True,
        "purpose": "OFFICIAL_VISA_PORTAL",
        "does_not_issue_from_this_app": True,
    }


def get_visa_official_sources(profile: Any = None) -> List[Any]:
    """
    Obtiene las fuentes asociadas a las reglas evaluadas.
    """
    results = _evaluate(_profile_dict(profile))

    sources: List[Any] = []
    seen = set()

    for result in results:
        source = _result_source(result)

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


def validate_visa_input(profile: Any) -> Dict[str, Any]:
    """
    Validación mínima de datos de entrada.

    No determina por sí sola si una persona necesita una visa.
    Esa decisión corresponde al motor de reglas.
    """
    data = _profile_dict(profile)
    missing: List[str] = []

    if not data:
        missing.append("profile")

    if not data.get("nationality"):
        missing.append("nationality")

    if not data.get("passport_number"):
        missing.append("passport_number")

    if not data.get("travel_date"):
        missing.append("travel_date")

    return {
        "valid": not missing,
        "missing": missing,
        "status": (
            RuleStatus.UNKNOWN.value
            if missing
            else RuleStatus.ACTIVE.value
        ),
    }


def visa_summary(profile: Any) -> Dict[str, Any]:
    """Resumen compacto para frontend/API."""
    result = evaluate_visa(profile)

    return {
        "status": result["status"],
        "requires_verification": result["requires_verification"],
        "can_continue": result["can_continue"],
        "confirmed_count": len(result["confirmed"]),
        "verification_count": len(result["verify"]),
        "unknown_count": len(result["unknown"]),
        "conditional_count": len(result["conditional"]),
        "expired_count": len(result["expired"]),
        "official_portal": result["official_portal"],
    }


__all__ = [
    "evaluate_visa",
    "check_visa",
    "evaluate",
    "get_visa_status",
    "get_visa_checklist",
    "get_official_visa_portal",
    "get_visa_official_sources",
    "validate_visa_input",
    "visa_summary",
]
