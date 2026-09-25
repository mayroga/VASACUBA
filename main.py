import json,re
from datetime import datetime
from pathlib import Path
from typing import Any,Dict,List
from fastapi import FastAPI,HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from schemas import VisaRequest,DViajerosRequest,PassportRequest,VisaResponse,DViajerosResponse,PassportResponse

APP_NAME="CUBA AUTO TRAVEL 2026"
APP_VERSION="2026.4"
BASE_DIR=Path(__file__).resolve().parent
DATA_DIR=BASE_DIR/"data"
STATIC_DIR=BASE_DIR/"static"
VISA_FILE=DATA_DIR/"cuba_visa.json"
DVIJEROS_FILE=DATA_DIR/"dviajeros.json"
PASSPORTS_FILE=DATA_DIR/"passports.json"
OFFICIAL_VISA_URL="https://evisacuba.cu/"
OFFICIAL_DVIAJEROS_URL="https://dviajeros.mitrans.gob.cu/"

app=FastAPI(title=APP_NAME,version=APP_VERSION,description="Simulador de práctica y preparación para Visa/eVisa Cuba y D'Viajeros.")

def load_json(path:Path)->Dict[str,Any]:
    try:
        if not path.exists():return {}
        with path.open("r",encoding="utf-8") as f:
            data=json.load(f)
        return data if isinstance(data,dict) else {}
    except (OSError,ValueError,TypeError):
        return {}

def clean(value:Any)->str:
    return "" if value is None else str(value).strip()

def missing_fields(data:Dict[str,Any],fields:List[str])->List[str]:
    return [f for f in fields if not clean(data.get(f))]

def get_visa_data():return load_json(VISA_FILE)
def get_dviajeros_data():return load_json(DVIJEROS_FILE)
def get_passports_data():return load_json(PASSPORTS_FILE)

def practice_screens(data:Dict[str,Any])->List[Dict[str,Any]]:
    return data.get("screens",[]) if isinstance(data.get("screens"),list) else []

def practice_screen(data:Dict[str,Any],screen_id:str)->Dict[str,Any]:
    for screen in practice_screens(data):
        if screen.get("id")==screen_id:return screen
    raise HTTPException(status_code=404,detail="Etapa de práctica no encontrada.")

def evaluate_visa(request:VisaRequest)->Dict[str,Any]:
    data=request.model_dump()
    required=["nationality","country_of_residence","passport_country","travel_purpose"]
    missing=missing_fields(data,required)
    checks=[]
    passport_missing=missing_fields(data,["passport_country","passport_number","first_name","first_surname","date_of_birth"])
    if not request.has_passport:
        checks.append({"id":"passport","status":"INCOMPLETE","message":"Prepara un pasaporte antes de continuar con la práctica."})
    elif passport_missing:
        checks.append({"id":"passport_data","status":"INCOMPLETE","message":"Faltan datos básicos del pasaporte."})
    elif not request.passport_valid:
        checks.append({"id":"passport_validity","status":"VERIFY","message":"La vigencia debe verificarse según el requisito oficial aplicable."})
    else:
        checks.append({"id":"passport","status":"READY","message":"Datos básicos del pasaporte preparados."})
    checks.append({"id":"email","status":"READY" if clean(request.email) else "INCOMPLETE","message":"Correo electrónico preparado." if clean(request.email) else "Falta el correo electrónico."})
    if request.dual_nationality:
        checks.append({"id":"dual_nationality","status":"VERIFY","message":"La situación de doble nacionalidad debe verificarse oficialmente."})
    checks.append({"id":"visa_requirement","status":"VERIFY","message":"La necesidad y modalidad de visa deben verificarse según nacionalidad y circunstancias del viaje."})
    return {"module":"visa","status":"INCOMPLETE" if missing else "VERIFY","missing_fields":missing,"checks":checks,"official_portal":OFFICIAL_VISA_URL,"official_document_issued":False,"app_issues_visa":False,"source_data_loaded":bool(get_visa_data()),"practice_completed":False}

def evaluate_dviajeros(request:DViajerosRequest)->Dict[str,Any]:
    data=request.model_dump()
    personal=["first_name","last_name","nationality","date_of_birth"]
    migration=["passport_number","passport_country","arrival_date"]
    missing=missing_fields(data,personal+migration)
    if not request.flight_number:missing.append("flight_number")
    if not request.airline:missing.append("airline")
    missing=list(dict.fromkeys(missing))
    modules=[
        {"id":"personal_information","title":"Información personal","status":"INCOMPLETE" if any(x in missing for x in personal) else "READY"},
        {"id":"migration","title":"Información migratoria","status":"INCOMPLETE" if any(x in missing for x in migration+["flight_number","airline"]) else "READY"},
        {"id":"accommodation","title":"Alojamiento y viaje","status":"VERIFY"},
        {"id":"health","title":"Información de salud","status":"VERIFY"},
        {"id":"customs","title":"Aduana","status":"VERIFY"},
        {"id":"review","title":"Revisión","status":"INCOMPLETE" if missing else "VERIFY"}
    ]
    return {"module":"dviajeros","status":"INCOMPLETE" if missing else "VERIFY","missing_fields":missing,"modules":modules,"submission_status":"NOT_SUBMITTED","official_portal":OFFICIAL_DVIAJEROS_URL,"official_qr_generated":False,"official_submission_completed":False,"source_data_loaded":bool(get_dviajeros_data()),"practice_completed":False}

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
    checks.append({"id":"country_present","status":"READY" if clean(request.passport_country) else "INCOMPLETE","message":"País emisor proporcionado." if clean(request.passport_country) else "Falta el país emisor del pasaporte."})
    if not clean(request.passport_number):
        checks.append({"id":"number_present","status":"INCOMPLETE","message":"Falta el número de pasaporte."})
    elif not passport_number_valid(request.passport_number,config):
        checks.append({"id":"number_length_reasonable","status":"VERIFY","message":"Revisa el formato y longitud del número de pasaporte."})
    else:
        checks.append({"id":"number_present","status":"READY","message":"Número de pasaporte proporcionado."})
    for field,label in [("first_name","first_name_present"),("first_surname","last_name_present"),("date_of_birth","date_of_birth_present"),("expiration_date","expiration_date_present")]:
        ok=clean(data.get(field))
        checks.append({"id":label,"status":"READY" if ok else "INCOMPLETE","message":"Dato proporcionado." if ok else "Falta este dato del pasaporte."})
    birth=parse_date(request.date_of_birth)
    expiration=parse_date(request.expiration_date)
    travel=parse_date(request.travel_date)
    if birth and expiration:
        checks.append({"id":"expiration_after_birth","status":"READY" if expiration>birth else "VERIFY","message":"Fechas coherentes." if expiration>birth else "Las fechas deben revisarse."})
    elif clean(request.date_of_birth) and clean(request.expiration_date):
        checks.append({"id":"expiration_after_birth","status":"VERIFY","message":"No se pudo interpretar una de las fechas; revísala."})
    if expiration and travel:
        checks.append({"id":"expiration_not_before_travel","status":"READY" if expiration>=travel else "VERIFY","message":"La fecha de vencimiento no es anterior al viaje indicado." if expiration>=travel else "El pasaporte vence antes de la fecha indicada de viaje."})
    elif clean(request.expiration_date) and clean(request.travel_date):
        checks.append({"id":"expiration_not_before_travel","status":"VERIFY","message":"Debe revisarse la fecha de vencimiento respecto al viaje."})
    return {"module":"passports","status":"INCOMPLETE" if missing else "READY","missing_fields":missing,"checks":checks,"source_data_loaded":bool(get_passports_data())}

@app.get("/")
def home():
    index=STATIC_DIR/"index.html"
    if index.exists():return FileResponse(index)
    return {"app":APP_NAME,"version":APP_VERSION,"modules":["visa","dviajeros","passports"]}

@app.get("/health")
def health():return {"status":"ok","app":APP_NAME,"version":APP_VERSION}

@app.get("/api/health")
def api_health():return health()

@app.get("/api")
def api_info():
    return {"app":APP_NAME,"version":APP_VERSION,"modules":{"visa":True,"dviajeros":True,"passports":True},"official_portals":{"visa":OFFICIAL_VISA_URL,"dviajeros":OFFICIAL_DVIAJEROS_URL}}

@app.get("/api/visa")
def visa_information():
    return {"module":"visa","name":"Visa cubana / eVisa","official_portal":OFFICIAL_VISA_URL,"data":get_visa_data()}

@app.post("/api/visa/evaluate")
def visa_evaluate(request:VisaRequest):return evaluate_visa(request)

@app.get("/api/visa/practice")
def visa_practice():
    data=get_visa_data()
    return {"module":"visa","name":"Visa cubana / eVisa","official_portal":OFFICIAL_VISA_URL,"screens":practice_screens(data),"practice_method":data.get("practice_method",{}),"official_process":data.get("official_process",{}),"saved_practice":data.get("saved_practice",{}),"example_policy":data.get("example_policy",{})}

@app.get("/api/visa/practice/{screen_id}")
def visa_practice_screen(screen_id:str):
    data=get_visa_data()
    return practice_screen(data,screen_id)

@app.post("/api/visa/practice")
def visa_practice_save(payload:Dict[str,Any]):
    answers=payload.get("answers",{})
    screen_id=clean(payload.get("screen_id"))
    current=int(payload.get("current_screen",1) or 1)
    completed=bool(payload.get("completed",False))
    return {"module":"visa","screen_id":screen_id,"current_screen":current,"answers":answers if isinstance(answers,dict) else {},"completed":completed,"official_submission":False,"official_payment":False,"official_visa":False}

@app.get("/api/dviajeros")
def dviajeros_information():
    return {"module":"dviajeros","name":"D'Viajeros","official_portal":OFFICIAL_DVIAJEROS_URL,"data":get_dviajeros_data()}

@app.post("/api/dviajeros/evaluate")
def dviajeros_evaluate(request:DViajerosRequest):return evaluate_dviajeros(request)

@app.get("/api/dviajeros/practice")
def dviajeros_practice():
    data=get_dviajeros_data()
    return {"module":"dviajeros","name":"D'Viajeros","official_portal":OFFICIAL_DVIAJEROS_URL,"screens":practice_screens(data),"practice_method":data.get("practice_method",{}),"saved_practice":data.get("saved_practice",{}),"example_policy":data.get("example_policy",{})}

@app.get("/api/dviajeros/practice/{screen_id}")
def dviajeros_practice_screen(screen_id:str):
    data=get_dviajeros_data()
    return practice_screen(data,screen_id)

@app.post("/api/dviajeros/practice")
def dviajeros_practice_save(payload:Dict[str,Any]):
    answers=payload.get("answers",{})
    screen_id=clean(payload.get("screen_id"))
    current=int(payload.get("current_screen",1) or 1)
    completed=bool(payload.get("completed",False))
    return {"module":"dviajeros","screen_id":screen_id,"current_screen":current,"answers":answers if isinstance(answers,dict) else {},"completed":completed,"official_submission":False,"official_qr_generated":False}

@app.get("/api/passports")
def passports_information():
    return {"module":"passports","name":"Preparación de pasaporte","data":get_passports_data()}

@app.post("/api/passports/evaluate")
def passports_evaluate(request:PassportRequest):return evaluate_passport(request)

@app.get("/api/sources")
def sources():
    return {"visa":{"name":"Portal oficial eVisa Cuba","url":OFFICIAL_VISA_URL},"dviajeros":{"name":"Portal oficial D'Viajeros","url":OFFICIAL_DVIAJEROS_URL}}

@app.get("/api/disclaimer")
def disclaimer():
    return {"text":"CUBA AUTO TRAVEL 2026 es una aplicación independiente de preparación y práctica. No pertenece al Gobierno de Cuba, MINREX, autoridad migratoria, consular, aduana ni otra entidad oficial. No emite visas, no envía solicitudes oficiales, no procesa pagos oficiales y no genera códigos QR oficiales."}

if STATIC_DIR.exists():
    app.mount("/static",StaticFiles(directory=str(STATIC_DIR)),name="static")
