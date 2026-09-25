# main.py
# CUBA AUTO TRAVEL 2026 - Plataforma de Asesoría Independiente
from __future__ import annotations

import os
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.responses import FileResponse, HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

app = FastAPI(
    title="CUBA AUTO TRAVEL 2026",
    description="Plataforma independiente de preparación y práctica para trámites de viaje a Cuba.",
    version="2026.1"
)

# Configuración de archivos estáticos
STATIC_DIR = Path("static")
STATIC_DIR.mkdir(parents=True, exist_ok=True)

DATA_DIR = Path("data")
DATA_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Modelos Pydantic para validación y estructura de datos
class TravelerData(BaseModel):
    first_name: Optional[str] = Field(default=None, description="Nombre del viajero")
    last_name: Optional[str] = Field(default=None, description="Apellidos del viajero")
    passport_number: Optional[str] = Field(default=None, description="Número de pasaporte")
    nationality: Optional[str] = Field(default=None, description="Nacionalidad")
    flight_number: Optional[str] = Field(default=None, description="Número de vuelo")
    entry_date: Optional[str] = Field(default=None, description="Fecha estimada de entrada")

@app.get("/", response_class=FileResponse)
def read_index() -> FileResponse:
    """Sirve la página principal de la aplicación."""
    index_file = STATIC_DIR / "index.html"
    if not index_file.exists():
        raise HTTPException(status_code=404, detail="Archivo principal no encontrado.")
    return FileResponse(index_file)

@app.get("/api/visa")
def get_visa_module() -> Dict[str, Any]:
    """Módulo de práctica interactiva para la Visa Cubana / eVisa."""
    return {
        "module": "Visa Cubana / eVisa",
        "status": "Activo",
        "purpose": "Preparación independiente para el trámite de visado.",
        "instructions": "Verifique los datos de su pasaporte antes de iniciar la solicitud oficial."
    }

@app.get("/api/dviajeros")
def get_dviajeros_module() -> Dict[str, Any]:
    """Módulo de preparación para el formulario D'Viajeros."""
    return {
        "module": "D'Viajeros",
        "status": "Activo",
        "purpose": "Organización previa de datos para el formulario oficial de entrada a Cuba.",
        "official_portal": "https://dviajeros.mitrans.gob.cu/"
    }

@app.post("/api/validate-data")
def validate_traveler_data(data: TravelerData) -> Dict[str, Any]:
    """Valida de forma preliminar la estructura de los datos ingresados."""
    return {
        "status": "success",
        "message": "Datos revisados preliminarmente con éxito.",
        "received_data": data.dict(exclude_none=True)
    }

@app.get("/health")
def health_check() -> Dict[str, str]:
    """Comprobación de estado del servidor."""
    return {"status": "online", "system": "CUBA AUTO TRAVEL 2026"}
