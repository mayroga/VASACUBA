# services/passport_service.py
# Cuba Travel & Consular Assistant
# Servicio de pasaporte cubano.
#
# IMPORTANTE:
# - Este archivo NO contiene requisitos oficiales hardcodeados.
# - Las reglas oficiales provienen de rules_engine.py y data/cuba_passport.json.
# - Los estados VERIFY / UNKNOWN deben conservarse.
# - Este servicio prepara, evalúa y organiza información.
# - NO emite, renueva ni aprueba pasaportes.

from __future__ import annotations

from typing import Any, Dict, List, Optional

from rules_engine import (
    RuleCategory,
    RuleStatus,
    evaluate_category,
    evaluate_rule,
    get_rules_engine,
)


CATEGORY = RuleCategory.PASSPORT


def _status_value(value: Any) -> str:
    """Convierte estados Enum u otros valores a texto seguro."""
    if value is None:
        return RuleStatus.UNKNOWN.value

    if isinstance(value, RuleStatus):
        return value.value

    raw = getattr(value, "value", value)
    return str(raw).lower()


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
    """Normaliza un perfil Pydantic/dataclass/dict."""
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
    """Obtiene el estado de una evaluación."""
    if isinstance(result, dict):
        return _status_value(result.get("status"))

    return _status_value(getattr(result, "status", None))


def _result_id(result: Any) -> Optional[str]:
    if isinstance(result, dict):
        value = result.get("rule_id") or result.get("id")
    else:
        value = getattr(result, "rule_id", None) or getattr(result, "id", None)

    return str(value) if value is not None else None


def _result_title(result: Any) -> str:
    if isinstance(result, dict):
        value = (
            result.get("title")
            or result.get("name")
            or result.get("description")
            or ""
        )
    else:
        value = (
            getattr(result, "title", None)
            or getattr(result, "name", None)
            or getattr(result, "description", None)
            or ""
        )

    return str(value)


def _result_message(result: Any) -> str:
    if isinstance(result, dict):
        value = (
            result.get("message")
            or result.get("description")
            or result.get("title")
            or ""
        )
    else:
        value = (
            getattr(result, "message", None)
            or getattr(result, "description", None)
            or getattr(result, "title", None)
            or ""
        )

    return str(value)


def _result_source(result: Any) -> Any:
    if isinstance(result, dict):
        return result.get("source") or result.get("sources")

    return getattr(result, "source", None) or getattr(result, "sources", None)


def _is_positive(result: Any) -> bool:
    """
    Una regla no debe considerarse confirmada solamente por ausencia
    de errores. Solo ACTIVE se considera confirmada.
    """
    return _result_status(result) == RuleStatus.ACTIVE.value


def _needs_verification(result: Any) -> bool:
    return _result_status(result) in {
        RuleStatus.VERIFY.value,
        RuleStatus.UNKNOWN.value,
        RuleStatus.CONDITIONAL.value,
    }


def _evaluate(profile: Any) -> List[Any]:
    """
    Evalúa todas las reglas de PASSPORT usando el motor central.
    """
    data = _profile_dict(profile)

    try:
        results = evaluate_category(data, CATEGORY)
    except TypeError:
        # Compatibilidad con implementaciones que reciben keyword.
        results = evaluate_category(profile=data, category=CATEGORY)

    if results is None:
        return []

    if isinstance(results, (list, tuple)):
        return list(results)

    return [results]


def evaluate_passport(profile: Any) -> Dict[str, Any]:
    """
    Evaluación completa del pasaporte para el perfil indicado.

    No agrega requisitos oficiales nuevos: únicamente interpreta
    las reglas existentes en data/cuba_passport.json.
    """
    profile_data = _profile_dict(profile)
    results = _evaluate(profile_data)

    serialized_results = [_serialize(item) for item in results]

    active = []
    conditional = []
    verify = []
    unknown = []
    expired = []

    for result in results:
        status = _result_status(result)

        if status == RuleStatus.ACTIVE.value:
            active.append(_serialize(result))
        elif status == RuleStatus.CONDITIONAL.value:
            conditional.append(_serialize(result))
        elif status == RuleStatus.VERIFY.value:
            verify.append(_serialize(result))
        elif status == RuleStatus.EXPIRED.value:
            expired.append(_serialize(result))
        else:
            unknown.append(_serialize(result))

    if unknown:
        overall_status = RuleStatus.UNKNOWN.value
    elif verify or conditional:
        overall_status = RuleStatus.VERIFY.value
    elif expired:
        overall_status = RuleStatus.VERIFY.value
    else:
        overall_status = RuleStatus.ACTIVE.value

    return {
        "category": CATEGORY.value
        if hasattr(CATEGORY, "value")
        else str(CATEGORY),
        "status": overall_status,
        "profile": profile_data,
        "results": serialized_results,
        "confirmed": active,
        "conditional": conditional,
        "verify": verify,
        "unknown": unknown,
        "expired": expired,
        "requires_verification": bool(verify or conditional or unknown or expired),
        "can_continue": not bool(unknown),
        "official_action": "VERIFY_WITH_OFFICIAL_CUBAN_SOURCE",
        "service_scope": [
            "evaluate",
            "prepare",
            "check",
            "checklist",
        ],
        "does_not_issue_passport": True,
    }


def check_passport(profile: Any) -> Dict[str, Any]:
    """Alias de compatibilidad para la API."""
    return evaluate_passport(profile)


def evaluate(profile: Any) -> Dict[str, Any]:
    """Alias corto para consumidores internos."""
    return evaluate_passport(profile)


def get_passport_status(profile: Any) -> Dict[str, Any]:
    """
    Devuelve únicamente el estado general y los indicadores
    principales de la evaluación.
    """
    result = evaluate_passport(profile)

    return {
        "category": result["category"],
        "status": result["status"],
        "requires_verification": result["requires_verification"],
        "can_continue": result["can_continue"],
        "official_action": result["official_action"],
        "does_not_issue_passport": True,
    }


def get_passport_checklist(profile: Any) -> Dict[str, Any]:
    """
    Construye una lista de preparación a partir de las reglas
    evaluadas. No inventa documentos.
    """
    result = evaluate_passport(profile)

    items: List[Dict[str, Any]] = []

    for rule in result["results"]:
        if not isinstance(rule, dict):
            continue

        status = _status_value(rule.get("status"))

        item_id = (
            rule.get("rule_id")
            or rule.get("id")
            or f"passport-{len(items) + 1}"
        )

        title = (
            rule.get("title")
            or rule.get("name")
            or rule.get("description")
            or "Passport requirement"
        )

        description = (
            rule.get("message")
            or rule.get("description")
            or title
        )

        source = rule.get("source") or rule.get("sources")

        if status == RuleStatus.ACTIVE.value:
            state = "CONFIRMED"
        elif status == RuleStatus.CONDITIONAL.value:
            state = "VERIFY"
        elif status == RuleStatus.VERIFY.value:
            state = "VERIFY"
        elif status == RuleStatus.UNKNOWN.value:
            state = "UNKNOWN"
        elif status == RuleStatus.EXPIRED.value:
            state = "VERIFY"
        else:
            state = "VERIFY"

        items.append(
            {
                "id": str(item_id),
                "title": str(title),
                "description": str(description),
                "status": state,
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
            1 for item in items if item["status"] == "CONFIRMED"
        ),
        "requires_verification": sum(
            1 for item in items if item["status"] in {"VERIFY", "UNKNOWN"}
        ),
        "does_not_issue_passport": True,
    }


def get_passport_official_sources(profile: Any = None) -> List[Any]:
    """
    Obtiene las fuentes asociadas a las reglas de pasaporte.
    La información procede del repositorio de reglas.
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


def validate_passport_input(profile: Any) -> Dict[str, Any]:
    """
    Validación mínima de entrada.

    No decide si una persona tiene derecho a un pasaporte.
    Solo identifica datos insuficientes para ejecutar correctamente
    las reglas disponibles.
    """
    data = _profile_dict(profile)

    missing: List[str] = []

    if not data:
        missing.append("profile")

    # El motor central determina qué reglas requieren datos adicionales.
    # Aquí solo evitamos inventar requisitos específicos.
    if data.get("age") is None:
        missing.append("age")

    if not data.get("nationality"):
        missing.append("nationality")

    return {
        "valid": not missing,
        "missing": missing,
        "status": (
            RuleStatus.UNKNOWN.value
            if missing
            else RuleStatus.ACTIVE.value
        ),
    }


def passport_summary(profile: Any) -> Dict[str, Any]:
    """
    Resumen compacto para frontend/API.
    """
    result = evaluate_passport(profile)

    return {
        "status": result["status"],
        "requires_verification": result["requires_verification"],
        "can_continue": result["can_continue"],
        "confirmed_count": len(result["confirmed"]),
        "verification_count": len(result["verify"]),
        "unknown_count": len(result["unknown"]),
        "conditional_count": len(result["conditional"]),
        "expired_count": len(result["expired"]),
    }


__all__ = [
    "evaluate_passport",
    "check_passport",
    "evaluate",
    "get_passport_status",
    "get_passport_checklist",
    "get_passport_official_sources",
    "validate_passport_input",
    "passport_summary",
]
