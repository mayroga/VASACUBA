from typing import Optional

from pydantic import BaseModel, Field

class PassportBase(BaseModel):
    passport_country: str = Field(default="")
    passport_number: str = Field(default="")
    first_name: str = Field(default="")
    last_name: str = Field(default="")
    date_of_birth: str = Field(default="")
    passport_expiration: str = Field(default="")

class VisaRequest(PassportBase):
    nationality: str = Field(default="")
    country_of_residence: str = Field(default="")
    travel_purpose: str = Field(default="")
    email: str = Field(default="")
    arrival_date: str = Field(default="")
    dual_nationality: bool = False

class DViajerosRequest(PassportBase):
    nationality: str = Field(default="")
    arrival_date: str = Field(default="")
    flight_number: str = Field(default="")
    airline: str = Field(default="")
    accommodation: str = Field(default="")
    health_information: Optional[str] = ""
    customs_information: Optional[str] = ""
