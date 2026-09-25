"use strict";

document.addEventListener("DOMContentLoaded", () => {

```
const OFFICIAL_VISA_URL = "https://evisacuba.cu/";
const OFFICIAL_DVIAJEROS_URL =
    "https://dviajeros.mitrans.gob.cu/";

const VISA_STORAGE = "cuba_auto_travel_2026_visa";
const DV_STORAGE = "cuba_auto_travel_2026_dviajeros";
const LANGUAGE_STORAGE = "cuba_auto_travel_2026_language";

let language =
    localStorage.getItem(LANGUAGE_STORAGE) || "es";

let currentVisaStep = 1;
let currentDvStep = 1;

const translations = {

    es: {
        hero_badge: "TU GUÍA ANTES DE VOLAR",
        hero_title: "Viaja a Cuba sabiendo qué hacer.",
        hero_text:
            "CUBA AUTO TRAVEL te acompaña paso a paso para preparar la Visa electrónica y D'Viajeros antes de entrar en los portales oficiales.",
        flow_understand: "Entender",
        flow_prepare: "Preparar",
        flow_simulate: "Simular",
        flow_do: "Hacer",
        flow_review: "Revisar",

        official_title:
            "¿Quieres ir directamente al sitio oficial?",
        official_text:
            "Se abrirá en otra pestaña. Esta aplicación permanecerá abierta para que puedas consultar, copiar y regresar.",

        module_visa_label: "VISA",
        module_visa_title: "Visa electrónica / eVisa",
        module_visa_text:
            "Aprende qué vas a hacer, prepara tus datos, practica el recorrido y después abre el portal oficial.",
        visa_point_1: "✓ Te explicamos cada etapa",
        visa_point_2: "✓ Preparas tus datos",
        visa_point_3: "✓ Entiendes el pago",
        visa_point_4: "✓ Abres el portal sin cerrar esta app",

        module_dv_label: "VIAJERO",
        module_dv_title: "D'Viajeros",
        module_dv_text:
            "Te guiamos por las secciones del formulario para que llegues preparado y puedas completarlo con rapidez.",
        dv_point_1: "✓ Datos personales",
        dv_point_2: "✓ Información del viaje",
        dv_point_3: "✓ Salud y aduana explicadas",
        dv_point_4: "✓ Revisión antes del QR",

        how_title: "¿Cómo funciona?",
        how_1_title: "Aprende",
        how_1_text:
            "Te explicamos qué estás haciendo y para qué sirve cada parte.",
        how_2_title: "Prepara",
        how_2_text:
            "Colocas aquí tus datos para tenerlos organizados.",
        how_3_title: "Simula",
        how_3_text:
            "Ves el camino antes de entrar al portal real.",
        how_4_title: "Hazlo",
        how_4_text:
            "Abres el sitio oficial en otra pestaña y vuelves cuando necesites ayuda.",

        notice_title: "Importante",
        notice_text:
            "CUBA AUTO TRAVEL 2026 es una aplicación independiente. No emite visas, no genera el QR oficial y no presenta trámites en nombre del viajero. El trámite oficial se realiza directamente en los sitios correspondientes.",

        back: "Volver",
        agent_mode: "MODO ACOMPAÑAMIENTO",

        visa_header: "Vamos a preparar tu Visa paso a paso.",
        visa_header_text:
            "No estás haciendo todavía el trámite oficial. Primero vamos a entenderlo y preparar la información.",

        visa_step_1: "Entender",
        visa_step_2: "Preparar",
        visa_step_3: "Simular",
        visa_step_4: "Pago",
        visa_step_5: "Revisar",
        visa_step_6: "Abrir oficial",

        visa_welcome_title:
            "Primero: tranquilo. Vamos a hacerlo juntos.",
        visa_welcome_text:
            "La Visa electrónica se tramita mediante el sistema correspondiente. Tu trabajo aquí es preparar la información. Después te acompañaremos mientras utilizas el portal oficial.",

        visa_what_title: "¿Qué vas a hacer?",
        visa_what_text:
            "Vas a solicitar una visa electrónica de turismo. El portal oficial te lleva por diferentes etapas. Nuestra aplicación te muestra previamente el camino para que no tengas que descubrirlo por primera vez cuando ya estés intentando hacer el trámite.",

        simulation_title: "SIMULACIÓN",
        simulation_text:
            "Lo que verás aquí es una guía preparada por CUBA AUTO TRAVEL. No es una copia ni reemplaza el formulario oficial.",

        visa_flow_1: "Detalles del trámite",
        visa_flow_2: "Trámites extras",
        visa_flow_3: "Pago",
        visa_flow_4: "Revisar y confirmar",

        continue: "Continuar",
        prepare_title: "Prepara tus datos",
        prepare_text:
            "Estos datos estarán aquí para que puedas consultarlos y copiar cada uno cuando estés en el portal oficial.",

        nationality: "Nacionalidad",
        nationality_help:
            "Escribe tu nacionalidad tal como corresponde a tu documentación.",
        residence: "País de residencia",
        residence_help:
            "El país donde resides actualmente.",
        passport_country: "País que emitió tu pasaporte",
        passport_country_help:
            "Busca esta información en tu pasaporte.",
        travel_purpose: "Motivo del viaje",
        travel_purpose_help:
            "Ten clara la finalidad de tu viaje antes de comenzar.",
        email: "Correo electrónico",
        email_help:
            "Usa un correo que puedas consultar. La comunicación del trámite puede llegar allí.",

        passport_available: "Tengo mi pasaporte disponible",
        passport_available_help:
            "Lo necesitarás para comprobar y copiar sus datos.",
        passport_valid: "He revisado la vigencia",
        passport_valid_help:
            "No marques esto sin haber revisado tu documento.",

        previous: "Anterior",
        continue_simulation: "Preparar simulación",

        simulation_step_title:
            "Ahora vamos a simular el recorrido.",
        simulation_step_text:
            "Así, cuando abras el sitio real, reconocerás la lógica del proceso y sabrás qué estás haciendo.",

        fake_step_1: "Detalles del trámite",
        fake_step_2: "Trámites extras",
        fake_step_3: "Pago",
        fake_step_4: "Revisión",
        fake_form_title: "Detalles del trámite",
        fake_passport_label: "Pasaporte",
        fake_passport_placeholder:
            "Aquí colocarías el dato de tu pasaporte",
        fake_email_label: "Correo electrónico",
        fake_email_placeholder:
            "Aquí colocarías tu correo",
        remember_title: "Recuerda:",
        fake_help:
            "tú puedes volver a esta aplicación para mirar qué dato necesitas y copiarlo.",

        simulation_a_title: "¿Qué haces tú?",
        simulation_a_text:
            "Lees la pregunta del portal, buscas el dato en tu documentación o en la información que preparaste, y lo introduces.",
        simulation_b_title: "¿Te olvidaste de un dato?",
        simulation_b_text:
            "No cierres el portal. Vuelve a esta pestaña, consulta tu información y continúa.",

        understand_payment: "Entender el pago",
        payment_title:
            "El pago: aquí es donde debes prestar atención.",
        payment_text:
            "No asumimos que todos los consulados utilizan el mismo método. La modalidad de pago puede variar según el consulado.",
        payment_alert_title: "IMPORTANTE",
        payment_alert_text:
            "No envíes dinero ni compres un método de pago basándote solamente en esta aplicación. Primero confirma en el portal o consulado que corresponda a tu trámite cuál es la modalidad aceptada y el importe vigente.",

        payment_transfer: "Transferencia",
        payment_transfer_text:
            "Puede aparecer como modalidad disponible dependiendo del consulado. Sigue únicamente las instrucciones oficiales.",
        payment_cash: "Efectivo",
        payment_cash_text:
            "Puede existir como modalidad en determinados lugares. No la des por disponible hasta comprobarlo.",
        payment_money_order: "Money Order",
        payment_money_order_text:
            "Puede aparecer como opción en determinados consulados. Verifica siempre las instrucciones del lugar donde tramitas.",

        agent_tip_title: "Consejo de agente",
        agent_tip_text:
            "Primero confirma quién recibe el pago, cuánto debes pagar, qué método aceptan, a nombre de quién y qué comprobante debes conservar. Después realiza el pago.",

        review_application: "Revisar mi preparación",
        review_title:
            "Antes de abrir el portal, revisemos juntos.",
        review_text:
            "Si algo falta, puedes volver atrás. No tienes que memorizarlo.",
        review_note_title: "Cuando todo esté preparado:",
        review_note_text:
            "abre eVisa Cuba en una nueva pestaña. Mantén esta aplicación abierta. Puedes mirar aquí, copiar un dato, volver al portal y continuar.",

        open_official: "Abrir eVisa oficial",
        official_open_title: "Ya sabes el camino.",
        official_open_text:
            "El portal oficial se abrirá en otra pestaña. Esta aplicación queda aquí para acompañarte.",
        copy_return_1: "Mira el dato",
        copy_return_2: "Cópialo",
        copy_return_3: "Pégalo",
        copy_return_4: "Vuelve si necesitas ayuda",
        open_official_again: "Abrir eVisa oficial",
        finish_home: "Volver al inicio",

        dv_header: "Vamos a preparar D'Viajeros juntos.",
        dv_header_text:
            "La idea no es que llegues al formulario oficial sin saber qué hacer. Primero organizamos la información y recorremos el camino.",

        dv_step_1: "Entender",
        dv_step_2: "Datos personales",
        dv_step_3: "Viaje",
        dv_step_4: "Salud",
        dv_step_5: "Aduana",
        dv_step_6: "Revisar",
        dv_step_7: "Abrir oficial",

        dv_welcome_title:
            "Piensa en esto como si un agente te estuviera preparando antes del aeropuerto.",
        dv_welcome_text:
            "D'Viajeros reúne información que se utiliza en los procesos de entrada a Cuba. Nosotros vamos a organizarla antes de que abras el formulario oficial.",

        dv_what_title: "¿Qué vamos a preparar?",
        dv_road_1: "Quién eres",
        dv_road_2: "Cómo llegas",
        dv_road_3: "Información sanitaria",
        dv_road_4: "Qué declaras",
        dv_road_5: "Revisión y QR",
        dv_simulation_text:
            "No estamos copiando el formulario oficial. Estamos preparando el contenido para que sepas qué hacer cuando estés frente a él.",

        start_prepare: "Empezar a preparar",
        dv_personal_title: "Primero: ¿quién viaja?",
        dv_personal_text:
            "Coloca aquí los datos que quieras tener preparados. Después podrás copiarlos uno por uno.",

        first_name: "Nombre",
        last_name: "Apellidos",
        birth_date: "Fecha de nacimiento",
        passport_number: "Número de pasaporte",
        passport_number_help:
            "Copia exactamente los caracteres del documento.",

        dv_trip_title: "Ahora: ¿cómo llegas a Cuba?",
        dv_trip_text:
            "Ten estos datos preparados antes de abrir el formulario.",
        arrival_date: "Fecha de llegada",
        flight_number: "Número de vuelo",
        flight_help:
            "Puedes encontrarlo en tu boleto o confirmación de vuelo.",
        airline: "Aerolínea",
        origin: "Lugar de procedencia",
        origin_help:
            "Prepara el lugar desde donde comienza tu viaje hacia Cuba.",
        accommodation: "Alojamiento",
        address_cuba: "Dirección en Cuba",
        purpose_trip: "Motivo del viaje",

        where_find_title: "¿Dónde encuentro estos datos?",
        where_find_text:
            "En tu pasaporte, boleto, confirmación de vuelo, reserva de alojamiento o documentos relacionados con tu viaje.",

        continue_health: "Continuar con Salud",
        health_title: "Salud: no adivinamos por ti.",
        health_text:
            "Aquí la aplicación te ayuda a organizar la información. La respuesta final debe ser verdadera y corresponder a tu situación.",
        health_q1_title:
            "¿Tienes alguna información sanitaria que debas declarar?",
        yes: "Sí",
        no: "No",
        not_sure: "No estoy seguro",
        health_q1_help:
            "Si no sabes cómo responder una pregunta sanitaria específica del formulario oficial, no inventes la respuesta. Revísala con la información oficial correspondiente.",
        health_q2_title:
            "Información adicional que quieras preparar",
        health_q2_help:
            "Esto es una ayuda personal. No sustituye las preguntas exactas que aparezcan en el portal oficial.",
        truth_title: "Regla principal",
        truth_text:
            "En salud, responde siempre con la verdad. CUBA AUTO TRAVEL organiza; la declaración oficial la realiza el viajero.",

        continue_customs: "Continuar con Aduana",
        customs_title:
            "Aduana: primero organiza, después declara.",
        customs_text:
            "No vamos a inventar cantidades ni valores. Te ayudamos a pensar qué información necesitas tener lista.",
        customs_q1_title:
            "¿Tienes algo que debas declarar?",
        customs_q2_title:
            "¿Hay información adicional que quieras tener preparada?",
        customs_q2_help:
            "Si tienes dudas sobre una mercancía, cantidad, valor o condición particular, compruébala en la información aduanera oficial antes de declarar.",
        customs_tip_title: "Importante",
        customs_tip_text:
            "Declarar información no significa automáticamente que una persona tenga que pagar. Las consecuencias dependen de la mercancía, cantidad, valor y reglas aplicables.",

        review_dv: "Revisar D'Viajeros",
        dv_review_title:
            "Última revisión antes de abrir D'Viajeros.",
        dv_review_text:
            "Comprueba que tienes preparados los datos principales.",
        dv_review_note_title: "Después:",
        dv_review_note_text:
            "abre D'Viajeros en una nueva pestaña. Mantén CUBA AUTO TRAVEL abierta para consultar y copiar información.",
        open_dv_official: "Abrir D'Viajeros oficial",

        dv_official_title:
            "Ya estás preparado para entrar al formulario oficial.",
        dv_official_text:
            "D'Viajeros se abrirá en otra pestaña. Esta aplicación seguirá disponible para ayudarte.",
        open_dv_again: "Abrir D'Viajeros oficial",

        footer_text:
            "Aplicación independiente de preparación y acompañamiento."
    },

    en: {
        hero_badge: "YOUR GUIDE BEFORE YOU FLY",
        hero_title: "Travel to Cuba knowing what to do.",
        hero_text:
            "CUBA AUTO TRAVEL guides you step by step to prepare your electronic Visa and D'Viajeros before entering the official portals.",
        flow_understand: "Understand",
        flow_prepare: "Prepare",
        flow_simulate: "Simulate",
        flow_do: "Do it",
        flow_review: "Review",

        official_title: "Want to go directly to the official site?",
        official_text:
            "It will open in another tab. This application will remain open so you can consult, copy and return.",

        module_visa_label: "VISA",
        module_visa_title: "Electronic Visa / eVisa",
        module_visa_text:
            "Learn what you are going to do, prepare your information, practice the process and then open the official portal.",
        visa_point_1: "✓ We explain each stage",
        visa_point_2: "✓ Prepare your information",
        visa_point_3: "✓ Understand the payment step",
        visa_point_4: "✓ Open the portal without closing this app",

        module_dv_label: "TRAVELER",
        module_dv_title: "D'Viajeros",
        module_dv_text:
            "We guide you through the form sections so you arrive prepared and can complete it efficiently.",
        dv_point_1: "✓ Personal information",
        dv_point_2: "✓ Travel information",
        dv_point_3: "✓ Health and customs explained",
        dv_point_4: "✓ Review before the QR",

        how_title: "How does it work?",
        how_1_title: "Learn",
        how_1_text:
            "We explain what you are doing and why each part matters.",
        how_2_title: "Prepare",
        how_2_text:
            "Enter your information here so it stays organized.",
        how_3_title: "Simulate",
        how_3_text:
            "See the path before entering the real portal.",
        how_4_title: "Do it",
        how_4_text:
            "Open the official site in another tab and return whenever you need help.",

        notice_title: "Important",
        notice_text:
            "CUBA AUTO TRAVEL 2026 is an independent application. It does not issue visas, generate the official QR or submit applications on behalf of the traveler. The official process is completed directly on the corresponding sites.",

        back: "Back",
        agent_mode: "GUIDED MODE",

        visa_header: "Let's prepare your Visa step by step.",
        visa_header_text:
            "You are not completing the official process yet. First we will understand it and prepare your information.",

        visa_step_1: "Understand",
        visa_step_2: "Prepare",
        visa_step_3: "Simulate",
        visa_step_4: "Payment",
        visa_step_5: "Review",
        visa_step_6: "Open official",

        visa_welcome_title:
            "First: relax. We will do it together.",
        visa_welcome_text:
            "The electronic Visa is processed through the corresponding system. Your job here is to prepare the information. Then we will accompany you while you use the official portal.",

        visa_what_title: "What are you going to do?",
        visa_what_text:
            "You are going to request an electronic tourist visa. The official portal takes you through different stages. Our application shows you the path first so you do not have to discover it for the first time while trying to complete the process.",

        simulation_title: "SIMULATION",
        simulation_text:
            "What you see here is a guide prepared by CUBA AUTO TRAVEL. It is not a copy of and does not replace the official form.",

        visa_flow_1: "Application details",
        visa_flow_2: "Extra procedures",
        visa_flow_3: "Payment",
        visa_flow_4: "Review and confirm",

        continue: "Continue",
        prepare_title: "Prepare your information",
        prepare_text:
            "Keep these details here so you can consult and copy each one while using the official portal.",

        nationality: "Nationality",
        nationality_help:
            "Enter your nationality according to your travel documentation.",
        residence: "Country of residence",
        residence_help:
            "The country where you currently live.",
        passport_country: "Passport issuing country",
        passport_country_help:
            "Find this information in your passport.",
        travel_purpose: "Purpose of travel",
        travel_purpose_help:
            "Know the purpose of your trip before starting.",
        email: "Email address",
        email_help:
            "Use an email account you can access. Process communications may arrive there.",

        passport_available: "I have my passport available",
        passport_available_help:
            "You will need it to check and copy its information.",
        passport_valid: "I have checked its validity",
        passport_valid_help:
            "Do not select this unless you have checked your document.",

        previous: "Previous",
        continue_simulation: "Prepare simulation",

        simulation_step_title:
            "Now let's simulate the process.",
        simulation_step_text:
            "That way, when you open the real site, you will recognize the process and know what you are doing.",

        fake_step_1: "Application details",
        fake_step_2: "Extra procedures",
        fake_step_3: "Payment",
        fake_step_4: "Review",
        fake_form_title: "Application details",
        fake_passport_label: "Passport",
        fake_passport_placeholder:
            "This is where you would enter your passport information",
        fake_email_label: "Email address",
        fake_email_placeholder:
            "This is where you would enter your email",
        remember_title: "Remember:",
        fake_help:
            "you can return to this application to see which information you need and copy it.",

        simulation_a_title: "What do you do?",
        simulation_a_text:
            "Read the portal question, find the information in your documents or in the information you prepared, and enter it.",
        simulation_b_title: "Forgot something?",
        simulation_b_text:
            "Do not close the portal. Return to this tab, check your information and continue.",

        understand_payment: "Understand payment",
        payment_title:
            "Payment: this is where you should pay attention.",
        payment_text:
            "We do not assume every consulate uses the same method. The payment method may vary by consulate.",
        payment_alert_title: "IMPORTANT",
        payment_alert_text:
            "Do not send money or purchase a payment method based only on this application. First confirm with the applicable official portal or consulate which method is accepted and the current amount.",

        payment_transfer: "Transfer",
        payment_transfer_text:
            "It may appear as an available method depending on the consulate. Follow only the official instructions.",
        payment_cash: "Cash",
        payment_cash_text:
            "It may be available in certain locations. Do not assume it is available until you confirm it.",
        payment_money_order: "Money Order",
        payment_money_order_text:
            "It may appear as an option at certain consulates. Always verify the instructions for your processing location.",

        agent_tip_title: "Agent tip",
        agent_tip_text:
            "First confirm who receives the payment, how much you must pay, which method they accept, who it should be payable to and which receipt you should keep. Then make the payment.",

        review_application: "Review my preparation",
        review_title:
            "Before opening the portal, let's review together.",
        review_text:
            "If something is missing, you can go back. You do not have to memorize anything.",
        review_note_title: "When everything is ready:",
        review_note_text:
            "open eVisa Cuba in a new tab. Keep this application open. You can look here, copy information, return to the portal and continue.",

        open_official: "Open official eVisa",
        official_open_title: "Now you know the path.",
        official_open_text:
            "The official portal will open in another tab. This application stays here to guide you.",
        copy_return_1: "Look",
        copy_return_2: "Copy",
        copy_return_3: "Paste",
        copy_return_4: "Return if you need help",
        open_official_again: "Open official eVisa",
        finish_home: "Return home",

        dv_header: "Let's prepare D'Viajeros together.",
        dv_header_text:
            "The goal is not to arrive at the official form without knowing what to do. First we organize the information and walk through the process.",

        dv_step_1: "Understand",
        dv_step_2: "Personal",
        dv_step_3: "Travel",
        dv_step_4: "Health",
        dv_step_5: "Customs",
        dv_step_6: "Review",
        dv_step_7: "Open official",

        dv_welcome_title:
            "Think of this as an agent preparing you before the airport.",
        dv_welcome_text:
            "D'Viajeros gathers information used in Cuba's entry processes. We will organize it before you open the official form.",

        dv_what_title: "What are we preparing?",
        dv_road_1: "Who you are",
        dv_road_2: "How you arrive",
        dv_road_3: "Health information",
        dv_road_4: "What you declare",
        dv_road_5: "Review and QR",
        dv_simulation_text:
            "We are not copying the official form. We are preparing the information so you know what to do when you face it.",

        start_prepare: "Start preparing",
        dv_personal_title: "First: who is traveling?",
        dv_personal_text:
            "Enter the information you want to have prepared. You can then copy each item individually.",

        first_name: "First name",
        last_name: "Last name",
        birth_date: "Date of birth",
        passport_number: "Passport number",
        passport_number_help:
            "Copy the characters exactly as they appear on the document.",

        dv_trip_title: "Now: how are you arriving in Cuba?",
        dv_trip_text:
            "Have these details ready before opening the form.",
        arrival_date: "Arrival date",
        flight_number: "Flight number",
        flight_help:
            "You can find it on your ticket or flight confirmation.",
        airline: "Airline",
        origin: "Place of departure",
        origin_help:
            "Prepare the place where your journey to Cuba begins.",
        accommodation: "Accommodation",
        address_cuba: "Address in Cuba",
        purpose_trip: "Purpose of trip",

        where_find_title: "Where can I find these details?",
        where_find_text:
            "In your passport, ticket, flight confirmation, accommodation reservation or other travel documents.",

        continue_health: "Continue to Health",
        health_title: "Health: we do not guess for you.",
        health_text:
            "The application helps you organize information. Your final answer must be truthful and match your situation.",
        health_q1_title:
            "Do you have health information that you need to declare?",
        yes: "Yes",
        no: "No",
        not_sure: "Not sure",
        health_q1_help:
            "If you do not know how to answer a specific health question in the official form, do not guess. Check the applicable official information.",
        health_q2_title:
            "Additional information you want to prepare",
        health_q2_help:
            "This is a personal preparation aid. It does not replace the exact questions shown on the official portal.",
        truth_title: "Main rule",
        truth_text:
            "For health information, always answer truthfully. CUBA AUTO TRAVEL organizes; the traveler makes the official declaration.",

        continue_customs: "Continue to Customs",
        customs_title:
            "Customs: organize first, then declare.",
        customs_text:
            "We will not invent quantities or values. We help you identify what information you need to have ready.",
        customs_q1_title:
            "Do you have anything you need to declare?",
        customs_q2_title:
            "Is there additional information you want to prepare?",
        customs_q2_help:
            "If you have questions about an item, quantity, value or special condition, verify it in the official customs information before declaring.",
        customs_tip_title: "Important",
        customs_tip_text:
            "Declaring information does not automatically mean that you must pay. Consequences depend on the item, quantity, value and applicable rules.",

        review_dv: "Review D'Viajeros",
        dv_review_title:
            "Final review before opening D'Viajeros.",
        dv_review_text:
            "Check that your main information is prepared.",
        dv_review_note_title: "After that:",
        dv_review_note_text:
            "open D'Viajeros in a new tab. Keep CUBA AUTO TRAVEL open so you can consult and copy information.",
        open_dv_official: "Open official D'Viajeros",

        dv_official_title:
            "You are ready to enter the official form.",
        dv_official_text:
            "D'Viajeros will open in another tab. This application will remain available to help you.",
        open_dv_again: "Open official D'Viajeros",

        footer_text:
            "Independent preparation and guidance application."
    }
};


function translatePage() {
    document.documentElement.lang = language;

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const key = element.dataset.i18n;
        if (
            Object.prototype.hasOwnProperty.call(
                translations[language],
                key
            )
        ) {
            element.textContent =
                translations[language][key];
        }
    });

    document.querySelectorAll("[data-placeholder-es]").forEach(element => {
        element.placeholder =
            language === "es"
                ? element.dataset.placeholderEs
                : element.dataset.placeholderEn;
    });

    const languageButton =
        document.getElementById("languageToggle");

    if (languageButton) {
        languageButton.textContent =
            language === "es"
                ? "ENGLISH"
                : "ESPAÑOL";
    }

    localStorage.setItem(
        LANGUAGE_STORAGE,
        language
    );
}


function openOfficial(url) {
    window.open(
        url,
        "_blank",
        "noopener,noreferrer"
    );
}


function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    const target = document.getElementById(id);

    if (target) {
        target.classList.add("active");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


function setVisaStep(step) {
    currentVisaStep = Number(step);

    document.querySelectorAll("[data-step-panel]").forEach(panel => {
        panel.classList.toggle(
            "active",
            Number(panel.dataset.stepPanel) === currentVisaStep
        );
    });

    document.querySelectorAll(".step-link[data-step]").forEach(link => {
        link.classList.toggle(
            "active",
            Number(link.dataset.step) === currentVisaStep
        );
    });

    if (currentVisaStep === 5) {
        renderVisaReview();
    }

    saveVisa();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function setDvStep(step) {
    currentDvStep = Number(step);

    document.querySelectorAll("[data-dv-panel]").forEach(panel => {
        panel.classList.toggle(
            "active",
            Number(panel.dataset.dvPanel) === currentDvStep
        );
    });

    document.querySelectorAll(".dv-step-link").forEach(link => {
        link.classList.toggle(
            "active",
            Number(link.dataset.dvStep) === currentDvStep
        );
    });

    if (currentDvStep === 6) {
        renderDvReview();
    }

    saveDviajeros();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function value(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : "";
}


function checked(id) {
    const element = document.getElementById(id);
    return element ? element.checked : false;
}


function setValue(id, val) {
    const element = document.getElementById(id);
    if (element && val !== undefined && val !== null) {
        element.value = val;
    }
}


function saveVisa() {
    const data = {
        nationality: value("visaNationality"),
        country_of_residence: value("visaResidence"),
        passport_country: value("visaPassportCountry"),
        travel_purpose: value("visaPurpose"),
        email: value("visaEmail"),
        has_passport: checked("visaHasPassport"),
        passport_valid: checked("visaPassportValid")
    };

    localStorage.setItem(
        VISA_STORAGE,
        JSON.stringify(data)
    );
}


function loadVisa() {
    try {
        const data = JSON.parse(
            localStorage.getItem(VISA_STORAGE) || "{}"
        );

        setValue("visaNationality", data.nationality);
        setValue("visaResidence", data.country_of_residence);
        setValue("visaPassportCountry", data.passport_country);
        setValue("visaPurpose", data.travel_purpose);
        setValue("visaEmail", data.email);

        const passport =
            document.getElementById("visaHasPassport");

        const valid =
            document.getElementById("visaPassportValid");

        if (passport) {
            passport.checked = Boolean(
                data.has_passport
            );
        }

        if (valid) {
            valid.checked = Boolean(
                data.passport_valid
            );
        }

    } catch {
        localStorage.removeItem(VISA_STORAGE);
    }
}


function saveDviajeros() {
    const healthRadio =
        document.querySelector(
            'input[name="healthDeclaration"]:checked'
        );

    const customsRadio =
        document.querySelector(
            'input[name="customsDeclaration"]:checked'
        );

    const data = {
        first_name: value("dvFirstName"),
        last_name: value("dvLastName"),
        nationality: value("dvNationality"),
        date_of_birth: value("dvBirthDate"),
        passport_number: value("dvPassport"),
        passport_country: value("dvPassportCountry"),
        arrival_date: value("dvArrivalDate"),
        flight_number: value("dvFlight"),
        airline: value("dvAirline"),
        origin: value("dvOrigin"),
        accommodation: value("dvAccommodation"),
        address_in_cuba: value("dvAddress"),
        purpose_of_trip: value("dvPurpose"),
        health_declaration:
            healthRadio ? healthRadio.value : "",
        health_notes: value("dvHealthNotes"),
        customs_declaration:
            customsRadio ? customsRadio.value : "",
        customs_notes: value("dvCustomsNotes")
    };

    localStorage.setItem(
        DV_STORAGE,
        JSON.stringify(data)
    );
}


function loadDviajeros() {
    try {
        const data = JSON.parse(
            localStorage.getItem(DV_STORAGE) || "{}"
        );

        const mapping = {
            first_name: "dvFirstName",
            last_name: "dvLastName",
            nationality: "dvNationality",
            date_of_birth: "dvBirthDate",
            passport_number: "dvPassport",
            passport_country: "dvPassportCountry",
            arrival_date: "dvArrivalDate",
            flight_number: "dvFlight",
            airline: "dvAirline",
            origin: "dvOrigin",
            accommodation: "dvAccommodation",
            address_in_cuba: "dvAddress",
            purpose_of_trip: "dvPurpose",
            health_notes: "dvHealthNotes",
            customs_notes: "dvCustomsNotes"
        };

        Object.entries(mapping).forEach(
            ([key, id]) => {
                setValue(id, data[key]);
            }
        );

        if (data.health_declaration) {
            const radio = document.querySelector(
                `input[name="healthDeclaration"][value="${data.health_declaration}"]`
            );
            if (radio) {
                radio.checked = true;
            }
        }

        if (data.customs_declaration) {
            const radio = document.querySelector(
                `input[name="customsDeclaration"][value="${data.customs_declaration}"]`
            );
            if (radio) {
                radio.checked = true;
            }
        }

    } catch {
        localStorage.removeItem(DV_STORAGE);
    }
}


async function copyField(id, button) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    const text =
        element.value ||
        element.textContent ||
        "";

    if (!text.trim()) {
        button.textContent =
            language === "es"
                ? "Vacío"
                : "Empty";

        setTimeout(() => {
            button.textContent =
                language === "es"
                    ? "Copiar"
                    : "Copy";
        }, 1200);

        return;
    }

    try {
        await navigator.clipboard.writeText(text);

        button.textContent =
            language === "es"
                ? "¡Copiado!"
                : "Copied!";

    } catch {
        const temp =
            document.createElement("textarea");

        temp.value = text;
        temp.style.position = "fixed";
        temp.style.opacity = "0";

        document.body.appendChild(temp);
        temp.focus();
        temp.select();

        try {
            document.execCommand("copy");

            button.textContent =
                language === "es"
                    ? "¡Copiado!"
                    : "Copied!";
        } catch {
            button.textContent =
                language === "es"
                    ? "Selecciona"
                    : "Select";
        }

        temp.remove();
    }

    setTimeout(() => {
        button.textContent =
            language === "es"
                ? "Copiar"
                : "Copy";
    }, 1400);
}


function renderVisaReview() {
    const container =
        document.getElementById("visaReview");

    if (!container) {
        return;
    }

    const fields = [
        ["visaNationality", "nationality"],
        ["visaResidence", "residence"],
        ["visaPassportCountry", "passport_country"],
        ["visaPurpose", "travel_purpose"],
        ["visaEmail", "email"]
    ];

    container.innerHTML = "";

    fields.forEach(([id, key]) => {
        const currentValue = value(id);
        const ready = Boolean(currentValue);

        const row =
            document.createElement("div");

        row.className =
            `review-item ${ready ? "ready" : "missing"}`;

        row.innerHTML = `
            <div>
                <strong>${translations[language][key]}</strong>
                <small>${ready ? escapeHtml(currentValue) : (
                    language === "es"
                        ? "Falta información"
                        : "Information missing"
                )}</small>
            </div>
            <span class="review-status">
                ${ready
                    ? (language === "es" ? "LISTO" : "READY")
                    : (language === "es" ? "FALTA" : "MISSING")}
            </span>
        `;

        container.appendChild(row);
    });

    const passportRow =
        document.createElement("div");

    passportRow.className =
        `review-item ${
            checked("visaHasPassport")
                ? "ready"
                : "missing"
        }`;

    passportRow.innerHTML = `
        <div>
            <strong>${
                language === "es"
                    ? "Pasaporte disponible"
                    : "Passport available"
            }</strong>
            <small>${
                checked("visaHasPassport")
                    ? (language === "es"
                        ? "Indicado por el viajero"
                        : "Confirmed by traveler")
                    : (language === "es"
                        ? "Comprueba que lo tienes contigo"
                        : "Make sure you have it available")
            }</small>
        </div>
        <span class="review-status">
            ${
                checked("visaHasPassport")
                    ? (language === "es" ? "LISTO" : "READY")
                    : (language === "es" ? "REVISAR" : "REVIEW")
            }
        </span>
    `;

    container.appendChild(passportRow);

    const validityRow =
        document.createElement("div");

    validityRow.className =
        `review-item ${
            checked("visaPassportValid")
                ? "ready"
                : "missing"
        }`;

    validityRow.innerHTML = `
        <div>
            <strong>${
                language === "es"
                    ? "Vigencia revisada"
                    : "Validity checked"
            }</strong>
            <small>${
                checked("visaPassportValid")
                    ? (language === "es"
                        ? "Indicado por el viajero"
                        : "Confirmed by traveler")
                    : (language === "es"
                        ? "Debes revisar tu documento"
                        : "You should check your document")
            }</small>
        </div>
        <span class="review-status">
            ${
                checked("visaPassportValid")
                    ? (language === "es" ? "LISTO" : "READY")
                    : (language === "es" ? "REVISAR" : "REVIEW")
            }
        </span>
    `;

    container.appendChild(validityRow);
}


function renderDvReview() {
    const container =
        document.getElementById("dvReview");

    if (!container) {
        return;
    }

    const fields = [
        ["dvFirstName", "first_name"],
        ["dvLastName", "last_name"],
        ["dvNationality", "nationality"],
        ["dvBirthDate", "birth_date"],
        ["dvPassport", "passport_number"],
        ["dvPassportCountry", "passport_country"],
        ["dvArrivalDate", "arrival_date"],
        ["dvFlight", "flight_number"],
        ["dvAirline", "airline"]
    ];

    container.innerHTML = "";

    fields.forEach(([id, key]) => {
        const currentValue = value(id);
        const ready = Boolean(currentValue);

        const row =
            document.createElement("div");

        row.className =
            `review-item ${ready ? "ready" : "missing"}`;

        row.innerHTML = `
            <div>
                <strong>${translations[language][key]}</strong>
                <small>${ready ? escapeHtml(currentValue) : (
                    language === "es"
                        ? "Falta información"
                        : "Information missing"
                )}</small>
            </div>
            <span class="review-status">
                ${ready
                    ? (language === "es" ? "LISTO" : "READY")
                    : (language === "es" ? "FALTA" : "MISSING")}
            </span>
        `;

        container.appendChild(row);
    });

    const health =
        document.querySelector(
            'input[name="healthDeclaration"]:checked'
        );

    const customs =
        document.querySelector(
            'input[name="customsDeclaration"]:checked'
        );

    addReviewChoice(
        container,
        language === "es"
            ? "Preparación de salud"
            : "Health preparation",
        health
            ? health.value
            : "",
        "health"
    );

    addReviewChoice(
        container,
        language === "es"
            ? "Preparación de aduana"
            : "Customs preparation",
        customs
            ? customs.value
            : "",
        "customs"
    );
}


function addReviewChoice(
    container,
    title,
    selected,
    type
) {
    const row =
        document.createElement("div");

    const ready = Boolean(selected);

    const display = {
        yes: language === "es" ? "Sí" : "Yes",
        no: language === "es" ? "No" : "No",
        review: language === "es"
            ? "No estoy seguro"
            : "Not sure"
    };

    row.className =
        `review-item ${ready ? "ready" : "missing"}`;

    row.innerHTML = `
        <div>
            <strong>${title}</strong>
            <small>${
                ready
                    ? display[selected]
                    : (
                        language === "es"
                            ? "Revisar"
                            : "Review"
                    )
            }</small>
        </div>
        <span class="review-status">
            ${
                ready
                    ? (language === "es"
                        ? "LISTO"
                        : "READY")
                    : (language === "es"
                        ? "REVISAR"
                        : "REVIEW")
            }
        </span>
    `;

    container.appendChild(row);
}


function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function bindNavigation() {

    document
        .getElementById("homeButton")
        ?.addEventListener(
            "click",
            () => showScreen("homeSection")
        );

    document
        .getElementById("startVisa")
        ?.addEventListener(
            "click",
            () => {
                showScreen("visaSection");
                setVisaStep(1);
            }
        );

    document
        .getElementById("startDviajeros")
        ?.addEventListener(
            "click",
            () => {
                showScreen("dviajerosSection");
                setDvStep(1);
            }
        );

    document
        .getElementById("visaBack")
        ?.addEventListener(
            "click",
            () => showScreen("homeSection")
        );

    document
        .getElementById("dviajerosBack")
        ?.addEventListener(
            "click",
            () => showScreen("homeSection")
        );

    document
        .getElementById("visaHome")
        ?.addEventListener(
            "click",
            () => showScreen("homeSection")
        );

    document
        .getElementById("dvHome")
        ?.addEventListener(
            "click",
            () => showScreen("homeSection")
        );
}


function bindOfficialButtons() {

    [
        "openVisaTop",
        "visaOpenOfficial",
        "visaOpenOfficialAgain"
    ].forEach(id => {
        document
            .getElementById(id)
            ?.addEventListener(
                "click",
                () => openOfficial(
                    OFFICIAL_VISA_URL
                )
            );
    });

    [
        "openDviajerosTop",
        "dvOpenOfficial",
        "dvOpenOfficialAgain"
    ].forEach(id => {
        document
            .getElementById(id)
            ?.addEventListener(
                "click",
                () => openOfficial(
                    OFFICIAL_DVIAJEROS_URL
                )
            );
    });
}


function bindVisaSteps() {

    document.querySelectorAll(
        ".step-link[data-step]"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => setVisaStep(
                button.dataset.step
            )
        );
    });

    document.querySelectorAll(
        ".next-step"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => setVisaStep(
                button.dataset.next
            )
        );
    });

    document.querySelectorAll(
        ".prev-step"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => setVisaStep(
                button.dataset.prev
            )
        );
    });
}


function bindDvSteps() {

    document.querySelectorAll(
        ".dv-step-link"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => setDvStep(
                button.dataset.dvStep
            )
        );
    });

    document.querySelectorAll(
        ".next-dv-step"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => setDvStep(
                button.dataset.next
            )
        );
    });

    document.querySelectorAll(
        ".prev-dv-step"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => setDvStep(
                button.dataset.prev
            )
        );
    });
}


function bindAutoSave() {

    document.querySelectorAll(
        "#visaSection input"
    ).forEach(element => {
        element.addEventListener(
            "input",
            saveVisa
        );

        element.addEventListener(
            "change",
            saveVisa
        );
    });

    document.querySelectorAll(
        "#dviajerosSection input, #dviajerosSection textarea"
    ).forEach(element => {
        element.addEventListener(
            "input",
            saveDviajeros
        );

        element.addEventListener(
            "change",
            saveDviajeros
        );
    });
}


function bindCopyButtons() {
    document.querySelectorAll(
        ".copy-field"
    ).forEach(button => {
        button.addEventListener(
            "click",
            () => copyField(
                button.dataset.copy,
                button
            )
        );
    });
}


function bindLanguage() {
    document
        .getElementById("languageToggle")
        ?.addEventListener(
            "click",
            () => {
                language =
                    language === "es"
                        ? "en"
                        : "es";

                translatePage();

                if (
                    document
                        .getElementById("visaSection")
                        ?.classList.contains("active")
                    && currentVisaStep === 5
                ) {
                    renderVisaReview();
                }

                if (
                    document
                        .getElementById("dviajerosSection")
                        ?.classList.contains("active")
                    && currentDvStep === 6
                ) {
                    renderDvReview();
                }
            }
        );
}


loadVisa();
loadDviajeros();

bindNavigation();
bindOfficialButtons();
bindVisaSteps();
bindDvSteps();
bindAutoSave();
bindCopyButtons();
bindLanguage();

translatePage();
setVisaStep(1);
setDvStep(1);
```

});
