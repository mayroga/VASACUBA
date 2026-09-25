import os,json
from pathlib import Path
from typing import Any,Dict,Optional
from fastapi import FastAPI,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from schemas import VisaRequest,DViajerosRequest,PassportRequest

BASE_DIR=Path(__file__).resolve().parent
DATA_DIR=BASE_DIR/"data"
STATIC_DIR=BASE_DIR/"static"

def load_json(filename:str,default:Any=None)->Any:
    path=DATA_DIR/filename
    try:
        with path.open("r",encoding="utf-8") as f:
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
    description="Guía informativa para viajeros a Cuba.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def normalize(value:Optional[str])->str:
    if value is None:
        return ""
    return " ".join(str(value).strip().lower().split())

def search_data(data:Any,request:Any)->Dict[str,Any]:
    if isinstance(data,dict):
        result=dict(data)
    else:
        result={"data":data}

    result["request"]=request.model_dump()
    return result

@app.get("/health")
def health():
    return {
        "status":"ok",
        "app":"CUBA AUTO TRAVEL 2026",
        "version":"1.0.0"
    }

@app.get("/api")
def api_info():
    return {
        "name":"CUBA AUTO TRAVEL 2026",
        "status":"ok",
        "endpoints":[
            "/api/visa",
            "/api/dviajeros",
            "/api/passports",
            "/api/data"
        ]
    }

@app.get("/api/data")
def get_data():
    return {
        "cuba_visa":CUBA_VISA,
        "dviajeros":D_VIAJEROS,
        "passports":PASSPORTS
    }

@app.get("/api/visa")
def get_visa():
    return CUBA_VISA

@app.post("/api/visa/check")
def check_visa(request:VisaRequest):
    return search_data(CUBA_VISA,request)

@app.get("/api/dviajeros")
def get_dviajeros():
    return D_VIAJEROS

@app.post("/api/dviajeros/check")
def check_dviajeros(request:DViajerosRequest):
    return search_data(D_VIAJEROS,request)

@app.get("/api/passports")
def get_passports():
    return PASSPORTS

@app.post("/api/passports/check")
def check_passport(request:PassportRequest):
    return search_data(PASSPORTS,request)

@app.get("/api/reload")
def reload_data():
    global CUBA_VISA,D_VIAJEROS,PASSPORTS
    CUBA_VISA=load_json("cuba_visa.json",{})
    D_VIAJEROS=load_json("dviajeros.json",{})
    PASSPORTS=load_json("passports.json",{})
    return {
        "status":"ok",
        "message":"Datos recargados"
    }

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
    port=int(os.environ.get("PORT","8000"))
    uvicorn.run("main:app",host="0.0.0.0",port=port)

