from **future** import annotations
from typing import Any,Dict,List,Optional
from pydantic import BaseModel,ConfigDict,Field

class BaseSchema(BaseModel):
model_config=ConfigDict(extra="ignore",str_strip_whitespace=True)

class VisaRequest(BaseSchema):
nationality:str=""
country_of_residence:str=""
passport_country:str=""
passport_number:str=""
first_name:str=""
last_name:str=""
date_of_birth:str=""
passport_expiration:str=""
travel_purpose:str=""
email:str=""
arrival_date:str=""
has_passport:bool=False
passport_valid:bool=False
dual_nationality:bool=False

class VisaCheck(BaseSchema):
id:str
status:str
message:str

class VisaResponse(BaseSchema):
module:str="visa"
status:str
missing_fields:List=Field(default_factory=list)
checks:List=Field(default_factory=list)
official_portal:str
official_document_issued:bool=False
app_issues_visa:bool=False

class DViajerosRequest(BaseSchema):
first_name:str=""
last_name:str=""
nationality:str=""
date_of_birth:str=""
passport_number:str=""
passport_country:str=""
passport_expiration:str=""
arrival_date:str=""
flight_number:str=""
airline:str=""
accommodation:str=""
address_in_cuba:str=""
purpose_of_trip:str=""
health_information:Dict=Field(default_factory=dict)
customs_information:Dict=Field(default_factory=dict)

class DViajerosModule(BaseSchema):
id:str
title:str
status:str

class DViajerosResponse(BaseSchema):
module:str="dviajeros"
status:str
missing_fields:List=Field(default_factory=list)
modules:List=Field(default_factory=list)
submission_status:str
official_portal:str
official_qr_generated:bool=False
official_submission_completed:bool=False

class OfficialSource(BaseSchema):
name:str
url:str

class SourcesResponse(BaseSchema):
visa:OfficialSource
dviajeros:OfficialSource

class ModuleStatus(BaseModel):
visa:bool=True
dviajeros:bool=True
passport_check:bool=True

class APIInfoResponse(BaseModel):
app:str
version:str
modules:ModuleStatus
official_portals:Dict=Field(default_factory=dict)

class HealthResponse(BaseModel):
status:str
app:str
version:str

class DisclaimerResponse(BaseModel):
text:str

class GenericStatusResponse(BaseModel):
status:str
message:Optional=None

**all**=[
"BaseSchema","VisaRequest","VisaCheck","VisaResponse",
"DViajerosRequest","DViajerosModule","DViajerosResponse",
"OfficialSource","SourcesResponse","ModuleStatus",
"APIInfoResponse","HealthResponse","DisclaimerResponse",
"GenericStatusResponse"
]
