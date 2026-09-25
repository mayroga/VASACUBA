# ============================================================
# main.py
# Cuba Travel & Consular Assistant
# Version: 1.0.0
#
# FastAPI + Rules Engine + Travel Engine + Services
#
# Informational / preparation assistant only.
# Does NOT issue passports, visas, permits, authorizations,
# official QR codes, government approvals, or legal opinions.
# ============================================================

from __future__ import annotations

import os
from pathlib import Path
from typing import Any, Dict, Optional

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from rules_engine import (
    RuleCategory,
    engine_info,
    evaluate_category,
    evaluate_rule,
    evaluate_trip,
    get_rules_engine,
    reload_rules,
)

from travel_engine import (
    build_application,
    evaluate_consular,
    evaluate_documents,
    evaluate_dviajeros,
    evaluate_minor,
    evaluate_passport,
    evaluate_travel,
    evaluate_us_cuba,
    evaluate_visa,
    get_checklist,
    get_safe_result,
    validate_traveler,
)

from services.checklist_service import (
    checklist_categories,
    generate_category_checklist,
    generate_checklist,
    merge_checklist_state,
    reset_checklist,
)

from services.document_service import (
    evaluate_complete_travel_documents,
    evaluate_document_inventory,
    evaluate_documents as service_evaluate_documents,
)

from services.dviajeros_service import (
    dviajeros_modules,
    dviajeros_status,
)

from services.passport_service import (
    passport_checklist,
    passport_status,
)

from services.visa_service import (
    official_visa_portal,
    visa_checklist,
    visa_status,
)

from schemas import (
    APIMessage,
    ApplicationResult,
    ChecklistUpdate,
    ConsularRequest,
    DViajerosRequest,
    EngineInfo,
    ErrorResponse,
    HealthResponse,
    MinorRequest,
    PassportRequest,
    RuleEvaluationRequest,
    SafeUserResult,
    SourceResponse,
    TravelProfileRequest,
    TravelRequest,
    USCubaRequest,
    ValidationResult,
    VisaRequest,
)


# ============================================================
# PATHS / CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
DATA_DIR = BASE_DIR / "data"

APP_NAME = os.getenv(
    "APP_NAME",
    "Cuba Travel & Consular Assistant",
)

APP_VERSION = os.getenv(
    "APP_VERSION",
    "1.0.0",
)

ENVIRONMENT = os.getenv(
    "ENVIRONMENT",
    "production",
)


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=(
        "Informational and preparation assistant for "
        "Cuban travel, consular and document workflows. "
        "This application is not a government authority."
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# GLOBAL EXCEPTION HANDLER
# ============================================================

@app.exception_handler(Exception)
async def global_exception_handler(
    request: Request,
    exc: Exception,
):
    return JSONResponse(
        status_code=500,
        content={
            "error": "INTERNAL_ERROR",
            "message": "Internal server error.",
            "path": str(request.url.path),
        },
    )


# ============================================================
# ROOT
# ============================================================

@app.get(
    "/",
    include_in_schema=False,
)
async def root():
    index_file = STATIC_DIR / "index.html"

    if index_file.exists():
        return FileResponse(index_file)

    return {
        "name": APP_NAME,
        "version": APP_VERSION,
        "status": "ok",
        "message": (
            "Cuba Travel & Consular Assistant API"
        ),
    }


# ============================================================
# HEALTH
# ============================================================

@app.get(
    "/health",
    response_model=HealthResponse,
)
async def health():
    return {
        "status": "ok",
        "service": APP_NAME,
        "version": APP_VERSION,
    }


@app.get(
    "/api/health",
    response_model=HealthResponse,
)
async def api_health():
    return {
        "status": "ok",
        "service": APP_NAME,
        "version": APP_VERSION,
    }


# ============================================================
# ENGINE
# ============================================================

@app.get(
    "/api/engine",
    response_model=EngineInfo,
)
async def api_engine():
    try:
        info = engine_info()
        return normalize_engine_info(info)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


@app.post(
    "/api/engine/reload",
    response_model=APIMessage,
)
async def api_engine_reload():
    try:
        reload_rules()

        return {
            "message": "Rules reloaded successfully.",
            "status": "ok",
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# ============================================================
# RULES
# ============================================================

@app.post(
    "/api/rules/evaluate",
)
async def api_rules_evaluate(
    request: RuleEvaluationRequest,
):
    try:
        result = evaluate_rule(
            request.rule_id,
            request.context or {},
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.get(
    "/api/rules/category/{category}",
)
async def api_rules_category(
    category: str,
):
    try:
        normalized = category.upper()

        result = evaluate_category(
            normalized,
            {},
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# PROFILE
# ============================================================

@app.post(
    "/api/profile/evaluate",
)
async def api_profile_evaluate(
    request: TravelProfileRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        validation = validate_traveler(
            profile
        )

        result = get_safe_result(
            profile
        )

        return {
            "validation": serialize(validation),
            "result": serialize(result),
        }

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# TRAVEL
# ============================================================

@app.post(
    "/api/travel/evaluate",
)
async def api_travel_evaluate(
    request: TravelRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_travel(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# APPLICATION
# ============================================================

@app.post(
    "/api/application/build",
)
async def api_application_build(
    request: TravelRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = build_application(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# PASSPORT
# ============================================================

@app.post(
    "/api/passport/check",
)
async def api_passport_check(
    request: PassportRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_passport(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/passport/status",
)
async def api_passport_status(
    request: PassportRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        return serialize(
            passport_status(profile)
        )

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/passport/checklist",
)
async def api_passport_checklist(
    request: PassportRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        return serialize(
            passport_checklist(profile)
        )

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# VISA / EVISA
# ============================================================

@app.post(
    "/api/visa/check",
)
async def api_visa_check(
    request: VisaRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_visa(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/visa/status",
)
async def api_visa_status(
    request: VisaRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        return serialize(
            visa_status(profile)
        )

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/visa/checklist",
)
async def api_visa_checklist(
    request: VisaRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        return serialize(
            visa_checklist(profile)
        )

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.get(
    "/api/visa/official-portal",
)
async def api_visa_official_portal():
    return {
        "url": official_visa_portal(),
        "official": True,
    }


# ============================================================
# D'VIAJEROS
# ============================================================

@app.post(
    "/api/dviajeros/check",
)
async def api_dviajeros_check(
    request: DViajerosRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_dviajeros(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/dviajeros/status",
)
async def api_dviajeros_status(
    request: DViajerosRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        return serialize(
            dviajeros_status(profile)
        )

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.get(
    "/api/dviajeros/modules",
)
async def api_dviajeros_modules():
    return {
        "modules": dviajeros_modules()
    }


# ============================================================
# MINORS
# ============================================================

@app.post(
    "/api/minor/check",
)
async def api_minor_check(
    request: MinorRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_minor(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# CONSULAR
# ============================================================

@app.post(
    "/api/consular/check",
)
async def api_consular_check(
    request: ConsularRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_consular(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# U.S. — CUBA
# ============================================================

@app.post(
    "/api/us-cuba/check",
)
async def api_us_cuba_check(
    request: USCubaRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_us_cuba(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# DOCUMENTS
# ============================================================

@app.post(
    "/api/documents/check",
)
async def api_documents_check(
    request: TravelProfileRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_documents(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/documents/complete",
)
async def api_documents_complete(
    request: TravelRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = evaluate_complete_travel_documents(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/documents/inventory",
)
async def api_documents_inventory(
    payload: Dict[str, Any],
):
    try:
        profile = payload.get(
            "profile",
            {},
        )

        documents = payload.get(
            "documents",
            [],
        )

        result = evaluate_document_inventory(
            profile,
            documents,
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# CHECKLIST
# ============================================================

@app.post(
    "/api/checklist",
)
async def api_checklist(
    request: TravelProfileRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = generate_checklist(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/checklist/category",
)
async def api_checklist_category(
    payload: Dict[str, Any],
):
    try:
        category = payload.get(
            "category"
        )

        profile = payload.get(
            "profile",
            {},
        )

        if not category:
            raise HTTPException(
                status_code=422,
                detail="category is required.",
            )

        result = generate_category_checklist(
            category,
            profile,
        )

        return serialize(result)

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/checklist/update",
)
async def api_checklist_update(
    request: ChecklistUpdate,
):
    try:
        payload = request.model_dump(
            exclude_none=True
        )

        result = merge_checklist_state(
            payload
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.post(
    "/api/checklist/reset",
)
async def api_checklist_reset(
    payload: Dict[str, Any],
):
    try:
        result = reset_checklist(
            payload
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


@app.get(
    "/api/checklist/categories",
)
async def api_checklist_categories():
    return {
        "categories": checklist_categories()
    }


# ============================================================
# VALIDATION
# ============================================================

@app.post(
    "/api/validate",
)
async def api_validate(
    request: TravelProfileRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = validate_traveler(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# SAFE USER RESULT
# ============================================================

@app.post(
    "/api/safe-result",
)
async def api_safe_result(
    request: TravelProfileRequest,
):
    try:
        profile = request.model_dump(
            exclude_none=True
        )

        result = get_safe_result(
            profile
        )

        return serialize(result)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )


# ============================================================
# SOURCES
# ============================================================

@app.get(
    "/api/sources",
)
async def api_sources():
    try:
        repository = get_rules_engine()

        sources = []

        raw_sources = getattr(
            repository,
            "sources",
            None,
        )

        if isinstance(raw_sources, dict):
            raw_sources = list(
                raw_sources.values()
            )

        if raw_sources:
            for source in raw_sources:
                sources.append(
                    serialize(source)
                )

        if not sources:
            sources = load_sources_from_json()

        return {
            "sources": sources
        }

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )


# ============================================================
# FLOWS
# ============================================================

@app.get(
    "/api/flows",
)
async def api_flows():
    return {
        "flows": [
            {
                "id": "CUBAN_FLOW",
                "name": "Cuban traveler",
                "status": "ACTIVE",
            },
            {
                "id": "FOREIGNER_FLOW",
                "name": "Foreign traveler",
                "status": "ACTIVE",
            },
            {
                "id": "DUAL_NATIONALITY_FLOW",
                "name": "Dual nationality",
                "status": "VERIFY",
            },
            {
                "id": "MINOR_FLOW",
                "name": "Minor traveler",
                "status": "VERIFY",
            },
            {
                "id": "PASSPORT_FLOW",
                "name": "Passport",
                "status": "ACTIVE",
            },
            {
                "id": "VISA_FLOW",
                "name": "Visa / eVisa",
                "status": "ACTIVE",
            },
            {
                "id": "DVIAJEROS_FLOW",
                "name": "D'Viajeros",
                "status": "VERIFY",
            },
            {
                "id": "CONSULAR_FLOW",
                "name": "Consular",
                "status": "VERIFY",
            },
            {
                "id": "US_CUBA_FLOW",
                "name": "U.S. — Cuba review",
                "status": "VERIFY",
            },
        ]
    }


# ============================================================
# STATUSES
# ============================================================

@app.get(
    "/api/statuses",
)
async def api_statuses():
    return {
        "statuses": [
            {
                "id": "ACTIVE",
                "label": "Active",
            },
            {
                "id": "CONDITIONAL",
                "label": "Conditional",
            },
            {
                "id": "VERIFY",
                "label": "Verify",
            },
            {
                "id": "UNKNOWN",
                "label": "Unknown",
            },
            {
                "id": "INCOMPLETE",
                "label": "Incomplete",
            },
            {
                "id": "EXPIRED",
                "label": "Expired",
            },
            {
                "id": "COMPLETED",
                "label": "Completed",
            },
            {
                "id": "PENDING",
                "label": "Pending",
            },
        ]
    }


# ============================================================
# OFFICIAL DISCLAIMER
# ============================================================

@app.get(
    "/api/disclaimer",
)
async def api_disclaimer():
    return {
        "informational_only": True,
        "government_affiliation": False,
        "issues_official_documents": False,
        "issues_official_qr": False,
        "text": (
            "This application is an informational and "
            "preparation tool. It is not a government "
            "authority and does not issue passports, "
            "visas, permits, authorizations, official "
            "QR codes, or legal approvals."
        ),
    }


# ============================================================
# STATIC FILES
# ============================================================

if STATIC_DIR.exists():
    app.mount(
        "/static",
        StaticFiles(
            directory=str(STATIC_DIR)
        ),
        name="static",
    )


# ============================================================
# SERIALIZATION HELPERS
# ============================================================

def serialize(value: Any) -> Any:
    """
    Convert Pydantic models, dataclasses, enums,
    dictionaries and lists into JSON-compatible data.
    """

    if value is None:
        return None

    if hasattr(value, "model_dump"):
        try:
            return value.model_dump(
                exclude_none=True
            )
        except Exception:
            pass

    if hasattr(value, "to_dict"):
        try:
            return value.to_dict()
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
            str(key): serialize(item)
            for key, item in value.items()
        }

    if isinstance(value, (list, tuple, set)):
        return [
            serialize(item)
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


def normalize_engine_info(
    value: Any,
) -> Dict[str, Any]:
    data = serialize(value)

    if not isinstance(data, dict):
        return {
            "engine": data,
            "version": APP_VERSION,
        }

    return data


def load_sources_from_json():
    source_file = DATA_DIR / "sources.json"

    if not source_file.exists():
        return []

    try:
        import json

        with source_file.open(
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        if isinstance(data, dict):
            sources = data.get(
                "sources",
                [],
            )
        else:
            sources = data

        if not isinstance(
            sources,
            list,
        ):
            return []

        return sources

    except Exception:
        return []


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
async def startup_event():
    """
    Load the rules repository at application startup.
    """

    try:
        get_rules_engine()
    except Exception:
        # The health endpoint must remain available even if
        # a data file requires correction.
        pass


# ============================================================
# LOCAL DEVELOPMENT / RENDER
# ============================================================

if __name__ == "__main__":
    port = int(
        os.getenv(
            "PORT",
            "10000",
        )
    )

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
    )
