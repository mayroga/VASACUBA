document.addEventListener("DOMContentLoaded", function () {
"use strict";

var STORAGE_VISA = "cuba_auto_travel_visa_2026";
var STORAGE_DV = "cuba_auto_travel_dviajeros_2026";
var STORAGE_LANG = "cuba_auto_travel_language_2026";

var OFFICIAL_VISA = "https://evisacuba.cu/";
var OFFICIAL_DV = "https://dviajeros.mitrans.gob.cu/";

var language = localStorage.getItem(STORAGE_LANG) || "es";
var passportRules = {};
var visaStep = 0;
var dvStep = 0;

var visaData = loadData(STORAGE_VISA);
var dvData = loadData(STORAGE_DV);

var translations = {
    es: {
        startVisa: "Preparar Visa / eVisa",
        startDviajeros: "Preparar D'Viajeros",
        backHome: "Volver al inicio",
        previous: "Anterior",
        next: "Continuar",
        clear: "Borrar mis datos",
        openOfficial: "Abrir portal oficial",
        copy: "Copiar",
        copied: "¡Copiado!",
        ready: "LISTO",
        review: "REVISA ESTO",
        missing: "FALTA ESTE DATO",
        complete: "MUY BIEN. YA PODEMOS CONTINUAR.",
        passportReady: "Información del pasaporte preparada.",
        passportMissing: "Ten tu pasaporte delante y completa todos los datos.",
        passportReview: "Revisa un dato del pasaporte.",
        passportExpired: "La fecha de vencimiento debe revisarse antes de continuar.",
        officialNotice: "El portal oficial se abrirá en una nueva pestaña. Puedes volver aquí cuando quieras.",
        noOfficial: "CUBA AUTO TRAVEL no realiza el trámite oficial.",
        required: "Completa este dato para continuar.",
        invalidEmail: "Escribe un correo electrónico válido.",
        invalidDate: "Revisa la fecha indicada.",
        expirationBeforeBirth: "La fecha de vencimiento no puede ser anterior a la fecha de nacimiento.",
        expirationBeforeArrival: "El pasaporte debe tener una fecha de vencimiento posterior a la fecha prevista de llegada.",
        passportNumberInvalid: "Revisa el número de pasaporte.",
        healthNeedDetails: "Si respondes Sí, explica brevemente lo que corresponda.",
        customsNeedDetails: "Si respondes Sí, prepara los datos que correspondan a la declaración.",
        yes: "Sí",
        no: "No",
        saved: "Tus datos se guardan solamente en este navegador.",
        language: "EN"
    },
    en: {
        startVisa: "Prepare Visa / eVisa",
        startDviajeros: "Prepare D'Viajeros",
        backHome: "Back to home",
        previous: "Previous",
        next: "Continue",
        clear: "Delete my data",
        openOfficial: "Open official portal",
        copy: "Copy",
        copied: "Copied!",
        ready: "READY",
        review: "CHECK THIS",
        missing: "THIS INFORMATION IS MISSING",
        complete: "VERY GOOD. WE CAN CONTINUE.",
        passportReady: "Passport information prepared.",
        passportMissing: "Have your passport in front of you and complete all the information.",
        passportReview: "Check one passport detail.",
        passportExpired: "Check the passport expiration date before continuing.",
        officialNotice: "The official portal will open in a new tab. You can return here whenever you want.",
        noOfficial: "CUBA AUTO TRAVEL does not perform the official procedure.",
        required: "Complete this information to continue.",
        invalidEmail: "Enter a valid email address.",
        invalidDate: "Check the date entered.",
        expirationBeforeBirth: "The expiration date cannot be before the date of birth.",
        expirationBeforeArrival: "The passport must expire after the planned arrival date.",
        passportNumberInvalid: "Check the passport number.",
        healthNeedDetails: "If you answer Yes, briefly explain what applies.",
        customsNeedDetails: "If you answer Yes, prepare the information required for the declaration.",
        yes: "Yes",
        no: "No",
        saved: "Your information is saved only in this browser.",
        language: "ES"
    }
};

function byId(id) {
    return document.getElementById(id);
}

function loadData(key) {
    try {
        var raw = localStorage.getItem(key);
        if (!raw) return {};
        var parsed = JSON.parse(raw);
        return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
        return {};
    }
}

function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
    }
}

function t(key) {
    if (translations[language] && translations[language][key]) {
        return translations[language][key];
    }
    return translations.es[key] || key;
}

function applyLanguage() {
    var nodes = document.querySelectorAll("[data-i18n]");

    for (var i = 0; i < nodes.length; i++) {
        var key = nodes[i].getAttribute("data-i18n");
        if (translations[language][key]) {
            nodes[i].textContent = translations[language][key];
        }
    }

    var placeholders = document.querySelectorAll("[data-i18n-placeholder]");

    for (var j = 0; j < placeholders.length; j++) {
        var placeholderKey = placeholders[j].getAttribute("data-i18n-placeholder");
        if (translations[language][placeholderKey]) {
            placeholders[j].setAttribute(
                "placeholder",
                translations[language][placeholderKey]
            );
        }
    }

    var languageButton = byId("languageButton");
    if (languageButton) {
        languageButton.textContent = t("language");
    }

    refreshStatusMessages();
}

function setValue(id, value) {
    var element = byId(id);
    if (!element || value === undefined || value === null) return;

    if (element.type === "checkbox") {
        element.checked = Boolean(value);
    } else {
        element.value = value;
    }
}

function getValue(id) {
    var element = byId(id);
    if (!element) return "";

    if (element.type === "checkbox") {
        return element.checked;
    }

    return String(element.value || "").trim();
}

function bindStorage(ids, storageKey, target) {
    ids.forEach(function (id) {
        var element = byId(id);
        if (!element) return;

        element.addEventListener("input", function () {
            target[id] = getValue(id);
            saveData(storageKey, target);
            refreshCurrentModule();
        });

        element.addEventListener("change", function () {
            target[id] = getValue(id);
            saveData(storageKey, target);
            refreshCurrentModule();
        });
    });
}

function restoreFields(ids, data) {
    ids.forEach(function (id) {
        if (Object.prototype.hasOwnProperty.call(data, id)) {
            setValue(id, data[id]);
        }
    });
}

function validDate(value) {
    if (!value) return false;

    var date = new Date(value + "T00:00:00");
    return !isNaN(date.getTime());
}

function passportNumberValid(value) {
    var number = String(value || "").replace(/\s+/g, "");

    if (!number) return false;
    if (number.length < 5 || number.length > 20) return false;

    return /^[A-Za-z0-9-]+$/.test(number);
}

function emailValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
}

function validatePassport(fields, travelDate) {
    var country = getValue(fields.country);
    var number = getValue(fields.number);
    var firstName = getValue(fields.firstName);
    var lastName = getValue(fields.lastName);
    var birth = getValue(fields.birth);
    var expiration = getValue(fields.expiration);

    var result = {
        valid: true,
        missing: [],
        review: [],
        message: t("passportReady")
    };

    if (!country) {
        result.valid = false;
        result.missing.push(fields.country);
    }

    if (!number) {
        result.valid = false;
        result.missing.push(fields.number);
    } else if (!passportNumberValid(number)) {
        result.valid = false;
        result.review.push(t("passportNumberInvalid"));
    }

    if (!firstName) {
        result.valid = false;
        result.missing.push(fields.firstName);
    }

    if (!lastName) {
        result.valid = false;
        result.missing.push(fields.lastName);
    }

    if (!birth) {
        result.valid = false;
        result.missing.push(fields.birth);
    } else if (!validDate(birth)) {
        result.valid = false;
        result.review.push(t("invalidDate"));
    }

    if (!expiration) {
        result.valid = false;
        result.missing.push(fields.expiration);
    } else if (!validDate(expiration)) {
        result.valid = false;
        result.review.push(t("invalidDate"));
    }

    if (birth && expiration && validDate(birth) && validDate(expiration)) {
        if (expiration < birth) {
            result.valid = false;
            result.review.push(t("expirationBeforeBirth"));
        }
    }

    if (
        travelDate &&
        expiration &&
        validDate(travelDate) &&
        validDate(expiration) &&
        expiration < travelDate
    ) {
        result.valid = false;
        result.review.push(t("expirationBeforeArrival"));
    }

    if (result.missing.length > 0) {
        result.message = t("passportMissing");
    } else if (result.review.length > 0) {
        result.message = result.review[0];
    }

    return result;
}

function setStatus(elementId, status, message) {
    var element = byId(elementId);
    if (!element) return;

    var badge = element.querySelector(".status-badge");

    if (!badge) {
        badge = document.createElement("span");
        badge.className = "status-badge";
        element.appendChild(badge);
    }

    badge.className = "status-badge";

    if (status === "REVIEW") {
        badge.classList.add("review");
        badge.textContent = t("review");
    } else if (status === "MISSING") {
        badge.classList.add("missing");
        badge.textContent = t("missing");
    } else {
        badge.textContent = t("ready");
    }

    var messageElement = element.querySelector(".status-message");

    if (!messageElement) {
        messageElement = document.createElement("div");
        messageElement.className = "status-message";
        element.appendChild(messageElement);
    }

    messageElement.textContent = message || "";
}

function passportFieldsVisa() {
    return {
        country: "visaPassportCountry",
        number: "visaPassportNumber",
        firstName: "visaFirstName",
        lastName: "visaLastName",
        birth: "visaBirthDate",
        expiration: "visaPassportExpiration"
    };
}

function passportFieldsDV() {
    return {
        country: "dvPassportCountry",
        number: "dvPassportNumber",
        firstName: "dvFirstName",
        lastName: "dvLastName",
        birth: "dvBirthDate",
        expiration: "dvPassportExpiration"
    };
}

function updateVisaPassportStatus() {
    var result = validatePassport(
        passportFieldsVisa(),
        getValue("visaArrivalDate")
    );

    if (result.missing.length > 0) {
        setStatus("visaPassportStatus", "MISSING", result.message);
    } else if (result.review.length > 0) {
        setStatus("visaPassportStatus", "REVIEW", result.message);
    } else {
        setStatus("visaPassportStatus", "READY", result.message);
    }

    return result;
}

function updateDVPassportStatus() {
    var result = validatePassport(
        passportFieldsDV(),
        getValue("dvArrivalDate")
    );

    if (result.missing.length > 0) {
        setStatus("dvPassportStatus", "MISSING", result.message);
    } else if (result.review.length > 0) {
        setStatus("dvPassportStatus", "REVIEW", result.message);
    } else {
        setStatus("dvPassportStatus", "READY", result.message);
    }

    return result;
}

function visaStepValid(step) {
    if (step === 0) return true;

    if (step === 1) {
        return updateVisaPassportStatus().valid;
    }

    if (step === 2) {
        if (!updateVisaPassportStatus().valid) return false;

        if (!getValue("visaNationality")) return false;
        if (!getValue("visaResidence")) return false;
        if (!getValue("visaPurpose")) return false;
        if (!getValue("visaEmail")) return false;

        if (!emailValid(getValue("visaEmail"))) return false;

        return true;
    }

    if (step === 3) {
        return visaStepValid(2);
    }

    if (step === 4) {
        return visaStepValid(2);
    }

    return true;
}

function dviajerosStepValid(step) {
    if (step === 0) return true;

    if (step === 1) {
        return updateDVPassportStatus().valid;
    }

    if (step === 2) {
        if (!dviajerosStepValid(1)) return false;

        if (!getValue("dvArrivalDate")) return false;
        if (!getValue("dvFlightNumber")) return false;
        if (!getValue("dvAirline")) return false;

        return true;
    }

    if (step === 3) {
        if (!dviajerosStepValid(2)) return false;
        if (!getValue("dvAccommodation")) return false;

        return true;
    }

    if (step === 4) {
        if (!dviajerosStepValid(3)) return false;

        var health = getValue("dvHealthAnswer");

        if (health !== "yes" && health !== "no") {
            return false;
        }

        if (health === "yes" && !getValue("dvHealthExtra")) {
            return false;
        }

        return true;
    }

    if (step === 5) {
        if (!dviajerosStepValid(4)) return false;

        var customs = getValue("dvCustomsAnswer");

        if (customs !== "yes" && customs !== "no") {
            return false;
        }

        if (customs === "yes" && !getValue("dvCustomsExtra")) {
            return false;
        }

        return true;
    }

    if (step === 6) {
        return dviajerosStepValid(5);
    }

    return true;
}

function showScreen(screenId) {
    var screens = document.querySelectorAll(".screen");

    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove("active");
    }

    var target = byId(screenId);

    if (target) {
        target.classList.add("active");
    }
}

function showHome() {
    showScreen("homeSection");
    visaStep = 0;
    dvStep = 0;
}

function updateStepper(containerId, currentStep) {
    var container = byId(containerId);
    if (!container) return;

    var items = container.querySelectorAll(".stepper-item");

    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
        items[i].classList.remove("completed");

        var itemStep = parseInt(items[i].getAttribute("data-step"), 10);

        if (itemStep === currentStep) {
            items[i].classList.add("active");
        }

        if (itemStep < currentStep) {
            items[i].classList.add("completed");
        }
    }
}

function renderVisaStep() {
    var container = byId("visaStepContainer");
    if (!container) return;

    var panels = container.querySelectorAll(".guide-panel");

    for (var i = 0; i < panels.length; i++) {
        var panelStep = parseInt(panels[i].getAttribute("data-step"), 10);
        panels[i].classList.toggle("hidden", panelStep !== visaStep);
    }

    updateStepper("visaStepper", visaStep);

    var previous = byId("visaPreviousButton");
    var next = byId("visaNextButton");

    if (previous) {
        previous.disabled = visaStep === 0;
    }

    if (next) {
        next.textContent =
            visaStep === 5 ? t("openOfficial") : t("next");
    }

    updateVisaPassportStatus();
    updateReview("visa");
}

function renderDVStep() {
    var container = byId("dviajerosStepContainer");
    if (!container) return;

    var panels = container.querySelectorAll(".guide-panel");

    for (var i = 0; i < panels.length; i++) {
        var panelStep = parseInt(panels[i].getAttribute("data-step"), 10);
        panels[i].classList.toggle("hidden", panelStep !== dvStep);
    }

    updateStepper("dviajerosStepper", dvStep);

    var previous = byId("dviajerosPreviousButton");
    var next = byId("dviajerosNextButton");

    if (previous) {
        previous.disabled = dvStep === 0;
    }

    if (next) {
        next.textContent =
            dvStep === 7 ? t("openOfficial") : t("next");
    }

    updateDVPassportStatus();
    updateReview("dviajeros");
}

function showVisa() {
    showScreen("visaSection");
    visaStep = 0;
    renderVisaStep();
}

function showDV() {
    showScreen("dviajerosSection");
    dvStep = 0;
    renderDVStep();
}

function updateReview(module) {
    var reviewContainer =
        module === "visa" ? byId("visaReview") : byId("dviajerosReview");

    if (!reviewContainer) return;

    var fragment = document.createDocumentFragment();

    function addItem(label, value, status) {
        var item = document.createElement("div");
        item.className = "review-item";

        var main = document.createElement("div");
        main.className = "review-item-main";

        var labelElement = document.createElement("div");
        labelElement.className = "review-item-label";
        labelElement.textContent = label;

        var valueElement = document.createElement("div");
        valueElement.className = "review-item-value";
        valueElement.textContent = value || "—";

        var badge = document.createElement("span");
        badge.className = "status-badge";

        if (status === "ready") {
            badge.textContent = t("ready");
        } else if (status === "review") {
            badge.classList.add("review");
            badge.textContent = t("review");
        } else {
            badge.classList.add("missing");
            badge.textContent = t("missing");
        }

        main.appendChild(labelElement);
        main.appendChild(valueElement);

        item.appendChild(main);
        item.appendChild(badge);

        fragment.appendChild(item);
    }

    if (module === "visa") {
        var passport = updateVisaPassportStatus();

        addItem(
            language === "es" ? "País del pasaporte" : "Passport country",
            getValue("visaPassportCountry"),
            passport.valid ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Número de pasaporte" : "Passport number",
            getValue("visaPassportNumber"),
            passport.valid ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Nombre" : "First name",
            getValue("visaFirstName"),
            getValue("visaFirstName") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Apellidos" : "Last name",
            getValue("visaLastName"),
            getValue("visaLastName") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Nacionalidad" : "Nationality",
            getValue("visaNationality"),
            getValue("visaNationality") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "País de residencia" : "Country of residence",
            getValue("visaResidence"),
            getValue("visaResidence") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Motivo del viaje" : "Travel purpose",
            getValue("visaPurpose"),
            getValue("visaPurpose") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Correo electrónico" : "Email",
            getValue("visaEmail"),
            emailValid(getValue("visaEmail")) ? "ready" : "missing"
        );
    } else {
        var dvPassport = updateDVPassportStatus();

        addItem(
            language === "es" ? "Nombre" : "First name",
            getValue("dvFirstName"),
            getValue("dvFirstName") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Apellidos" : "Last name",
            getValue("dvLastName"),
            getValue("dvLastName") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Nacionalidad" : "Nationality",
            getValue("dvNationality"),
            getValue("dvNationality") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Número de pasaporte" : "Passport number",
            getValue("dvPassportNumber"),
            dvPassport.valid ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Fecha de llegada" : "Arrival date",
            getValue("dvArrivalDate"),
            getValue("dvArrivalDate") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Número de vuelo" : "Flight number",
            getValue("dvFlightNumber"),
            getValue("dvFlightNumber") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Aerolínea" : "Airline",
            getValue("dvAirline"),
            getValue("dvAirline") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Alojamiento" : "Accommodation",
            getValue("dvAccommodation"),
            getValue("dvAccommodation") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Salud" : "Health",
            getValue("dvHealthAnswer"),
            getValue("dvHealthAnswer") ? "ready" : "missing"
        );

        addItem(
            language === "es" ? "Aduana" : "Customs",
            getValue("dvCustomsAnswer"),
            getValue("dvCustomsAnswer") ? "ready" : "missing"
        );
    }

    reviewContainer.replaceChildren(fragment);
}

function showValidationMessage(message) {
    var existing = document.querySelector(".temporary-validation");

    if (existing) {
        existing.remove();
    }

    var messageBox = document.createElement("div");
    messageBox.className = "temporary-validation";
    messageBox.textContent = message || t("required");

    document.body.appendChild(messageBox);

    setTimeout(function () {
        if (messageBox.parentNode) {
            messageBox.remove();
        }
    }, 2500);
}

function getFirstInvalidMessage(module, step) {
    if (module === "visa") {
        if (step === 1) {
            var visaPassport = updateVisaPassportStatus();

            if (visaPassport.review.length > 0) {
                return visaPassport.review[0];
            }

            return t("passportMissing");
        }

        if (step === 2) {
            if (!getValue("visaNationality")) return t("required");
            if (!getValue("visaResidence")) return t("required");
            if (!getValue("visaPurpose")) return t("required");
            if (!getValue("visaEmail")) return t("required");
            if (!emailValid(getValue("visaEmail"))) return t("invalidEmail");
        }
    }

    if (module === "dviajeros") {
        if (step === 1) {
            var dvPassport = updateDVPassportStatus();

            if (dvPassport.review.length > 0) {
                return dvPassport.review[0];
            }

            return t("passportMissing");
        }

        if (step === 2) {
            return t("required");
        }

        if (step === 3) {
            return t("required");
        }

        if (step === 4 && getValue("dvHealthAnswer") === "yes" && !getValue("dvHealthExtra")) {
            return t("healthNeedDetails");
        }

        if (step === 5 && getValue("dvCustomsAnswer") === "yes" && !getValue("dvCustomsExtra")) {
            return t("customsNeedDetails");
        }

        return t("required");
    }

    return t("required");
}

function nextVisa() {
    if (visaStep === 5) {
        window.open(OFFICIAL_VISA, "_blank", "noopener,noreferrer");
        return;
    }

    if (!visaStepValid(visaStep)) {
        showValidationMessage(getFirstInvalidMessage("visa", visaStep));
        return;
    }

    if (visaStep < 5) {
        visaStep += 1;
        renderVisaStep();
    }
}

function previousVisa() {
    if (visaStep > 0) {
        visaStep -= 1;
        renderVisaStep();
    }
}

function nextDV() {
    if (dvStep === 7) {
        window.open(OFFICIAL_DV, "_blank", "noopener,noreferrer");
        return;
    }

    if (!dviajerosStepValid(dvStep)) {
        showValidationMessage(getFirstInvalidMessage("dviajeros", dvStep));
        return;
    }

    if (dvStep < 7) {
        dvStep += 1;
        renderDVStep();
    }
}

function previousDV() {
    if (dvStep > 0) {
        dvStep -= 1;
        renderDVStep();
    }
}

function copyText(value, button) {
    if (!value) {
        showValidationMessage(t("required"));
        return;
    }

    function copied() {
        if (!button) return;

        var original = button.textContent;
        button.textContent = t("copied");

        setTimeout(function () {
            button.textContent = original || t("copy");
        }, 1200);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(copied).catch(function () {
            fallbackCopy(value, copied);
        });
    } else {
        fallbackCopy(value, copied);
    }
}

function fallbackCopy(value, callback) {
    var textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand("copy");
    } catch (error) {
    }

    textarea.remove();

    if (callback) callback();
}

function setupCopyButtons() {
    var buttons = document.querySelectorAll("[data-copy-target]");

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function () {
            var targetId = this.getAttribute("data-copy-target");
            var value = getValue(targetId);
            copyText(value, this);
        });
    }
}

function setupAnswerFields() {
    var healthAnswer = byId("dvHealthAnswer");
    var healthExtra = byId("dvHealthExtra");
    var customsAnswer = byId("dvCustomsAnswer");
    var customsExtra = byId("dvCustomsExtra");

    function refreshHealth() {
        if (!healthExtra || !healthAnswer) return;

        var show = healthAnswer.value === "yes";
        healthExtra.classList.toggle("hidden", !show);

        if (!show) {
            healthExtra.value = "";
            dvData.dvHealthExtra = "";
            saveData(STORAGE_DV, dvData);
        }
    }

    function refreshCustoms() {
        if (!customsExtra || !customsAnswer) return;

        var show = customsAnswer.value === "yes";
        customsExtra.classList.toggle("hidden", !show);

        if (!show) {
            customsExtra.value = "";
            dvData.dvCustomsExtra = "";
            saveData(STORAGE_DV, dvData);
        }
    }

    if (healthAnswer) {
        healthAnswer.addEventListener("change", function () {
            dvData.dvHealthAnswer = healthAnswer.value;
            saveData(STORAGE_DV, dvData);
            refreshHealth();
            renderDVStep();
        });
    }

    if (customsAnswer) {
        customsAnswer.addEventListener("change", function () {
            dvData.dvCustomsAnswer = customsAnswer.value;
            saveData(STORAGE_DV, dvData);
            refreshCustoms();
            renderDVStep();
        });
    }

    if (healthExtra) {
        healthExtra.addEventListener("input", function () {
            dvData.dvHealthExtra = healthExtra.value;
            saveData(STORAGE_DV, dvData);
        });
    }

    if (customsExtra) {
        customsExtra.addEventListener("input", function () {
            dvData.dvCustomsExtra = customsExtra.value;
            saveData(STORAGE_DV, dvData);
        });
    }

    refreshHealth();
    refreshCustoms();
}

function setupNavigation() {
    var startVisa = byId("startVisaButton");
    var startDV = byId("startDviajerosButton");
    var visaPrevious = byId("visaPreviousButton");
    var visaNext = byId("visaNextButton");
    var dvPrevious = byId("dviajerosPreviousButton");
    var dvNext = byId("dviajerosNextButton");
    var languageButton = byId("languageButton");

    if (startVisa) {
        startVisa.addEventListener("click", showVisa);
    }

    if (startDV) {
        startDV.addEventListener("click", showDV);
    }

    if (visaPrevious) {
        visaPrevious.addEventListener("click", previousVisa);
    }

    if (visaNext) {
        visaNext.addEventListener("click", nextVisa);
    }

    if (dvPrevious) {
        dvPrevious.addEventListener("click", previousDV);
    }

    if (dvNext) {
        dvNext.addEventListener("click", nextDV);
    }

    if (languageButton) {
        languageButton.addEventListener("click", function () {
            language = language === "es" ? "en" : "es";
            localStorage.setItem(STORAGE_LANG, language);
            applyLanguage();
            renderVisaStep();
            renderDVStep();
        });
    }

    var backButtons = document.querySelectorAll("[data-back-home]");

    for (var i = 0; i < backButtons.length; i++) {
        backButtons[i].addEventListener("click", showHome);
    }
}

function setupClearButtons() {
    var clearVisa = byId("clearVisaButton");
    var clearDV = byId("clearDviajerosButton");

    if (clearVisa) {
        clearVisa.addEventListener("click", function () {
            localStorage.removeItem(STORAGE_VISA);
            visaData = {};
            location.reload();
        });
    }

    if (clearDV) {
        clearDV.addEventListener("click", function () {
            localStorage.removeItem(STORAGE_DV);
            dvData = {};
            location.reload();
        });
    }
}

function setupFields() {
    var visaIds = [
        "visaPassportCountry",
        "visaPassportNumber",
        "visaFirstName",
        "visaLastName",
        "visaBirthDate",
        "visaPassportExpiration",
        "visaNationality",
        "visaResidence",
        "visaPurpose",
        "visaArrivalDate",
        "visaEmail"
    ];

    var dvIds = [
        "dvFirstName",
        "dvLastName",
        "dvNationality",
        "dvBirthDate",
        "dvPassportNumber",
        "dvPassportCountry",
        "dvPassportExpiration",
        "dvArrivalDate",
        "dvFlightNumber",
        "dvAirline",
        "dvAccommodation",
        "dvAddressCuba",
        "dvPurpose",
        "dvHealthAnswer",
        "dvHealthExtra",
        "dvCustomsAnswer",
        "dvCustomsExtra"
    ];

    restoreFields(visaIds, visaData);
    restoreFields(dvIds, dvData);

    bindStorage(visaIds, STORAGE_VISA, visaData);
    bindStorage(dvIds, STORAGE_DV, dvData);

    var visaBirth = byId("visaBirthDate");
    var visaExpiration = byId("visaPassportExpiration");
    var visaArrival = byId("visaArrivalDate");

    if (visaBirth) {
        visaBirth.addEventListener("change", updateVisaPassportStatus);
    }

    if (visaExpiration) {
        visaExpiration.addEventListener("change", updateVisaPassportStatus);
    }

    if (visaArrival) {
        visaArrival.addEventListener("change", updateVisaPassportStatus);
    }

    var dvBirth = byId("dvBirthDate");
    var dvExpiration = byId("dvPassportExpiration");
    var dvArrival = byId("dvArrivalDate");

    if (dvBirth) {
        dvBirth.addEventListener("change", updateDVPassportStatus);
    }

    if (dvExpiration) {
        dvExpiration.addEventListener("change", updateDVPassportStatus);
    }

    if (dvArrival) {
        dvArrival.addEventListener("change", updateDVPassportStatus);
    }
}

function refreshStatusMessages() {
    updateVisaPassportStatus();
    updateDVPassportStatus();
}

function refreshCurrentModule() {
    if (byId("visaSection") && byId("visaSection").classList.contains("active")) {
        renderVisaStep();
    }

    if (
        byId("dviajerosSection") &&
        byId("dviajerosSection").classList.contains("active")
    ) {
        renderDVStep();
    }
}

function loadPassportRules() {
    fetch("/api/passports", {
        method: "GET",
        headers: {
            Accept: "application/json"
        }
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("passport data unavailable");
            }

            return response.json();
        })
        .then(function (payload) {
            passportRules = payload && payload.data ? payload.data : {};
        })
        .catch(function () {
            passportRules = {};
        });
}

setupFields();
setupNavigation();
setupCopyButtons();
setupAnswerFields();
setupClearButtons();

showHome();
applyLanguage();
loadPassportRules();
refreshStatusMessages();

});
