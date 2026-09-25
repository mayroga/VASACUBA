/* =========================================================
   NAVEGACIÓN
   ========================================================= */

function showModule(module) {
    document
        .getElementById("visa-section")
        .classList.add("hidden");

    document
        .getElementById("dviajeros-section")
        .classList.add("hidden");

    document
        .querySelector(".intro")
        .classList.add("hidden");

    document
        .querySelector(".modules")
        .classList.add("hidden");

    if (module === "visa") {
        document
            .getElementById("visa-section")
            .classList.remove("hidden");
    }

    if (module === "dviajeros") {
        document
            .getElementById("dviajeros-section")
            .classList.remove("hidden");
    }
}


function goHome() {
    document
        .getElementById("visa-section")
        .classList.add("hidden");

    document
        .getElementById("dviajeros-section")
        .classList.add("hidden");

    document
        .querySelector(".intro")
        .classList.remove("hidden");

    document
        .querySelector(".modules")
        .classList.remove("hidden");
}


/* =========================================================
   UTILIDADES
   ========================================================= */

function formToObject(form) {
    const data = {};

    form.querySelectorAll(
        "input, textarea, select"
    ).forEach(element => {
        if (!element.name) return;

        if (element.type === "checkbox") {
            data[element.name] = element.checked;
        } else {
            data[element.name] =
                element.value.trim();
        }
    });

    return data;
}


function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function statusClass(status) {
    const value = String(
        status || ""
    ).toUpperCase();

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
}


function showError(element, message) {
    element.classList.remove("hidden");

    element.innerHTML = `
        <h3>Error</h3>
        <p>${escapeHtml(message)}</p>
    `;
}


/* =========================================================
   VISA
   ========================================================= */

document
    .getElementById("visa-form")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const result =
                document.getElementById(
                    "visa-result"
                );

            result.classList.remove(
                "hidden"
            );

            result.innerHTML =
                "<p>Revisando información...</p>";

            try {

                const response =
                    await fetch(
                        "/api/visa/evaluate",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify(
                                formToObject(
                                    event.target
                                )
                            )
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail ||
                        "No se pudo procesar la solicitud."
                    );
                }

                let html = `
                    <h3>Resultado de la revisión</h3>

                    <p>
                        Estado:
                        <span class="status ${statusClass(
                            data.status
                        )}">
                            ${escapeHtml(
                                data.status
                            )}
                        </span>
                    </p>
                `;

                if (
                    data.missing_fields?.length
                ) {

                    html += `
                        <div class="result-item">
                            <strong>
                                Datos faltantes
                            </strong>

                            <ul>
                                ${data.missing_fields
                                    .map(
                                        field =>
                                            `<li>${escapeHtml(
                                                field
                                            )}</li>`
                                    )
                                    .join("")}
                            </ul>
                        </div>
                    `;
                }

                if (data.checks?.length) {

                    html += `
                        <div class="result-item">
                            <strong>
                                Revisión
                            </strong>
                    `;

                    data.checks.forEach(
                        check => {

                            html += `
                                <div class="result-item">
                                    <strong>
                                        ${escapeHtml(
                                            check.id
                                        )}
                                    </strong>

                                    <div class="status ${statusClass(
                                        check.status
                                    )}">
                                        ${escapeHtml(
                                            check.status
                                        )}
                                    </div>

                                    <div>
                                        ${escapeHtml(
                                            check.message
                                        )}
                                    </div>
                                </div>
                            `;
                        }
                    );

                    html += "</div>";
                }

                if (data.official_portal) {

                    html += `
                        <a
                            class="official-link"
                            href="${escapeHtml(
                                data.official_portal
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Abrir portal oficial →
                        </a>
                    `;
                }

                result.innerHTML = html;

            } catch (error) {

                showError(
                    result,
                    error.message
                );
            }
        }
    );


/* =========================================================
   D'VIAJEROS
   ========================================================= */

document
    .getElementById("dviajeros-form")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();

            const result =
                document.getElementById(
                    "dviajeros-result"
                );

            result.classList.remove(
                "hidden"
            );

            result.innerHTML =
                "<p>Revisando información...</p>";

            const data =
                formToObject(event.target);


            /* ---------------------------------------------
               Convertir texto de salud y aduana a objetos
               --------------------------------------------- */

            data.health_information =
                data.health_information
                    ? {
                        declaration:
                            data.health_information
                    }
                    : {};

            data.customs_information =
                data.customs_information
                    ? {
                        declaration:
                            data.customs_information
                    }
                    : {};


            try {

                const response =
                    await fetch(
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

                const resultData =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        resultData.detail ||
                        "No se pudo procesar la solicitud."
                    );
                }


                let html = `
                    <h3>Resultado de la revisión</h3>

                    <p>
                        Estado:
                        <span class="status ${statusClass(
                            resultData.status
                        )}">
                            ${escapeHtml(
                                resultData.status
                            )}
                        </span>
                    </p>

                    <p>
                        Preparación:
                        <strong>
                            ${escapeHtml(
                                resultData
                                    .submission_status
                            )}
                        </strong>
                    </p>
                `;


                if (
                    resultData.missing_fields?.length
                ) {

                    html += `
                        <div class="result-item">
                            <strong>
                                Datos faltantes
                            </strong>

                            <ul>
                                ${resultData
                                    .missing_fields
                                    .map(
                                        field =>
                                            `<li>${escapeHtml(
                                                field
                                            )}</li>`
                                    )
                                    .join("")}
                            </ul>
                        </div>
                    `;
                }


                if (
                    resultData.modules?.length
                ) {

                    html += `
                        <div class="result-item">
                            <strong>
                                Módulos
                            </strong>
                    `;

                    resultData.modules.forEach(
                        module => {

                            html += `
                                <div class="result-item">

                                    <strong>
                                        ${escapeHtml(
                                            module.title
                                        )}
                                    </strong>

                                    <div class="status ${statusClass(
                                        module.status
                                    )}">
                                        ${escapeHtml(
                                            module.status
                                        )}
                                    </div>

                                </div>
                            `;
                        }
                    );

                    html += "</div>";
                }


                if (resultData.official_portal) {

                    html += `
                        <a
                            class="official-link"
                            href="${escapeHtml(
                                resultData.official_portal
                            )}"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Abrir portal oficial D'Viajeros →
                        </a>
                    `;
                }


                result.innerHTML = html;

            } catch (error) {

                showError(
                    result,
                    error.message
                );
            }
        }
    );

