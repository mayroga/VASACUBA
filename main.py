CUBA AUTO TRAVEL 2026
Plataforma Independiente de Preparación y Práctica

Módulos de Asesoría y Práctica
Selecciona una opción para comenzar a organizar tu información de viaje de forma segura, reduciendo dudas y ganando tranquilidad antes de realizar tus trámites.

📄

Visa Cubana / eVisa
Preparación independiente y práctica guiada para el trámite de visado.
Iniciar Práctica →

✈️

D'Viajeros
Organización previa de datos para el formulario oficial de entrada a Cuba.
Iniciar Práctica →

¿Cómo Funciona?
1
Selecciona
Elige el trámite que deseas ensayar.

2
Practica
Responde de forma guiada y sin presiones.

3
Revisa
Verifica tus datos antes de ir al sitio oficial.

4
Viaja Seguro
Reduce el margen de error y la incertidumbre.

Aviso de Transparencia:

CUBA AUTO TRAVEL 2026 es una herramienta independiente de preparación, simulación y práctica. No emite visas oficiales, no sustituye los portales gubernamentales ni genera documentos o códigos QR oficiales.

© 2026 CUBA AUTO TRAVEL — Plataforma de Asesoría Independiente

"""

@app.get("/", response_class=HTMLResponse)
def read_index() -> HTMLResponse:
"""Sirve la interfaz web directamente con diseño integrado."""
return HTMLResponse(content=HTML_CONTENT)

@app.get("/api/visa")
def get_visa_module() -> Dict[str, Any]:
return {
"module": "Visa Cubana / eVisa",
"status": "Activo",
"purpose": "Preparación independiente para el trámite de visado."
}

@app.get("/api/dviajeros")
def get_dviajeros_module() -> Dict[str, Any]:
return {
"module": "D'Viajeros",
"status": "Activo",
"purpose": "Organización previa de datos para el formulario oficial de entrada a Cuba."
}

@app.get("/health")
def health_check() -> Dict[str, str]:
return {"status": "online", "system": "CUBA AUTO TRAVEL 2026"}
