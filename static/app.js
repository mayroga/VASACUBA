"use strict";

function showModule(module) {
var visa = document.getElementById("visa-section");
var dviajeros = document.getElementById("dviajeros-section");
var intro = document.querySelector(".intro");
var modules = document.querySelector(".modules");

```
visa.classList.add("hidden");
dviajeros.classList.add("hidden");
intro.classList.add("hidden");
modules.classList.add("hidden");

if (module === "visa") {
    visa.classList.remove("hidden");
}

if (module === "dviajeros") {
    dviajeros.classList.remove("hidden");
}
```

}

function goHome() {
document.getElementById("visa-section").classList.add("hidden");
document.getElementById("dviajeros-section").classList.add("hidden");
document.querySelector(".intro").classList.remove("hidden");
document.querySelector(".modules").classList.remove("hidden");
}

function formToObject(form) {
var data = {};
var elements = form.querySelectorAll("input, textarea, select");

```
elements.forEach(function (element) {
    if (!element.name) {
        return;
    }

    if (element.type === "checkbox") {
        data[element.name] = element.checked;
    } else {
        data[element.name] = element.value.trim();
    }
});

return data;
```

}

function escapeHtml(value) {
return String(value == null ? "" : value)
.replace(/&/g, "&")
.replace(/</g, "<")
.replace(/>/g, ">")
.replace(/"/g, """)
.replace(/'/g, "'");
}

function statusClass(status) {
var value = String(status || "").toUpperCase();

```
if (value === "READY") {
    return "status-ready";
}

if (value === "VERIFY") {
    return "status-verify";
}

if (value === "INCOMPLETE") {
    return "status-incomplete";
}

return "";
```

}

function showError(element, message) {
element.classList.remove("hidden");

```
element.innerHTML =
    "<h3>Error</h3>" +
    "<p>" +
    escapeHtml(message) +
    "</p>";
```

}

/* =========================================================
VISA
========================================================= */

var visaForm = document.getElementById("visa-form");

if (visaForm) {
visaForm.addEventListener("submit", async function (event) {
event.preventDefault();

```
    var result = document.getElementById("visa-result");

    result.classList.remove("hidden");
    result.innerHTML = "<p>Revisando información...</p>";

    try {
        var response = await fetch("/api/visa/evaluate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                formToObject(event.target)
            )
        });

        var data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail ||
                "No se pudo procesar la solicitud."
            );
        }

        var html =
            "<h3>Resultado de la revisión</h3>" +
            "<p>" +
            "Estado: " +
            "<span class=\"status " +
            statusClass(data.status) +
            "\">" +
            escapeHtml(data.status) +
            "</span>" +
            "</p>";

        if (
            data.missing_fields &&
            data.missing_fields.length
        ) {
            html +=
                "<div class=\"result-item\">" +
                "<strong>Datos faltantes</strong>" +
                "<ul>";

            data.missing_fields.forEach(function (field) {
                html +=
                    "<li>" +
                    escapeHtml(field) +
                    "</li>";
            });

            html += "</ul></div>";
        }

        if (data.checks && data.checks.length) {
            html +=
                "<div class=\"result-item\">" +
                "<strong>Revisión</strong>";

            data.checks.forEach(function (check) {
                html +=
                    "<div class=\"result-item\">" +
                    "<strong>" +
                    escapeHtml(check.id) +
                    "</strong>" +
                    "<div class=\"status " +
                    statusClass(check.status) +
                    "\">" +
                    escapeHtml(check.status) +
                    "</div>" +
                    "<div>" +
                    escapeHtml(check.message) +
                    "</div>" +
                    "</div>";
            });

            html += "</div>";
        }

        if (data.official_portal) {
            html +=
                "<a class=\"official-link\" href=\"" +
                escapeHtml(data.official_portal) +
                "\" target=\"_blank\" " +
                "rel=\"noopener noreferrer\">" +
                "Abrir portal oficial →" +
                "</a>";
        }

        result.innerHTML = html;

    } catch (error) {
        showError(result, error.message);
    }
});
```

}

/* =========================================================
D'VIAJEROS
========================================================= */

var dviajerosForm =
document.getElementById("dviajeros-form");

if (dviajerosForm) {
dviajerosForm.addEventListener(
"submit",
async function (event) {
event.preventDefault();

```
        var result =
            document.getElementById(
                "dviajeros-result"
            );

        result.classList.remove("hidden");
        result.innerHTML =
            "<p>Revisando información...</p>";

        var data = formToObject(event.target);

        if (data.health_information) {
            data.health_information = {
                declaration:
                    data.health_information
            };
        } else {
            data.health_information = {};
        }

        if (data.customs_information) {
            data.customs_information = {
                declaration:
                    data.customs_information
            };
        } else {
            data.customs_information = {};
        }

        try {
            var response = await fetch(
                "/api/dviajeros/evaluate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            var resultData =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    resultData.detail ||
                    "No se pudo procesar la solicitud."
                );
            }

            var html =
                "<h3>Resultado de la revisión</h3>" +
                "<p>" +
                "Estado: " +
                "<span class=\"status " +
                statusClass(resultData.status) +
                "\">" +
                escapeHtml(resultData.status) +
                "</span>" +
                "</p>" +
                "<p>" +
                "Preparación: <strong>" +
                escapeHtml(
                    resultData.submission_status
                ) +
                "</strong>" +
                "</p>";

            if (
                resultData.missing_fields &&
                resultData.missing_fields.length
            ) {
                html +=
                    "<div class=\"result-item\">" +
                    "<strong>Datos faltantes</strong>" +
                    "<ul>";

                resultData.missing_fields.forEach(
                    function (field) {
                        html +=
                            "<li>" +
                            escapeHtml(field) +
                            "</li>";
                    }
                );

                html += "</ul></div>";
            }

            if (
                resultData.modules &&
                resultData.modules.length
            ) {
                html +=
                    "<div class=\"result-item\">" +
                    "<strong>Módulos</strong>";

                resultData.modules.forEach(
                    function (module) {
                        html +=
                            "<div class=\"result-item\">" +
                            "<strong>" +
                            escapeHtml(module.title) +
                            "</strong>" +
                            "<div class=\"status " +
                            statusClass(module.status) +
                            "\">" +
                            escapeHtml(module.status) +
                            "</div>" +
                            "</div>";
                    }
                );

                html += "</div>";
            }

            if (resultData.official_portal) {
                html +=
                    "<a class=\"official-link\" href=\"" +
                    escapeHtml(
                        resultData.official_portal
                    ) +
                    "\" target=\"_blank\" " +
                    "rel=\"noopener noreferrer\">" +
                    "Abrir portal oficial D'Viajeros →" +
                    "</a>";
            }

            result.innerHTML = html;

        } catch (error) {
            showError(result, error.message);
        }
    }
);
```

}
