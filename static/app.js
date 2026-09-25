"use strict";

document.addEventListener("DOMContentLoaded", function () {
var currentLanguage = localStorage.getItem("cuba_auto_language") || "es";

```
var OFFICIAL_VISA_URL = "https://evisacuba.cu/";
var OFFICIAL_DVIAJEROS_URL = "https://dviajeros.mitrans.gob.cu/";

function byId(id) {
    return document.getElementById(id);
}

function openOfficial(url) {
    window.open(url, "_blank", "noopener,noreferrer");
}

function saveValue(key, value) {
    try {
        localStorage.setItem(
            "cuba_auto_" + key,
            value
        );
    } catch (error) {
        console.warn("No se pudo guardar información local.", error);
    }
}

function loadValue(key) {
    try {
        return localStorage.getItem(
            "cuba_auto_" + key
        ) || "";
    } catch (error) {
        return "";
    }
}

function saveFormFields() {
    var fields = document.querySelectorAll(
        "input, select, textarea"
    );

    fields.forEach(function (field) {
        if (!field.id) {
            return;
        }

        if (field.type === "checkbox") {
            saveValue(
                field.id,
                field.checked ? "true" : "false"
            );
        } else {
            saveValue(
                field.id,
                field.value || ""
            );
        }
    });
}

function restoreFormFields() {
    var fields = document.querySelectorAll(
        "input, select, textarea"
    );

    fields.forEach(function (field) {
        if (!field.id) {
            return;
        }

        var saved = loadValue(field.id);

        if (saved === "") {
            return;
        }

        if (field.type === "checkbox") {
            field.checked = saved === "true";
        } else {
            field.value = saved;
        }
    });
}

function setLanguage(language) {
    currentLanguage = language;

    try {
        localStorage.setItem(
            "cuba_auto_language",
            language
        );
    } catch (error) {
        console.warn("No se pudo guardar el idioma.", error);
    }

    var elements = document.querySelectorAll(
        "[data-es][data-en]"
    );

    elements.forEach(function (element) {
        var text = language === "en"
            ? element.getAttribute("data-en")
            : element.getAttribute("data-es");

        if (text !== null) {
            element.textContent = text;
        }
    });

    var placeholders = document.querySelectorAll(
        "[data-placeholder-es][data-placeholder-en]"
    );

    placeholders.forEach(function (element) {
        var placeholder = language === "en"
            ? element.getAttribute("data-placeholder-en")
            : element.getAttribute("data-placeholder-es");

        if (placeholder !== null) {
            element.setAttribute(
                "placeholder",
                placeholder
            );
        }
    });

    var languageButtons = document.querySelectorAll(
        "[data-language]"
    );

    languageButtons.forEach(function (button) {
        var buttonLanguage = button.getAttribute(
            "data-language"
        );

        if (buttonLanguage === language) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    var currentLanguageLabel = byId(
        "current-language"
    );

    if (currentLanguageLabel) {
        currentLanguageLabel.textContent =
            language === "en" ? "ENGLISH" : "ESPAÑOL";
    }

    var languageToggle = byId(
        "language-toggle"
    );

    if (languageToggle) {
        languageToggle.textContent =
            language === "en"
                ? "ESPAÑOL"
                : "ENGLISH";
    }

    document.documentElement.lang = language;
}

function hideAllModules() {
    var modules = document.querySelectorAll(
        ".module-view, .app-module, [data-module-view]"
    );

    modules.forEach(function (module) {
        module.classList.remove("active");
        module.classList.add("hidden");
    });
}

function showModule(moduleName) {
    hideAllModules();

    var candidates = [
        moduleName,
        moduleName + "-module",
        moduleName + "-view"
    ];

    var target = null;

    for (var i = 0; i < candidates.length; i += 1) {
        var candidate = byId(candidates[i]);

        if (candidate) {
            target = candidate;
            break;
        }
    }

    if (!target) {
        target = document.querySelector(
            '[data-module-view="' +
            moduleName +
            '"]'
        );
    }

    if (target) {
        target.classList.remove("hidden");
        target.classList.add("active");

        try {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        } catch (error) {
            target.scrollIntoView();
        }
    }
}

function showHome() {
    hideAllModules();

    var home = byId("home");

    if (!home) {
        home = byId("home-view");
    }

    if (!home) {
        home = document.querySelector(
            '[data-module-view="home"]'
        );
    }

    if (home) {
        home.classList.remove("hidden");
        home.classList.add("active");
    }

    window.scrollTo(0, 0);
}

function copyText(value, button) {
    if (!value) {
        return;
    }

    if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
    ) {
        navigator.clipboard.writeText(value)
            .then(function () {
                showCopyMessage(button);
            })
            .catch(function () {
                fallbackCopy(value, button);
            });

        return;
    }

    fallbackCopy(value, button);
}

function fallbackCopy(value, button) {
    var temporary = document.createElement("textarea");

    temporary.value = value;
    temporary.setAttribute(
        "readonly",
        "readonly"
    );

    temporary.style.position = "fixed";
    temporary.style.left = "-9999px";

    document.body.appendChild(temporary);

    temporary.select();

    try {
        document.execCommand("copy");
        showCopyMessage(button);
    } catch (error) {
        console.warn(
            "No se pudo copiar automáticamente.",
            error
        );
    }

    document.body.removeChild(temporary);
}

function showCopyMessage(button) {
    if (!button) {
        return;
    }

    var originalText = button.textContent;

    button.textContent =
        currentLanguage === "en"
            ? "COPIED"
            : "COPIADO";

    window.setTimeout(function () {
        button.textContent = originalText;
    }, 1200);
}

function runLocalReview() {
    var requiredFields = document.querySelectorAll(
        "[data-required]"
    );

    var missing = 0;

    requiredFields.forEach(function (field) {
        var value = "";

        if (field.type === "checkbox") {
            value = field.checked ? "yes" : "";
        } else {
            value = String(
                field.value || ""
            ).trim();
        }

        if (!value) {
            missing += 1;
            field.classList.add("field-missing");
        } else {
            field.classList.remove("field-missing");
        }
    });

    var result = byId("review-result");

    if (!result) {
        result = byId("status-result");
    }

    if (!result) {
        saveFormFields();
        return;
    }

    if (missing > 0) {
        result.textContent =
            currentLanguage === "en"
                ? "Some information is still missing. Review the highlighted fields."
                : "Todavía falta información. Revisa los campos marcados.";

        result.classList.add("warning");
        result.classList.remove("success");
    } else {
        result.textContent =
            currentLanguage === "en"
                ? "Your information is prepared. You can continue to the official portal."
                : "Tu información está preparada. Puedes continuar al portal oficial.";

        result.classList.add("success");
        result.classList.remove("warning");
    }

    saveFormFields();
}

function connectButtons() {
    var buttons = document.querySelectorAll(
        "button, a"
    );

    buttons.forEach(function (button) {
        if (button.getAttribute("data-cuba-connected") === "true") {
            return;
        }

        button.setAttribute(
            "data-cuba-connected",
            "true"
        );

        var action = button.getAttribute(
            "data-action"
        );

        var module = button.getAttribute(
            "data-module"
        );

        var language = button.getAttribute(
            "data-language"
        );

        if (language) {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    setLanguage(language);
                }
            );

            return;
        }

        if (action === "visa") {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    showModule("visa");
                }
            );

            return;
        }

        if (action === "dviajeros") {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    showModule("dviajeros");
                }
            );

            return;
        }

        if (action === "home") {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    showHome();
                }
            );

            return;
        }

        if (action === "official-visa") {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    openOfficial(
                        OFFICIAL_VISA_URL
                    );
                }
            );

            return;
        }

        if (action === "official-dviajeros") {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    openOfficial(
                        OFFICIAL_DVIAJEROS_URL
                    );
                }
            );

            return;
        }

        if (action === "review") {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    runLocalReview();
                }
            );

            return;
        }

        if (action === "copy") {
            button.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();

                    var targetId =
                        button.getAttribute(
                            "data-copy-target"
                        );

                    if (!targetId) {
                        return;
                    }

                    var target = byId(
                        targetId
                    );

                    if (!target) {
                        return;
                    }

                    var value =
                        target.value !== undefined
                            ? target.value
                            : target.textContent;

                    copyText(
                        String(value || ""),
                        button
                    );
                }
            );

            return;
        }

        if (module === "visa") {
            button.addEventListener(
                "click",
                function (event) {
                    if (
                        button.tagName.toLowerCase() ===
                        "button"
                    ) {
                        event.preventDefault();
                    }

                    showModule("visa");
                }
            );

            return;
        }

        if (module === "dviajeros") {
            button.addEventListener(
                "click",
                function (event) {
                    if (
                        button.tagName.toLowerCase() ===
                        "button"
                    ) {
                        event.preventDefault();
                    }

                    showModule("dviajeros");
                }
            );
        }
    });
}

function connectAutomaticOfficialLinks() {
    var links = document.querySelectorAll(
        "a[href]"
    );

    links.forEach(function (link) {
        var href = link.getAttribute("href");

        if (!href) {
            return;
        }

        if (
            href.indexOf(
                "evisacuba.cu"
            ) !== -1
        ) {
            link.setAttribute(
                "target",
                "_blank"
            );

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );
        }

        if (
            href.indexOf(
                "dviajeros.mitrans.gob.cu"
            ) !== -1
        ) {
            link.setAttribute(
                "target",
                "_blank"
            );

            link.setAttribute(
                "rel",
                "noopener noreferrer"
            );
        }
    });
}

function connectForms() {
    var fields = document.querySelectorAll(
        "input, select, textarea"
    );

    fields.forEach(function (field) {
        field.addEventListener(
            "input",
            function () {
                if (field.classList.contains("field-missing")) {
                    if (
                        String(
                            field.value || ""
                        ).trim()
                    ) {
                        field.classList.remove(
                            "field-missing"
                        );
                    }
                }

                saveFormFields();
            }
        );

        field.addEventListener(
            "change",
            function () {
                saveFormFields();
            }
        );
    });
}

function connectModuleCards() {
    var visaSelectors = [
        "#visa-card",
        "#visa-option",
        "#visa-module-button",
        ".visa-card",
        "[data-open-module='visa']"
    ];

    var dviajerosSelectors = [
        "#dviajeros-card",
        "#dviajeros-option",
        "#dviajeros-module-button",
        ".dviajeros-card",
        "[data-open-module='dviajeros']"
    ];

    visaSelectors.forEach(function (selector) {
        document.querySelectorAll(selector)
            .forEach(function (element) {
                if (
                    element.getAttribute(
                        "data-cuba-card-connected"
                    ) === "true"
                ) {
                    return;
                }

                element.setAttribute(
                    "data-cuba-card-connected",
                    "true"
                );

                element.addEventListener(
                    "click",
                    function (event) {
                        event.preventDefault();
                        showModule("visa");
                    }
                );
            });
    });

    dviajerosSelectors.forEach(function (selector) {
        document.querySelectorAll(selector)
            .forEach(function (element) {
                if (
                    element.getAttribute(
                        "data-cuba-card-connected"
                    ) === "true"
                ) {
                    return;
                }

                element.setAttribute(
                    "data-cuba-card-connected",
                    "true"
                );

                element.addEventListener(
                    "click",
                    function (event) {
                        event.preventDefault();
                        showModule("dviajeros");
                    }
                );
            });
    });
}

function initializeVisibility() {
    var modules = document.querySelectorAll(
        ".module-view, .app-module, [data-module-view]"
    );

    if (!modules.length) {
        return;
    }

    var home =
        byId("home") ||
        byId("home-view") ||
        document.querySelector(
            '[data-module-view="home"]'
        );

    if (home) {
        home.classList.remove("hidden");
        home.classList.add("active");
    }

    modules.forEach(function (module) {
        if (module === home) {
            return;
        }

        if (
            !module.classList.contains("active")
        ) {
            module.classList.add("hidden");
        }
    });
}

restoreFormFields();
setLanguage(currentLanguage);
connectButtons();
connectAutomaticOfficialLinks();
connectForms();
connectModuleCards();
initializeVisibility();
```

});
