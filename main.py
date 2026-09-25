# main.py
# CUBA AUTO TRAVEL 2026
# Módulos:
#   1. Visa cubana / eVisa
#   2. D'Viajeros
#
# La aplicación informa, prepara y valida datos.
# No emite visas, no emite documentos oficiales
# y no genera códigos QR oficiales.

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field


# ============================================================
# CONFIGURACIÓN
# ============================================================

APP_NAME = "CUBA AUTO TRAVEL 2026"
APP_VERSION = "1.0.0"

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"

VISA_FILE = DATA_DIR / "cuba_visa.json"
DVIJEROS_FILE = DATA_DIR / "dviajeros.json"

OFFICIAL_VISA_URL = "https://evisacuba.cu/"
OFFICIAL_DVIAJEROS_URL = (
    "https://dviajeros.mitrans.gob.cu/"
)


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=(
        "Asistente informativo para Visa cubana "
        "y D'Viajeros."
    ),
)


# ============================================================
# MODELOS
# ============================================================

class VisaRequest(BaseModel):
    nationality: str = ""
    country_of_residence: str = ""
    passport_country: str = ""
    travel_purpose: str = ""
    entry_type: str = ""
    has_passport: bool = False
    passport_valid: bool = False
    email: str = ""
    dual_nationality: bool = False


class DViajerosRequest(BaseModel):
    first_name: str = ""
    last_name: str = ""
    nationality: str = ""
    date_of_birth: str = ""
    passport_number: str = ""
    passport_country: str = ""
    arrival_date: str = ""
    flight_number: str = ""
    airline: str = ""
    accommodation: str = ""
    address_in_cuba: str = ""
    purpose_of_trip: str = ""
    health_information: Dict[str, Any] = Field(
        default_factory=dict
    )
    customs_information: Dict[str, Any] = Field(
        default_factory=dict
    )


# ============================================================
# UTILIDADES
# ============================================================

def load_json(path: Path) -> Dict[str, Any]:
    """
    Carga un archivo JSON.
    Si no existe o está dañado, devuelve {}.
    """
    try:
        if not path.exists():
            return {}

        with path.open(
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


def clean(value: Any) -> str:
    if value is None:
        return ""

    return str(value).strip()


def missing_fields(
    data: Dict[str, Any],
    fields: List[str],
) -> List[str]:

    missing = []

    for field in fields:
        value = data.get(field)

        if value is None:
            missing.append(field)
            continue

        if isinstance(value, str):
            if not value.strip():
                missing.append(field)
        elif value is False:
            # False no se considera automáticamente
            # un dato faltante.
            continue

    return missing


def status_from_missing(
    missing: List[str],
) -> str:

    if missing:
        return "INCOMPLETE"

    return "READY"


# ============================================================
# DATOS
# ============================================================

def get_visa_data() -> Dict[str, Any]:
    return load_json(VISA_FILE)


def get_dviajeros_data() -> Dict[str, Any]:
    return load_json(DVIJEROS_FILE)


# ============================================================
# VISA CUBANA
# ============================================================

def evaluate_visa(
    request: VisaRequest,
) -> Dict[str, Any]:

    data = request.model_dump()

    required = [
        "nationality",
        "country_of_residence",
        "passport_country",
        "travel_purpose",
    ]

    missing = missing_fields(
        data,
        required,
    )

    checks = []

    if not request.has_passport:
        checks.append({
            "id": "passport",
            "status": "INCOMPLETE",
            "message": (
                "Se necesita un pasaporte "
                "válido para continuar."
            ),
        })

    elif not request.passport_valid:
        checks.append({
            "id": "passport_validity",
            "status": "VERIFY",
            "message": (
                "Debe verificarse la validez "
                "del pasaporte según las reglas "
                "oficiales aplicables."
            ),
        })

    else:
        checks.append({
            "id": "passport",
            "status": "READY",
            "message": (
                "Datos básicos del pasaporte "
                "proporcionados."
            ),
        })

    if not request.email:
        checks.append({
            "id": "email",
            "status": "INCOMPLETE",
            "message": (
                "Se necesita un correo electrónico "
                "para continuar con la preparación."
            ),
        })
    else:
        checks.append({
            "id": "email",
            "status": "READY",
            "message": (
                "Correo electrónico proporcionado."
            ),
        })

    if request.dual_nationality:
        checks.append({
            "id": "dual_nationality",
            "status": "VERIFY",
            "message": (
                "La situación de doble nacionalidad "
                "debe verificarse con la fuente oficial."
            ),
        })

    # La necesidad exacta de visa/eVisa depende de
    # nacionalidad, propósito y demás circunstancias.
    # No se inventa una determinación automática.
    checks.append({
        "id": "visa_requirement",
        "status": "VERIFY",
        "message": (
            "La necesidad y modalidad de visa "
            "deben verificarse según nacionalidad "
            "y circunstancias del viaje."
        ),
    })

    overall = (
        "INCOMPLETE"
        if missing
        else "VERIFY"
    )

    return {
        "module": "visa",
        "status": overall,
        "missing_fields": missing,
        "checks": checks,
        "official_portal": OFFICIAL_VISA_URL,
        "official_document_issued": False,
        "app_issues_visa": False,
        "source_data_loaded": bool(
            get_visa_data()
        ),
    }


# ============================================================
# D'VIAJEROS
# ============================================================

def evaluate_dviajeros(
    request: DViajerosRequest,
) -> Dict[str, Any]:

    data = request.model_dump()

    required = [
        "first_name",
        "last_name",
        "nationality",
        "date_of_birth",
        "passport_number",
        "passport_country",
        "arrival_date",
        "flight_number",
        "airline",
    ]

    missing = missing_fields(
        data,
        required,
    )

    modules = [
        {
            "id": "personal_information",
            "title": "Información personal",
            "status": (
                "INCOMPLETE"
                if any(
                    field in missing
                    for field in [
                        "first_name",
                        "last_name",
                        "nationality",
                        "date_of_birth",
                    ]
                )
                else "READY"
            ),
        },
        {
            "id": "migration",
            "title": "Migración",
            "status": (
                "INCOMPLETE"
                if any(
                    field in missing
                    for field in [
                        "passport_number",
                        "passport_country",
                        "arrival_date",
                        "flight_number",
                        "airline",
                    ]
                )
                else "READY"
            ),
        },
        {
            "id": "health",
            "title": "Salud",
            "status": (
                "READY"
                if request.health_information
                else "VERIFY"
            ),
        },
        {
            "id": "customs",
            "title": "Aduana",
            "status": (
                "READY"
                if request.customs_information
                else "VERIFY"
            ),
        },
        {
            "id": "review",
            "title": "Revisión",
            "status": (
                "INCOMPLETE"
                if missing
                else "READY"
            ),
        },
    ]

    overall = status_from_missing(
        missing
    )

    if overall == "READY":
        submission_status = (
            "READY_FOR_OFFICIAL_FORM"
        )
    else:
        submission_status = "INCOMPLETE"

    return {
        "module": "dviajeros",
        "status": overall,
        "missing_fields": missing,
        "modules": modules,
        "submission_status": submission_status,
        "official_portal": (
            OFFICIAL_DVIAJEROS_URL
        ),
        "official_qr_generated": False,
        "official_submission_completed": False,
        "source_data_loaded": bool(
            get_dviajeros_data()
        ),
    }


# ============================================================
# RUTAS GENERALES
# ============================================================

@app.get("/")
def home():
    index = STATIC_DIR / "index.html"

    if index.exists():
        return FileResponse(index)

    return {
        "app": APP_NAME,
        "version": APP_VERSION,
        "modules": [
            "visa",
            "dviajeros",
        ],
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "app": APP_NAME,
        "version": APP_VERSION,
    }


@app.get("/api/health")
def api_health():
    return health()


@app.get("/api")
def api_info():
    return {
        "app": APP_NAME,
        "version": APP_VERSION,
        "modules": {
            "visa": True,
            "dviajeros": True,
        },
        "official_portals": {
            "visa": OFFICIAL_VISA_URL,
            "dviajeros": OFFICIAL_DVIAJEROS_URL,
        },
    }


# ============================================================
# VISA ROUTES
# ============================================================

@app.get("/api/visa")
def visa_information():

    return {
        "module": "visa",
        "name": "Visa cubana / eVisa",
        "official_portal": OFFICIAL_VISA_URL,
        "data": get_visa_data(),
    }


@app.post("/api/visa/evaluate")
def visa_evaluate(
    request: VisaRequest,
):

    return evaluate_visa(request)


# ============================================================
# D'VIAJEROS ROUTES
# ============================================================

@app.get("/api/dviajeros")
def dviajeros_information():

    return {
        "module": "dviajeros",
        "name": "D'Viajeros",
        "official_portal": (
            OFFICIAL_DVIAJEROS_URL
        ),
        "data": get_dviajeros_data(),
    }


@app.post("/api/dviajeros/evaluate")
def dviajeros_evaluate(
    request: DViajerosRequest,
):

    return evaluate_dviajeros(request)


# ============================================================
# FUENTES
# ============================================================

@app.get("/api/sources")
def sources():

    return {
        "visa": {
            "name": "Portal oficial eVisa Cuba",
            "url": OFFICIAL_VISA_URL,
        },
        "dviajeros": {
            "name": "Portal oficial D'Viajeros",
            "url": OFFICIAL_DVIAJEROS_URL,
        },
    }


# ============================================================
# DISCLAIMER
# ============================================================

@app.get("/api/disclaimer")
def disclaimer():

    return {
        "text": (
            "CUBA AUTO TRAVEL 2026 es una aplicación "
            "informativa y de preparación. No pertenece "
            "al Gobierno de Cuba, MINREX, autoridad "
            "migratoria, aduana ni otra entidad oficial. "
            "No emite visas, pasaportes, autorizaciones "
            "ni códigos QR oficiales. Los requisitos y "
            "decisiones oficiales deben verificarse "
            "directamente con las autoridades y portales "
            "oficiales correspondientes."
        )
    }


# ============================================================
# STATIC
# ============================================================

if STATIC_DIR.exists():
    app.mount(
        "/static",
        StaticFiles(
            directory=str(STATIC_DIR)
        ),
        name="static",
    )

