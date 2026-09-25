from typing import Optional
from pydantic import BaseModel,Field

class VisaRequest(BaseModel):
    nationality:Optional[str]=Field(default=None)
    residence:Optional[str]=Field(default=None)
    travel_purpose:Optional[str]=Field(default=None)
    visa_type:Optional[str]=Field(default=None)
    airline:Optional[str]=Field(default=None)
    origin:Optional[str]=Field(default=None)
    destination:Optional[str]=Field(default="Cuba")

class DViajerosRequest(BaseModel):
    nationality:Optional[str]=Field(default=None)
    residence:Optional[str]=Field(default=None)
    travel_date:Optional[str]=Field(default=None)
    origin:Optional[str]=Field(default=None)
    destination:Optional[str]=Field(default="Cuba")
    purpose:Optional[str]=Field(default=None)

class PassportRequest(BaseModel):
    nationality:Optional[str]=Field(default=None)
    passport_type:Optional[str]=Field(default=None)
    passport_status:Optional[str]=Field(default=None)
    expiration_date:Optional[str]=Field(default=None)
    destination:Optional[str]=Field(default="Cuba")

