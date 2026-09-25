"use strict";

document.addEventListener("DOMContentLoaded", function () {
const VISA_URL = "https://evisacuba.cu/";
const DVIJEROS_URL = "https://dviajeros.mitrans.gob.cu/";

```
const STORAGE_VISA = "cu_cuba_auto_travel_2026_visa";
const STORAGE_DVIAJEROS = "cu_cuba_auto_travel_2026_dviajeros";
const STORAGE_LANGUAGE = "cu_cuba_auto_travel_2026_language";

let language = localStorage.getItem(STORAGE_LANGUAGE) || "es";

let visaStep = 0;
let dviajerosStep = 0;

const visaTotalSteps = 6;
const dviajerosTotalSteps = 8;

const translations = {
    es: {
        independent_badge: "APLICACIÓN INDEPENDIENTE",
        hero_title: "Prepárate para viajar a Cuba sin miedo a perderte.",
        hero_text: "CU CUBA AUTO TRAVEL 2026 te explica, te prepara y te acompaña paso a paso antes de entrar a los portales oficiales.",
        visa_button: "Preparar Visa / eVisa",
        dviajeros_button: "Preparar D'Viajeros",
        official_kicker: "PORTALES OFICIALES",
        official_title: "Tenlos siempre a mano",
        official_text: "Se abrirán en una nueva pestaña. CU CUBA AUTO TRAVEL permanecerá abierta para que puedas mirar, copiar, volver y continuar.",
        open_official_visa: "Abrir portal oficial de Visa",
        open_official_dviajeros: "Abrir portal oficial de D'Viajeros",
        how_kicker: "CÓMO FUNCIONA",
        how_title: "Como tener un agente a tu lado",
        how_1_title: "Entender",
        how_1_text: "Te explicamos qué vas a hacer antes de comenzar.",
        how_2_title: "Preparar",
        how_2_text: "Organizas tus datos y tienes todo listo.",
        how_3_title: "Simular",
        how_3_text: "Practicas el camino antes de entrar al sitio oficial.",
        how_4_title: "Continuar",
        how_4_text: "Abres el portal oficial y vuelves aquí cuando necesites orientación.",
        important_label: "IMPORTANTE",
        disclaimer: "CU CUBA AUTO TRAVEL 2026 es independiente. No pertenece al Gobierno de Cuba ni a sus autoridades migratorias, consulares, sanitarias o aduanales. No emite visas, no presenta solicitudes oficiales y no genera QR oficiales.",
        back: "Volver",
        agent_title: "Te voy guiando paso a paso.",
        agent_text: "Primero entendemos el procedimiento. Después preparamos los datos, simulamos el recorrido y finalmente abrimos el sitio oficial.",
        visa_title: "Visa cubana / eVisa",
        visa_intro: "Vamos a prepararla juntos antes de abrir el portal oficial.",
        step_1: "PASO 1",
        step_2: "PASO 2",
        step_3: "PASO 3",
        step_4: "PASO 4",
        step_5: "PASO 5",
        step_6: "PASO 6",
        step_7: "PASO 7",
        step_8: "PASO 8",
        visa_step1_title: "¿Qué vas a hacer?",
        visa_step1_text: "La eVisa es un procedimiento electrónico. CU CUBA AUTO TRAVEL no expide la visa: aquí preparas la información y después continúas directamente en el portal oficial.",
        what_we_do: "Aquí hacemos",
        visa_here: "Preparar, explicar, revisar y practicar.",
        official_does: "En el portal oficial",
        visa_official: "Presentas la solicitud y realizas el procedimiento oficial.",
        visa_step2_title: "Prepara tus datos",
        visa_step2_text: "Completa estos datos con la información real de tu pasaporte y de tu viaje. Los datos se guardan solamente en este navegador para que puedas continuar.",
        nationality: "Nacionalidad",
        residence: "País de residencia",
        passport_country: "País que emitió tu pasaporte",
        travel_purpose: "Motivo del viaje",
        email: "Correo electrónico",
        copy: "Copiar",
        visa_step3_title: "Revisa tu pasaporte",
        passport_available: "Tengo mi pasaporte disponible.",
        passport_valid: "He revisado la vigencia de mi pasaporte.",
        dual_nationality: "Tengo doble nacionalidad.",
        tip: "CONSEJO",
        passport_tip: "Si tienes dudas sobre tu nacionalidad aplicable o sobre un requisito específico, no adivines. Compruébalo en la información oficial antes de enviar la solicitud.",
        visa_step4_title: "Así es el camino del trámite",
        visa_sim1_title: "Detalles del trámite",
        visa_sim1_text: "Introduces la información solicitada por el portal.",
        visa_sim2_title: "Trámites adicionales",
        visa_sim2_text: "Si el portal muestra procedimientos adicionales aplicables, los revisas antes de continuar.",
        visa_sim3_title: "Pago",
        visa_sim3_text: "El método de pago no debe suponerse. El portal muestra las opciones correspondientes al trámite y al consulado.",
        visa_sim4_title: "Revisar y confirmar",
        visa_sim4_text: "Compruebas los datos antes de confirmar y enviar.",
        payment_attention: "ATENCIÓN AL PAGO",
        payment_text: "No vamos a decirte que existe un único método de pago para todos. Las opciones pueden depender del consulado. Mira siempre lo que indique el portal oficial para tu trámite.",
        visa_step5_title: "Haz una última revisión",
        clear: "Borrar preparación",
        visa_step6_title: "Ahora sí: abre el portal oficial",
        portal_instruction1: "Pulsa el botón. El portal oficial se abrirá en otra pestaña.",
        portal_instruction2: "Deja CU CUBA AUTO TRAVEL abierta.",
        portal_instruction3: "Mira aquí, copia el dato que necesites, pégalo en el portal oficial y vuelve aquí cuando necesites continuar.",
        open_visa_portal: "ABRIR eVISA OFICIAL ↗",
        official_note: "Esta aplicación no presenta la solicitud ni emite la visa.",
        previous: "Anterior",
        next: "Siguiente",
        dviajeros_intro: "Vamos a organizar la información para que el formulario oficial sea más fácil de completar.",
        dviajeros_agent_title: "No tienes que recordar todo de golpe.",
        dviajeros_agent_text: "Avanzaremos por partes: datos personales, viaje, alojamiento, salud, aduana y revisión.",
        dv_step1_title: "Primero entendamos D'Viajeros",
        dv_step1_text: "D'Viajeros reúne información que el viajero debe proporcionar antes de su entrada a Cuba. Aquí no generamos el QR oficial. Preparamos contigo la información para que después puedas completar y revisar el procedimiento en el sitio oficial.",
        dv_personal: "Información personal",
        dv_personal_text: "Quién eres y los datos de tu documento.",
        dv_trip: "Información del viaje",
        dv_trip_text: "Cuándo llegas, vuelo y aerolínea.",
        dv_health: "Salud",
        dv_health_text: "Respondes según tu situación real.",
        dv_customs: "Aduana",
        dv_customs_text: "Declaras lo que corresponda a tu caso.",
        dv_step2_title: "Datos personales",
        first_name: "Nombre",
        last_name: "Apellidos",
        birth_date: "Fecha de nacimiento",
        where_to_find: "¿Dónde encontrar estos datos?",
        personal_tip: "Utiliza tu pasaporte. Es mejor copiar exactamente cómo aparece allí que intentar recordarlo.",
        dv_step3_title: "Pasaporte y viaje",
        passport_number: "Número de pasaporte",
        arrival_date: "Fecha de llegada",
        flight_number: "Número de vuelo",
        airline: "Aerolínea",
        travel_tip_title: "Consejo del agente",
        travel_tip: "Ten a mano tu boleto o confirmación de vuelo. Ahí normalmente encontrarás el número de vuelo y la aerolínea.",
        dv_step4_title: "Alojamiento y otros datos",
        accommodation: "Alojamiento",
        address_cuba: "Dirección en Cuba",
        trip_purpose: "Motivo del viaje",
        extra_information: "¿Tienes algo más?",
        extra_information_text: "Si el portal oficial te solicita un dato que no aparece aquí, no significa que estés perdido. Anótalo y podrás revisarlo nuevamente en esta aplicación.",
        dv_step5_title: "Salud: responde según tu realidad",
        dv_health_intro: "Esta parte no debe rellenarse por adivinación. CU CUBA AUTO TRAVEL te ayuda a organizar la respuesta, pero tú debes declarar la información verdadera que corresponda a tu situación.",
        health_declaration: "Información de salud que deba declarar",
        select_option: "Selecciona una opción",
        no_information: "No tengo información adicional que declarar",
        yes_information: "Sí, tengo información que debo declarar",
        health_extra: "Información adicional",
        health_placeholder: "Escribe aquí solamente información real que corresponda a tu caso.",
        do_not_guess: "NO ADIVINES",
        health_warning: "Si una pregunta oficial no está clara, léela exactamente en el portal oficial y utiliza esta sección para organizar tu respuesta.",
        dv_step6_title: "Aduana: prepara lo que realmente corresponda",
        dv_customs_intro: "No vamos a inventar cantidades, valores ni categorías. Esta sección sirve para que pienses y organices la información antes de responder en el portal oficial.",
        customs_declaration: "¿Tienes información que debas declarar?",
        nothing_to_declare: "No tengo información adicional que declarar",
        something_to_declare: "Sí, tengo algo que declarar",
        customs_extra: "Detalles que quieras preparar",
        customs_placeholder: "Escribe aquí los detalles reales que necesites revisar.",
        customs_tip_title: "Recuerda",
        customs_tip: "Si tienes una mercancía, cantidad, valor o situación especial, utiliza la información oficial aplicable para determinar cómo debe declararse.",
        dv_step7_title: "Revisión antes de abrir D'Viajeros",
        dv_step8_title: "Ahora abre D'Viajeros",
        dv_portal_instruction3: "Completa el formulario oficial y vuelve aquí cuando necesites consultar o revisar un dato.",
        open_dviajeros_portal: "ABRIR D'VIAJEROS OFICIAL ↗",
        qr_note: "El QR oficial lo genera el sistema oficial después de completar el procedimiento correspondiente.",
        footer_text: "Aplicación independiente de preparación y acompañamiento."
    },

    en: {
        independent_badge: "INDEPENDENT APPLICATION",
        hero_title: "Prepare for your trip to Cuba without getting lost.",
        hero_text: "CU CUBA AUTO TRAVEL 2026 explains, prepares and guides you step by step before you enter the official portals.",
        visa_button: "Prepare Visa / eVisa",
        dviajeros_button: "Prepare D'Viajeros",
        official_kicker: "OFFICIAL PORTALS",
        official_title: "Keep them within reach",
        official_text: "They open in a new tab. CU CUBA AUTO TRAVEL stays open so you can look, copy, return and continue.",
        open_official_visa: "Open official Visa portal",
        open_official_dviajeros: "Open official D'Viajeros portal",
        how_kicker: "HOW IT WORKS",
        how_title: "Like having an agent beside you",
        how_1_title: "Understand",
        how_1_text: "We explain what you are going to do before you begin.",
        how_2_title: "Prepare",
        how_2_text: "Organize your information and get everything ready.",
        how_3_title: "Practice",
        how_3_text: "Practice the process before entering the official site.",
        how_4_title: "Continue",
        how_4_text: "Open the official portal and return here whenever you need guidance.",
        important_label: "IMPORTANT",
        disclaimer: "CU CUBA AUTO TRAVEL 2026 is independent. It is not part of the Government of Cuba or its migration, consular, health or customs authorities. It does not issue visas, submit official applications or generate official QR codes.",
        back: "Back",
        agent_title: "I will guide you step by step.",
        agent_text: "First we understand the process. Then we prepare the information, practice the path and finally open the official site.",
        visa_title: "Cuban Visa / eVisa",
        visa_intro: "Let's prepare it together before opening the official portal.",
        step_1: "STEP 1",
        step_2: "STEP 2",
        step_3: "STEP 3",
        step_4: "STEP 4",
        step_5: "STEP 5",
        step_6: "STEP 6",
        step_7: "STEP 7",
        step_8: "STEP 8",
        visa_step1_title: "What are you going to do?",
        visa_step1_text: "The eVisa is an electronic procedure. CU CUBA AUTO TRAVEL does not issue the visa: you prepare your information here and then continue directly on the official portal.",
        what_we_do: "Here we",
        visa_here: "Prepare, explain, review and practice.",
        official_does: "On the official portal",
        visa_official: "You submit the application and complete the official procedure.",
        visa_step2_title: "Prepare your information",
        visa_step2_text: "Enter the real information from your passport and trip. The information is stored only in this browser so you can continue.",
        nationality: "Nationality",
        residence: "Country of residence",
        passport_country: "Country that issued your passport",
        travel_purpose: "Purpose of travel",
        email: "Email",
        copy: "Copy",
        visa_step3_title: "Check your passport",
        passport_available: "I have my passport available.",
        passport_valid: "I have checked my passport validity.",
        dual_nationality: "I have dual nationality.",
        tip: "TIP",
        passport_tip: "If you are unsure about your applicable nationality or a specific requirement, do not guess. Check the official information before submitting.",
        visa_step4_title: "This is the path of the procedure",
        visa_sim1_title: "Application details",
        visa_sim1_text: "Enter the information requested by the portal.",
        visa_sim2_title: "Additional procedures",
        visa_sim2_text: "If the portal shows additional procedures that apply, review them before continuing.",
        visa_sim3_title: "Payment",
        visa_sim3_text: "Do not assume a payment method. The portal shows the options corresponding to the procedure and consulate.",
        visa_sim4_title: "Review and confirm",
        visa_sim4_text: "Check the information before confirming and submitting.",
        payment_attention: "PAYMENT ATTENTION",
        payment_text: "We will not tell you there is one payment method for everyone. Options may depend on the consulate. Always follow what the official portal shows for your application.",
        visa_step5_title: "Do one final review",
        clear: "Clear preparation",
        visa_step6_title: "Now open the official portal",
        portal_instruction1: "Press the button. The official portal will open in another tab.",
        portal_instruction2: "Leave CU CUBA AUTO TRAVEL open.",
        portal_instruction3: "Look here, copy the information you need, paste it into the official portal and return here whenever you need to continue.",
        open_visa_portal: "OPEN OFFICIAL eVISA ↗",
        official_note: "This application does not submit the application or issue the visa.",
        previous: "Previous",
        next: "Next",
        dviajeros_intro: "Let's organize the information so the official form is easier to complete.",
        dviajeros_agent_title: "You do not have to remember everything at once.",
        dviajeros_agent_text: "We will go section by section: personal information, trip, accommodation, health, customs and review.",
        dv_step1_title: "First, understand D'Viajeros",
        dv_step1_text: "D'Viajeros collects information that travelers must provide before entering Cuba. We do not generate the official QR here. We prepare the information with you so you can complete and review the procedure on the official site.",
        dv_personal: "Personal information",
        dv_personal_text: "Who you are and your document details.",
        dv_trip: "Trip information",
        dv_trip_text: "When you arrive, flight and airline.",
        dv_health: "Health",
        dv_health_text: "Answer according to your real situation.",
        dv_customs: "Customs",
        dv_customs_text: "Declare what applies to your situation.",
        dv_step2_title: "Personal information",
        first_name: "First name",
        last_name: "Last name",
        birth_date: "Date of birth",
        where_to_find: "Where can you find these details?",
        personal_tip: "Use your passport. It is better to copy exactly what appears there than to rely on memory.",
        dv_step3_title: "Passport and trip",
        passport_number: "Passport number",
        arrival_date: "Arrival date",
        flight_number: "Flight number",
        airline: "Airline",
        travel_tip_title: "Agent tip",
        travel_tip: "Keep your ticket or flight confirmation nearby. You will normally find the flight number and airline there.",
        dv_step4_title: "Accommodation and other information",
        accommodation: "Accommodation",
        address_cuba: "Address in Cuba",
        trip_purpose: "Purpose of travel",
        extra_information: "Do you have anything else?",
        extra_information_text: "If the official portal asks for information that is not shown here, that does not mean you are lost. Write it down and review it again in this application.",
        dv_step5_title: "Health: answer according to your situation",
        dv_health_intro: "Do not fill this section by guessing. CU CUBA AUTO TRAVEL helps you organize your answer, but you must declare the true information that applies to your situation.",
        health_declaration: "Health information that must be declared",
        select_option: "Select an option",
        no_information: "I have no additional information to declare",
        yes_information: "Yes, I have information to declare",
        health_extra: "Additional information",
        health_placeholder: "Write only real information that applies to your situation here.",
        do_not_guess: "DO NOT GUESS",
        health_warning: "If an official question is unclear, read it exactly on the official portal and use this section to organize your answer.",
        dv_step6_title: "Customs: prepare what actually applies",
        dv_customs_intro: "We will not invent quantities, values or categories. Use this section to think through and organize your information before answering on the official portal.",
        customs_declaration: "Do you have information that must be declared?",
        nothing_to_declare: "I have no additional information to declare",
        something_to_declare: "Yes, I have something to declare",
        customs_extra: "Details you want to prepare",
        customs_placeholder: "Write the real details you need to review here.",
        customs_tip_title: "Remember",
        customs_tip: "If you have merchandise, a quantity, value or special situation, use the applicable official information to determine how it should be declared.",
        dv_step7_title: "Review before opening D'Viajeros",
        dv_step8_title: "Now open D'Viajeros",
        dv_portal_instruction3: "Complete the official form and return here whenever you need to check or review information.",
        open_dviajeros_portal: "OPEN OFFICIAL D'VIAJEROS ↗",
        qr_note: "The official QR is generated by the official system after the corresponding procedure is completed.",
        footer_text: "Independent preparation and companion application."
    }
};

function $(id) {
    return document.getElementById(id);
}

function getValue(id) {
    const element = $(id);
    return element ? element.value : "";
}

function getChecked(id) {
    const element = $(id);
    return element ? element.checked : false;
}

function setValue(id, value) {
    const element = $(id);
    if (element) {
        element.value = value || "";
    }
}

function setChecked(id, value) {
    const element = $(id);
    if (element) {
        element.checked = Boolean(value);
    }
}

function saveJSON(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.warn("No se pudo guardar en localStorage.", error);
    }
}

function loadJSON(key) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : {};
    } catch (error) {
        return {};
    }
}

function applyTranslations() {
    const dictionary = translations[language];

    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const key = element.getAttribute("data-i18n");
        if (dictionary[key] !== undefined) {
            element.textContent = dictionary[key];
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(function (element) {
        const key = element.getAttribute("data-i18n-placeholder");
        if (dictionary[key] !== undefined) {
            element.placeholder = dictionary[key];
        }
    });

    $("languageButton").textContent = language === "es" ? "EN" : "ES";

    updateVisaStepper();
    updateDviajerosStepper();
    updateNavigationButtons();
    updateVisaReview();
    updateDviajerosReview();
}

function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(function (screen) {
        screen.classList.remove("active");
    });

    const screen = $(screenId);

    if (screen) {
        screen.classList.add("active");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}

function saveVisa() {
    const data = {
        nationality: getValue("visaNationality"),
        residence: getValue("visaResidence"),
        passportCountry: getValue("visaPassportCountry"),
        purpose: getValue("visaPurpose"),
        email: getValue("visaEmail"),
        hasPassport: getChecked("visaHasPassport"),
        passportValid: getChecked("visaPassportValid"),
        dualNationality: getChecked("visaDualNationality")
    };

    saveJSON(STORAGE_VISA, data);
}

function loadVisa() {
    const data = loadJSON(STORAGE_VISA);

    setValue("visaNationality", data.nationality);
    setValue("visaResidence", data.residence);
    setValue("visaPassportCountry", data.passportCountry);
    setValue("visaPurpose", data.purpose);
    setValue("visaEmail", data.email);

    setChecked("visaHasPassport", data.hasPassport);
    setChecked("visaPassportValid", data.passportValid);
    setChecked("visaDualNationality", data.dualNationality);
}

function saveDviajeros() {
    const data = {
        firstName: getValue("dvFirstName"),
        lastName: getValue("dvLastName"),
        nationality: getValue("dvNationality"),
        birthDate: getValue("dvBirthDate"),
        passportNumber: getValue("dvPassportNumber"),
        passportCountry: getValue("dvPassportCountry"),
        arrivalDate: getValue("dvArrivalDate"),
        flightNumber: getValue("dvFlightNumber"),
        airline: getValue("dvAirline"),
        accommodation: getValue("dvAccommodation"),
        addressCuba: getValue("dvAddressCuba"),
        purpose: getValue("dvPurpose"),
        healthAnswer: getValue("dvHealthAnswer"),
        healthExtra: getValue("dvHealthExtra"),
        customsAnswer: getValue("dvCustomsAnswer"),
        customsExtra: getValue("dvCustomsExtra")
    };

    saveJSON(STORAGE_DVIAJEROS, data);
}

function loadDviajeros() {
    const data = loadJSON(STORAGE_DVIAJEROS);

    setValue("dvFirstName", data.firstName);
    setValue("dvLastName", data.lastName);
    setValue("dvNationality", data.nationality);
    setValue("dvBirthDate", data.birthDate);
    setValue("dvPassportNumber", data.passportNumber);
    setValue("dvPassportCountry", data.passportCountry);
    setValue("dvArrivalDate", data.arrivalDate);
    setValue("dvFlightNumber", data.flightNumber);
    setValue("dvAirline", data.airline);
    setValue("dvAccommodation", data.accommodation);
    setValue("dvAddressCuba", data.addressCuba);
    setValue("dvPurpose", data.purpose);
    setValue("dvHealthAnswer", data.healthAnswer);
    setValue("dvHealthExtra", data.healthExtra);
    setValue("dvCustomsAnswer", data.customsAnswer);
    setValue("dvCustomsExtra", data.customsExtra);
}

function updateVisaStepper() {
    const container = $("visaStepper");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < visaTotalSteps; i += 1) {
        const dot = document.createElement("div");
        dot.className = "step-dot";

        if (i === visaStep) {
            dot.classList.add("active");
        } else if (i < visaStep) {
            dot.classList.add("done");
        }

        dot.textContent = String(i + 1);
        container.appendChild(dot);
    }
}

function updateDviajerosStepper() {
    const container = $("dviajerosStepper");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < dviajerosTotalSteps; i += 1) {
        const dot = document.createElement("div");
        dot.className = "step-dot";

        if (i === dviajerosStep) {
            dot.classList.add("active");
        } else if (i < dviajerosStep) {
            dot.classList.add("done");
        }

        dot.textContent = String(i + 1);
        container.appendChild(dot);
    }
}

function showVisaStep(step) {
    if (step < 0) {
        step = 0;
    }

    if (step >= visaTotalSteps) {
        step = visaTotalSteps - 1;
    }

    saveVisa();
    visaStep = step;

    document.querySelectorAll("[data-visa-step]").forEach(function (panel) {
        const panelStep = Number(panel.getAttribute("data-visa-step"));
        panel.classList.toggle("hidden", panelStep !== visaStep);
    });

    updateVisaStepper();
    updateNavigationButtons();
    updateVisaReview();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function showDviajerosStep(step) {
    if (step < 0) {
        step = 0;
    }

    if (step >= dviajerosTotalSteps) {
        step = dviajerosTotalSteps - 1;
    }

    saveDviajeros();
    dviajerosStep = step;

    document.querySelectorAll("[data-dviajeros-step]").forEach(function (panel) {
        const panelStep = Number(panel.getAttribute("data-dviajeros-step"));
        panel.classList.toggle("hidden", panelStep !== dviajerosStep);
    });

    updateDviajerosStepper();
    updateNavigationButtons();
    updateDviajerosReview();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function updateNavigationButtons() {
    const previousVisa = $("visaPreviousButton");
    const nextVisa = $("visaNextButton");
    const previousDV = $("dviajerosPreviousButton");
    const nextDV = $("dviajerosNextButton");

    if (previousVisa) {
        previousVisa.disabled = visaStep === 0;
        previousVisa.style.visibility = visaStep === 0 ? "hidden" : "visible";
    }

    if (nextVisa) {
        nextVisa.style.display = visaStep === visaTotalSteps - 1 ? "none" : "inline-flex";
    }

    if (previousDV) {
        previousDV.disabled = dviajerosStep === 0;
        previousDV.style.visibility = dviajerosStep === 0 ? "hidden" : "visible";
    }

    if (nextDV) {
        nextDV.style.display = dviajerosStep === dviajerosTotalSteps - 1 ? "none" : "inline-flex";
    }
}

function reviewItem(label, value) {
    const item = document.createElement("div");
    const hasValue = String(value || "").trim().length > 0;

    item.className = "review-item " + (hasValue ? "ok" : "missing");

    const labelElement = document.createElement("span");
    labelElement.className = "review-label";
    labelElement.textContent = label;

    const status = document.createElement("span");
    status.className = "review-status";
    status.textContent = hasValue
        ? (language === "es" ? "LISTO" : "READY")
        : (language === "es" ? "FALTA INFORMACIÓN" : "MISSING");

    item.appendChild(labelElement);
    item.appendChild(status);

    return item;
}

function updateVisaReview() {
    const container = $("visaReview");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const dictionary = translations[language];

    container.appendChild(
        reviewItem(dictionary.nationality, getValue("visaNationality"))
    );

    container.appendChild(
        reviewItem(dictionary.residence, getValue("visaResidence"))
    );

    container.appendChild(
        reviewItem(dictionary.passport_country, getValue("visaPassportCountry"))
    );

    container.appendChild(
        reviewItem(dictionary.travel_purpose, getValue("visaPurpose"))
    );

    container.appendChild(
        reviewItem(dictionary.email, getValue("visaEmail"))
    );

    container.appendChild(
        reviewItem(
            language === "es"
                ? "Pasaporte disponible"
                : "Passport available",
            getChecked("visaHasPassport") ? "ok" : ""
        )
    );

    container.appendChild(
        reviewItem(
            language === "es"
                ? "Vigencia revisada"
                : "Validity checked",
            getChecked("visaPassportValid") ? "ok" : ""
        )
    );
}

function updateDviajerosReview() {
    const container = $("dviajerosReview");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const dictionary = translations[language];

    container.appendChild(
        reviewItem(dictionary.first_name, getValue("dvFirstName"))
    );

    container.appendChild(
        reviewItem(dictionary.last_name, getValue("dvLastName"))
    );

    container.appendChild(
        reviewItem(dictionary.nationality, getValue("dvNationality"))
    );

    container.appendChild(
        reviewItem(dictionary.birth_date, getValue("dvBirthDate"))
    );

    container.appendChild(
        reviewItem(dictionary.passport_number, getValue("dvPassportNumber"))
    );

    container.appendChild(
        reviewItem(dictionary.passport_country, getValue("dvPassportCountry"))
    );

    container.appendChild(
        reviewItem(dictionary.arrival_date, getValue("dvArrivalDate"))
    );

    container.appendChild(
        reviewItem(dictionary.flight_number, getValue("dvFlightNumber"))
    );

    container.appendChild(
        reviewItem(dictionary.airline, getValue("dvAirline"))
    );

    container.appendChild(
        reviewItem(dictionary.accommodation, getValue("dvAccommodation"))
    );
}

function clearVisa() {
    localStorage.removeItem(STORAGE_VISA);

    [
        "visaNationality",
        "visaResidence",
        "visaPassportCountry",
        "visaPurpose",
        "visaEmail"
    ].forEach(function (id) {
        setValue(id, "");
    });

    setChecked("visaHasPassport", false);
    setChecked("visaPassportValid", false);
    setChecked("visaDualNationality", false);

    updateVisaReview();
}

function clearDviajeros() {
    localStorage.removeItem(STORAGE_DVIAJEROS);

    [
        "dvFirstName",
        "dvLastName",
        "dvNationality",
        "dvBirthDate",
        "dvPassportNumber",
        "dvPassportCountry",
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
    ].forEach(function (id) {
        setValue(id, "");
    });

    updateDviajerosReview();
}

async function copyValue(targetId, button) {
    const value = getValue(targetId);

    if (!value) {
        return;
    }

    try {
        await navigator.clipboard.writeText(value);
    } catch (error) {
        const temporary = document.createElement("textarea");
        temporary.value = value;
        document.body.appendChild(temporary);
        temporary.select();

        try {
            document.execCommand("copy");
        } catch (copyError) {
            console.warn("No se pudo copiar.", copyError);
        }

        document.body.removeChild(temporary);
    }

    const original = button.textContent;
    button.textContent = language === "es" ? "¡Copiado!" : "Copied!";

    window.setTimeout(function () {
        button.textContent = original;
    }, 1200);
}

function openModule(module) {
    if (module === "visa") {
        showScreen("visaSection");
        showVisaStep(0);
        return;
    }

    if (module === "dviajeros") {
        showScreen("dviajerosSection");
        showDviajerosStep(0);
    }
}

$("languageButton").addEventListener("click", function () {
    language = language === "es" ? "en" : "es";
    localStorage.setItem(STORAGE_LANGUAGE, language);
    applyTranslations();
});

$("startVisaButton").addEventListener("click", function () {
    openModule("visa");
});

$("startDviajerosButton").addEventListener("click", function () {
    openModule("dviajeros");
});

document.querySelectorAll("[data-back-home]").forEach(function (button) {
    button.addEventListener("click", function () {
        showScreen("homeSection");
    });
});

$("visaPreviousButton").addEventListener("click", function () {
    showVisaStep(visaStep - 1);
});

$("visaNextButton").addEventListener("click", function () {
    saveVisa();
    showVisaStep(visaStep + 1);
});

$("dviajerosPreviousButton").addEventListener("click", function () {
    showDviajerosStep(dviajerosStep - 1);
});

$("dviajerosNextButton").addEventListener("click", function () {
    saveDviajeros();
    showDviajerosStep(dviajerosStep + 1);
});

$("clearVisaButton").addEventListener("click", function () {
    const message = language === "es"
        ? "¿Quieres borrar toda la preparación de Visa?"
        : "Do you want to clear all Visa preparation?";

    if (window.confirm(message)) {
        clearVisa();
    }
});

$("clearDviajerosButton").addEventListener("click", function () {
    const message = language === "es"
        ? "¿Quieres borrar toda la preparación de D'Viajeros?"
        : "Do you want to clear all D'Viajeros preparation?";

    if (window.confirm(message)) {
        clearDviajeros();
    }
});

document.querySelectorAll("[data-copy-target]").forEach(function (button) {
    button.addEventListener("click", function () {
        copyValue(
            button.getAttribute("data-copy-target"),
            button
        );
    });
});

document.querySelectorAll("#visaSection input, #visaSection textarea, #visaSection select").forEach(function (element) {
    element.addEventListener("input", function () {
        saveVisa();
        updateVisaReview();
    });

    element.addEventListener("change", function () {
        saveVisa();
        updateVisaReview();
    });
});

document.querySelectorAll("#dviajerosSection input, #dviajerosSection textarea, #dviajerosSection select").forEach(function (element) {
    element.addEventListener("input", function () {
        saveDviajeros();
        updateDviajerosReview();
    });

    element.addEventListener("change", function () {
        saveDviajeros();
        updateDviajerosReview();
    });
});

loadVisa();
loadDviajeros();

applyTranslations();
showScreen("homeSection");
showVisaStep(0);
showDviajerosStep(0);

window.CU_CUBA_AUTO_TRAVEL = {
    openVisa: function () {
        window.open(VISA_URL, "_blank", "noopener,noreferrer");
    },
    openDviajeros: function () {
        window.open(DVIJEROS_URL, "_blank", "noopener,noreferrer");
    }
};
```

});
