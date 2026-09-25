(function () {
"use strict";

document.addEventListener("DOMContentLoaded", function () {

    var language = localStorage.getItem("cu_language") || "es";

    var visaStep = 0;
    var dviajerosStep = 0;

    var visaTotalSteps = 6;
    var dviajerosTotalSteps = 8;

    var translations = {

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
            visa_title: "Visa cubana / eVisa",
            visa_intro: "Vamos a prepararla juntos antes de abrir el portal oficial.",
            agent_title: "Te voy guiando paso a paso.",
            agent_text: "Primero entendemos el procedimiento. Después preparamos los datos, simulamos el recorrido y finalmente abrimos el sitio oficial.",
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
            hero_title: "Get ready to travel to Cuba without getting lost.",
            hero_text: "CU CUBA AUTO TRAVEL 2026 explains, prepares and guides you step by step before you enter the official portals.",
            visa_button: "Prepare Visa / eVisa",
            dviajeros_button: "Prepare D'Viajeros",
            official_kicker: "OFFICIAL PORTALS",
            official_title: "Keep them within reach",
            official_text: "They will open in a new tab. CU CUBA AUTO TRAVEL will remain open so you can look, copy, return and continue.",
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
            visa_title: "Cuban Visa / eVisa",
            visa_intro: "Let's prepare it together before opening the official portal.",
            agent_title: "I will guide you step by step.",
            agent_text: "First we understand the process. Then we prepare the information, practice the path and finally open the official site.",
            step_1: "STEP 1",
            step_2: "STEP 2",
            step_3: "STEP 3",
            step_4: "STEP 4",
            step_5: "STEP 5",
            step_6: "STEP 6",
            step_7: "STEP 7",
            step_8: "STEP 8",
            visa_step1_title: "What are you going to do?",
            visa_step1_text: "The eVisa is an electronic procedure. CU CUBA AUTO TRAVEL does not issue the visa: here you prepare the information and then continue directly on the official portal.",
            what_we_do: "What we do here",
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
            visa_sim2_text: "If the portal shows additional procedures that apply to you, review them before continuing.",
            visa_sim3_title: "Payment",
            visa_sim3_text: "Do not assume one payment method. The portal shows the options applicable to the procedure and consulate.",
            visa_sim4_title: "Review and confirm",
            visa_sim4_text: "Check the information before confirming and submitting.",
            payment_attention: "PAYMENT ATTENTION",
            payment_text: "We will not tell you that there is one payment method for everyone. Options may depend on the consulate. Always follow what the official portal indicates for your procedure.",
            visa_step5_title: "One final review",
            clear: "Clear preparation",
            visa_step6_title: "Now open the official portal",
            portal_instruction1: "Press the button. The official portal will open in another tab.",
            portal_instruction2: "Keep CU CUBA AUTO TRAVEL open.",
            portal_instruction3: "Look here, copy the information you need, paste it into the official portal and return here whenever you need to continue.",
            open_visa_portal: "OPEN OFFICIAL eVISA ↗",
            official_note: "This application does not submit the application or issue the visa.",
            previous: "Previous",
            next: "Next",
            dviajeros_intro: "Let's organize the information so the official form is easier to complete.",
            dviajeros_agent_title: "You do not have to remember everything at once.",
            dviajeros_agent_text: "We will go step by step: personal information, trip, accommodation, health, customs and review.",
            dv_step1_title: "First, understand D'Viajeros",
            dv_step1_text: "D'Viajeros collects information that travelers must provide before entering Cuba. We do not generate the official QR here. We prepare the information with you so you can complete and review the official procedure.",
            dv_personal: "Personal information",
            dv_personal_text: "Who you are and your document information.",
            dv_trip: "Travel information",
            dv_trip_text: "When you arrive, flight and airline.",
            dv_health: "Health",
            dv_health_text: "Answer according to your real situation.",
            dv_customs: "Customs",
            dv_customs_text: "Declare what applies to your situation.",
            dv_step2_title: "Personal information",
            first_name: "First name",
            last_name: "Last name",
            birth_date: "Date of birth",
            where_to_find: "Where can you find this information?",
            personal_tip: "Use your passport. It is better to copy it exactly as shown there than to rely on memory.",
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
            extra_information_text: "If the official portal asks for information that is not shown here, you are not lost. Write it down and review it again in this application.",
            dv_step5_title: "Health: answer according to your situation",
            dv_health_intro: "Do not guess this section. CU CUBA AUTO TRAVEL helps you organize your answer, but you must declare the real information that applies to your situation.",
            health_declaration: "Health information that you need to declare",
            select_option: "Select an option",
            no_information: "I have no additional information to declare",
            yes_information: "Yes, I have information that I need to declare",
            health_extra: "Additional information",
            health_placeholder: "Write only real information that applies to your situation.",
            do_not_guess: "DO NOT GUESS",
            health_warning: "If an official question is unclear, read it exactly on the official portal and use this section to organize your answer.",
            dv_step6_title: "Customs: prepare what actually applies",
            dv_customs_intro: "We will not invent quantities, values or categories. This section helps you think about and organize your information before answering on the official portal.",
            customs_declaration: "Do you have information that you need to declare?",
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
            qr_note: "The official QR is generated by the official system after the applicable procedure is completed.",
            footer_text: "Independent preparation and guidance application."
        }
    };

    function byId(id) {
        return document.getElementById(id);
    }

    function setLanguage(newLanguage) {

        language = newLanguage === "en" ? "en" : "es";

        localStorage.setItem("cu_language", language);

        document.documentElement.lang = language;

        var elements = document.querySelectorAll("[data-i18n]");
        var dictionary = translations[language];

        for (var i = 0; i < elements.length; i++) {

            var key = elements[i].getAttribute("data-i18n");

            if (dictionary[key] !== undefined) {
                elements[i].textContent = dictionary[key];
            }
        }

        var placeholders = document.querySelectorAll("[data-i18n-placeholder]");

        for (var j = 0; j < placeholders.length; j++) {

            var placeholderKey = placeholders[j].getAttribute("data-i18n-placeholder");

            if (dictionary[placeholderKey] !== undefined) {
                placeholders[j].setAttribute(
                    "placeholder",
                    dictionary[placeholderKey]
                );
            }
        }

        var languageButton = byId("languageButton");

        if (languageButton) {
            languageButton.textContent = language === "es" ? "EN" : "ES";
        }

        updateStepper("visa");
        updateStepper("dviajeros");
        updateNavigation("visa");
        updateNavigation("dviajeros");
    }

    function showScreen(screenId) {

        var screens = document.querySelectorAll(".screen");

        for (var i = 0; i < screens.length; i++) {
            screens[i].classList.remove("active");
        }

        var screen = byId(screenId);

        if (screen) {
            screen.classList.add("active");
            window.scrollTo(0, 0);
        }
    }

    function showModule(module) {

        if (module === "visa") {
            visaStep = 0;
            showScreen("visaSection");
            showStep("visa", visaStep);
            return;
        }

        if (module === "dviajeros") {
            dviajerosStep = 0;
            showScreen("dviajerosSection");
            showStep("dviajeros", dviajerosStep);
        }
    }

    function showStep(module, step) {

        var selector;
        var panels;

        if (module === "visa") {
            selector = "[data-visa-step]";
        } else {
            selector = "[data-dviajeros-step]";
        }

        panels = document.querySelectorAll(selector);

        for (var i = 0; i < panels.length; i++) {

            var value;

            if (module === "visa") {
                value = Number(panels[i].getAttribute("data-visa-step"));
            } else {
                value = Number(panels[i].getAttribute("data-dviajeros-step"));
            }

            if (value === step) {
                panels[i].classList.remove("hidden");
            } else {
                panels[i].classList.add("hidden");
            }
        }

        if (module === "visa") {
            visaStep = step;
            updateStepper("visa");
            updateNavigation("visa");
            if (step === 4) {
                buildVisaReview();
            }
        } else {
            dviajerosStep = step;
            updateStepper("dviajeros");
            updateNavigation("dviajeros");
            if (step === 6) {
                buildDviajerosReview();
            }
        }

        window.scrollTo(0, 0);
    }

    function updateStepper(module) {

        var container;
        var current;
        var total;
        var text;

        if (module === "visa") {
            container = byId("visaStepper");
            current = visaStep;
            total = visaTotalSteps;
        } else {
            container = byId("dviajerosStepper");
            current = dviajerosStep;
            total = dviajerosTotalSteps;
        }

        if (!container) {
            return;
        }

        container.textContent = "";

        for (var i = 0; i < total; i++) {

            var item = document.createElement("div");

            item.className = "step-dot";

            if (i === current) {
                item.classList.add("active");
            }

            if (i < current) {
                item.classList.add("completed");
            }

            item.textContent = String(i + 1);

            container.appendChild(item);
        }
    }

    function updateNavigation(module) {

        var previousButton;
        var nextButton;
        var current;
        var total;

        if (module === "visa") {
            previousButton = byId("visaPreviousButton");
            nextButton = byId("visaNextButton");
            current = visaStep;
            total = visaTotalSteps;
        } else {
            previousButton = byId("dviajerosPreviousButton");
            nextButton = byId("dviajerosNextButton");
            current = dviajerosStep;
            total = dviajerosTotalSteps;
        }

        if (previousButton) {
            previousButton.disabled = current === 0;
        }

        if (nextButton) {

            if (current >= total - 1) {
                nextButton.style.display = "none";
            } else {
                nextButton.style.display = "";
            }
        }
    }

    function nextStep(module) {

        var current;
        var total;

        if (module === "visa") {
            current = visaStep;
            total = visaTotalSteps;
        } else {
            current = dviajerosStep;
            total = dviajerosTotalSteps;
        }

        if (current < total - 1) {

            if (module === "visa") {
                visaStep += 1;
                saveVisa();
                showStep("visa", visaStep);
            } else {
                dviajerosStep += 1;
                saveDviajeros();
                showStep("dviajeros", dviajerosStep);
            }
        }
    }

    function previousStep(module) {

        if (module === "visa") {

            if (visaStep > 0) {
                visaStep -= 1;
                showStep("visa", visaStep);
            }

        } else {

            if (dviajerosStep > 0) {
                dviajerosStep -= 1;
                showStep("dviajeros", dviajerosStep);
            }
        }
    }

    function getValue(id) {

        var element = byId(id);

        if (!element) {
            return "";
        }

        return element.value || "";
    }

    function getChecked(id) {

        var element = byId(id);

        if (!element) {
            return false;
        }

        return Boolean(element.checked);
    }

    function setValue(id, value) {

        var element = byId(id);

        if (element) {
            element.value = value || "";
        }
    }


    function setChecked(id, value) {

        var element = byId(id);

        if (element) {
            element.checked = Boolean(value);
        }
    }

    function saveVisa() {

        var data = {
            nationality: getValue("visaNationality"),
            residence: getValue("visaResidence"),
            passportCountry: getValue("visaPassportCountry"),
            purpose: getValue("visaPurpose"),
            email: getValue("visaEmail"),
            hasPassport: getChecked("visaHasPassport"),
            passportValid: getChecked("visaPassportValid"),
            dualNationality: getChecked("visaDualNationality")
        };

        localStorage.setItem(
            "cu_visa_preparation",
            JSON.stringify(data)
        );
    }

    function loadVisa() {

        var raw = localStorage.getItem("cu_visa_preparation");

        if (!raw) {
            return;
        }

        try {

            var data = JSON.parse(raw);

            setValue("visaNationality", data.nationality);
            setValue("visaResidence", data.residence);
            setValue("visaPassportCountry", data.passportCountry);
            setValue("visaPurpose", data.purpose);
            setValue("visaEmail", data.email);

            setChecked("visaHasPassport", data.hasPassport);
            setChecked("visaPassportValid", data.passportValid);
            setChecked("visaDualNationality", data.dualNationality);

        } catch (error) {
            localStorage.removeItem("cu_visa_preparation");
        }
    }

    function saveDviajeros() {

        var data = {
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

        localStorage.setItem(
            "cu_dviajeros_preparation",
            JSON.stringify(data)
        );
    }

    function loadDviajeros() {

        var raw = localStorage.getItem("cu_dviajeros_preparation");

        if (!raw) {
            return;
        }

        try {

            var data = JSON.parse(raw);

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

        } catch (error) {
            localStorage.removeItem("cu_dviajeros_preparation");
        }
    }

    function buildReviewRow(container, label, value) {

        var row = document.createElement("div");
        row.className = "review-row";

        var title = document.createElement("strong");
        title.textContent = label;

        var content = document.createElement("span");

        if (String(value || "").trim()) {
            content.textContent = value;
            row.classList.add("ready");
        } else {
            content.textContent = language === "es"
                ? "FALTA INFORMACIÓN"
                : "INFORMATION MISSING";

            row.classList.add("missing");
        }

        row.appendChild(title);
        row.appendChild(content);
        container.appendChild(row);
    }

    function buildVisaReview() {

        var container = byId("visaReview");

        if (!container) {
            return;
        }

        container.textContent = "";

        buildReviewRow(
            container,
            translations[language].nationality,
            getValue("visaNationality")
        );

        buildReviewRow(
            container,
            translations[language].residence,
            getValue("visaResidence")
        );

        buildReviewRow(
            container,
            translations[language].passport_country,
            getValue("visaPassportCountry")
        );

        buildReviewRow(
            container,
            translations[language].travel_purpose,
            getValue("visaPurpose")
        );

        buildReviewRow(
            container,
            translations[language].email,
            getValue("visaEmail")
        );

        buildReviewRow(
            container,
            language === "es"
                ? "Pasaporte disponible"
                : "Passport available",
            getChecked("visaHasPassport")
                ? (language === "es" ? "LISTO" : "READY")
                : ""
        );

        buildReviewRow(
            container,
            language === "es"
                ? "Vigencia revisada"
                : "Validity checked",
            getChecked("visaPassportValid")
                ? (language === "es" ? "LISTO" : "READY")
                : ""
        );
    }

    function buildDviajerosReview() {

        var container = byId("dviajerosReview");

        if (!container) {
            return;
        }

        container.textContent = "";

        buildReviewRow(
            container,
            translations[language].first_name,
            getValue("dvFirstName")
        );

        buildReviewRow(
            container,
            translations[language].last_name,
            getValue("dvLastName")
        );

        buildReviewRow(
            container,
            translations[language].nationality,
            getValue("dvNationality")
        );

        buildReviewRow(
            container,
            translations[language].birth_date,
            getValue("dvBirthDate")
        );

        buildReviewRow(
            container,
            translations[language].passport_number,
            getValue("dvPassportNumber")
        );

        buildReviewRow(
            container,
            translations[language].passport_country,
            getValue("dvPassportCountry")
        );

        buildReviewRow(
            container,
            translations[language].arrival_date,
            getValue("dvArrivalDate")
        );

        buildReviewRow(
            container,
            translations[language].flight_number,
            getValue("dvFlightNumber")
        );

        buildReviewRow(
            container,
            translations[language].airline,
            getValue("dvAirline")
        );

        buildReviewRow(
            container,
            translations[language].accommodation,
            getValue("dvAccommodation")
        );

        buildReviewRow(
            container,
            translations[language].address_cuba,
            getValue("dvAddressCuba")
        );
    }

    function copyFromField(id, button) {

        var element = byId(id);

        if (!element) {
            return;
        }

        var value = element.value || "";

        if (!value) {
            return;
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {

            navigator.clipboard.writeText(value)
                .then(function () {
                    showCopyFeedback(button);
                })
                .catch(function () {
                    fallbackCopy(element, button);
                });

        } else {
            fallbackCopy(element, button);
        }
    }

    function fallbackCopy(element, button) {

        element.focus();
        element.select();

        try {
            document.execCommand("copy");
            showCopyFeedback(button);
        } catch (error) {
            return;
        }
    }

    function showCopyFeedback(button) {

        if (!button) {
            return;
        }

        var original = button.getAttribute("data-original-text");

        if (!original) {
            original = button.textContent;
            button.setAttribute("data-original-text", original);
        }

        button.textContent = language === "es"
            ? "¡Copiado!"
            : "Copied!";

        window.setTimeout(function () {

            var saved = button.getAttribute("data-original-text");

            if (saved) {
                button.textContent = saved;
            }

        }, 1200);
    }

    function attachInputSaving() {

        var inputs = document.querySelectorAll(
            "input, textarea, select"
        );

        for (var i = 0; i < inputs.length; i++) {

            inputs[i].addEventListener(
                "input",
                function () {
                    saveVisa();
                    saveDviajeros();
                }
            );

            inputs[i].addEventListener(
                "change",
                function () {
                    saveVisa();
                    saveDviajeros();
                }
            );
        }
    }

    function attachCopyButtons() {

        var buttons = document.querySelectorAll(
            "[data-copy-target]"
        );

        for (var i = 0; i < buttons.length; i++) {

            buttons[i].addEventListener(
                "click",
                function () {

                    var target = this.getAttribute(
                        "data-copy-target"
                    );

                    copyFromField(target, this);
                }
            );
        }
    }

    function attachEvents() {

        var languageButton = byId("languageButton");

        if (languageButton) {

            languageButton.addEventListener(
                "click",
                function () {

                    if (language === "es") {
                        setLanguage("en");
                    } else {
                        setLanguage("es");
                    }
                }
            );
        }

        var visaButton = byId("startVisaButton");

        if (visaButton) {

            visaButton.addEventListener(
                "click",
                function () {
                    showModule("visa");
                }
            );
        }

        var dviajerosButton = byId("startDviajerosButton");

        if (dviajerosButton) {

            dviajerosButton.addEventListener(
                "click",
                function () {
                    showModule("dviajeros");
                }
            );
        }

        var backButtons = document.querySelectorAll(
            "[data-back-home]"
        );

        for (var i = 0; i < backButtons.length; i++) {

            backButtons[i].addEventListener(
                "click",
                function () {
                    showScreen("homeSection");
                }
            );
        }

        var visaPrevious = byId("visaPreviousButton");

        if (visaPrevious) {

            visaPrevious.addEventListener(
                "click",
                function () {
                    previousStep("visa");
                }
            );
        }

        var visaNext = byId("visaNextButton");

        if (visaNext) {

            visaNext.addEventListener(
                "click",
                function () {
                    nextStep("visa");
                }
            );
        }

        var dvPrevious = byId("dviajerosPreviousButton");

        if (dvPrevious) {

            dvPrevious.addEventListener(
                "click",
                function () {
                    previousStep("dviajeros");
                }
            );
        }

        var dvNext = byId("dviajerosNextButton");

        if (dvNext) {

            dvNext.addEventListener(
                "click",
                function () {
                    nextStep("dviajeros");
                }
            );
        }

        var clearVisa = byId("clearVisaButton");

        if (clearVisa) {

            clearVisa.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "cu_visa_preparation"
                    );

                    var visaInputs = document.querySelectorAll(
                        "#visaSection input, #visaSection textarea, #visaSection select"
                    );

                    for (var j = 0; j < visaInputs.length; j++) {

                        if (visaInputs[j].type === "checkbox") {
                            visaInputs[j].checked = false;
                        } else {
                            visaInputs[j].value = "";
                        }
                    }

                    buildVisaReview();
                }
            );
        }

        var clearDviajeros = byId("clearDviajerosButton");

        if (clearDviajeros) {

            clearDviajeros.addEventListener(
                "click",
                function () {

                    localStorage.removeItem(
                        "cu_dviajeros_preparation"
                    );

                    var dvInputs = document.querySelectorAll(
                        "#dviajerosSection input, #dviajerosSection textarea, #dviajerosSection select"
                    );

                    for (var k = 0; k < dvInputs.length; k++) {
                        dvInputs[k].value = "";
                    }

                    buildDviajerosReview();
                }
            );
        }

        attachCopyButtons();
        attachInputSaving();
    }

    loadVisa();
    loadDviajeros();

    attachEvents();

    setLanguage(language);

    showScreen("homeSection");

    console.log("CU CUBA AUTO TRAVEL 2026 - APP.JS CARGADO");
});

}());
