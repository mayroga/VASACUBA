# ============================================================
# travel_engine.py
# Cuba Travel & Consular Assistant
# Version: 1.0.0
#
# Orchestrator between the API, rules_engine and services.
#
# This module does NOT create official requirements.
# The JSON rules remain the source of truth.
# ============================================================

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from rules_engine import (
    RuleCategory,
    RuleStatus,
    evaluate_category,
    evaluate_trip,
    get_rules_engine,
)


# ============================================================
# CONSTANTS
# ============================================================

ENGINE_VERSION = "1.0.0"

CUBAN_FLOW = "CUBAN_FLOW"
FOREIGNER_FLOW = "FOREIGNER_FLOW"
DUAL_NATIONALITY_FLOW = "DUAL_NATIONALITY_FLOW"
MINOR_FLOW = "MINOR_FLOW"
PASSPORT_FLOW = "PASSPORT_FLOW"
VISA_FLOW = "VISA_FLOW"
DVIAJEROS_FLOW = "DVIAJEROS_FLOW"
CONSULAR_FLOW = "CONSULAR_FLOW"
US_CUBA_FLOW = "US_CUBA_FLOW"

INFORMATIONAL_ONLY = True


# ============================================================
# GENERIC HELPERS
# ============================================================

def _now() -> str:
    return datetime.now(
        timezone.utc
    ).isoformat()


def _clean(
    value: Any,
) -> Any:
    if isinstance(value, str):
        value = value.strip()
        return value or None

    return value


def _clean_profile(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    if not isinstance(profile, dict):
        return {}

    cleaned: Dict[str, Any] = {}

    for key, value in profile.items():
        cleaned_value = _clean(value)

        if cleaned_value is not None:
            cleaned[key] = cleaned_value

    return cleaned


def _status_value(
    value: Any,
) -> str:
    if value is None:
        return "UNKNOWN"

    if hasattr(value, "value"):
        try:
            return str(value.value).upper()
        except Exception:
            pass

    return str(value).upper()


def _result_list(
    value: Any,
) -> List[Any]:
    if value is None:
        return []

    if isinstance(value, list):
        return value

    if isinstance(value, tuple):
        return list(value)

    if isinstance(value, dict):
        for key in (
            "results",
            "items",
            "rules",
            "evaluations",
            "data",
        ):
            candidate = value.get(key)

            if isinstance(candidate, list):
                return candidate

        return [value]

    return [value]


def _serialize(
    value: Any,
) -> Any:
    if value is None:
        return None

    if hasattr(value, "model_dump"):
        try:
            return value.model_dump(
                exclude_none=True
            )
        except Exception:
            pass

    if hasattr(value, "__dataclass_fields__"):
        try:
            from dataclasses import asdict

            return asdict(value)
        except Exception:
            pass

    if hasattr(value, "value"):
        try:
            return value.value
        except Exception:
            pass

    if isinstance(value, dict):
        return {
            str(key): _serialize(item)
            for key, item in value.items()
        }

    if isinstance(value, (list, tuple, set)):
        return [
            _serialize(item)
            for item in value
        ]

    if isinstance(
        value,
        (
            str,
            int,
            float,
            bool,
        ),
    ):
        return value

    return str(value)


def _collect_statuses(
    results: List[Any],
) -> List[str]:
    statuses: List[str] = []

    for result in results:
        if isinstance(result, dict):
            status = (
                result.get("status")
                or result.get("rule_status")
                or result.get("result")
            )
        else:
            status = getattr(
                result,
                "status",
                None,
            )

        normalized = _status_value(
            status
        )

        if normalized not in statuses:
            statuses.append(normalized)

    return statuses


def _requires_verification(
    results: List[Any],
) -> bool:
    for result in results:
        if isinstance(result, dict):
            status = (
                result.get("status")
                or result.get("rule_status")
                or result.get("result")
            )
        else:
            status = getattr(
                result,
                "status",
                None,
            )

        if _status_value(status) in {
            "VERIFY",
            "CONDITIONAL",
            "UNKNOWN",
        }:
            return True

    return False


def _has_incomplete(
    results: List[Any],
) -> bool:
    for result in results:
        if isinstance(result, dict):
            status = (
                result.get("status")
                or result.get("rule_status")
                or result.get("result")
            )
        else:
            status = getattr(
                result,
                "status",
                None,
            )

        if _status_value(status) == "INCOMPLETE":
            return True

    return False


def _category_value(
    category: Any,
) -> Any:
    if hasattr(category, "value"):
        try:
            return category.value
        except Exception:
            pass

    return category


# ============================================================
# FLOW DETERMINATION
# ============================================================

def determine_flow(
    profile: Optional[Dict[str, Any]],
) -> str:
    profile = _clean_profile(profile)

    nationality = str(
        profile.get(
            "nationality",
            "",
        )
    ).upper()

    is_minor = bool(
        profile.get(
            "is_minor",
            False,
        )
    )

    passport_only = bool(
        profile.get(
            "passport_only",
            False,
        )
    )

    visa_only = bool(
        profile.get(
            "visa_only",
            False,
        )
    )

    dviajeros_only = bool(
        profile.get(
            "dviajeros_only",
            False,
        )
    )

    consular_only = bool(
        profile.get(
            "consular_only",
            False,
        )
    )

    us_cuba = bool(
        profile.get(
            "us_jurisdiction",
            False,
        )
    ) or str(
        profile.get(
            "residence_country",
            "",
        )
    ).upper() in {
        "US",
        "USA",
        "UNITED_STATES",
        "UNITED STATES",
        "UNITED STATES OF AMERICA",
    }

    if passport_only:
        return PASSPORT_FLOW

    if visa_only:
        return VISA_FLOW

    if dviajeros_only:
        return DVIAJEROS_FLOW

    if consular_only:
        return CONSULAR_FLOW

    if is_minor:
        return MINOR_FLOW

    if nationality in {
        "DUAL",
        "DUAL_NATIONALITY",
        "MULTIPLE",
        "MULTIPLE_NATIONALITY",
    }:
        return DUAL_NATIONALITY_FLOW

    if us_cuba:
        return US_CUBA_FLOW

    if nationality in {
        "CUBAN",
        "CUBA",
    }:
        return CUBAN_FLOW

    if nationality in {
        "FOREIGN",
        "FOREIGNER",
        "NON_CUBAN",
        "NON-CUBAN",
    }:
        return FOREIGNER_FLOW

    return FOREIGNER_FLOW


# ============================================================
# BASIC VALIDATION
# ============================================================

def validate_traveler(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    missing: List[str] = []
    warnings: List[str] = []

    required_fields = (
        "nationality",
        "age",
        "residence_country",
        "travel_date",
        "entry_method",
    )

    for field in required_fields:
        value = profile.get(field)

        if value is None or value == "":
            missing.append(field)

    is_minor = bool(
        profile.get(
            "is_minor",
            False,
        )
    )

    age = profile.get("age")

    if age is not None:
        try:
            age_value = int(age)

            if age_value < 0:
                warnings.append(
                    "Age cannot be negative."
                )

            if age_value < 18:
                is_minor = True

        except (
            TypeError,
            ValueError,
        ):
            missing.append("age")

    if is_minor and not profile.get(
        "accompaniment"
    ):
        missing.append(
            "accompaniment"
        )

    if not profile.get(
        "passport_number"
    ):
        warnings.append(
            "Passport information was not provided."
        )

    if missing:
        return {
            "valid": False,
            "status": "INCOMPLETE",
            "missing": sorted(
                set(missing)
            ),
            "warnings": warnings,
            "flow": determine_flow(profile),
            "informational_only": True,
        }

    return {
        "valid": True,
        "status": "ACTIVE",
        "missing": [],
        "warnings": warnings,
        "flow": determine_flow(profile),
        "informational_only": True,
    }


# ============================================================
# PROFILE EVALUATION
# ============================================================

def evaluate_profile(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    validation = validate_traveler(
        profile
    )

    flow = determine_flow(
        profile
    )

    try:
        trip_result = evaluate_trip(
            profile
        )
    except Exception as exc:
        trip_result = {
            "status": "VERIFY",
            "error": str(exc),
            "results": [],
        }

    results = _result_list(
        trip_result
    )

    statuses = _collect_statuses(
        results
    )

    return {
        "timestamp": _now(),
        "flow": flow,
        "validation": validation,
        "status": (
            "INCOMPLETE"
            if not validation["valid"]
            else (
                "VERIFY"
                if _requires_verification(
                    results
                )
                else "ACTIVE"
            )
        ),
        "requires_verification":
            _requires_verification(results),
        "statuses": statuses,
        "results": _serialize(results),
        "informational_only": True,
        "government_affiliation": False,
    }


# ============================================================
# SAFE USER RESULT
# ============================================================

def get_safe_result(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    evaluated = evaluate_profile(
        profile
    )

    results = evaluated.get(
        "results",
        [],
    )

    safe_items: List[Dict[str, Any]] = []

    for result in results:
        item = _serialize(result)

        if not isinstance(
            item,
            dict,
        ):
            item = {
                "message": str(item)
            }

        safe_items.append(
            {
                "title": item.get(
                    "title"
                ) or item.get(
                    "name"
                ) or item.get(
                    "rule_id"
                ),
                "description":
                    item.get(
                        "description"
                    ) or item.get(
                        "message"
                    ) or item.get(
                        "reason"
                    ),
                "status":
                    item.get(
                        "status"
                    ) or item.get(
                        "rule_status"
                    ) or "UNKNOWN",
                "source_url":
                    item.get(
                        "source_url"
                    ) or item.get(
                        "url"
                    ),
            }
        )

    return {
        "timestamp":
            evaluated.get(
                "timestamp"
            ),
        "flow":
            evaluated.get(
                "flow"
            ),
        "status":
            evaluated.get(
                "status",
                "UNKNOWN",
            ),
        "requires_verification":
            evaluated.get(
                "requires_verification",
                True,
            ),
        "items": safe_items,
        "notice": (
            "Informational preparation result. "
            "Verify current requirements with the "
            "responsible official authority before travel."
        ),
    }


# ============================================================
# CATEGORY EVALUATION
# ============================================================

def evaluate_category_for_profile(
    category: Any,
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    category_value = _category_value(
        category
    )

    try:
        raw = evaluate_category(
            category_value,
            profile,
        )
    except Exception as exc:
        return {
            "category": category_value,
            "status": "VERIFY",
            "requires_verification": True,
            "error": str(exc),
            "results": [],
        }

    results = _result_list(
        raw
    )

    return {
        "category": category_value,
        "status": (
            "INCOMPLETE"
            if _has_incomplete(results)
            else (
                "VERIFY"
                if _requires_verification(
                    results
                )
                else "ACTIVE"
            )
        ),
        "requires_verification":
            _requires_verification(results),
        "results":
            _serialize(results),
    }


# ============================================================
# PASSPORT
# ============================================================

def evaluate_passport(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    result = evaluate_category_for_profile(
        RuleCategory.PASSPORT,
        profile,
    )

    result["flow"] = PASSPORT_FLOW

    return result


# ============================================================
# VISA
# ============================================================

def evaluate_visa(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    result = evaluate_category_for_profile(
        RuleCategory.VISA,
        profile,
    )

    result["flow"] = VISA_FLOW

    return result


# ============================================================
# D'VIAJEROS
# ============================================================

def evaluate_dviajeros(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    try:
        category = RuleCategory.DVIAJEROS
    except AttributeError:
        category = "DVIAJEROS"

    result = evaluate_category_for_profile(
        category,
        profile,
    )

    result["flow"] = DVIAJEROS_FLOW

    return result


# ============================================================
# MINORS
# ============================================================

def evaluate_minor(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    try:
        category = RuleCategory.MINOR
    except AttributeError:
        category = "MINOR"

    result = evaluate_category_for_profile(
        category,
        profile,
    )

    result["flow"] = MINOR_FLOW

    return result


# ============================================================
# CONSULAR
# ============================================================

def evaluate_consular(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    try:
        category = RuleCategory.CONSULAR
    except AttributeError:
        category = "CONSULAR"

    result = evaluate_category_for_profile(
        category,
        profile,
    )

    result["flow"] = CONSULAR_FLOW

    return result


# ============================================================
# U.S. — CUBA
# ============================================================

def evaluate_us_cuba(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    try:
        category = RuleCategory.US_CUBA
    except AttributeError:
        category = "US_CUBA"

    result = evaluate_category_for_profile(
        category,
        profile,
    )

    result["flow"] = US_CUBA_FLOW

    return result


# ============================================================
# DOCUMENTS
# ============================================================

def evaluate_documents(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    try:
        from services.document_service import (
            evaluate_documents as service_evaluate_documents,
        )

        result = service_evaluate_documents(
            profile
        )

        return _serialize(result)

    except Exception as exc:
        return {
            "status": "VERIFY",
            "requires_verification": True,
            "error": str(exc),
            "results": [],
        }


# ============================================================
# CHECKLIST
# ============================================================

def get_checklist(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    try:
        from services.checklist_service import (
            generate_checklist,
        )

        result = generate_checklist(
            profile
        )

        return _serialize(result)

    except Exception as exc:
        return {
            "status": "VERIFY",
            "requires_verification": True,
            "error": str(exc),
            "items": [],
        }


# ============================================================
# COMPLETE TRAVEL EVALUATION
# ============================================================

def evaluate_travel(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    validation = validate_traveler(
        profile
    )

    flow = determine_flow(
        profile
    )

    evaluated = evaluate_profile(
        profile
    )

    documents = evaluate_documents(
        profile
    )

    checklist = get_checklist(
        profile
    )

    return {
        "timestamp": _now(),
        "flow": flow,
        "status":
            evaluated.get(
                "status",
                "UNKNOWN",
            ),
        "validation": validation,
        "results":
            evaluated.get(
                "results",
                [],
            ),
        "documents":
            documents,
        "checklist":
            checklist,
        "requires_verification":
            evaluated.get(
                "requires_verification",
                True,
            ),
        "informational_only": True,
        "government_affiliation": False,
    }


# ============================================================
# APPLICATION PACKAGE
# ============================================================

def build_application(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    travel = evaluate_travel(
        profile
    )

    return {
        "application_type": "TRAVEL_PREPARATION",
        "created_at": _now(),
        "flow": determine_flow(
            profile
        ),
        "profile": profile,
        "validation":
            travel.get(
                "validation"
            ),
        "results":
            travel.get(
                "results",
                [],
            ),
        "documents":
            travel.get(
                "documents"
            ),
        "checklist":
            travel.get(
                "checklist"
            ),
        "status":
            travel.get(
                "status",
                "UNKNOWN",
            ),
        "requires_verification": True,
        "official_submission_required": True,
        "informational_only": True,
        "government_affiliation": False,
        "notices": [
            (
                "This package does not constitute "
                "an official application."
            ),
            (
                "The responsible authority remains "
                "the source of truth."
            ),
            (
                "Do not use this application to "
                "fabricate official documents or QR codes."
            ),
        ],
    }


# ============================================================
# SESSION
# ============================================================

def create_session(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    return {
        "session_id":
            _build_session_id(
                profile
            ),
        "created_at": _now(),
        "flow":
            determine_flow(
                profile
            ),
        "profile": profile,
        "status": "IN_PROGRESS",
        "informational_only": True,
    }


def _build_session_id(
    profile: Dict[str, Any],
) -> str:
    import hashlib
    import json

    payload = json.dumps(
        profile,
        sort_keys=True,
        default=str,
    )

    digest = hashlib.sha256(
        payload.encode(
            "utf-8"
        )
    ).hexdigest()

    return digest[:24]


# ============================================================
# SUMMARY
# ============================================================

def summarize(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    profile = _clean_profile(profile)

    result = evaluate_profile(
        profile
    )

    return {
        "flow":
            result.get(
                "flow"
            ),
        "status":
            result.get(
                "status",
                "UNKNOWN",
            ),
        "requires_verification":
            result.get(
                "requires_verification",
                True,
            ),
        "statuses":
            result.get(
                "statuses",
                [],
            ),
        "timestamp":
            result.get(
                "timestamp"
            ),
        "informational_only": True,
    }


# ============================================================
# PUBLIC ENGINE INFORMATION
# ============================================================

def engine_info() -> Dict[str, Any]:
    try:
        repository = get_rules_engine()

        info = {
            "engine": "Cuba Travel & Consular Assistant",
            "version": ENGINE_VERSION,
            "rules_engine": "rules_engine",
            "repository": type(
                repository
            ).__name__,
            "informational_only": True,
            "government_affiliation": False,
            "source_of_truth":
                "data/*.json",
        }

        return info

    except Exception as exc:
        return {
            "engine":
                "Cuba Travel & Consular Assistant",
            "version":
                ENGINE_VERSION,
            "status":
                "VERIFY",
            "error":
                str(exc),
            "informational_only":
                True,
        }


# ============================================================
# COMPATIBILITY ALIASES
# ============================================================

def evaluate_profile_safe(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    return get_safe_result(
        profile
    )


def travel_summary(
    profile: Optional[Dict[str, Any]],
) -> Dict[str, Any]:
    return summarize(
        profile
    )


__all__ = [
    "ENGINE_VERSION",
    "CUBAN_FLOW",
    "FOREIGNER_FLOW",
    "DUAL_NATIONALITY_FLOW",
    "MINOR_FLOW",
    "PASSPORT_FLOW",
    "VISA_FLOW",
    "DVIAJEROS_FLOW",
    "CONSULAR_FLOW",
    "US_CUBA_FLOW",
    "determine_flow",
    "validate_traveler",
    "evaluate_profile",
    "get_safe_result",
    "evaluate_category_for_profile",
    "evaluate_passport",
    "evaluate_visa",
    "evaluate_dviajeros",
    "evaluate_minor",
    "evaluate_consular",
    "evaluate_us_cuba",
    "evaluate_documents",
    "get_checklist",
    "evaluate_travel",
    "build_application",
    "create_session",
    "summarize",
    "engine_info",
    "evaluate_profile_safe",
    "travel_summary",
]
