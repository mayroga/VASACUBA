from **future** import annotations

import json
from datetime import date
from pathlib import Path
from typing import Any, Dict

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from schemas import VisaRequest, DViajerosRequest

APP_NAME = "CUBA AUTO TRAVEL 2026"
APP_VERSION = "4.0.0"

BASE_DIR = Path(**file**).resolve().parent
DATA_DIR = BASE_DIR / "data"
STATIC_DIR = BASE_DIR / "static"

VISA_FILE = DATA_DIR / "cuba_visa.json"
DVIAJEROS_FILE = DATA_DIR / "dviajeros.json"
PASSPORTS_FILE = DATA_DIR / "passports.json"

OFFICIAL_VISA_URL = "https://evisacuba.cu/"
OFFICIAL_DVIAJEROS_URL = "https://dviajeros.mitrans.gob.cu/"

app = FastAPI(
title=APP_NAME,
version=APP_VERSION,
description=(
"Asistente independiente para preparar y acompañar al viajero "
"antes y durante el uso de los portales oficiales de eVisa Cuba y D'Viajeros."
),
)

def load_json(path: Path) -> Dict[str, Any]:
try:
if not path.exists():
return {}

    with path.open("r", encoding="utf-8") as file:
        data = json.load(file)

    return data if isinstance(data, dict) else {}

except (OSError, ValueError, TypeError):
    return {}

def get_visa_data() -> Dict[str, Any]:
return load_json(VISA_FILE)

def get_dviajeros_data() -> Dict[str, Any]:
return load_json(DVIAJEROS_FILE)

def get_passports_data() -> Dict[str, Any]:
return load_json(PASSPORTS_FILE)

def clean(value: Any) -> str:
return str(value or "").strip()

def valid_date(value: str) -> bool:
try:
date.fromisoformat(clean(value))
return True
except (ValueError, TypeError):
return False

def email_valid(value: str) -> bool:
value = clean(value)
return "@" in value and "." in value.rsplit("@", 1)[-1]

def passport_number_valid(value: str) -> bool:
value = clean(value).replace(" ", "")

if not 5 <= len(value) <= 20:
    return False

return all(character.isalnum() or character == "-" for character in value)

def passport_check(
country: str,
number: str,
first_name: str,
last_name: str,
birth_date: str,
expiration: str,
travel_date: str = "",
) -> Dict[str, Any]:

missing = []

fields = {
    "passport_country": country,
    "passport_number": number,
    "first_name": first_name,
    "last_name": last_name,
    "date_of_birth": birth_date,
    "passport_expiration": expiration,
}

for field, value in fields.items():
    if not clean(value):
        missing.append(field)

checks = []

if number and not passport_number_valid(number):
    checks.append({
        "id": "passport_number",
        "status": "REVISA ESTO",
        "message": "Revisa el número de pasaporte."
    })

if birth_date and not valid_date(birth_date):
    checks.append({
        "id": "date_of_birth",
        "status": "REVISA ESTO",
        "message": "Revisa la fecha de nacimiento."
    })

if expiration and not valid_date(expiration):
    checks.append({
        "id": "passport_expiration",
        "status": "REVISA ESTO",
        "message": "Revisa la fecha de vencimiento."
    })

if (
    valid_date(birth_date)
    and valid_date(expiration)
    and expiration < birth_date
):
    checks.append({
        "id": "expiration_after_birth",
        "status": "REVISA ESTO",
        "message": "La fecha de vencimiento no puede ser anterior a la fecha de nacimiento."
    })

if (
    travel_date
    and valid_date(travel_date)
    and valid_date(expiration)
    and expiration < travel_date
):
    checks.append({
        "id": "expiration_before_travel",
        "status": "REVISA ESTO",
        "message": "La fecha de vencimiento debe revisarse antes de la fecha prevista de llegada."
    })

if missing:
    status = "FALTA ESTE DATO"
    message = "Ten tu pasaporte delante y completa todos los datos."
elif checks:
    status = "REVISA ESTO"
    message = checks[0]["message"]
else:
    status = "LISTO"
    message = "Información del pasaporte preparada."

return {
    "status": status,
    "message": message,
    "missing_fields": missing,
    "checks": checks,
    "official_validity_confirmed": False,
}

@app.get("/")
def home():
index = STATIC_DIR / "index.html"

if index.exists():
    return FileResponse(index)

return {
    "app": APP_NAME,
    "version": APP_VERSION,
    "status": "ok",
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
"Preparar, revisar y acompañar al viajero "
"sin sustituir los trámites oficiales."
),
"modules": {
"visa": True,
"dviajeros": True,
"passport_check": True,
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

@app.get("/api/passports")
def passports_information():
return {
"module": "passports",
"data": get_passports_data(),
}

@app.post("/api/visa/evaluate")
def visa_evaluate(request: VisaRequest):
passport = passport_check(
country=request.passport_country,
number=request.passport_number,
first_name=request.first_name,
last_name=request.last_name,
birth_date=request.date_of_birth,
expiration=request.passport_expiration,
travel_date=request.arrival_date,
)

required = [
    "nationality",
    "country_of_residence",
    "passport_country",
    "passport_number",
    "first_name",
    "last_name",
    "date_of_birth",
    "passport_expiration",
    "travel_purpose",
    "email",
]

data = request.model_dump()

missing = [
    field
    for field in required
    if not clean(data.get(field))
]

checks = list(passport["checks"])

if request.email and not email_valid(request.email):
    checks.append({
        "id": "email",
        "status": "REVISA ESTO",
        "message": "Escribe un correo electrónico válido."
    })

if request.dual_nationality:
    checks.append({
        "id": "dual_nationality",
        "status": "REVISA ESTO",
        "message": "Revisa las instrucciones oficiales aplicables a tu situación."
    })

if passport["missing_fields"]:
    status = "FALTA ESTE DATO"
elif missing:
    status = "FALTA ESTE DATO"
elif checks:
    status = "REVISA ESTO"
else:
    status = "LISTO"

return {
    "module": "visa",
    "status": status,
    "missing_fields": missing,
    "checks": checks,
    "passport_check": passport,
    "official_portal": OFFICIAL_VISA_URL,
    "official_document_issued": False,
    "app_issues_visa": False,
    "official_submission_completed": False,
    "payment_received_by_app": False,
}

@app.post("/api/dviajeros/evaluate")
def dviajeros_evaluate(request: DViajerosRequest):
data = request.model_dump()

passport = passport_check(
    country=request.passport_country,
    number=request.passport_number,
    first_name=request.first_name,
    last_name=request.last_name,
    birth_date=request.date_of_birth,
    expiration=request.passport_expiration,
    travel_date=request.arrival_date,
)

required = [
    "first_name",
    "last_name",
    "nationality",
    "date_of_birth",
    "passport_number",
    "passport_country",
    "passport_expiration",
    "arrival_date",
    "flight_number",
    "airline",
    "accommodation",
]

missing = [
    field
    for field in required
    if not clean(data.get(field))
]

health_ok = bool(request.health_information)

customs_ok = bool(request.customs_information)

modules = [
    {
        "id": "passport",
        "title": "Pasaporte",
        "status": (
            "LISTO"
            if passport["status"] == "LISTO"
            else passport["status"]
        ),
    },
    {
        "id": "travel",
        "title": "Información del viaje",
        "status": (
            "LISTO"
            if all(
                clean(data.get(field))
                for field in [
                    "arrival_date",
                    "flight_number",
                    "airline",
                ]
            )
            else "FALTA ESTE DATO"
        ),
    },
    {
        "id": "accommodation",
        "title": "Alojamiento",
        "status": (
            "LISTO"
            if clean(request.accommodation)
            else "FALTA ESTE DATO"
        ),
    },
    {
        "id": "health",
        "title": "Salud",
        "status": "LISTO" if health_ok else "REVISA ESTO",
    },
    {
        "id": "customs",
        "title": "Aduana",
        "status": "LISTO" if customs_ok else "REVISA ESTO",
    },
]

if passport["status"] != "LISTO":
    status = passport["status"]
elif missing:
    status = "FALTA ESTE DATO"
elif not health_ok or not customs_ok:
    status = "REVISA ESTO"
else:
    status = "LISTO"

return {
    "module": "dviajeros",
    "status": status,
    "missing_fields": missing,
    "modules": modules,
    "passport_check": passport,
    "submission_status": (
        "MUY BIEN. YA PODEMOS CONTINUAR."
        if status == "LISTO"
        else status
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
"CUBA AUTO TRAVEL 2026 es una aplicación independiente "
"de preparación y acompañamiento. No pertenece al Gobierno "
"de Cuba, MINREX ni a las autoridades migratorias, sanitarias "
"o aduanales. No emite visas, no presenta trámites oficiales, "
"no genera códigos QR oficiales y no sustituye los portales "
"oficiales. El trámite oficial se realiza directamente con "
"la autoridad correspondiente."
)
}

if STATIC_DIR.exists():
app.mount(
"/static",
StaticFiles(directory=str(STATIC_DIR)),
name="static",
)
