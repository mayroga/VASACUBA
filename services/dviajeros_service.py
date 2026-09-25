# services/dviajeros_service.py
# Cuba Travel & Consular Assistant
# Servicio para D'Viajeros.
#
# IMPORTANTE:
# - Este archivo NO contiene requisitos oficiales hardcodeados.
# - Las reglas proceden de rules_engine.py y data/dviajeros.json.
# - VERIFY / UNKNOWN se mantienen cuando la información no puede
#   confirmarse de forma segura.
# - Este servicio prepara y evalúa información.
# - NO genera ni falsifica códigos QR oficiales.
# - NO presenta una solicitud oficial en nombre del viajero.

from __future__ import annotations

from typing import Any, Dict, List

from rules_engine import (
    RuleCategory,
    RuleStatus,
    evaluate_category,
)


CATEGORY = RuleCategory.DVIAJEROS

OFFICIAL_PORTAL = "https://dviajeros.mitrans.gob.cu/"


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
    """Evalúa las reglas D'Viajeros mediante el motor central."""
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


def evaluate_dviajeros(profile: Any) -> Dict[str, Any]:
    """
    Evaluación completa del flujo D'Viajeros.

    Las reglas y condiciones se obtienen del repositorio central.
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
        "official_portal": OFFICIAL_PORTAL,
        "official_action": "VERIFY_WITH_OFFICIAL_DVIAJEROS_PORTAL",
        "modules": [
            "MIGRATION",
            "HEALTH",
            "CUSTOMS",
        ],
        "workflow": [
            "PERSONAL_INFORMATION",
            "MIGRATION",
            "HEALTH",
            "CUSTOMS",
            "REVIEW",
            "SUBMISSION_OR_OFFICIAL_PORTAL",
        ],
        "does_not_generate_official_qr": True,
    }


def check_dviajeros(profile: Any) -> Dict[str, Any]:
    """Alias de compatibilidad para la API."""
    return evaluate_dviajeros(profile)


def evaluate(profile: Any) -> Dict[str, Any]:
    """Alias corto para consumidores internos."""
    return evaluate_dviajeros(profile)


def get_dviajeros_status(profile: Any) -> Dict[str, Any]:
    """Devuelve el estado general del flujo."""
    result = evaluate_dviajeros(profile)

    return {
        "category": result["category"],
        "status": result["status"],
        "requires_verification": result["requires_verification"],
        "can_continue": result["can_continue"],
        "official_portal": result["official_portal"],
        "official_action": result["official_action"],
        "does_not_generate_official_qr": True,
    }


def get_dviajeros_modules(profile: Any = None) -> Dict[str, Any]:
    """
    Devuelve los módulos que componen el flujo.

    No agrega requisitos específicos no presentes en las reglas.
    """
    result = evaluate_dviajeros(profile)

    return {
        "modules": result["modules"],
        "workflow": result["workflow"],
        "status": result["status"],
        "requires_verification": result["requires_verification"],
        "official_portal": result["official_portal"],
    }


def get_dviajeros_checklist(profile: Any) -> Dict[str, Any]:
    """
    Construye checklist a partir de las reglas evaluadas.
    """
    result = evaluate_dviajeros(profile)

    items: List[Dict[str, Any]] = []

    for index, rule in enumerate(result["results"], start=1):
        if not isinstance(rule, dict):
            continue

        status = _status_value(rule.get("status"))

        item_id = (
            rule.get("rule_id")
            or rule.get("id")
            or f"dviajeros-{index}"
        )

        title = (
            rule.get("title")
            or rule.get("name")
            or rule.get("description")
            or "D'Viajeros requirement"
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
        "official_portal": OFFICIAL_PORTAL,
        "does_not_generate_official_qr": True,
    }


def get_dviajeros_official_sources(profile: Any = None) -> List[Any]:
    """
    Obtiene las fuentes asociadas a las reglas D'Viajeros.
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


def get_official_dviajeros_portal() -> Dict[str, Any]:
    """Devuelve la dirección del portal oficial configurado."""
    return {
        "name": "D'Viajeros",
        "url": OFFICIAL_PORTAL,
        "official": True,
        "purpose": "OFFICIAL_TRAVELER_FORM_PORTAL",
        "does_not_generate_official_qr": True,
    }


def validate_dviajeros_input(profile: Any) -> Dict[str, Any]:
    """
    Validación mínima de entrada.

    No determina por sí sola si el viajero puede entrar o salir de Cuba.
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

    if not data.get("entry_method"):
        missing.append("entry_method")

    return {
        "valid": not missing,
        "missing": missing,
        "status": (
            RuleStatus.UNKNOWN.value
            if missing
            else RuleStatus.ACTIVE.value
        ),
    }


def dviajeros_summary(profile: Any) -> Dict[str, Any]:
    """Resumen compacto para frontend/API."""
    result = evaluate_dviajeros(profile)

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
        "modules": result["modules"],
    }


__all__ = [
    "evaluate_dviajeros",
    "check_dviajeros",
    "evaluate",
    "get_dviajeros_status",
    "get_dviajeros_modules",
    "get_dviajeros_checklist",
    "get_dviajeros_official_sources",
    "get_official_dviajeros_portal",
    "validate_dviajeros_input",
    "dviajeros_summary",
]
