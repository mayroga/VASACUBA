# rules_engine.py — CUBA AUTO TRAVEL 2026
# Motor central de reglas para pasaporte cubano, visa/eVisa,
# D'Viajeros, menores, documentos, consulado y viaje.
#
# IMPORTANTE:
# Este archivo NO inventa requisitos oficiales.
# Las reglas concretas deben residir en data/*.json y tener
# una fuente oficial, fecha de verificación y estado.
#
# Estados permitidos:
# ACTIVE       = regla vigente y confirmada
# CONDITIONAL  = depende de una condición
# VERIFY       = requiere confirmación oficial
# EXPIRED      = regla histórica/no vigente
# UNKNOWN      = no existe información suficiente
#
# La aplicación es informativa y de preparación.
# No sustituye al MINREX, consulado, Migración, Aduana,
# D'Viajeros ni ninguna otra autoridad competente.

from __future__ import annotations

import json
from dataclasses import dataclass, field
from datetime import date, datetime, timezone
from enum import Enum
from pathlib import Path
from typing import Any, Dict, List, Optional


# ============================================================
# CONFIGURACIÓN
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"


# ============================================================
# ENUMS
# ============================================================

class RuleStatus(str, Enum):
    ACTIVE = "ACTIVE"
    CONDITIONAL = "CONDITIONAL"
    VERIFY = "VERIFY"
    EXPIRED = "EXPIRED"
    UNKNOWN = "UNKNOWN"


class RuleCategory(str, Enum):
    PASSPORT = "PASSPORT"
    VISA = "VISA"
    EVISA = "EVISA"
    MINOR = "MINOR"
    DVIAJEROS = "DVIAJEROS"
    IMMIGRATION = "IMMIGRATION"
    HEALTH = "HEALTH"
    CUSTOMS = "CUSTOMS"
    CONSULAR = "CONSULAR"
    US_CUBA = "US_CUBA"
    TRAVEL = "TRAVEL"
    DOCUMENTS = "DOCUMENTS"
    PAYMENTS = "PAYMENTS"


# ============================================================
# MODELOS
# ============================================================

@dataclass
class RuleSource:
    name: str
    url: Optional[str] = None
    source_type: str = "OFFICIAL"
    verified_date: Optional[str] = None
    effective_date: Optional[str] = None
    expiration_date: Optional[str] = None

    def is_verified(self) -> bool:
        return bool(
            self.name
            and self.source_type.upper() == "OFFICIAL"
            and self.verified_date
        )


@dataclass
class Rule:
    rule_id: str
    category: str
    jurisdiction: str = "CU"
    condition: Dict[str, Any] = field(default_factory=dict)
    result: Dict[str, Any] = field(default_factory=dict)
    documents: List[Dict[str, Any]] = field(default_factory=list)
    status: str = RuleStatus.UNKNOWN.value
    source: Optional[RuleSource] = None
    effective_date: Optional[str] = None
    expiration_date: Optional[str] = None
    verified_date: Optional[str] = None
    notes: Optional[str] = None

    def normalized_status(self) -> RuleStatus:
        try:
            return RuleStatus(str(self.status).upper())
        except ValueError:
            return RuleStatus.UNKNOWN

    def is_expired(self, today: Optional[date] = None) -> bool:
        if not self.expiration_date:
            return False

        today = today or date.today()

        try:
            expiration = date.fromisoformat(
                str(self.expiration_date)
            )
        except (TypeError, ValueError):
            return False

        return expiration < today

    def is_not_yet_effective(
        self,
        today: Optional[date] = None,
    ) -> bool:
        if not self.effective_date:
            return False

        today = today or date.today()

        try:
            effective = date.fromisoformat(
                str(self.effective_date)
            )
        except (TypeError, ValueError):
            return False

        return effective > today


@dataclass
class RuleEvaluation:
    rule_id: str
    category: str
    status: RuleStatus
    result: Dict[str, Any] = field(default_factory=dict)
    documents: List[Dict[str, Any]] = field(default_factory=list)
    source: Optional[Dict[str, Any]] = None
    reason: Optional[str] = None
    notes: Optional[str] = None


@dataclass
class TripProfile:
    nationality: Optional[str] = None
    passport_country: Optional[str] = None
    passport_type: Optional[str] = None
    residence_country: Optional[str] = None
    residence_state: Optional[str] = None

    age: Optional[int] = None
    is_minor: Optional[bool] = None

    purpose: Optional[str] = None
    entry_method: Optional[str] = None
    travel_date: Optional[str] = None

    has_cuban_nationality: Optional[bool] = None
    dual_nationality: Optional[bool] = None

    has_cuban_passport: Optional[bool] = None
    passport_valid: Optional[bool] = None
    passport_lost: Optional[bool] = None
    passport_stolen: Optional[bool] = None
    passport_damaged: Optional[bool] = None

    visa_available: Optional[bool] = None
    visa_type: Optional[str] = None

    traveling_with_minor: Optional[bool] = None
    minor_travel_companion: Optional[str] = None

    dviajeros_completed: Optional[bool] = None

    extra: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        data: Dict[str, Any] = {
            "nationality": self.nationality,
            "passport_country": self.passport_country,
            "passport_type": self.passport_type,
            "residence_country": self.residence_country,
            "residence_state": self.residence_state,
            "age": self.age,
            "is_minor": self.is_minor,
            "purpose": self.purpose,
            "entry_method": self.entry_method,
            "travel_date": self.travel_date,
            "has_cuban_nationality": self.has_cuban_nationality,
            "dual_nationality": self.dual_nationality,
            "has_cuban_passport": self.has_cuban_passport,
            "passport_valid": self.passport_valid,
            "passport_lost": self.passport_lost,
            "passport_stolen": self.passport_stolen,
            "passport_damaged": self.passport_damaged,
            "visa_available": self.visa_available,
            "visa_type": self.visa_type,
            "traveling_with_minor": self.traveling_with_minor,
            "minor_travel_companion": self.minor_travel_companion,
            "dviajeros_completed": self.dviajeros_completed,
        }

        if self.extra:
            data.update(self.extra)

        return {
            key: value
            for key, value in data.items()
            if value is not None
        }


# ============================================================
# UTILIDADES
# ============================================================

def _normalize(value: Any) -> Any:
    if isinstance(value, str):
        return value.strip().upper()

    if isinstance(value, list):
        return [_normalize(item) for item in value]

    if isinstance(value, dict):
        return {
            str(key).upper(): _normalize(val)
            for key, val in value.items()
        }

    return value


def _deep_get(
    data: Dict[str, Any],
    path: str,
) -> Any:
    current: Any = data

    for part in str(path).split("."):
        if not isinstance(current, dict):
            return None

        if part not in current:
            return None

        current = current[part]

    return current


def _parse_date(
    value: Optional[str],
) -> Optional[date]:
    if not value:
        return None

    try:
        return date.fromisoformat(str(value))
    except (TypeError, ValueError):
        return None


def _today() -> date:
    return date.today()


def _profile_to_dict(
    profile: TripProfile | Dict[str, Any],
) -> Dict[str, Any]:
    if isinstance(profile, TripProfile):
        return profile.to_dict()

    if isinstance(profile, dict):
        return {
            key: value
            for key, value in profile.items()
            if value is not None
        }

    if hasattr(profile, "model_dump"):
        try:
            data = profile.model_dump(exclude_none=True)
            if isinstance(data, dict):
                return data
        except Exception:
            pass

    if hasattr(profile, "dict"):
        try:
            data = profile.dict(exclude_none=True)
            if isinstance(data, dict):
                return data
        except Exception:
            pass

    return {}


def _serialize_value(value: Any) -> Any:
    if isinstance(value, Enum):
        return value.value

    if isinstance(value, dict):
        return {
            str(key): _serialize_value(item)
            for key, item in value.items()
        }

    if isinstance(value, list):
        return [
            _serialize_value(item)
            for item in value
        ]

    if hasattr(value, "__dataclass_fields__"):
        return {
            key: _serialize_value(getattr(value, key))
            for key in value.__dataclass_fields__
        }

    return value


# ============================================================
# REPOSITORIO
# ============================================================

class RulesRepository:
    """
    Carga las reglas desde data/*.json.

    Cada archivo puede contener:

    {
        "rules": [
            {
                "rule_id": "...",
                "category": "...",
                "jurisdiction": "CU",
                "condition": {},
                "result": {},
                "documents": [],
                "status": "ACTIVE",
                "source": {
                    "name": "...",
                    "url": "...",
                    "source_type": "OFFICIAL",
                    "verified_date": "YYYY-MM-DD"
                }
            }
        ]
    }
    """

    def __init__(
        self,
        data_dir: Optional[Path] = None,
    ):
        self.data_dir = Path(
            data_dir or DATA_DIR
        )
        self.rules: List[Rule] = []
        self.load()

    def load(self) -> None:
        self.rules = []

        if not self.data_dir.exists():
            return

        for file_path in sorted(
            self.data_dir.glob("*.json")
        ):
            self._load_file(file_path)

    def _load_file(
        self,
        file_path: Path,
    ) -> None:
        try:
            with file_path.open(
                "r",
                encoding="utf-8",
            ) as file:
                payload = json.load(file)

        except (
            OSError,
            json.JSONDecodeError,
        ):
            return

        if isinstance(payload, list):
            raw_rules = payload

        elif isinstance(payload, dict):
            raw_rules = payload.get(
                "rules",
                []
            )

        else:
            return

        if not isinstance(raw_rules, list):
            return

        for raw_rule in raw_rules:

            if not isinstance(
                raw_rule,
                dict,
            ):
                continue

            source_data = raw_rule.get(
                "source"
            )

            source = None

            if isinstance(
                source_data,
                dict,
            ):
                source = RuleSource(
                    name=str(
                        source_data.get(
                            "name",
                            "",
                        )
                    ),
                    url=source_data.get(
                        "url"
                    ),
                    source_type=str(
                        source_data.get(
                            "source_type",
                            "OFFICIAL",
                        )
                    ),
                    verified_date=source_data.get(
                        "verified_date"
                    ),
                    effective_date=source_data.get(
                        "effective_date"
                    ),
                    expiration_date=source_data.get(
                        "expiration_date"
                    ),
                )

            rule = Rule(
                rule_id=str(
                    raw_rule.get(
                        "rule_id",
                        "",
                    )
                ),
                category=str(
                    raw_rule.get(
                        "category",
                        RuleCategory.TRAVEL.value,
                    )
                ).upper(),
                jurisdiction=str(
                    raw_rule.get(
                        "jurisdiction",
                        "CU",
                    )
                ).upper(),
                condition=(
                    raw_rule.get(
                        "condition",
                        {},
                    )
                    or {}
                ),
                result=(
                    raw_rule.get(
                        "result",
                        {},
                    )
                    or {}
                ),
                documents=(
                    raw_rule.get(
                        "documents",
                        [],
                    )
                    or []
                ),
                status=str(
                    raw_rule.get(
                        "status",
                        RuleStatus.UNKNOWN.value,
                    )
                ).upper(),
                source=source,
                effective_date=raw_rule.get(
                    "effective_date"
                ),
                expiration_date=raw_rule.get(
                    "expiration_date"
                ),
                verified_date=raw_rule.get(
                    "verified_date"
                ),
                notes=raw_rule.get(
                    "notes"
                ),
            )

            if rule.rule_id:
                self.rules.append(rule)

    def all(self) -> List[Rule]:
        return list(self.rules)

    def by_category(
        self,
        category: str,
    ) -> List[Rule]:

        category_value = str(
            category
        ).upper()

        return [
            rule
            for rule in self.rules
            if rule.category.upper()
            == category_value
        ]

    def by_id(
        self,
        rule_id: str,
    ) -> Optional[Rule]:

        for rule in self.rules:
            if rule.rule_id == rule_id:
                return rule

        return None

    def categories(self) -> List[str]:
        return sorted(
            {
                rule.category.upper()
                for rule in self.rules
            }
        )

    def count(self) -> int:
        return len(self.rules)


# Compatibility with older code.
RuleRepository = RulesRepository


# ============================================================
# MOTOR DE REGLAS
# ============================================================

class RulesEngine:

    def __init__(
        self,
        repository: Optional[RulesRepository] = None,
    ):
        self.repository = (
            repository
            or RulesRepository()
        )

    # --------------------------------------------------------
    # CONDICIONES
    # --------------------------------------------------------

    def _condition_matches(
        self,
        condition: Dict[str, Any],
        profile: Dict[str, Any],
    ) -> bool:

        if not condition:
            return True

        condition = _normalize(
            condition
        )

        profile = _normalize(
            profile
        )

        if not isinstance(
            condition,
            dict,
        ):
            return False

        for key, expected in condition.items():

            key = str(key).upper()

            if key == "ALL":

                if not isinstance(
                    expected,
                    list,
                ):
                    return False

                if not all(
                    self._condition_matches(
                        item,
                        profile,
                    )
                    for item in expected
                ):
                    return False

            elif key == "ANY":

                if not isinstance(
                    expected,
                    list,
                ):
                    return False

                if not any(
                    self._condition_matches(
                        item,
                        profile,
                    )
                    for item in expected
                ):
                    return False

            elif key == "NOT":

                if self._condition_matches(
                    expected,
                    profile,
                ):
                    return False

            elif key == "IN":

                if not isinstance(
                    expected,
                    dict,
                ):
                    return False

                field_name = expected.get(
                    "FIELD"
                )

                values = expected.get(
                    "VALUES",
                    [],
                )

                if not field_name:
                    return False

                actual = _deep_get(
                    profile,
                    str(field_name),
                )

                if isinstance(
                    actual,
                    list,
                ):
                    if not any(
                        item in values
                        for item in actual
                    ):
                        return False
                elif actual not in values:
                    return False

            elif key == "EQUALS":

                if not isinstance(
                    expected,
                    dict,
                ):
                    return False

                field_name = expected.get(
                    "FIELD"
                )

                value = expected.get(
                    "VALUE"
                )

                actual = _deep_get(
                    profile,
                    str(field_name),
                )

                if actual != value:
                    return False

            elif key == "NOT_EQUALS":

                if not isinstance(
                    expected,
                    dict,
                ):
                    return False

                field_name = expected.get(
                    "FIELD"
                )

                value = expected.get(
                    "VALUE"
                )

                actual = _deep_get(
                    profile,
                    str(field_name),
                )

                if actual == value:
                    return False

            elif key == "FIELD_EXISTS":

                actual = _deep_get(
                    profile,
                    str(expected),
                )

                if actual is None:
                    return False

            elif key == "AGE_GTE":

                age = profile.get(
                    "AGE"
                )

                try:
                    age = int(age)
                except (
                    TypeError,
                    ValueError,
                ):
                    return False

                if age < expected:
                    return False

            elif key == "AGE_LTE":

                age = profile.get(
                    "AGE"
                )

                try:
                    age = int(age)
                except (
                    TypeError,
                    ValueError,
                ):
                    return False

                if age > expected:
                    return False

            else:

                actual = _deep_get(
                    profile,
                    str(key),
                )

                if isinstance(
                    expected,
                    list,
                ):
                    if actual not in expected:
                        return False

                elif actual != expected:
                    return False

        return True

    # --------------------------------------------------------
    # FUENTES
    # --------------------------------------------------------

    @staticmethod
    def _source_payload(
        source: Optional[RuleSource],
    ) -> Optional[Dict[str, Any]]:

        if not source:
            return None

        return {
            "name": source.name,
            "url": source.url,
            "source_type": source.source_type,
            "verified_date": source.verified_date,
            "effective_date": source.effective_date,
            "expiration_date": source.expiration_date,
        }

    # --------------------------------------------------------
    # ESTADO EFECTIVO
    # --------------------------------------------------------

    def _effective_status(
        self,
        rule: Rule,
    ) -> RuleStatus:

        status = rule.normalized_status()

        if rule.is_expired():
            return RuleStatus.EXPIRED

        if rule.is_not_yet_effective():
            return RuleStatus.VERIFY

        if status == RuleStatus.ACTIVE:

            if (
                not rule.source
                or not rule.source.is_verified()
            ):
                return RuleStatus.VERIFY

        return status

    # --------------------------------------------------------
    # EVALUAR REGLA
    # --------------------------------------------------------

    def evaluate_rule(
        self,
        rule: Rule,
        profile: TripProfile | Dict[str, Any],
    ) -> Optional[RuleEvaluation]:

        profile_data = _profile_to_dict(
            profile
        )

        if not self._condition_matches(
            rule.condition,
            profile_data,
        ):
            return None

        status = self._effective_status(
            rule
        )

        reason = None

        if status == RuleStatus.VERIFY:

            reason = (
                "La regla requiere verificación "
                "oficial antes de utilizarse como "
                "decisión definitiva."
            )

        elif status == RuleStatus.UNKNOWN:

            reason = (
                "No existe información suficiente "
                "para emitir una conclusión."
            )

        elif status == RuleStatus.EXPIRED:

            reason = (
                "La regla está fuera de vigencia."
            )

        elif status == RuleStatus.CONDITIONAL:

            reason = (
                "El resultado depende de una "
                "condición adicional."
            )

        return RuleEvaluation(
            rule_id=rule.rule_id,
            category=rule.category,
            status=status,
            result=(
                rule.result
                if isinstance(
                    rule.result,
                    dict,
                )
                else {}
            ),
            documents=(
                rule.documents
                if isinstance(
                    rule.documents,
                    list,
                )
                else []
            ),
            source=self._source_payload(
                rule.source
            ),
            reason=reason,
            notes=rule.notes,
        )

    # --------------------------------------------------------
    # EVALUAR CATEGORÍA
    # --------------------------------------------------------

    def evaluate_category(
        self,
        category: str,
        profile: TripProfile | Dict[str, Any],
    ) -> List[RuleEvaluation]:

        evaluations: List[
            RuleEvaluation
        ] = []

        for rule in self.repository.by_category(
            str(category)
        ):

            evaluation = self.evaluate_rule(
                rule,
                profile,
            )

            if evaluation is not None:
                evaluations.append(
                    evaluation
                )

        return evaluations

    # --------------------------------------------------------
    # EVALUAR TODAS LAS REGLAS
    # --------------------------------------------------------

    def evaluate(
        self,
        profile: TripProfile | Dict[str, Any],
    ) -> Dict[str, Any]:

        profile_data = _profile_to_dict(
            profile
        )

        categories = [
            category.value
            for category in RuleCategory
        ]

        # También incluimos cualquier categoría
        # existente en JSON que no esté en el enum.
        categories.extend(
            self.repository.categories()
        )

        categories = list(
            dict.fromkeys(
                category.upper()
                for category in categories
            )
        )

        results: Dict[
            str,
            List[Dict[str, Any]],
        ] = {}

        for category in categories:

            evaluations = (
                self.evaluate_category(
                    category,
                    profile_data,
                )
            )

            if evaluations:

                results[category] = [
                    self._evaluation_to_dict(
                        evaluation
                    )
                    for evaluation
                    in evaluations
                ]

        trip_status = (
            self._calculate_trip_status(
                results
            )
        )

        return {
            "status": trip_status,
            "profile": profile_data,
            "results": results,
            "generated_at": (
                datetime.now(
                    timezone.utc
                ).isoformat()
            ),
        }

    # --------------------------------------------------------
    # SERIALIZACIÓN
    # --------------------------------------------------------

    @staticmethod
    def _evaluation_to_dict(
        evaluation: RuleEvaluation,
    ) -> Dict[str, Any]:

        return {
            "rule_id": evaluation.rule_id,
            "category": evaluation.category,
            "status": evaluation.status.value,
            "result": _serialize_value(
                evaluation.result
            ),
            "documents": _serialize_value(
                evaluation.documents
            ),
            "source": _serialize_value(
                evaluation.source
            ),
            "reason": evaluation.reason,
            "notes": evaluation.notes,
        }

    # --------------------------------------------------------
    # ESTADO GLOBAL
    # --------------------------------------------------------

    @staticmethod
    def _calculate_trip_status(
        results: Dict[
            str,
            List[Dict[str, Any]],
        ],
    ) -> str:

        statuses: List[
            RuleStatus
        ] = []

        for evaluations in results.values():

            for evaluation in evaluations:

                try:
                    statuses.append(
                        RuleStatus(
                            str(
                                evaluation.get(
                                    "status",
                                    RuleStatus.UNKNOWN.value,
                                )
                            ).upper()
                        )
                    )

                except ValueError:
                    statuses.append(
                        RuleStatus.UNKNOWN
                    )

        if not statuses:
            return RuleStatus.UNKNOWN.value

        if RuleStatus.UNKNOWN in statuses:
            return RuleStatus.UNKNOWN.value

        if RuleStatus.VERIFY in statuses:
            return RuleStatus.VERIFY.value

        if RuleStatus.EXPIRED in statuses:
            return RuleStatus.VERIFY.value

        if RuleStatus.CONDITIONAL in statuses:
            return RuleStatus.CONDITIONAL.value

        if all(
            status == RuleStatus.ACTIVE
            for status in statuses
        ):
            return RuleStatus.ACTIVE.value

        return RuleStatus.VERIFY.value


# ============================================================
# MOTOR GLOBAL
# ============================================================

_default_engine: Optional[
    RulesEngine
] = None


def get_rules_engine() -> RulesEngine:
    global _default_engine

    if _default_engine is None:
        _default_engine = RulesEngine()

    return _default_engine


def reload_rules() -> RulesEngine:
    global _default_engine

    _default_engine = RulesEngine(
        repository=RulesRepository()
    )

    return _default_engine


# ============================================================
# API PÚBLICA DE EVALUACIÓN
# ============================================================

def evaluate_rule(
    rule: Rule,
    profile: TripProfile | Dict[str, Any],
) -> Optional[RuleEvaluation]:

    return get_rules_engine().evaluate_rule(
        rule,
        profile,
    )


def evaluate_category(
    category: str | RuleCategory,
    profile: TripProfile | Dict[str, Any],
) -> List[RuleEvaluation]:

    """
    Función pública compatible con main.py y los servicios.

    IMPORTANTE:
    La firma principal es:

        evaluate_category(category, profile)

    También se acepta accidentalmente el orden:

        evaluate_category(profile, category)

    para evitar incompatibilidades entre versiones anteriores
    del proyecto.
    """

    # Compatibilidad con llamadas antiguas donde
    # el primer argumento era el perfil.
    if isinstance(
        category,
        (
            TripProfile,
            dict,
        ),
    ) and not isinstance(
        profile,
        (
            TripProfile,
            dict,
        ),
    ):
        category, profile = profile, category

    if isinstance(
        category,
        RuleCategory,
    ):
        category = category.value

    return get_rules_engine().evaluate_category(
        str(category),
        profile,
    )


def evaluate_trip(
    profile: TripProfile | Dict[str, Any],
) -> Dict[str, Any]:

    return get_rules_engine().evaluate(
        profile
    )


# ============================================================
# DETERMINACIÓN DE FLUJOS
# ============================================================

def determine_travel_flow(
    profile: TripProfile | Dict[str, Any],
) -> List[str]:

    data = _profile_to_dict(
        profile
    )

    flows: List[str] = []

    nationality = str(
        data.get(
            "nationality",
            "",
        )
    ).upper()

    has_cuban_nationality = data.get(
        "has_cuban_nationality"
    )

    if (
        has_cuban_nationality is True
        or nationality in {
            "CU",
            "CUBA",
            "CUBAN",
            "CUBANA",
            "CUBANO",
        }
    ):
        flows.append(
            "CUBAN_FLOW"
        )
    else:
        flows.append(
            "FOREIGNER_FLOW"
        )

    if data.get(
        "dual_nationality"
    ) is True:
        flows.append(
            "DUAL_NATIONALITY_FLOW"
        )

    age = data.get(
        "age"
    )

    try:
        normalized_age = (
            int(age)
            if age is not None
            else None
        )
    except (
        TypeError,
        ValueError,
    ):
        normalized_age = None

    if (
        data.get("is_minor") is True
        or (
            normalized_age is not None
            and normalized_age < 18
        )
    ):
        flows.append(
            "MINOR_FLOW"
        )

    if (
        data.get(
            "has_cuban_nationality"
        ) is True
        or data.get(
            "has_cuban_passport"
        ) is True
    ):
        flows.append(
            "PASSPORT_FLOW"
        )
    else:
        flows.append(
            "VISA_FLOW"
        )

    entry_method = str(
        data.get(
            "entry_method",
            "",
        )
    ).upper()

    air_methods = {
        "AIR",
        "AIRPORT",
        "PLANE",
        "FLIGHT",
        "AIRLINE",
    }

    maritime_methods = {
        "MARITIME",
        "SEA",
        "SHIP",
        "BOAT",
        "CRUISE",
    }

    if (
        entry_method in air_methods
        or entry_method in maritime_methods
    ):
        flows.append(
            "DVIAJEROS_FLOW"
        )

    if entry_method in maritime_methods:
        flows.append(
            "MARITIME_CONSULAR_VERIFICATION"
        )

    return list(
        dict.fromkeys(
            flows
        )
    )


# ============================================================
# CHECKLIST
# ============================================================

def _documents_from_evaluation(
    evaluation: Dict[str, Any],
) -> Dict[str, List[Dict[str, Any]]]:

    required: List[
        Dict[str, Any]
    ] = []

    conditional: List[
        Dict[str, Any]
    ] = []

    verification: List[
        Dict[str, Any]
    ] = []

    results = evaluation.get(
        "results",
        {},
    )

    if not isinstance(
        results,
        dict,
    ):
        return {
            "required": [],
            "conditional": [],
            "verification_required": [],
        }

    for category_items in results.values():

        if not isinstance(
            category_items,
            list,
        ):
            continue

        for item in category_items:

            if not isinstance(
                item,
                dict,
            ):
                continue

            status = str(
                item.get(
                    "status",
                    RuleStatus.UNKNOWN.value,
                )
            ).upper()

            documents = item.get(
                "documents",
                [],
            )

            if not isinstance(
                documents,
                list,
            ):
                continue

            if (
                status
                == RuleStatus.ACTIVE.value
            ):
                required.extend(
                    documents
                )

            elif (
                status
                == RuleStatus.CONDITIONAL.value
            ):
                conditional.extend(
                    documents
                )

            elif status in {
                RuleStatus.VERIFY.value,
                RuleStatus.UNKNOWN.value,
                RuleStatus.EXPIRED.value,
            }:
                verification.extend(
                    documents
                )

    return {
        "required": required,
        "conditional": conditional,
        "verification_required": verification,
    }


def build_checklist(
    evaluation_or_profile: Dict[str, Any]
    | TripProfile,
    category: Optional[
        str | RuleCategory
    ] = None,
) -> Dict[str, Any]:

    """
    Construye checklist de forma compatible con:

    build_checklist(evaluation)

    y también:

    build_checklist(profile, category)

    Esto permite que main.py, travel_engine.py y
    checklist_service.py utilicen el mismo motor.
    """

    # --------------------------------------------------------
    # Caso 1: se recibió una evaluación ya construida
    # --------------------------------------------------------

    if (
        isinstance(
            evaluation_or_profile,
            dict,
        )
        and "results"
        in evaluation_or_profile
    ):

        return _documents_from_evaluation(
            evaluation_or_profile
        )

    # --------------------------------------------------------
    # Caso 2: se recibió perfil + categoría
    # --------------------------------------------------------

    profile = evaluation_or_profile

    if category is not None:

        if isinstance(
            category,
            RuleCategory,
        ):
            category_value = category.value
        else:
            category_value = str(
                category
            ).upper()

        evaluations = evaluate_category(
            category_value,
            profile,
        )

        results = {
            category_value: [
                get_rules_engine()
                ._evaluation_to_dict(
                    evaluation
                )
                for evaluation
                in evaluations
            ]
        }

        return _documents_from_evaluation(
            {
                "results": results
            }
        )

    # --------------------------------------------------------
    # Caso 3: perfil sin categoría
    # --------------------------------------------------------

    evaluation = evaluate_trip(
        profile
    )

    return _documents_from_evaluation(
        evaluation
    )


# ============================================================
# VALIDACIÓN DEL PERFIL
# ============================================================

def validate_profile(
    profile: TripProfile | Dict[str, Any],
) -> List[str]:

    data = _profile_to_dict(
        profile
    )

    errors: List[str] = []

    nationality = data.get(
        "nationality"
    )

    if not nationality:
        errors.append(
            "Falta la nacionalidad."
        )

    if data.get(
        "dual_nationality"
    ) is True:

        if not data.get(
            "passport_country"
        ):
            errors.append(
                "Debe indicarse el pasaporte "
                "que utilizará para el viaje."
            )

    age = data.get(
        "age"
    )

    if age is not None:

        try:
            normalized_age = int(age)

            if (
                normalized_age < 0
                or normalized_age > 120
            ):
                errors.append(
                    "La edad no es válida."
                )

        except (
            TypeError,
            ValueError,
        ):
            errors.append(
                "La edad no es válida."
            )

    travel_date = data.get(
        "travel_date"
    )

    if travel_date:

        if _parse_date(
            travel_date
        ) is None:
            errors.append(
                "La fecha de viaje no es válida."
            )

    return errors


# ============================================================
# RESULTADO SEGURO
# ============================================================

def safe_user_result(
    profile: TripProfile | Dict[str, Any],
) -> Dict[str, Any]:

    validation_errors = (
        validate_profile(
            profile
        )
    )

    if validation_errors:

        return {
            "status": "INCOMPLETE",
            "errors": validation_errors,
            "message": (
                "Falta información para "
                "determinar el trámite."
            ),
        }

    evaluation = evaluate_trip(
        profile
    )

    flows = determine_travel_flow(
        profile
    )

    checklist = build_checklist(
        evaluation
    )

    return {
        "status": evaluation.get(
            "status",
            RuleStatus.UNKNOWN.value,
        ),
        "flows": flows,
        "checklist": checklist,
        "rules": evaluation.get(
            "results",
            {},
        ),
        "message": _status_message(
            evaluation.get(
                "status",
                RuleStatus.UNKNOWN.value,
            )
        ),
    }


def _status_message(
    status: str,
) -> str:

    normalized = str(
        status
    ).upper()

    messages = {
        RuleStatus.ACTIVE.value: (
            "La información disponible coincide "
            "con reglas vigentes verificadas."
        ),
        RuleStatus.CONDITIONAL.value: (
            "El resultado depende de una "
            "condición adicional."
        ),
        RuleStatus.VERIFY.value: (
            "Debe verificarse esta situación "
            "con la autoridad oficial correspondiente "
            "antes de continuar."
        ),
        RuleStatus.UNKNOWN.value: (
            "No existe información suficiente "
            "para emitir una conclusión segura."
        ),
        "INCOMPLETE": (
            "Falta información para determinar "
            "el trámite."
        ),
    }

    return messages.get(
        normalized,
        messages[
            RuleStatus.UNKNOWN.value
        ],
    )


# ============================================================
# INFORMACIÓN DEL MOTOR
# ============================================================

def engine_info() -> Dict[str, Any]:

    engine = get_rules_engine()

    return {
        "name": "CUBA AUTO TRAVEL",
        "version": "2026.1",
        "engine": "rules_engine",
        "data_directory": str(
            DATA_DIR
        ),
        "rules_loaded": (
            engine.repository.count()
        ),
        "categories": [
            category.value
            for category
            in RuleCategory
        ],
        "loaded_json_categories": (
            engine.repository.categories()
        ),
        "statuses": [
            status.value
            for status
            in RuleStatus
        ],
        "official_sources_only": True,
        "authority_replacement": False,
    }


# ============================================================
# ALIASES DE COMPATIBILIDAD
# ============================================================

def evaluate_profile(
    profile: TripProfile | Dict[str, Any],
) -> Dict[str, Any]:
    return evaluate_trip(profile)


def evaluate_category_rules(
    category: str | RuleCategory,
    profile: TripProfile | Dict[str, Any],
) -> List[RuleEvaluation]:
    return evaluate_category(
        category,
        profile,
    )


def get_category_rules(
    category: str | RuleCategory,
) -> List[Rule]:
    if isinstance(
        category,
        RuleCategory,
    ):
        category = category.value

    return get_rules_engine().repository.by_category(
        str(category)
    )


# ============================================================
# EXPORTS
# ============================================================

__all__ = [
    "RuleStatus",
    "RuleCategory",
    "RuleSource",
    "Rule",
    "RuleEvaluation",
    "TripProfile",
    "RulesRepository",
    "RuleRepository",
    "RulesEngine",
    "get_rules_engine",
    "reload_rules",
    "evaluate_rule",
    "evaluate_category",
    "evaluate_category_rules",
    "evaluate_trip",
    "evaluate_profile",
    "determine_travel_flow",
    "build_checklist",
    "validate_profile",
    "safe_user_result",
    "engine_info",
    "get_category_rules",
]
