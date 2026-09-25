"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const VISA_URL = "https://evisacuba.cu/";
    const DVIJEROS_URL = "https://dviajeros.mitrans.gob.cu/";

    const VISA_STORAGE_KEY = "cuba_auto_travel_2026_visa";
    const DVIJEROS_STORAGE_KEY = "cuba_auto_travel_2026_dviajeros";

    const homeSection = document.getElementById("home-section");
    const visaSection = document.getElementById("visa-section");
    const dviajerosSection = document.getElementById("dviajeros-section");

    const visaButton = document.getElementById("visa-button");
    const dviajerosButton = document.getElementById("dviajeros-button");

    const visaBack = document.getElementById("visa-back");
    const dviajerosBack = document.getElementById("dviajeros-back");

    const visaForm = document.getElementById("visa-form");
    const dviajerosForm = document.getElementById("dviajeros-form");

    function hideAllSections() {
        homeSection.classList.add("hidden");
        visaSection.classList.add("hidden");
        dviajerosSection.classList.add("hidden");
    }

    function showHome() {
        hideAllSections();
        homeSection.classList.remove("hidden");
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function showVisa() {
        hideAllSections();
        visaSection.classList.remove("hidden");
        loadForm(
            visaForm,
            VISA_STORAGE_KEY
        );
        updateProgress(
            visaForm,
            "visa-progress",
            "visa-progress-bar"
        );
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function showDViajeros() {
        hideAllSections();
        dviajerosSection.classList.remove("hidden");
        loadForm(
            dviajerosForm,
            DVIJEROS_STORAGE_KEY
        );
        updateProgress(
            dviajerosForm,
            "dviajeros-progress",
            "dviajeros-progress-bar"
        );
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    function getFormData(form) {
        const data = {};

        form.querySelectorAll(
            "input, textarea, select"
        ).forEach(function (field) {
            if (!field.name) {
                return;
            }

            if (field.type === "checkbox") {
                data[field.name] = field.checked;
            } else {
                data[field.name] = field.value;
            }
        });

        return data;
    }

    function saveForm(form, storageKey) {
        try {
            const data = getFormData(form);

            localStorage.setItem(
                storageKey,
                JSON.stringify(data)
            );
        } catch (error) {
            console.warn(
                "No se pudo guardar la información localmente.",
                error
            );
        }
    }

    function loadForm(form, storageKey) {
        try {
            const saved = localStorage.getItem(storageKey);

            if (!saved) {
                return;
            }

            const data = JSON.parse(saved);

            if (
                !data ||
                typeof data !== "object"
            ) {
                return;
            }

            form.querySelectorAll(
                "input, textarea, select"
            ).forEach(function (field) {
                if (!field.name) {
                    return;
                }

                if (
                    !Object.prototype.hasOwnProperty.call(
                        data,
                        field.name
                    )
                ) {
                    return;
                }

                if (field.type === "checkbox") {
                    field.checked = Boolean(
                        data[field.name]
                    );
                } else {
                    field.value =
                        data[field.name] ?? "";
                }
            });
        } catch (error) {
            console.warn(
                "No se pudo cargar la información guardada.",
                error
            );
        }
    }

    function updateProgress(
        form,
        textId,
        barId
    ) {
        const fields = Array.from(
            form.querySelectorAll(
                "input:not([type='checkbox']), textarea, select"
            )
        );

        const checkboxes = Array.from(
            form.querySelectorAll(
                "input[type='checkbox']"
            )
        );

        const total =
            fields.length + checkboxes.length;

        if (!total) {
            return;
        }

        let completed = 0;

        fields.forEach(function (field) {
            if (
                String(field.value || "").trim()
            ) {
                completed += 1;
            }
        });

        checkboxes.forEach(function (field) {
            if (field.checked) {
                completed += 1;
            }
        });

        const percentage = Math.round(
            (completed / total) * 100
        );

        const textElement =
            document.getElementById(textId);

        const barElement =
            document.getElementById(barId);

        if (textElement) {
            textElement.textContent =
                percentage + "% completado";
        }

        if (barElement) {
            barElement.style.width =
                percentage + "%";
        }
    }

    function showStatus(
        elementId,
        message,
        type
    ) {
        const element =
            document.getElementById(elementId);

        if (!element) {
            return;
        }

        element.className =
            "status-message " + type;

        element.textContent = message;
    }

    function getMissingFields(
        form,
        requiredNames
    ) {
        const missing = [];

        requiredNames.forEach(function (name) {
            const field = form.elements[name];

            if (!field) {
                return;
            }

            if (
                field.type === "checkbox"
            ) {
                if (!field.checked) {
                    missing.push(name);
                }
                return;
            }

            if (
                !String(field.value || "").trim()
            ) {
                missing.push(name);
            }
        });

        return missing;
    }

    function reviewVisa() {
        saveForm(
            visaForm,
            VISA_STORAGE_KEY
        );

        const required = [
            "nationality",
            "country_of_residence",
            "passport_country",
            "travel_purpose",
            "email"
        ];

        const missing =
            getMissingFields(
                visaForm,
                required
            );

        const hasPassport =
            document.getElementById(
                "visa-has-passport"
            ).checked;

        const passportValid =
            document.getElementById(
                "visa-passport-valid"
            ).checked;

        if (missing.length > 0) {
            showStatus(
                "visa-status",
                "FALTA INFORMACIÓN. Completa los campos principales antes de continuar.",
                "warning"
            );
            return;
        }

        if (!hasPassport) {
            showStatus(
                "visa-status",
                "REVISAR. Debes tener tu pasaporte disponible antes de continuar.",
                "warning"
            );
            return;
        }

        if (!passportValid) {
            showStatus(
                "visa-status",
                "REVISAR. Verifica la vigencia de tu pasaporte según las instrucciones oficiales.",
                "warning"
            );
            return;
        }

        showStatus(
            "visa-status",
            "LISTO PARA CONTINUAR. Revisa nuevamente tus datos y, cuando estés preparado, abre el portal oficial.",
            "success"
        );
    }

    function reviewDViajeros() {
        saveForm(
            dviajerosForm,
            DVIJEROS_STORAGE_KEY
        );

        const required = [
            "first_name",
            "last_name",
            "nationality",
            "date_of_birth",
            "passport_number",
            "passport_country",
            "arrival_date",
            "flight_number",
            "airline"
        ];

        const missing =
            getMissingFields(
                dviajerosForm,
                required
            );

        if (missing.length > 0) {
            showStatus(
                "dviajeros-status",
                "FALTA INFORMACIÓN. Completa los datos principales del viajero y del viaje antes de continuar.",
                "warning"
            );
            return;
        }

        showStatus(
            "dviajeros-status",
            "LISTO PARA CONTINUAR. Revisa nuevamente tus datos y abre D'Viajeros cuando estés preparado.",
            "success"
        );
    }

    function clearForm(
        form,
        storageKey,
        statusId
    ) {
        form.reset();

        try {
            localStorage.removeItem(
                storageKey
            );
        } catch (error) {
            console.warn(
                "No se pudo eliminar la información local.",
                error
            );
        }

        const status =
            document.getElementById(statusId);

        if (status) {
            status.className =
                "status-message hidden";
            status.textContent = "";
        }
    }

    async function copyField(fieldId, button) {
        const field =
            document.getElementById(fieldId);

        if (!field) {
            return;
        }

        const value =
            String(field.value || "").trim();

        if (!value) {
            button.textContent =
                "Vacío";

            setTimeout(function () {
                button.textContent =
                    "Copiar";
            }, 1200);

            return;
        }

        try {
            await navigator.clipboard.writeText(
                value
            );

            button.textContent =
                "Copiado";

            setTimeout(function () {
                button.textContent =
                    "Copiar";
            }, 1200);

        } catch (error) {
            const temporary =
                document.createElement("textarea");

            temporary.value = value;
            temporary.style.position = "fixed";
            temporary.style.opacity = "0";

            document.body.appendChild(
                temporary
            );

            temporary.focus();
            temporary.select();

            try {
                document.execCommand("copy");

                button.textContent =
                    "Copiado";
            } catch (copyError) {
                button.textContent =
                    "No se pudo copiar";
            }

            document.body.removeChild(
                temporary
            );

            setTimeout(function () {
                button.textContent =
                    "Copiar";
            }, 1400);
        }
    }

    function openOfficialPortal(url) {
        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    }

    visaButton.addEventListener(
        "click",
        showVisa
    );

    dviajerosButton.addEventListener(
        "click",
        showDViajeros
    );

    visaBack.addEventListener(
        "click",
        showHome
    );

    dviajerosBack.addEventListener(
        "click",
        showHome
    );

    document.getElementById(
        "visa-review"
    ).addEventListener(
        "click",
        reviewVisa
    );

    document.getElementById(
        "dviajeros-review"
    ).addEventListener(
        "click",
        reviewDViajeros
    );

    document.getElementById(
        "visa-clear"
    ).addEventListener(
        "click",
        function () {
            clearForm(
                visaForm,
                VISA_STORAGE_KEY,
                "visa-status"
            );

            updateProgress(
                visaForm,
                "visa-progress",
                "visa-progress-bar"
            );
        }
    );

    document.getElementById(
        "dviajeros-clear"
    ).addEventListener(
        "click",
        function () {
            clearForm(
                dviajerosForm,
                DVIJEROS_STORAGE_KEY,
                "dviajeros-status"
            );

            updateProgress(
                dviajerosForm,
                "dviajeros-progress",
                "dviajeros-progress-bar"
            );
        }
    );

    document.getElementById(
        "open-visa"
    ).addEventListener(
        "click",
        function () {
            openOfficialPortal(
                VISA_URL
            );
        }
    );

    document.getElementById(
        "open-dviajeros"
    ).addEventListener(
        "click",
        function () {
            openOfficialPortal(
                DVIJEROS_URL
            );
        }
    );

    document.querySelectorAll(
        "[data-copy]"
    ).forEach(function (button) {
        button.addEventListener(
            "click",
            function () {
                copyField(
                    button.dataset.copy,
                    button
                );
            }
        );
    });

    visaForm.addEventListener(
        "input",
        function () {
            saveForm(
                visaForm,
                VISA_STORAGE_KEY
            );

            updateProgress(
                visaForm,
                "visa-progress",
                "visa-progress-bar"
            );
        }
    );

    visaForm.addEventListener(
        "change",
        function () {
            saveForm(
                visaForm,
                VISA_STORAGE_KEY
            );

            updateProgress(
                visaForm,
                "visa-progress",
                "visa-progress-bar"
            );
        }
    );

    dviajerosForm.addEventListener(
        "input",
        function () {
            saveForm(
                dviajerosForm,
                DVIJEROS_STORAGE_KEY
            );

            updateProgress(
                dviajerosForm,
                "dviajeros-progress",
                "dviajeros-progress-bar"
            );
        }
    );

    dviajerosForm.addEventListener(
        "change",
        function () {
            saveForm(
                dviajerosForm,
                DVIJEROS_STORAGE_KEY
            );

            updateProgress(
                dviajerosForm,
                "dviajeros-progress",
                "dviajeros-progress-bar"
            );
        }
    );

    loadForm(
        visaForm,
        VISA_STORAGE_KEY
    );

    loadForm(
        dviajerosForm,
        DVIJEROS_STORAGE_KEY
    );

    updateProgress(
        visaForm,
        "visa-progress",
        "visa-progress-bar"
    );

    updateProgress(
        dviajerosForm,
        "dviajeros-progress",
        "dviajeros-progress-bar"
    );
});
