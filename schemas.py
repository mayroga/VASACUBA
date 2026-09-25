from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field

class BaseSchema(BaseModel):
    model_config = ConfigDict(extra="ignore", str_strip_whitespace=True)

class PracticeField(BaseSchema):
    name: str
    label: str
    status: str = "VERIFY"
    required: bool = False
    example: Optional[Any] = None
    help: Optional[str] = None
    type: Optional[str] = None
    input_type: Optional[str] = None
    placeholder: Optional[str] = None
    multiline: bool = False
    options: List = Field(default_factory=list)
    choices: List = Field(default_factory=list)
    values: List = Field(default_factory=list)

class PracticeScreen(BaseSchema):
    id: str
    order: int = 0
    title: str
    status: str = "VERIFY"
    explanation: Optional[str] = None
    question: Optional[str] = None
    badge: Optional[str] = None
    image: Optional[str] = None
    image_url: Optional[str] = None
    image_alt: Optional[str] = None
    illustration: Optional[str] = None
    screenshot: Optional[str] = None
    images: List = Field(default_factory=list)
    fields: List = Field(default_factory=list)
    prepare: List = Field(default_factory=list)
    review: Optional[str] = None
    warning: Optional[str] = None
    important: Optional[str] = None
    portal_note: Optional[str] = None

class PracticeAnswer(BaseSchema):
    screen_id: str
    answers: Dict = Field(default_factory=dict)

class PracticeSession(BaseSchema):
    module: str
    current_screen: int = 1
    answers: Dict = Field(default_factory=dict)
    completed: bool = False

class VisaRequest(BaseSchema):
    nationality: str = ""
    country_of_residence: str = ""
    passport_country: str = ""
    passport_number: str = ""
    first_name: str = ""
    second_name: str = ""
    first_surname: str = ""
    second_surname: str = ""
    date_of_birth: str = ""
    gender: str = ""
    phone: str = ""
    travel_purpose: str = ""
    entry_type: str = ""
    has_passport: bool = False
    passport_valid: bool = False
    email: str = ""
    dual_nationality: bool = False
    extra_details: Dict = Field(default_factory=dict)

class VisaPracticeRequest(BaseSchema):
    session: PracticeSession
    screen_id: str = ""
    answers: Dict = Field(default_factory=dict)

class VisaCheck(BaseSchema):
    id: str
    status: str
    message: str

class VisaResponse(BaseSchema):
    module: str
    status: str
    missing_fields: List = Field(default_factory=list)
    checks: List = Field(default_factory=list)
    official_portal: str
    official_document_issued: bool = False
    app_issues_visa: bool = False
    source_data_loaded: bool = False
    practice_completed: bool = False

class VisaInformation(BaseSchema):
    module: str
    name: str
    official_portal: str
    data: Dict = Field(default_factory=dict)

class HealthInformation(BaseSchema):
    information: Dict = Field(default_factory=dict)

class CustomsInformation(BaseSchema):
    information: Dict = Field(default_factory=dict)

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
    health_information: Dict = Field(default_factory=dict)
    customs_information: Dict = Field(default_factory=dict)

class DViajerosPracticeRequest(BaseSchema):
    session: PracticeSession
    screen_id: str = ""
    answers: Dict = Field(default_factory=dict)

class DViajerosModule(BaseSchema):
    id: str
    title: str
    status: str

class DViajerosResponse(BaseSchema):
    module: str
    status: str
    missing_fields: List = Field(default_factory=list)
    modules: List = Field(default_factory=list)
    submission_status: str
    official_portal: str
    official_qr_generated: bool = False
    official_submission_completed: bool = False
    source_data_loaded: bool = False
    practice_completed: bool = False

class DViajerosInformation(BaseSchema):
    module: str
    name: str
    official_portal: str
    data: Dict = Field(default_factory=dict)

class PassportRequest(BaseSchema):
    first_name: str = ""
    second_name: str = ""
    first_surname: str = ""
    second_surname: str = ""
    date_of_birth: str = ""
    passport_number: str = ""
    passport_country: str = ""
    expiration_date: str = ""
    travel_date: str = ""

class PassportCheck(BaseSchema):
    id: str
    status: str
    message: str

class PassportResponse(BaseSchema):
    module: str
    status: str
    missing_fields: List = Field(default_factory=list)
    checks: List = Field(default_factory=list)
    source_data_loaded: bool = False

class OfficialSource(BaseSchema):
    name: str
    url: str

class SourcesResponse(BaseSchema):
    visa: OfficialSource
    dviajeros: OfficialSource

class ModuleStatus(BaseSchema):
    module: str
    status: str

class APIInfoResponse(BaseSchema):
    app: str
    version: str
    modules: Dict
    official_portals: Dict

class HealthResponse(BaseSchema):
    status: str
    app: str
    version: str

class DisclaimerResponse(BaseSchema):
    text: str

class MissingFieldsResponse(BaseSchema):
    missing_fields: List = Field(default_factory=list)

class GenericStatusResponse(BaseSchema):
    status: str
    message: Optional[str] = None
