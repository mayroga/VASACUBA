from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from schemas import VisaRequest, DViajerosRequest


APP_NAME = "CUBA AUTO TRAVEL 2026"
APP_VERSION = "2.0.0"

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"

VISA_FILE = DATA_DIR / "cuba_visa.json"
DVIJEROS_FILE = DATA_DIR / "dviajeros.json"

OFFICIAL_VISA_URL = "https://evisacuba.cu/"
OFFICIAL_DVIAJEROS_URL = (
    "https://dviajeros.mitrans.gob.cu/"
)


app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=(
        "Asistente de preparación para Visa cubana "
        "y D'Viajeros. La aplicación guía al viajero, "
        "organiza información y enlaza con los portales "
        "oficiales."
    ),
)


def load_json(path: Path) -> Dict[str, Any]:
    try:
        if not path.exists():
            return {}

        with path.open(
            "r",
            encoding="utf-8",
        ) as file:
            data = json.load(file)

        if isinstance(data, dict):
            return data

    except (
        OSError,
        ValueError,
        TypeError,
    ):
        pass

    return {}


def get_visa_data() -> Dict[str, Any]:
    return load_json(VISA_FILE)


def get_dviajeros_data() -> Dict[str, Any]:
    return load_json(DVIJEROS_FILE)


@app.get("/")
def home():
    index = STATIC_DIR / "index.html"

    if index.exists():
        return FileResponse(index)

    return {
        "app": APP_NAME,
        "version": APP_VERSION,
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
        "purpose": (
            "Preparar y acompañar al viajero "
            "antes y durante el uso de los portales oficiales."
        ),
        "modules": {
            "visa": True,
            "dviajeros": True,
        },
        "official_portals": {
            "visa": OFFICIAL_VISA_URL,
            "dviajeros": OFFICIAL_DVIAJEROS_URL,
        },
    }


@app.get("/api/visa")
def visa_information():
    return {
        "module": "visa",
        "name": "Visa cubana / eVisa",
        "official_portal": OFFICIAL_VISA_URL,
        "data": get_visa_data(),
    }


@app.get("/api/dviajeros")
def dviajeros_information():
    return {
        "module": "dviajeros",
        "name": "D'Viajeros",
        "official_portal": OFFICIAL_DVIAJEROS_URL,
        "data": get_dviajeros_data(),
    }


@app.post("/api/visa/evaluate")
def visa_evaluate(request: VisaRequest):
    data = request.model_dump()

    required = [
        "nationality",
        "country_of_residence",
        "passport_country",
        "travel_purpose",
        "email",
    ]

    missing = [
        field
        for field in required
        if not str(data.get(field, "")).strip()
    ]

    checks = []

    checks.append({
        "id": "passport",
        "status": (
            "FALTA INFORMACIÓN"
            if not request.has_passport
            else "LISTO"
        ),
        "message": (
            "Debes tener tu pasaporte disponible."
            if not request.has_passport
            else "Pasaporte indicado."
        ),
    })

    checks.append({
        "id": "passport_validity",
        "status": (
            "REVISAR"
            if not request.passport_valid
            else "LISTO"
        ),
        "message": (
            "Verifica la vigencia del pasaporte "
            "según la información oficial aplicable."
            if not request.passport_valid
            else "Vigencia indicada por el usuario."
        ),
    })

    if request.dual_nationality:
        checks.append({
            "id": "dual_nationality",
            "status": "REVISAR",
            "message": (
                "Si tienes doble nacionalidad, revisa "
                "las reglas oficiales aplicables a tu caso."
            ),
        })

    status = (
        "FALTA INFORMACIÓN"
        if missing
        else "REVISAR"
    )

    return {
        "module": "visa",
        "status": status,
        "missing_fields": missing,
        "checks": checks,
        "official_portal": OFFICIAL_VISA_URL,
        "official_document_issued": False,
        "app_issues_visa": False,
    }


@app.post("/api/dviajeros/evaluate")
def dviajeros_evaluate(
    request: DViajerosRequest,
):
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

    missing = [
        field
        for field in required
        if not str(data.get(field, "")).strip()
    ]

    personal_fields = [
        "first_name",
        "last_name",
        "nationality",
        "date_of_birth",
    ]

    migration_fields = [
        "passport_number",
        "passport_country",
        "arrival_date",
        "flight_number",
        "airline",
    ]

    modules = [
        {
            "id": "personal_information",
            "title": "Información personal",
            "status": (
                "FALTA INFORMACIÓN"
                if any(
                    field in missing
                    for field in personal_fields
                )
                else "LISTO"
            ),
        },
        {
            "id": "migration",
            "title": "Información del viaje",
            "status": (
                "FALTA INFORMACIÓN"
                if any(
                    field in missing
                    for field in migration_fields
                )
                else "LISTO"
            ),
        },
        {
            "id": "health",
            "title": "Salud",
            "status": (
                "LISTO"
                if request.health_information
                else "REVISAR"
            ),
        },
        {
            "id": "customs",
            "title": "Aduana",
            "status": (
                "LISTO"
                if request.customs_information
                else "REVISAR"
            ),
        },
    ]

    return {
        "module": "dviajeros",
        "status": (
            "FALTA INFORMACIÓN"
            if missing
            else "LISTO"
        ),
        "missing_fields": missing,
        "modules": modules,
        "submission_status": (
            "LISTO PARA CONTINUAR AL PORTAL OFICIAL"
            if not missing
            else "FALTA INFORMACIÓN"
        ),
        "official_portal": OFFICIAL_DVIAJEROS_URL,
        "official_qr_generated": False,
        "official_submission_completed": False,
    }


@app.get("/api/sources")
def sources():
    return {
        "visa": {
            "name": "eVisa Cuba",
            "url": OFFICIAL_VISA_URL,
        },
        "dviajeros": {
            "name": "D'Viajeros",
            "url": OFFICIAL_DVIAJEROS_URL,
        },
    }


@app.get("/api/disclaimer")
def disclaimer():
    return {
        "text": (
            "CUBA AUTO TRAVEL 2026 es una aplicación "
            "independiente de preparación y acompañamiento. "
            "No pertenece al Gobierno de Cuba, MINREX, "
            "autoridades migratorias, sanitarias o aduanales. "
            "No emite visas, no presenta trámites oficiales, "
            "no genera códigos QR oficiales y no sustituye "
            "los portales oficiales. El usuario realiza "
            "el trámite directamente con la autoridad "
            "correspondiente."
        )
    }


if STATIC_DIR.exists():
    app.mount(
        "/static",
        StaticFiles(
            directory=str(STATIC_DIR)
        ),
        name="static",
    )

