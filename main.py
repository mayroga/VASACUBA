import os,json
from pathlib import Path
from typing import Any,Optional
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from schemas import VisaRequest,DViajerosRequest,PassportRequest

BASE_DIR=Path(__file__).resolve().parent
DATA_DIR=BASE_DIR/"data"
STATIC_DIR=BASE_DIR/"static"

def load_json(filename:str,default:Any=None)->Any:
    p=DATA_DIR/filename
    try:
        with p.open("r",encoding="utf-8") as f:return json.load(f)
    except FileNotFoundError:
        if default is not None:return default
        raise
    except json.JSONDecodeError as e:
        raise RuntimeError(f"JSON inválido: {filename}: {e}")

CUBA_VISA=load_json("cuba_visa.json",{})
D_VIAJEROS=load_json("dviajeros.json",{})
PASSPORTS=load_json("passports.json",{})

app=FastAPI(title="CUBA AUTO TRAVEL 2026",description="Guía práctica para pasajeros que viajan a Cuba.",version="2.0.0")
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_credentials=True,allow_methods=["*"],allow_headers=["*"])

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
    {"name":"Cubazul Air","type":"Charter","note_es":"Operador mencionado en información turística cubana; confirma vuelos y fechas actuales.","note_en":"Operator mentioned in Cuban tourism information; confirm current flights and dates.","source":OFFICIAL["holguin_flights"]},
    {"name":"Xael","type":"Charter","note_es":"Operador mencionado para vuelos a Cuba; confirma disponibilidad directamente.","note_en":"Operator mentioned for flights to Cuba; confirm availability directly.","source":OFFICIAL["holguin_flights"]},
    {"name":"Invicta","type":"Charter","note_es":"Operador mencionado para vuelos a Cuba; confirma disponibilidad directamente.","note_en":"Operator mentioned for flights to Cuba; confirm availability directly.","source":OFFICIAL["holguin_flights"]},
    {"name":"Cuballama","type":"Charter booking","note_es":"Servicio de información/reserva de charters; verifica ruta, fecha y precio antes de comprar.","note_en":"Charter information/booking service; verify route, date and price before purchasing.","source":OFFICIAL["charters"]}
]

def request_data(request:Any)->dict:
    return request.model_dump()

@app.get("/health")
def health():
    return {"status":"ok","app":"CUBA AUTO TRAVEL 2026","version":"2.0.0"}

@app.get("/api")
def api_info():
    return {"name":"CUBA AUTO TRAVEL 2026","status":"ok","version":"2.0.0","endpoints":["/api/visa","/api/visa/check","/api/dviajeros","/api/dviajeros/check","/api/passports","/api/passports/check","/api/guides","/api/flights","/api/airports","/api/destinations","/api/charters"]}

@app.get("/api/data")
def get_data():
    return {"cuba_visa":CUBA_VISA,"dviajeros":D_VIAJEROS,"passports":PASSPORTS}

@app.get("/api/visa")
def get_visa():
    return CUBA_VISA

@app.post("/api/visa/check")
def check_visa(request:VisaRequest):
    return {"status":"ok","request":request_data(request),"data":CUBA_VISA}

@app.get("/api/dviajeros")
def get_dviajeros():
    return D_VIAJEROS

@app.post("/api/dviajeros/check")
def check_dviajeros(request:DViajerosRequest):
    return {"status":"ok","request":request_data(request),"data":D_VIAJEROS}

@app.get("/api/passports")
def get_passports():
    return PASSPORTS

@app.post("/api/passports/check")
def check_passport(request:PassportRequest):
    return {"status":"ok","request":request_data(request),"data":PASSPORTS}

@app.get("/api/guides")
def get_guides():
    return {"visa":GUIDE["visa"],"dviajeros":GUIDE["dviajeros"]}

@app.get("/api/flights")
def get_flights():
    return {"providers":FLIGHTS,"airports":AIRPORTS,"destinations":DESTINATIONS,"charters":CHARTER_INFO}

@app.get("/api/official")
def official_links():
    return OFFICIAL

@app.get("/api/reload")
def reload_data():
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
    if index.exists():return FileResponse(index)
    raise HTTPException(status_code=404,detail="Aplicación no encontrada")

if __name__=="__main__":
    import uvicorn
    uvicorn.run("main:app",host="0.0.0.0",port=int(os.environ.get("PORT","8000")))
