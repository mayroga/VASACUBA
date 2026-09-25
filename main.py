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
import json,re
from datetime import date,datetime
from pathlib import Path
from typing import Any, Dict, List

from fastapi import FastAPI, HTTPException
from typing import Any,Dict,List
from fastapi import FastAPI
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
from schemas import VisaRequest,DViajerosRequest,PassportRequest,VisaResponse,DViajerosResponse,PassportResponse

APP_NAME="CUBA AUTO TRAVEL 2026"
APP_VERSION="2026.3"
BASE_DIR=Path(__file__).resolve().parent
DATA_DIR=BASE_DIR/"data"
STATIC_DIR=BASE_DIR/"static"
VISA_FILE=DATA_DIR/"cuba_visa.json"
DVIJEROS_FILE=DATA_DIR/"dviajeros.json"
PASSPORTS_FILE=DATA_DIR/"passports.json"
OFFICIAL_VISA_URL="https://evisacuba.cu/"
OFFICIAL_DVIAJEROS_URL="https://dviajeros.mitrans.gob.cu/"

app=FastAPI(title=APP_NAME,version=APP_VERSION,description="Asistente informativo y de preparación para Visa cubana/eVisa y D'Viajeros.")

def load_json(path:Path)->Dict[str,Any]:
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
        if not path.exists(): return {}
        with path.open("r",encoding="utf-8") as f:
            data=json.load(f)
        return data if isinstance(data,dict) else {}
    except (OSError,ValueError,TypeError):
        return {}

def clean(value:Any)->str:
    return "" if value is None else str(value).strip()

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
def missing_fields(data:Dict[str,Any],fields:List[str])->List[str]:
    return [field for field in fields if not clean(data.get(field))]

    if missing:
        return "INCOMPLETE"

    return "READY"


# ============================================================
# DATOS
# ============================================================

def get_visa_data() -> Dict[str, Any]:
def get_visa_data()->Dict[str,Any]:
    return load_json(VISA_FILE)


def get_dviajeros_data() -> Dict[str, Any]:
def get_dviajeros_data()->Dict[str,Any]:
    return load_json(DVIJEROS_FILE)

def get_passports_data()->Dict[str,Any]:
    return load_json(PASSPORTS_FILE)

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

def evaluate_visa(request:VisaRequest)->Dict[str,Any]:
    data=request.model_dump()
    required=["nationality","country_of_residence","passport_country","travel_purpose"]
    missing=missing_fields(data,required)
    checks=[]
    passport_missing=missing_fields(data,["passport_country","passport_number","first_name","first_surname","date_of_birth"])
    if not request.has_passport:
        checks.append({
            "id": "passport",
            "status": "INCOMPLETE",
            "message": (
                "Se necesita un pasaporte "
                "válido para continuar."
            ),
        })

        checks.append({"id":"passport","status":"INCOMPLETE","message":"Se necesita un pasaporte para continuar con la preparación."})
    elif passport_missing:
        checks.append({"id":"passport_data","status":"INCOMPLETE","message":"Faltan datos básicos del pasaporte."})
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

        checks.append({"id":"passport_validity","status":"VERIFY","message":"Debe verificarse la vigencia del pasaporte según los requisitos oficiales aplicables."})
    else:
        checks.append({
            "id": "passport",
            "status": "READY",
            "message": (
                "Datos básicos del pasaporte "
                "proporcionados."
            ),
        })

        checks.append({"id":"passport","status":"READY","message":"Datos básicos del pasaporte proporcionados."})
    if not request.email:
        checks.append({
            "id": "email",
            "status": "INCOMPLETE",
            "message": (
                "Se necesita un correo electrónico "
                "para continuar con la preparación."
            ),
        })
        checks.append({"id":"email","status":"INCOMPLETE","message":"Se necesita un correo electrónico para continuar con la preparación."})
    else:
        checks.append({
            "id": "email",
            "status": "READY",
            "message": (
                "Correo electrónico proporcionado."
            ),
        })

        checks.append({"id":"email","status":"READY","message":"Correo electrónico proporcionado."})
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
        checks.append({"id":"dual_nationality","status":"VERIFY","message":"La situación de doble nacionalidad debe verificarse con la fuente oficial."})
    checks.append({"id":"visa_requirement","status":"VERIFY","message":"La necesidad y modalidad de visa deben verificarse según nacionalidad y circunstancias del viaje."})
    return {"module":"visa","status":"INCOMPLETE" if missing else "VERIFY","missing_fields":missing,"checks":checks,"official_portal":OFFICIAL_VISA_URL,"official_document_issued":False,"app_issues_visa":False,"source_data_loaded":bool(get_visa_data())}

def evaluate_dviajeros(request:DViajerosRequest)->Dict[str,Any]:
    data=request.model_dump()
    personal=["first_name","last_name","nationality","date_of_birth"]
    migration=["passport_number","passport_country","arrival_date"]
    missing=missing_fields(data,personal+["passport_number","passport_country","arrival_date"])
    if not request.flight_number: missing.append("flight_number")
    if not request.airline: missing.append("airline")
    modules=[
        {"id":"personal_information","title":"Información personal","status":"INCOMPLETE" if any(x in missing for x in personal) else "READY"},
        {"id":"migration","title":"Migración","status":"INCOMPLETE" if any(x in missing for x in ["passport_number","passport_country","arrival_date","flight_number","airline"]) else "READY"},
        {"id":"health","title":"Salud","status":"VERIFY" if not request.health_information else "VERIFY"},
        {"id":"customs","title":"Aduana","status":"VERIFY" if not request.customs_information else "VERIFY"},
        {"id":"review","title":"Revisión","status":"INCOMPLETE" if missing else "VERIFY"}
    ]

    overall = status_from_missing(
        missing
    )

    if overall == "READY":
        submission_status = (
            "READY_FOR_OFFICIAL_FORM"
        )
    return {"module":"dviajeros","status":"INCOMPLETE" if missing else "VERIFY","missing_fields":list(dict.fromkeys(missing)),"modules":modules,"submission_status":"NOT_SUBMITTED","official_portal":OFFICIAL_DVIAJEROS_URL,"official_qr_generated":False,"official_submission_completed":False,"source_data_loaded":bool(get_dviajeros_data())}

def parse_date(value:str):
    value=clean(value)
    if not value:return None
    for fmt in ("%Y-%m-%d","%m/%d/%Y","%d/%m/%Y"):
        try:return datetime.strptime(value,fmt).date()
        except ValueError:pass
    return None

def passport_number_valid(number:str,config:Dict[str,Any])->bool:
    number=clean(number)
    if not number:return False
    minimum=int(config.get("min_number_length",5))
    maximum=int(config.get("max_number_length",20))
    if not minimum<=len(number)<=maximum:return False
    if not config.get("allow_letters",True) and re.search(r"[A-Za-z]",number):return False
    if not config.get("allow_numbers",True) and re.search(r"\d",number):return False
    if not config.get("allow_hyphen",True) and "-" in number:return False
    return bool(re.fullmatch(r"[A-Za-z0-9-]+",number))

def evaluate_passport(request:PassportRequest)->Dict[str,Any]:
    data=request.model_dump()
    config=get_passports_data().get("default",{})
    checks=[]
    required=["first_name","first_surname","date_of_birth","passport_number","passport_country","expiration_date"]
    missing=missing_fields(data,required)
    if not clean(request.passport_country):
        checks.append({"id":"country_present","status":"INCOMPLETE","message":"Falta el país emisor del pasaporte."})
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
        checks.append({"id":"country_present","status":"READY","message":"País emisor proporcionado."})
    if not clean(request.passport_number):
        checks.append({"id":"number_present","status":"INCOMPLETE","message":"Falta el número de pasaporte."})
    elif not passport_number_valid(request.passport_number,config):
        checks.append({"id":"number_length_reasonable","status":"VERIFY","message":"Revisa el formato y longitud del número de pasaporte."})
    else:
        checks.append({"id":"number_present","status":"READY","message":"Número de pasaporte proporcionado."})
    for field,label in [("first_name","first_name_present"),("first_surname","last_name_present"),("date_of_birth","date_of_birth_present"),("expiration_date","expiration_date_present")]:
        checks.append({"id":label,"status":"READY" if clean(data.get(field)) else "INCOMPLETE","message":"Dato proporcionado." if clean(data.get(field)) else "Falta este dato del pasaporte."})
    birth=parse_date(request.date_of_birth)
    expiration=parse_date(request.expiration_date)
    travel=parse_date(request.travel_date)
    if birth and expiration:
        checks.append({"id":"expiration_after_birth","status":"READY" if expiration>birth else "VERIFY","message":"Las fechas deben revisarse." if expiration<=birth else "Fechas coherentes."})
    elif clean(request.date_of_birth) and clean(request.expiration_date):
        checks.append({"id":"expiration_after_birth","status":"VERIFY","message":"No se pudo interpretar una de las fechas; revísala."})
    if expiration and travel:
        checks.append({"id":"expiration_not_before_travel","status":"READY" if expiration>=travel else "VERIFY","message":"El pasaporte vence antes de la fecha indicada de viaje." if expiration<travel else "La fecha de vencimiento no es anterior al viaje indicado."})
    elif clean(request.expiration_date) and clean(request.travel_date):
        checks.append({"id":"expiration_not_before_travel","status":"VERIFY","message":"Debe revisarse la fecha de vencimiento respecto al viaje."})
    status="INCOMPLETE" if missing else "READY"
    return {"module":"passports","status":status,"missing_fields":missing,"checks":checks,"source_data_loaded":bool(get_passports_data())}

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

    index=STATIC_DIR/"index.html"
    if index.exists():return FileResponse(index)
    return {"app":APP_NAME,"version":APP_VERSION,"modules":["visa","dviajeros","passports"]}

@app.get("/health")
def health():
    return {
        "status": "ok",
        "app": APP_NAME,
        "version": APP_VERSION,
    }

    return {"status":"ok","app":APP_NAME,"version":APP_VERSION}

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
    return {"app":APP_NAME,"version":APP_VERSION,"modules":{"visa":True,"dviajeros":True,"passports":True},"official_portals":{"visa":OFFICIAL_VISA_URL,"dviajeros":OFFICIAL_DVIAJEROS_URL}}

@app.get("/api/visa")
def visa_information():

    return {
        "module": "visa",
        "name": "Visa cubana / eVisa",
        "official_portal": OFFICIAL_VISA_URL,
        "data": get_visa_data(),
    }

    return {"module":"visa","name":"Visa cubana / eVisa","official_portal":OFFICIAL_VISA_URL,"data":get_visa_data()}

@app.post("/api/visa/evaluate")
def visa_evaluate(
    request: VisaRequest,
):

def visa_evaluate(request:VisaRequest):
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

    return {"module":"dviajeros","name":"D'Viajeros","official_portal":OFFICIAL_DVIAJEROS_URL,"data":get_dviajeros_data()}

@app.post("/api/dviajeros/evaluate")
def dviajeros_evaluate(
    request: DViajerosRequest,
):

def dviajeros_evaluate(request:DViajerosRequest):
    return evaluate_dviajeros(request)

@app.get("/api/passports")
def passports_information():
    return {"module":"passports","name":"Preparación de pasaporte","data":get_passports_data()}

# ============================================================
# FUENTES
# ============================================================
@app.post("/api/passports/evaluate")
def passports_evaluate(request:PassportRequest):
    return evaluate_passport(request)

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
    return {"visa":{"name":"Portal oficial eVisa Cuba","url":OFFICIAL_VISA_URL},"dviajeros":{"name":"Portal oficial D'Viajeros","url":OFFICIAL_DVIAJEROS_URL}}

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
    return {"text":"CUBA AUTO TRAVEL 2026 es una aplicación informativa y de preparación. No pertenece al Gobierno de Cuba, MINREX, autoridad migratoria, aduana ni otra entidad oficial. No emite visas, pasaportes, autorizaciones ni códigos QR oficiales. Los requisitos y decisiones oficiales deben verificarse directamente con las autoridades y portales oficiales correspondientes."}

if STATIC_DIR.exists():
    app.mount(
        "/static",
        StaticFiles(
            directory=str(STATIC_DIR)
        ),
        name="static",
    )
    app.mount("/static",StaticFiles(directory=str(STATIC_DIR)),name="static")
