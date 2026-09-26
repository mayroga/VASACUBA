import json,re
from datetime import datetime
from pathlib import Path
from typing import Any,Dict,List
from fastapi import FastAPI,HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from schemas import VisaRequest,DViajerosRequest,PassportRequest

APP_NAME="CUBA AUTO TRAVEL 2026"
APP_VERSION="2026.5"
BASE_DIR=Path(__file__).resolve().parent
DATA_DIR=BASE_DIR/"data"
STATIC_DIR=BASE_DIR/"static"
VISA_FILE=DATA_DIR/"cuba_visa.json"
DVIJEROS_FILE=DATA_DIR/"dviajeros.json"
PASSPORTS_FILE=DATA_DIR/"passports.json"
OFFICIAL_VISA_URL="https://evisacuba.cu/"
OFFICIAL_DVIAJEROS_URL="https://dviajeros.mitrans.gob.cu/"

app=FastAPI(title=APP_NAME,version=APP_VERSION,description="Práctica y preparación independiente para Visa/eVisa Cuba y D'Viajeros.")

def load_json(path:Path)->Dict[str,Any]:
try:
if not path.exists():return {}
with path.open("r",encoding="utf-8") as f:data=json.load(f)
return data if isinstance(data,dict) else {}
except (OSError,ValueError,TypeError):return {}

def clean(v:Any)->str:return "" if v is None else str(v).strip()

def missing_fields(data:Dict,fields:List)->List[str]:
return [f for f in fields if not clean(data.get(f))]

def visa_data():return load_json(VISA_FILE)
def dviajeros_data():return load_json(DVIJEROS_FILE)
def passports_data():return load_json(PASSPORTS_FILE)

def screens(data:Dict)->List[Dict[str,Any]]:
return data.get("screens",[]) if isinstance(data.get("screens"),list) else []

def get_screen(data:Dict,screen_id:str)->Dict[str,Any]:
for s in screens(data):
if s.get("id")==screen_id:return s
raise HTTPException(404,"Etapa de práctica no encontrada.")

def evaluate_visa(r:VisaRequest)->Dict[str,Any]:
d=r.model_dump()
required=["nationality","country_of_residence","passport_country","travel_purpose"]
missing=missing_fields(d,required)
checks=[]
pm=missing_fields(d,["passport_country","passport_number","first_name","first_surname","date_of_birth"])
if not r.has_passport:
checks.append({"id":"passport","status":"INCOMPLETE","message":"Prepara un pasaporte antes de continuar."})
elif pm:
checks.append({"id":"passport_data","status":"INCOMPLETE","message":"Faltan datos básicos del pasaporte."})
elif not r.passport_valid:
checks.append({"id":"passport_validity","status":"VERIFY","message":"La vigencia debe verificarse oficialmente."})
else:
checks.append({"id":"passport","status":"READY","message":"Datos básicos del pasaporte preparados."})
checks.append({"id":"email","status":"READY" if clean(r.email) else "INCOMPLETE","message":"Correo electrónico preparado." if clean(r.email) else "Falta el correo electrónico."})
if r.dual_nationality:checks.append({"id":"dual_nationality","status":"VERIFY","message":"La situación de doble nacionalidad debe verificarse oficialmente."})
checks.append({"id":"visa_requirement","status":"VERIFY","message":"La necesidad y modalidad de visa deben verificarse según nacionalidad y circunstancias del viaje."})
return {"module":"visa","status":"INCOMPLETE" if missing else "VERIFY","missing_fields":missing,"checks":checks,"official_portal":OFFICIAL_VISA_URL,"official_document_issued":False,"app_issues_visa":False,"source_data_loaded":bool(visa_data()),"practice_completed":False}

def evaluate_dviajeros(r:DViajerosRequest)->Dict[str,Any]:
d=r.model_dump()
personal=["first_name","last_name","nationality","date_of_birth"]
migration=["passport_number","passport_country","arrival_date"]
missing=missing_fields(d,personal+migration)
if not r.flight_number:missing.append("flight_number")
if not r.airline:missing.append("airline")
missing=list(dict.fromkeys(missing))
modules=[
{"id":"personal_information","title":"Información personal","status":"INCOMPLETE" if any(x in missing for x in personal) else "READY"},
{"id":"migration","title":"Información migratoria","status":"INCOMPLETE" if any(x in missing for x in migration+["flight_number","airline"]) else "READY"},
{"id":"accommodation","title":"Alojamiento y viaje","status":"VERIFY"},
{"id":"health","title":"Información de salud","status":"VERIFY"},
{"id":"customs","title":"Aduana","status":"VERIFY"},
{"id":"review","title":"Revisión","status":"INCOMPLETE" if missing else "VERIFY"}
]
return {"module":"dviajeros","status":"INCOMPLETE" if missing else "VERIFY","missing_fields":missing,"modules":modules,"submission_status":"NOT_SUBMITTED","official_portal":OFFICIAL_DVIAJEROS_URL,"official_qr_generated":False,"official_submission_completed":False,"source_data_loaded":bool(dviajeros_data()),"practice_completed":False}

def parse_date(v:str):
v=clean(v)
if not v:return None
for fmt in("%Y-%m-%d","%m/%d/%Y","%d/%m/%Y"):
try:return datetime.strptime(v,fmt).date()
except ValueError:pass
return None

def passport_number_valid(number:str,cfg:Dict)->bool:
n=clean(number)
if not n:return False
minimum=int(cfg.get("min_number_length",5))
maximum=int(cfg.get("max_number_length",20))
if not minimum<=len(n)<=maximum:return False
if not cfg.get("allow_letters",True) and re.search(r"[A-Za-z]",n):return False
if not cfg.get("allow_numbers",True) and re.search(r"\d",n):return False
if not cfg.get("allow_hyphen",True) and "-" in n:return False
return bool(re.fullmatch(r"[A-Za-z0-9-]+",n))

def evaluate_passport(r:PassportRequest)->Dict[str,Any]:
d=r.model_dump();cfg=passports_data().get("default",{});checks=[]
required=["first_name","first_surname","date_of_birth","passport_number","passport_country","expiration_date"]
missing=missing_fields(d,required)
checks.append({"id":"country_present","status":"READY" if clean(r.passport_country) else "INCOMPLETE","message":"País emisor proporcionado." if clean(r.passport_country) else "Falta el país emisor."})
if not clean(r.passport_number):checks.append({"id":"number_present","status":"INCOMPLETE","message":"Falta el número de pasaporte."})
elif not passport_number_valid(r.passport_number,cfg):checks.append({"id":"number_format","status":"VERIFY","message":"Revisa el formato y longitud del número de pasaporte."})
else:checks.append({"id":"number_present","status":"READY","message":"Número de pasaporte proporcionado."})
for field,label in[("first_name","first_name_present"),("first_surname","last_name_present"),("date_of_birth","date_of_birth_present"),("expiration_date","expiration_date_present")]:
ok=clean(d.get(field));checks.append({"id":label,"status":"READY" if ok else "INCOMPLETE","message":"Dato proporcionado." if ok else "Falta este dato."})
birth=parse_date(r.date_of_birth);expiration=parse_date(r.expiration_date);travel=parse_date(r.travel_date)
if birth and expiration:checks.append({"id":"expiration_after_birth","status":"READY" if expiration>birth else "VERIFY","message":"Fechas coherentes." if expiration>birth else "Las fechas deben revisarse."})
if expiration and travel:checks.append({"id":"expiration_not_before_travel","status":"READY" if expiration>=travel else "VERIFY","message":"La fecha de vencimiento no es anterior al viaje indicado." if expiration>=travel else "El pasaporte vence antes de la fecha indicada."})
return {"module":"passports","status":"INCOMPLETE" if missing else "READY","missing_fields":missing,"checks":checks,"source_data_loaded":bool(passports_data())}

@app.get("/")
def home():
index=STATIC_DIR/"index.html"
return FileResponse(index) if index.exists() else {"app":APP_NAME,"version":APP_VERSION}

@app.get("/health")
def health():return {"status":"ok","app":APP_NAME,"version":APP_VERSION}

@app.get("/api/health")
def api_health():return health()

@app.get("/api")
def api_info():
return {"app":APP_NAME,"version":APP_VERSION,"modules":{"visa":True,"dviajeros":True,"passports":True},"official_portals":{"visa":OFFICIAL_VISA_URL,"dviajeros":OFFICIAL_DVIAJEROS_URL}}

@app.get("/api/visa")
def visa_information():return {"module":"visa","name":"Visa cubana / eVisa","official_portal":OFFICIAL_VISA_URL,"data":visa_data()}

@app.post("/api/visa/evaluate")
def visa_evaluate(r:VisaRequest):return evaluate_visa(r)

@app.get("/api/visa/practice")
def visa_practice():
d=visa_data()
return {"module":"visa","name":"Visa cubana / eVisa","official_portal":OFFICIAL_VISA_URL,"screens":screens(d),"practice_method":d.get("practice_method",{}),"official_process":d.get("official_process",{}),"saved_practice":d.get("saved_practice",{}),"example_policy":d.get("example_policy",{})}

@app.get("/api/visa/practice/{screen_id}")
def visa_practice_screen(screen_id:str):return get_screen(visa_data(),screen_id)

@app.post("/api/visa/practice")
def visa_practice_save(payload:Dict):
return {"module":"visa","screen_id":clean(payload.get("screen_id")),"current_screen":int(payload.get("current_screen",1) or 1),"answers":payload.get("answers",{}) if isinstance(payload.get("answers",{}),dict) else {},"completed":bool(payload.get("completed",False)),"official_submission":False,"official_payment":False,"official_visa":False}

@app.get("/api/dviajeros")
def dviajeros_information():return {"module":"dviajeros","name":"D'Viajeros","official_portal":OFFICIAL_DVIAJEROS_URL,"data":dviajeros_data()}

@app.post("/api/dviajeros/evaluate")
def dviajeros_evaluate(r:DViajerosRequest):return evaluate_dviajeros(r)

@app.get("/api/dviajeros/practice")
def dviajeros_practice():
d=dviajeros_data()
return {"module":"dviajeros","name":"D'Viajeros","official_portal":OFFICIAL_DVIAJEROS_URL,"screens":screens(d),"practice_method":d.get("practice_method",{}),"saved_practice":d.get("saved_practice",{}),"example_policy":d.get("example_policy",{})}

@app.get("/api/dviajeros/practice/{screen_id}")
def dviajeros_practice_screen(screen_id:str):return get_screen(dviajeros_data(),screen_id)

@app.post("/api/dviajeros/practice")
def dviajeros_practice_save(payload:Dict):
return {"module":"dviajeros","screen_id":clean(payload.get("screen_id")),"current_screen":int(payload.get("current_screen",1) or 1),"answers":payload.get("answers",{}) if isinstance(payload.get("answers",{}),dict) else {},"completed":bool(payload.get("completed",False)),"official_submission":False,"official_qr_generated":False}

@app.get("/api/passports")
def passports_information():return {"module":"passports","name":"Preparación de pasaporte","data":passports_data()}

@app.post("/api/passports/evaluate")
def passports_evaluate(r:PassportRequest):return evaluate_passport(r)

@app.get("/api/sources")
def sources():
return {"visa":{"name":"Portal oficial eVisa Cuba","url":OFFICIAL_VISA_URL},"dviajeros":{"name":"Portal oficial D'Viajeros","url":OFFICIAL_DVIAJEROS_URL}}

@app.get("/api/disclaimer")
def disclaimer():
return {"text":"CUBA AUTO TRAVEL 2026 es una aplicación independiente de preparación y práctica. No pertenece al Gobierno de Cuba, MINREX, autoridad migratoria, consular, aduana ni otra entidad oficial. No emite visas, no envía solicitudes oficiales, no procesa pagos oficiales y no genera códigos QR oficiales."}

if STATIC_DIR.exists():app.mount("/static",StaticFiles(directory=str(STATIC_DIR)),name="static")
