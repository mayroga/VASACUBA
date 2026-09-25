from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field, ConfigDict

# ============================================================

# ENUM-LIKE TYPES

# ============================================================

RuleStatusType = Literal[
"ACTIVE",
"CONDITIONAL",
"VERIFY",
"EXPIRED",
"UNKNOWN",
"INCOMPLETE"
]

TravelFlowType = Literal[
"CUBAN_FLOW",
"FOREIGNER_FLOW",
"DUAL_NATIONALITY_FLOW",
"MINOR_FLOW",
"PASSPORT_FLOW",
"VISA_FLOW",
"DVIAJEROS_FLOW",
"MARITIME_CONSULAR_VERIFICATION",
"US_CUBA_FLOW",
"UNKNOWN_FLOW"
]

NationalityType = Literal[
"CUBAN",
"FOREIGN",
"DUAL",
"UNKNOWN"
]

EntryMethodType = Literal[
"AIR",
"MARITIME",
"LAND",
"UNKNOWN"
]

AccompanimentType = Literal[
"BOTH_PARENTS",
"MOTHER",
"FATHER",
"PARENT",
"RELATIVE",
"LEGAL_GUARDIAN",
"OTHER_ADULT",
"AUTHORIZED_PERSON",
"UNACCOMPANIED",
"UNKNOWN"
]

# ============================================================

# GENERIC API RESPONSE

# ============================================================

class APIMessage(BaseModel):
model_config = ConfigDict(extra="ignore")

```
status: str = "ok"
message: str
```

class ErrorResponse(BaseModel):
model_config = ConfigDict(extra="ignore")

```
status: str = "error"
message: str
code: Optional[str] = None
details: Optional[Dict[str, Any]] = None
```

# ============================================================

# TRAVELER / PASSPORT

# ============================================================

class PassportInfo(BaseModel):
model_config = ConfigDict(extra="ignore")

```
number: Optional[str] = None
country: Optional[str] = None
nationality: Optional[str] = None
issue_date: Optional[str] = None
expiration_date: Optional[str] = None
valid: Optional[bool] = None
```

class ParentGuardian(BaseModel):
model_config = ConfigDict(extra="ignore")

```
name: Optional[str] = None
relationship: Optional[str] = None
nationality: Optional[str] = None
present_for_travel: Optional[bool] = None
legal_guardian: Optional[bool] = None
```

class MinorInfo(BaseModel):
model_config = ConfigDict(extra="ignore")

```
is_minor: bool = False
age: Optional[int] = Field(default=None, ge=0, le=120)
accompaniment_type: AccompanimentType = "UNKNOWN"
parent_not_traveling: Optional[bool] = None
has_legal_guardian: Optional[bool] = None
parents: List[ParentGuardian] = Field(default_factory=list)
```

class TravelerProfile(BaseModel):
model_config = ConfigDict(extra="ignore")

```
first_name: Optional[str] = None
last_name: Optional[str] = None

nationality: Optional[str] = None
nationality_type: NationalityType = "UNKNOWN"

citizenship_country: Optional[str] = None
residence_country: Optional[str] = None
residence_region: Optional[str] = None
residence_state: Optional[str] = None
residence_city: Optional[str] = None

departure_country: Optional[str] = None
departure_city: Optional[str] = None

destination_country: str = "CUBA"

age: Optional[int] = Field(default=None, ge=0, le=120)

passport: Optional[PassportInfo] = None

dual_nationality: bool = False
selected_passport_country: Optional[str] = None

is_minor: bool = False
minor: Optional[MinorInfo] = None

us_jurisdiction: bool = False

email: Optional[str] = None

travel_purpose: Optional[str] = None
travel_category_known: Optional[bool] = None

entry_method: EntryMethodType = "UNKNOWN"
travel_date: Optional[str] = None

travel_to_cuba: bool = True

dviajeros_completed: Optional[bool] = None
dviajeros_confirmation: Optional[str] = None

evisa_required: Optional[bool] = None
evisa_completed: Optional[bool] = None

consular_office_id: Optional[str] = None
```

# ============================================================

# RULE SOURCE

# ============================================================

class RuleSource(BaseModel):
model_config = ConfigDict(extra="ignore")

```
id: str
name: str
type: Optional[str] = None
url: Optional[str] = None
official: bool = False
verified: bool = False
verified_date: Optional[str] = None
effective_date: Optional[str] = None
```

# ============================================================

# RULE CONDITION

# ============================================================

class RuleCondition(BaseModel):
model_config = ConfigDict(extra="allow")

```
ALL: Optional[List[Dict[str, Any]]] = None
ANY: Optional[List[Dict[str, Any]]] = None
NOT: Optional[Dict[str, Any]] = None
IN: Optional[Dict[str, Any]] = None
EQUALS: Optional[Dict[str, Any]] = None
NOT_EQUALS: Optional[Dict[str, Any]] = None
FIELD_EXISTS: Optional[str] = None
AGE_GTE: Optional[int] = None
AGE_LTE: Optional[int] = None
```

# ============================================================

# RULE RESULT

# ============================================================

class RuleResult(BaseModel):
model_config = ConfigDict(extra="ignore")

```
status: RuleStatusType = "VERIFY"
action: Optional[str] = None
message: str
data: Optional[Dict[str, Any]] = None
```

# ============================================================

# RULE

# ============================================================

class Rule(BaseModel):
model_config = ConfigDict(extra="ignore")

```
id: str
category: str
name: str
description: Optional[str] = None

condition: Dict[str, Any] = Field(default_factory=dict)

result: RuleResult

source_ids: List[str] = Field(default_factory=list)

priority: Optional[int] = None
effective_date: Optional[str] = None
expiration_date: Optional[str] = None

enabled: bool = True
```

# ============================================================

# RULE EVALUATION

# ============================================================

class RuleEvaluation(BaseModel):
model_config = ConfigDict(extra="ignore")

```
rule_id: str
category: str
name: str

matched: bool = False

status: RuleStatusType = "UNKNOWN"

action: Optional[str] = None
message: Optional[str] = None

source_ids: List[str] = Field(default_factory=list)

sources: List[RuleSource] = Field(default_factory=list)

data: Dict[str, Any] = Field(default_factory=dict)
```

# ============================================================

# CHECKLIST ITEM

# ============================================================

class ChecklistItem(BaseModel):
model_config = ConfigDict(extra="ignore")

```
id: str
title: str
description: Optional[str] = None

status: RuleStatusType = "VERIFY"

required: bool = True
completed: bool = False

action: Optional[str] = None

source_ids: List[str] = Field(default_factory=list)
```

# ============================================================

# CHECKLIST

# ============================================================

class Checklist(BaseModel):
model_config = ConfigDict(extra="ignore")

```
status: Literal[
    "READY",
    "INCOMPLETE",
    "VERIFY",
    "UNKNOWN"
] = "UNKNOWN"

items: List[ChecklistItem] = Field(default_factory=list)

completed_count: int = 0
total_count: int = 0

message: Optional[str] = None
```

# ============================================================

# TRAVEL FLOW

# ============================================================

class TravelFlow(BaseModel):
model_config = ConfigDict(extra="ignore")

```
flow: TravelFlowType = "UNKNOWN_FLOW"

title: str

description: Optional[str] = None

steps: List[str] = Field(default_factory=list)

status: RuleStatusType = "VERIFY"

message: Optional[str] = None
```

# ============================================================

# RULE EVALUATION REQUEST

# ============================================================

class RuleEvaluationRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
profile: TravelerProfile

category: Optional[str] = None

include_sources: bool = True

include_inactive: bool = False
```

# ============================================================

# TRAVEL PROFILE REQUEST

# ============================================================

class TravelProfileRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
profile: TravelerProfile
```

# ============================================================

# TRAVEL RESULT

# ============================================================

class TravelResult(BaseModel):
model_config = ConfigDict(extra="ignore")

```
status: RuleStatusType = "VERIFY"

flow: TravelFlowType = "UNKNOWN_FLOW"

title: str

message: str

profile: Optional[TravelerProfile] = None

evaluations: List[RuleEvaluation] = Field(default_factory=list)

checklist: Optional[Checklist] = None

sources: List[RuleSource] = Field(default_factory=list)

official_links: List[str] = Field(default_factory=list)
```

# ============================================================

# PASSPORT REQUEST

# ============================================================

class PassportRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
nationality: Optional[str] = None

nationality_type: NationalityType = "UNKNOWN"

age: Optional[int] = Field(default=None, ge=0, le=120)

passport: Optional[PassportInfo] = None

is_minor: bool = False

residence_country: Optional[str] = None

purpose: Optional[str] = None
```

# ============================================================

# VISA REQUEST

# ============================================================

class VisaRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
nationality: Optional[str] = None

nationality_type: NationalityType = "UNKNOWN"

residence_country: Optional[str] = None

passport: Optional[PassportInfo] = None

travel_purpose: Optional[str] = None

entry_method: EntryMethodType = "UNKNOWN"

travel_date: Optional[str] = None

is_minor: bool = False

dual_nationality: bool = False
```

# ============================================================

# D'VIAJEROS REQUEST

# ============================================================

class DViajerosRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
nationality: Optional[str] = None

passport_number: Optional[str] = None

travel_date: Optional[str] = None

entry_method: EntryMethodType = "UNKNOWN"

email: Optional[str] = None

is_minor: bool = False

dual_nationality: bool = False

completed: bool = False

confirmation: Optional[str] = None
```

# ============================================================

# MINOR REQUEST

# ============================================================

class MinorRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
age: int = Field(ge=0, le=17)

nationality: Optional[str] = None

nationality_type: NationalityType = "UNKNOWN"

residence_country: Optional[str] = None

departure_country: Optional[str] = None

passport: Optional[PassportInfo] = None

accompaniment_type: AccompanimentType = "UNKNOWN"

parent_not_traveling: Optional[bool] = None

has_legal_guardian: Optional[bool] = None

travel_date: Optional[str] = None

travel_to_cuba: bool = True
```

# ============================================================

# CONSULAR REQUEST

# ============================================================

class ConsularRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
residence_country: Optional[str] = None

residence_region: Optional[str] = None

residence_state: Optional[str] = None

residence_city: Optional[str] = None

service: Optional[str] = None

service_type: Optional[str] = None

is_minor: bool = False

consular_office_id: Optional[str] = None
```

# ============================================================

# US / CUBA REQUEST

# ============================================================

class USCubaRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
us_jurisdiction: bool = False

citizenship_country: Optional[str] = None

residence_country: Optional[str] = None

departure_country: Optional[str] = None

nationality: Optional[str] = None

nationality_type: NationalityType = "UNKNOWN"

travel_purpose: Optional[str] = None

travel_to_cuba: bool = True

dual_nationality: bool = False

is_minor: bool = False

entry_method: EntryMethodType = "UNKNOWN"

travel_date: Optional[str] = None
```

# ============================================================

# HEALTH / CUSTOMS / GENERAL TRAVEL

# ============================================================

class TravelRequest(BaseModel):
model_config = ConfigDict(extra="ignore")

```
traveler: TravelerProfile

include_passport: bool = True
include_visa: bool = True
include_dviajeros: bool = True
include_minor: bool = True
include_consular: bool = True
include_us_cuba: bool = True
```

# ============================================================

# HEALTH-CHECK RESPONSE

# ============================================================

class HealthResponse(BaseModel):
model_config = ConfigDict(extra="ignore")

```
status: Literal["ok", "degraded"] = "ok"

service: str

version: str

rules_loaded: Optional[int] = None

timestamp: Optional[str] = None
```

# ============================================================

# ENGINE INFORMATION

# ============================================================

class EngineInfo(BaseModel):
model_config = ConfigDict(extra="ignore")

```
name: str

version: str

country: str

environment: Optional[str] = None

rules_loaded: int = 0

categories: List[str] = Field(default_factory=list)

source_policy: str = "official_first"
```

# ============================================================

# SAFE USER RESULT

# ============================================================

class SafeUserResult(BaseModel):
model_config = ConfigDict(extra="ignore")

```
status: RuleStatusType

title: str

message: str

action: Optional[str] = None

checklist: List[ChecklistItem] = Field(default_factory=list)

warnings: List[str] = Field(default_factory=list)

official_links: List[str] = Field(default_factory=list)
```

# ============================================================

# VALIDATION RESULT

# ============================================================

class ValidationResult(BaseModel):
model_config = ConfigDict(extra="ignore")

```
valid: bool

missing_fields: List[str] = Field(default_factory=list)

invalid_fields: List[str] = Field(default_factory=list)

warnings: List[str] = Field(default_factory=list)

message: Optional[str] = None
```

# ============================================================

# GENERIC PAGINATION

# ============================================================

class Pagination(BaseModel):
model_config = ConfigDict(extra="ignore")

```
page: int = Field(default=1, ge=1)

page_size: int = Field(default=25, ge=1, le=100)

total: int = Field(default=0, ge=0)
```

# ============================================================

# SOURCE RESPONSE

# ============================================================

class SourceResponse(BaseModel):
model_config = ConfigDict(extra="ignore")

```
sources: List[RuleSource] = Field(default_factory=list)

total: int = 0
```

# ============================================================

# CHECKLIST UPDATE

# ============================================================

class ChecklistUpdate(BaseModel):
model_config = ConfigDict(extra="ignore")

```
item_id: str

completed: bool = True
```

# ============================================================

# APPLICATION SESSION

# ============================================================

class TravelSession(BaseModel):
model_config = ConfigDict(extra="ignore")

```
session_id: str

created_at: Optional[str] = None

updated_at: Optional[str] = None

profile: TravelerProfile = Field(default_factory=TravelerProfile)

flow: TravelFlowType = "UNKNOWN_FLOW"

status: RuleStatusType = "UNKNOWN"

checklist: Optional[Checklist] = None
```

# ============================================================

# FINAL APPLICATION RESULT

# ============================================================

class ApplicationResult(BaseModel):
model_config = ConfigDict(extra="ignore")

```
success: bool = True

status: RuleStatusType = "VERIFY"

message: str

flow: TravelFlowType = "UNKNOWN_FLOW"

checklist: Optional[Checklist] = None

evaluations: List[RuleEvaluation] = Field(default_factory=list)

sources: List[RuleSource] = Field(default_factory=list)

official_links: List[str] = Field(default_factory=list)

warnings: List[str] = Field(default_factory=list)
```
