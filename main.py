import os,json,hmac,hashlib,base64,time
from pathlib import Path
from typing import Any
import stripe
from fastapi import FastAPI,HTTPException,Request,Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from schemas import VisaRequest,DViajerosRequest,PassportRequest

BASE_DIR=Path(__file__).resolve().parent
DATA_DIR=BASE_DIR/"data"
STATIC_DIR=BASE_DIR/"static"

APP_URL=os.environ.get("APP_URL","https://vasacuba.onrender.com").rstrip("/")
ACCESS_MINUTES=18
ACCESS_SECONDS=ACCESS_MINUTES*60
ADMIN_USERNAME=os.environ.get("ADMIN_USERNAME","").strip()
ADMIN_PASSWORD=os.environ.get("ADMIN_PASSWORD","")
STRIPE_SECRET_KEY=os.environ.get("STRIPE_SECRET_KEY","").strip()
STRIPE_PUBLISHABLE_KEY=os.environ.get("STRIPE_PUBLISHABLE_KEY","").strip()
STRIPE_PRICE_ID1=os.environ.get("STRIPE_PRICE_ID1","").strip()
STRIPE_WEBHOOK_SECRET=os.environ.get("STRIPE_WEBHOOK_SECRET","").strip()
ACCESS_TOKEN_SECRET=os.environ.get("ACCESS_TOKEN_SECRET","").strip() or STRIPE_SECRET_KEY

if STRIPE_SECRET_KEY:
    stripe.api_key=STRIPE_SECRET_KEY

def load_json(filename:str,default:Any=None)->Any:
    p=DATA_DIR/filename
    try:
        with p.open("r",encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        if default is not None:
            return default
        raise
    except json.JSONDecodeError as e:
        raise RuntimeError(f"JSON inválido: {filename}: {e}")

CUBA_VISA=load_json("cuba_visa.json",{})
D_VIAJEROS=load_json("dviajeros.json",{})
PASSPORTS=load_json("passports.json",{})

app=FastAPI(
    title="CUBA AUTO TRAVEL 2026",
    description="Guía práctica para pasajeros que viajan a Cuba.",
    version="2.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

OFFICIAL={
    "visa":"https://evisacuba.cu/",
    "visa_form":"https://evisacuba.cu/en/solicitar/visa",
    "dviajeros":"https://www.dviajeros.mitrans.gob.cu/",
    "cuba_travel":"https://www.cuba.travel/informacion-util/regulaciones-y-tramites",
    "google_flights":"https://www.google.com/travel/flights",
    "american_cuba":"https://www.aa.com/en-us/flights-to-cuba",
    "american_cuba_info":"https://www.aa.com/pubcontent/en_US/travel-info/international-travel/cuba.html",
    "charters":"https://www.cuballama.com/viajes/vuelos/charters",
    "holguin_flights":"https://www.cuba.travel/destinos/holguin/como-llegar"
}

GUIDE={
    "visa":{
        "title_es":"Visa para viajar a Cuba",
        "title_en":"Visa to travel to Cuba",
        "intro_es":"No tengas miedo. La visa se puede revisar paso a paso antes de entrar al formulario oficial.",
        "intro_en":"Don't worry. You can review the visa step by step before opening the official form.",
        "steps_es":[
            "Revisa primero que tu pasaporte sea válido.",
            "Confirma qué tipo de visa corresponde a tu viaje.",
            "Ten a mano los datos exactamente como aparecen en tu pasaporte.",
            "Abre el formulario oficial de eVisa Cuba.",
            "Escribe tus datos con cuidado y revisa todo antes de enviar.",
            "Conserva la información de tu visa para el viaje."
        ],
        "steps_en":[
            "First check that your passport is valid.",
            "Confirm which visa applies to your trip.",
            "Have your information exactly as shown on your passport.",
            "Open the official Cuba eVisa form.",
            "Enter your information carefully and review it before submitting.",
            "Keep your visa information for your trip."
        ],
        "button_es":"ABRIR VISA OFICIAL",
        "button_en":"OPEN OFFICIAL VISA"
    },
    "dviajeros":{
        "title_es":"D'Viajeros paso a paso",
        "title_en":"D'Viajeros step by step",
        "intro_es":"D'Viajeros es el formulario digital que debes completar antes de viajar. Hazlo con calma y revisa cada dato.",
        "intro_en":"D'Viajeros is the digital form you complete before traveling. Take your time and check every detail.",
        "steps_es":[
            "Entra al sitio oficial de D'Viajeros.",
            "Selecciona el idioma que prefieras.",
            "Completa tus datos personales exactamente como aparecen en tus documentos.",
            "Completa la información de tu viaje y vuelo.",
            "Revisa cuidadosamente todos los datos antes de finalizar.",
            "Al terminar, conserva el comprobante y el código QR para presentarlo cuando corresponda."
        ],
        "steps_en":[
            "Open the official D'Viajeros website.",
            "Select your preferred language.",
            "Enter your personal information exactly as shown on your documents.",
            "Enter your trip and flight information.",
            "Carefully review everything before finishing.",
            "When completed, keep your confirmation and QR code for your trip."
        ],
        "button_es":"ABRIR D'VIAJEROS",
        "button_en":"OPEN D'VIAJEROS"
    }
}

FLIGHTS={
    "google":{
        "name":"Google Flights",
        "description_es":"Busca vuelos y compara opciones de diferentes aerolíneas.",
        "description_en":"Search flights and compare options from different airlines.",
        "url":OFFICIAL["google_flights"]
    },
    "american":{
        "name":"American Airlines",
        "description_es":"Consulta vuelos de American hacia Cuba.",
        "description_en":"Check American Airlines flights to Cuba.",
        "url":OFFICIAL["american_cuba"]
    },
    "charters":{
        "name_es":"Charters a Cuba",
        "name_en":"Charter flights to Cuba",
        "description_es":"Consulta opciones de vuelos charter y verifica disponibilidad, fechas y precios directamente con el proveedor.",
        "description_en":"Check charter flight options and verify availability, dates and prices directly with the provider.",
        "url":OFFICIAL["charters"]
    }
}

AIRPORTS=[
    {"code":"MIA","name":"Miami","name_en":"Miami","type":"regular_charter"},
    {"code":"TPA","name":"Tampa","name_en":"Tampa","type":"regular_charter"},
    {"code":"FLL","name":"Fort Lauderdale","name_en":"Fort Lauderdale","type":"search"},
    {"code":"RSW","name":"Fort Myers","name_en":"Fort Myers","type":"search"}
]

DESTINATIONS=[
    {"code":"HAV","name":"La Habana","name_en":"Havana"},
    {"code":"VRA","name":"Varadero","name_en":"Varadero"},
    {"code":"SNU","name":"Santa Clara","name_en":"Santa Clara"},
    {"code":"CMW","name":"Camagüey","name_en":"Camagüey"},
    {"code":"HOG","name":"Holguín","name_en":"Holguín"},
    {"code":"SCU","name":"Santiago de Cuba","name_en":"Santiago de Cuba"}
]

CHARTER_INFO=[
    {
        "name":"Cubazul Air",
        "type":"Charter",
        "note_es":"Operador mencionado en información turística cubana; confirma vuelos y fechas actuales.",
        "note_en":"Operator mentioned in Cuban tourism information; confirm current flights and dates.",
        "source":OFFICIAL["holguin_flights"]
    },
    {
        "name":"Xael",
        "type":"Charter",
        "note_es":"Operador mencionado para vuelos a Cuba; confirma disponibilidad directamente.",
        "note_en":"Operator mentioned for flights to Cuba; confirm availability directly.",
        "source":OFFICIAL["holguin_flights"]
    },
    {
        "name":"Invicta",
        "type":"Charter",
        "note_es":"Operador mencionado para vuelos a Cuba; confirma disponibilidad directamente.",
        "note_en":"Operator mentioned for flights to Cuba; confirm availability directly.",
        "source":OFFICIAL["holguin_flights"]
    },
    {
        "name":"Cuballama",
        "type":"Charter booking",
        "note_es":"Servicio de información/reserva de charters; verifica ruta, fecha y precio antes de comprar.",
        "note_en":"Charter information/booking service; verify route, date and price before purchasing.",
        "source":OFFICIAL["charters"]
    }
]

def request_data(request:Any)->dict:
    return request.model_dump()

def stripe_ready():
    return bool(STRIPE_SECRET_KEY and STRIPE_PRICE_ID1)

def make_token(kind:str,seconds:int=ACCESS_SECONDS)->str:
    exp=int(time.time())+max(1,int(seconds))
    payload=f"{kind}|{exp}"
    secret=ACCESS_TOKEN_SECRET or "cuba-auto-travel-2026"
    sig=hmac.new(secret.encode(),payload.encode(),hashlib.sha256).digest()
    return base64.urlsafe_b64encode(f"{payload}|{base64.urlsafe_b64encode(sig).decode()}".encode()).decode()

def read_token(token:str):
    try:
        raw=base64.urlsafe_b64decode(token.encode()).decode()
        kind,exp,sig=raw.split("|",2)
        exp=int(exp)
        if exp<=int(time.time()):
            return None
        payload=f"{kind}|{exp}"
        secret=ACCESS_TOKEN_SECRET or "cuba-auto-travel-2026"
        expected=base64.urlsafe_b64encode(
            hmac.new(secret.encode(),payload.encode(),hashlib.sha256).digest()
        ).decode()
        if not hmac.compare_digest(sig,expected):
            return None
        return {"kind":kind,"expires_at":exp,"remaining_seconds":max(0,exp-int(time.time()))}
    except Exception:
        return None

def auth_token(request:Request):
    value=request.headers.get("authorization","")
    if not value.lower().startswith("bearer "):
        raise HTTPException(status_code=401,detail="Acceso requerido")
    token=value[7:].strip()
    data=read_token(token)
    if not data:
        raise HTTPException(status_code=401,detail="Acceso inválido o expirado")
    return data

def require_service_access(auth=Depends(auth_token)):
    return auth

def verify_price_is_20():
    if not stripe_ready():
        raise HTTPException(status_code=503,detail="Stripe no está configurado")
    try:
        price=stripe.Price.retrieve(STRIPE_PRICE_ID1)
        if not price.get("active"):
            raise HTTPException(status_code=503,detail="El precio de Stripe no está activo")
        if price.get("type")!="one_time":
            raise HTTPException(status_code=503,detail="El precio debe ser de pago único")
        if str(price.get("currency","")).lower()!="usd":
            raise HTTPException(status_code=503,detail="El precio debe estar en USD")
        if int(price.get("unit_amount") or 0)!=2000:
            raise HTTPException(status_code=503,detail="El precio configurado no es de $20")
        return price
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503,detail=f"No se pudo verificar el precio de Stripe: {e}")

@app.get("/health")
def health():
    return {"status":"ok","app":"CUBA AUTO TRAVEL 2026","version":"2.1.0"}

@app.get("/api")
def api_info():
    return {
        "name":"CUBA AUTO TRAVEL 2026",
        "status":"ok",
        "version":"2.1.0",
        "endpoints":[
            "/api/auth/config",
            "/api/auth/checkout",
            "/api/auth/verify",
            "/api/auth/admin",
            "/api/auth/check",
            "/api/stripe/webhook",
            "/api/visa",
            "/api/visa/check",
            "/api/dviajeros",
            "/api/dviajeros/check",
            "/api/passports",
            "/api/passports/check",
            "/api/guides",
            "/api/flights",
            "/api/airports",
            "/api/destinations",
            "/api/charters"
        ]
    }

@app.get("/api/auth/config")
def auth_config():
    return {
        "publishable_key":STRIPE_PUBLISHABLE_KEY,
        "price_usd":20,
        "access_minutes":ACCESS_MINUTES,
        "stripe_enabled":stripe_ready(),
        "admin_enabled":bool(ADMIN_USERNAME and ADMIN_PASSWORD)
    }

@app.post("/api/auth/admin")
async def admin_login(request:Request):
    try:
        data=await request.json()
    except Exception:
        data={}
    username=str(data.get("username","")).strip()
    password=str(data.get("password",""))
    if not ADMIN_USERNAME or not ADMIN_PASSWORD:
        raise HTTPException(status_code=503,detail="Acceso administrativo no configurado")
    if not hmac.compare_digest(username,ADMIN_USERNAME) or not hmac.compare_digest(password,ADMIN_PASSWORD):
        raise HTTPException(status_code=401,detail="Usuario o contraseña incorrectos")
    token=make_token("admin",ACCESS_SECONDS)
    return {
        "ok":True,
        "valid":True,
        "kind":"admin",
        "token":token,
        "access_token":token,
        "expires_in":ACCESS_SECONDS,
        "remaining_seconds":ACCESS_SECONDS,
        "expires_at":int(time.time())+ACCESS_SECONDS
    }

@app.get("/api/auth/check")
def auth_check(auth=Depends(auth_token)):
    return {
        "ok":True,
        "valid":True,
        "kind":auth["kind"],
        "expires_at":auth["expires_at"],
        "remaining_seconds":auth["remaining_seconds"]
    }

@app.post("/api/auth/checkout")
async def create_checkout():
    verify_price_is_20()
    try:
        session=stripe.checkout.Session.create(
            mode="payment",
            line_items=[{"price":STRIPE_PRICE_ID1,"quantity":1}],
            success_url=f"{APP_URL}/?stripe_session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{APP_URL}/?payment_cancelled=1",
            metadata={
                "product":"CUBA AUTO TRAVEL 2026",
                "access_minutes":str(ACCESS_MINUTES)
            }
        )
        return {
            "ok":True,
            "url":session.url,
            "session_id":session.id
        }
    except Exception as e:
        raise HTTPException(status_code=502,detail=f"No se pudo crear el pago: {e}")

@app.post("/api/auth/verify")
async def verify_checkout(request:Request):
    try:
        data=await request.json()
    except Exception:
        data={}
    session_id=str(data.get("session_id") or data.get("stripe_session_id") or "").strip()
    if not session_id:
        raise HTTPException(status_code=400,detail="Falta session_id")
    if not stripe_ready():
        raise HTTPException(status_code=503,detail="Stripe no está configurado")
    try:
        session=stripe.checkout.Session.retrieve(session_id)
        if session.get("status")!="complete":
            raise HTTPException(status_code=402,detail="El pago no está completado")
        if session.get("payment_status")!="paid":
            raise HTTPException(status_code=402,detail="El pago no aparece como pagado")
        if session.get("mode")!="payment":
            raise HTTPException(status_code=400,detail="Sesión de pago no válida")
        metadata=session.get("metadata") or {}
        if metadata.get("product")!="CUBA AUTO TRAVEL 2026":
            raise HTTPException(status_code=400,detail="Producto no válido")
        price=verify_price_is_20()
        line_items=stripe.checkout.Session.list_line_items(session_id,limit=10)
        valid_price=False
        for item in line_items.get("data",[]):
            if item.get("price",{}).get("id")==STRIPE_PRICE_ID1:
                valid_price=True
                break
        if not valid_price:
            raise HTTPException(status_code=400,detail="Precio de pago no válido")
        token=make_token("paid",ACCESS_SECONDS)
        return {
            "ok":True,
            "valid":True,
            "kind":"paid",
            "token":token,
            "access_token":token,
            "expires_in":ACCESS_SECONDS,
            "remaining_seconds":ACCESS_SECONDS,
            "expires_at":int(time.time())+ACCESS_SECONDS,
            "amount":int(price.get("unit_amount") or 0),
            "currency":price.get("currency")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502,detail=f"No se pudo verificar el pago: {e}")

@app.post("/api/stripe/webhook")
async def stripe_webhook(request:Request):
    payload=await request.body()
    signature=request.headers.get("stripe-signature","")
    if not STRIPE_WEBHOOK_SECRET:
        return {"received":True,"configured":False}
    try:
        event=stripe.Webhook.construct_event(payload,signature,STRIPE_WEBHOOK_SECRET)
    except ValueError:
        raise HTTPException(status_code=400,detail="Payload inválido")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400,detail="Firma Stripe inválida")
    if event.get("type")=="checkout.session.completed":
        session=event.get("data",{}).get("object",{})
        print("Stripe checkout completed:",session.get("id"))
    return {"received":True}

@app.get("/api/data")
def get_data(auth=Depends(require_service_access)):
    return {
        "cuba_visa":CUBA_VISA,
        "dviajeros":D_VIAJEROS,
        "passports":PASSPORTS
    }

@app.get("/api/visa")
def get_visa(auth=Depends(require_service_access)):
    return CUBA_VISA

@app.post("/api/visa/check")
def check_visa(request:VisaRequest,auth=Depends(require_service_access)):
    return {
        "status":"ok",
        "request":request_data(request),
        "data":CUBA_VISA
    }

@app.get("/api/dviajeros")
def get_dviajeros(auth=Depends(require_service_access)):
    return D_VIAJEROS

@app.post("/api/dviajeros/check")
def check_dviajeros(request:DViajerosRequest,auth=Depends(require_service_access)):
    return {
        "status":"ok",
        "request":request_data(request),
        "data":D_VIAJEROS
    }

@app.get("/api/passports")
def get_passports(auth=Depends(require_service_access)):
    return PASSPORTS

@app.post("/api/passports/check")
def check_passport(request:PassportRequest,auth=Depends(require_service_access)):
    return {
        "status":"ok",
        "request":request_data(request),
        "data":PASSPORTS
    }

@app.get("/api/guides")
def get_guides(auth=Depends(require_service_access)):
    return {
        "visa":GUIDE["visa"],
        "dviajeros":GUIDE["dviajeros"]
    }

@app.get("/api/flights")
def get_flights(auth=Depends(require_service_access)):
    return {
        "providers":FLIGHTS,
        "airports":AIRPORTS,
        "destinations":DESTINATIONS,
        "charters":CHARTER_INFO
    }

@app.get("/api/airports")
def get_airports(auth=Depends(require_service_access)):
    return AIRPORTS

@app.get("/api/destinations")
def get_destinations(auth=Depends(require_service_access)):
    return DESTINATIONS

@app.get("/api/charters")
def get_charters(auth=Depends(require_service_access)):
    return CHARTER_INFO

@app.get("/api/official")
def official_links(auth=Depends(require_service_access)):
    return OFFICIAL

@app.get("/api/reload")
def reload_data(auth=Depends(require_service_access)):
    global CUBA_VISA,D_VIAJEROS,PASSPORTS
    CUBA_VISA=load_json("cuba_visa.json",{})
    D_VIAJEROS=load_json("dviajeros.json",{})
    PASSPORTS=load_json("passports.json",{})
    return {"status":"ok","message":"Datos recargados"}

if STATIC_DIR.exists():
    app.mount("/static",StaticFiles(directory=str(STATIC_DIR)),name="static")

@app.get("/{path:path}")
def frontend(path:str):
    if path.startswith("api/"):
        raise HTTPException(status_code=404,detail="API endpoint not found")
    index=STATIC_DIR/"index.html"
    if index.exists():
        return FileResponse(index)
    raise HTTPException(status_code=404,detail="Aplicación no encontrada")

if __name__=="__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT","8000"))
    )
