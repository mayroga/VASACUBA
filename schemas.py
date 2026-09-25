```python
# schemas.py
# CUBA AUTO TRAVEL 2026
# Solo:
#   1. Visa cubana / eVisa
#   2. D'Viajeros
#
# Modelos Pydantic v2.
# No emite documentos oficiales.

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, ConfigDict


# ============================================================
# BASE
# ============================================================

class BaseSchema(BaseModel):
    model_config = ConfigDict(
        extra="ignore",
        str_strip_whitespace=True,
    )


# ============================================================
# VISA CUBANA
# ============================================================

class VisaRequest(BaseSchema):
    nationality: str = ""
    country_of_residence: str = ""
    passport_country: str = ""
    travel_purpose: str = ""

    entry_type: str = ""

    has_passport: bool = False
    passport_valid: bool = False

    email: str = ""

    dual_nationality: bool = False


class VisaCheck(BaseSchema):
    id: str
    status: str
    message: str


class VisaResponse(BaseSchema):
    module: str = "visa"
    status: str

    missing_fields: List[str] = Field(
        default_factory=list
    )

    checks: List[VisaCheck] = Field(
        default_factory=list
    )

    official_portal: str

    official_document_issued: bool = False
    app_issues_visa: bool = False

    source_data_loaded: bool = False


class VisaInformation(BaseSchema):
    module: str = "visa"
    name: str = "Visa cubana / eVisa"
    official_portal: str
    data: Dict[str, Any] = Field(
        default_factory=dict
    )


# ============================================================
# D'VIAJEROS
# ============================================================

class HealthInformation(BaseSchema):
    data: Dict[str, Any] = Field(
        default_factory=dict
    )


class CustomsInformation(BaseSchema):
    data: Dict[str, Any] = Field(
        default_factory=dict
    )


class DViajerosRequest(BaseSchema):
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


class DViajerosModule(BaseSchema):
    id: str
    title: str
    status: str


class DViajerosResponse(BaseSchema):
    module: str = "dviajeros"
    status: str

    missing_fields: List[str] = Field(
        default_factory=list
    )

    modules: List[DViajerosModule] = Field(
        default_factory=list
    )

    submission_status: str

    official_portal: str

    official_qr_generated: bool = False
    official_submission_completed: bool = False

    source_data_loaded: bool = False


class DViajerosInformation(BaseSchema):
    module: str = "dviajeros"
    name: str = "D'Viajeros"
    official_portal: str

    data: Dict[str, Any] = Field(
        default_factory=dict
    )


# ============================================================
# FUENTES
# ============================================================

class OfficialSource(BaseSchema):
    name: str
    url: str


class SourcesResponse(BaseSchema):
    visa: OfficialSource
    dviajeros: OfficialSource


# ============================================================
# INFORMACIÓN GENERAL
# ============================================================

class ModuleStatus(BaseSchema):
    visa: bool = True
    dviajeros: bool = True


class APIInfoResponse(BaseSchema):
    app: str
    version: str

    modules: ModuleStatus

    official_portals: Dict[str, str] = Field(
        default_factory=dict
    )


class HealthResponse(BaseSchema):
    status: str
    app: str
    version: str


class DisclaimerResponse(BaseSchema):
    text: str


# ============================================================
# RESPUESTAS GENERALES
# ============================================================

class MissingFieldsResponse(BaseSchema):
    missing_fields: List[str] = Field(
        default_factory=list
    )


class GenericStatusResponse(BaseSchema):
    status: str
    message: Optional[str] = None


# ============================================================
# EXPORTACIONES
# ============================================================

__all__ = [
    "BaseSchema",

    # Visa
    "VisaRequest",
    "VisaCheck",
    "VisaResponse",
    "VisaInformation",

    # D'Viajeros
    "HealthInformation",
    "CustomsInformation",
    "DViajerosRequest",
    "DViajerosModule",
    "DViajerosResponse",
    "DViajerosInformation",

    # Sources
    "OfficialSource",
    "SourcesResponse",

    # General
    "ModuleStatus",
    "APIInfoResponse",
    "HealthResponse",
    "DisclaimerResponse",
    "MissingFieldsResponse",
    "GenericStatusResponse",
]
```
