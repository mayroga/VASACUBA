/* ============================================================
   Cuba Travel & Consular Assistant
   static/app.js
   Version: 1.0.0
   Informational / preparation assistant only.
   Does not issue passports, visas, permits, QR codes,
   authorizations, or government approvals.
   ============================================================ */

"use strict";

const API_BASE = "";

const state = {
    language: localStorage.getItem("cuba_travel_language") || "es",
    profile: {},
    result: null,
    checklist: [],
    checklistState: {},
    sources: [],
    loading: false
};

const TEXT = {
    es: {
        loading: "Cargando...",
        analyzing: "Analizando información...",
        error: "No fue posible completar la operación.",
        networkError: "No se pudo conectar con el servidor.",
        required: "Completa los campos requeridos.",
        noResults: "No se encontraron resultados.",
        ready: "Revisión completada.",
        verify: "Verificar",
        active: "Activo",
        conditional: "Condicional",
        unknown: "Desconocido",
        incomplete: "Incompleto",
        expired: "Vencido",
        completed: "Completado",
        pending: "Pendiente",
        checklistComplete: "Lista completada.",
        checklistPending: "Elementos pendientes",
        officialSource: "Fuente oficial",
        openOfficial: "Abrir fuente oficial",
        notOfficial: "Esta aplicación no es una autoridad gubernamental."
    },

    en: {
        loading: "Loading...",
        analyzing: "Analyzing information...",
        error: "The operation could not be completed.",
        networkError: "Could not connect to the server.",
        required: "Complete the required fields.",
        noResults: "No results found.",
        ready: "Review completed.",
        verify: "Verify",
        active: "Active",
        conditional: "Conditional",
        unknown: "Unknown",
        incomplete: "Incomplete",
        expired: "Expired",
        completed: "Completed",
        pending: "Pending",
        checklistComplete: "Checklist completed.",
        checklistPending: "Pending items",
        officialSource: "Official source",
        openOfficial: "Open official source",
        notOfficial: "This application is not a government authority."
    }
};

const $ = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", init);

async function init() {
    setupLanguage();
    setupForm();
    setupChecklistActions();
    restoreChecklistState();
    updateMinorFields();
    await loadSources();
}

/* ============================================================
   LANGUAGE
   ============================================================ */

function setupLanguage() {
    const esButton = $("lang-es");
    const enButton = $("lang-en");

    if (esButton) {
        esButton.addEventListener("click", () => setLanguage("es"));
    }

    if (enButton) {
        enButton.addEventListener("click", () => setLanguage("en"));
    }

    setLanguage(state.language, false);
}

function setLanguage(language, save = true) {
    if (!["es", "en"].includes(language)) {
        language = "es";
    }

    state.language = language;

    if (save) {
        localStorage.setItem("cuba_travel_language", language);
    }

    document.documentElement.lang = language;

    const esButton = $("lang-es");
    const enButton = $("lang-en");

    if (esButton) {
        esButton.classList.toggle("active", language === "es");
    }

    if (enButton) {
        enButton.classList.toggle("active", language === "en");
    }

    translateStaticText();
    renderResult();
    renderChecklist();
    renderSources();
}

function t(key) {
    return TEXT[state.language]?.[key] || TEXT.es[key] || key;
}

function translateStaticText() {
    document.querySelectorAll("[data-es][data-en]").forEach((element) => {
        const value =
            state.language === "en"
                ? element.dataset.en
                : element.dataset.es;

        if (value !== undefined) {
            element.textContent = value;
        }
    });

    document.querySelectorAll("[data-placeholder-es][data-placeholder-en]")
        .forEach((element) => {
            const value =
                state.language === "en"
                    ? element.dataset.placeholderEn
                    : element.dataset.placeholderEs;

            if (value !== undefined) {
                element.placeholder = value;
            }
        });
}

/* ============================================================
   FORM
   ============================================================ */

function setupForm() {
    const form = $("traveler-form");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await evaluateTraveler();
        });
    }

    const minor = $("is-minor");

    if (minor) {
        minor.addEventListener("change", updateMinorFields);
    }

    const nationality = $("nationality");

    if (nationality) {
        nationality.addEventListener("change", updateNationalityFields);
    }
}

function updateMinorFields() {
    const minorCheckbox = $("is-minor");
    const accompaniment = $("accompaniment-group");

    if (!minorCheckbox || !accompaniment) {
        return;
    }

    accompaniment.classList.toggle(
        "hidden",
        !minorCheckbox.checked
    );
}

function updateNationalityFields() {
    const nationality = getValue("nationality");

    const purposeGroup = $("travel-purpose-group");

    if (purposeGroup) {
        purposeGroup.classList.toggle(
            "hidden",
            !nationality
        );
    }
}

function collectProfile() {
    const minorChecked = getChecked("is-minor");

    const profile = {
        nationality: getValue("nationality"),
        age: getNumber("age"),
        residence_country: getValue("residence-country"),
        travel_date: getValue("travel-date"),
        entry_method: getValue("entry-method"),
        passport_number: getValue("passport-number"),
        is_minor: minorChecked,
        accompaniment: minorChecked
            ? getValue("accompaniment")
            : null,
        travel_purpose: getValue("travel-purpose")
    };

    return removeEmpty(profile);
}

function validateBasicProfile(profile) {
    const missing = [];

    if (!profile.nationality) {
        missing.push("nationality");
    }

    if (profile.age === null || profile.age === undefined) {
        missing.push("age");
    }

    if (!profile.residence_country) {
        missing.push("residence_country");
    }

    if (!profile.travel_date) {
        missing.push("travel_date");
    }

    if (!profile.entry_method) {
        missing.push("entry_method");
    }

    if (profile.is_minor && !profile.accompaniment) {
        missing.push("accompaniment");
    }

    return missing;
}

/* ============================================================
   MAIN EVALUATION
   ============================================================ */

async function evaluateTraveler() {
    clearError();

    const profile = collectProfile();
    const missing = validateBasicProfile(profile);

    if (missing.length > 0) {
        showError(
            `${t("required")} (${missing.join(", ")})`
        );
        return;
    }

    state.profile = profile;
    state.loading = true;

    showLoading(t("analyzing"));
    setStep(2);

    try {
        const response = await apiFetch(
            "/api/travel/evaluate",
            {
                method: "POST",
                body: profile
            }
        );

        state.result = response;
        state.checklist = extractChecklist(response);
        initializeChecklistState(state.checklist);

        renderResult();
        renderChecklist();

        await loadSources();

        setStep(3);
        scrollToElement("results-section");
    } catch (error) {
        showError(
            error?.message || t("networkError")
        );
    } finally {
        state.loading = false;
        hideLoading();
    }
}

/* ============================================================
   API
   ============================================================ */

async function apiFetch(path, options = {}) {
    const config = {
        method: options.method || "GET",
        headers: {
            "Accept": "application/json",
            ...(options.headers || {})
        }
    };

    if (options.body !== undefined) {
        config.headers["Content-Type"] = "application/json";
        config.body = JSON.stringify(options.body);
    }

    const response = await fetch(
        `${API_BASE}${path}`,
        config
    );

    let data = null;

    try {
        data = await response.json();
    } catch (_) {
        data = null;
    }

    if (!response.ok) {
        const detail =
            data?.detail ||
            data?.message ||
            data?.error ||
            `${t("error")} (${response.status})`;

        throw new Error(
            typeof detail === "string"
                ? detail
                : JSON.stringify(detail)
        );
    }

    return data;
}

/* ============================================================
   RESULT RENDERING
   ============================================================ */

function renderResult() {
    const section = $("results-section");

    if (!section) {
        return;
    }

    if (!state.result) {
        section.classList.add("hidden");
        return;
    }

    section.classList.remove("hidden");

    renderSummary();
    renderValidation();
    renderResultItems();
}

function renderSummary() {
    const container = $("result-summary");

    if (!container) {
        return;
    }

    const result = state.result || {};
    const profile = state.profile || {};

    const flow =
        result.flow ||
        result.travel_flow ||
        result.flow_name ||
        result.summary?.flow ||
        "—";

    const status =
        result.status ||
        result.summary?.status ||
        "UNKNOWN";

    const verification =
        result.requires_verification ??
        result.summary?.requires_verification ??
        false;

    container.innerHTML = `
        <div class="summary-item">
            <span class="label">${escapeHtml(
                state.language === "es" ? "Flujo" : "Flow"
            )}</span>
            <span class="value">${escapeHtml(
                formatValue(flow)
            )}</span>
        </div>

        <div class="summary-item">
            <span class="label">${escapeHtml(
                state.language === "es" ? "Estado" : "Status"
            )}</span>
            <span class="value">${renderStatusBadge(status)}</span>
        </div>

        <div class="summary-item">
            <span class="label">${escapeHtml(
                state.language === "es"
                    ? "Nacionalidad"
                    : "Nationality"
            )}</span>
            <span class="value">${escapeHtml(
                formatValue(profile.nationality)
            )}</span>
        </div>

        <div class="summary-item">
            <span class="label">${escapeHtml(
                state.language === "es"
                    ? "Verificación oficial"
                    : "Official verification"
            )}</span>
            <span class="value">
                ${verification
                    ? renderStatusBadge("VERIFY")
                    : renderStatusBadge("ACTIVE")}
            </span>
        </div>
    `;
}

function renderValidation() {
    const container = $("validation-result");

    if (!container) {
        return;
    }

    const validation =
        state.result?.validation ||
        state.result?.validation_result ||
        null;

    if (!validation) {
        container.innerHTML = "";
        return;
    }

    const valid =
        validation.valid ??
        validation.is_valid ??
        false;

    const messages =
        normalizeArray(
            validation.messages ||
            validation.errors ||
            validation.warnings
        );

    let html = `
        <div class="status-box ${valid ? "success" : "warning"}">
            <strong>
                ${valid
                    ? escapeHtml(
                        state.language === "es"
                            ? "Validación inicial completada"
                            : "Initial validation completed"
                    )
                    : escapeHtml(
                        state.language === "es"
                            ? "Revisión requiere atención"
                            : "Review requires attention"
                    )}
            </strong>
        </div>
    `;

    if (messages.length) {
        html += `
            <div class="result-list">
                ${messages.map((message) => `
                    <div class="result-item">
                        <p>${escapeHtml(
                            formatResultText(message)
                        )}</p>
                    </div>
                `).join("")}
            </div>
        `;
    }

    container.innerHTML = html;
}

function renderResultItems() {
    const container = $("result-items");

    if (!container) {
        return;
    }

    const items = extractResultItems(state.result);

    if (!items.length) {
        container.innerHTML = `
            <div class="status-box info">
                ${escapeHtml(t("noResults"))}
            </div>
        `;
        return;
    }

    container.innerHTML = items.map((item, index) => {
        const title =
            item.title ||
            item.name ||
            item.rule_id ||
            `${state.language === "es" ? "Elemento" : "Item"} ${index + 1}`;

        const description =
            item.description ||
            item.message ||
            item.explanation ||
            item.reason ||
            "";

        const status =
            item.status ||
            item.rule_status ||
            item.result ||
            "UNKNOWN";

        return `
            <article class="result-item">
                <div class="result-item-header">
                    <h4>${escapeHtml(
                        formatValue(title)
                    )}</h4>
                    ${renderStatusBadge(status)}
                </div>

                ${
                    description
                        ? `<p>${escapeHtml(
                            formatResultText(description)
                        )}</p>`
                        : ""
                }

                ${
                    item.source_url
                        ? `
                            <p>
                                <a
                                    href="${escapeAttribute(item.source_url)}"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    ${escapeHtml(t("openOfficial"))}
                                </a>
                            </p>
                        `
                        : ""
                }
            </article>
        `;
    }).join("");
}

function extractResultItems(result) {
    if (!result || typeof result !== "object") {
        return [];
    }

    const candidates = [
        result.items,
        result.results,
        result.rules,
        result.evaluations,
        result.rule_results,
        result.details,
        result.checklist
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate) && candidate.length) {
            return candidate;
        }
    }

    return [];
}

/* ============================================================
   STATUS
   ============================================================ */

function renderStatusBadge(status) {
    const normalized = String(
        status || "UNKNOWN"
    ).toUpperCase();

    const labels = {
        ACTIVE: t("active"),
        CONDITIONAL: t("conditional"),
        VERIFY: t("verify"),
        UNKNOWN: t("unknown"),
        INCOMPLETE: t("incomplete"),
        EXPIRED: t("expired"),
        COMPLETED: t("completed"),
        PENDING: t("pending")
    };

    const cssMap = {
        ACTIVE: "badge-active",
        CONDITIONAL: "badge-conditional",
        VERIFY: "badge-verify",
        UNKNOWN: "badge-unknown",
        INCOMPLETE: "badge-incomplete",
        EXPIRED: "badge-expired",
        COMPLETED: "badge-active",
        PENDING: "badge-unknown"
    };

    return `
        <span class="badge ${
            cssMap[normalized] || "badge-unknown"
        }">
            ${escapeHtml(
                labels[normalized] || formatValue(normalized)
            )}
        </span>
    `;
}

/* ============================================================
   CHECKLIST
   ============================================================ */

function extractChecklist(result) {
    if (!result || typeof result !== "object") {
        return [];
    }

    const candidates = [
        result.checklist,
        result.items,
        result.checklist?.items,
        result.data?.checklist,
        result.application?.checklist
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) {
            return candidate;
        }

        if (
            candidate &&
            Array.isArray(candidate.items)
        ) {
            return candidate.items;
        }
    }

    return [];
}

function initializeChecklistState(items) {
    const saved = loadChecklistStorage();

    state.checklistState = {};

    items.forEach((item, index) => {
        const id =
            item.id ||
            item.rule_id ||
            item.key ||
            `item-${index}`;

        state.checklistState[id] =
            Boolean(saved[id]);
    });

    saveChecklistState();
}

function setupChecklistActions() {
    const resetButton = $("reset-checklist");

    if (resetButton) {
        resetButton.addEventListener("click", resetChecklist);
    }

    const completeButton = $("complete-checklist");

    if (completeButton) {
        completeButton.addEventListener(
            "click",
            markChecklistComplete
        );
    }
}

function renderChecklist() {
    const container = $("checklist");

    if (!container) {
        return;
    }

    if (!state.checklist.length) {
        container.innerHTML = `
            <div class="status-box info">
                ${escapeHtml(
                    state.language === "es"
                        ? "La lista aparecerá después de analizar el viaje."
                        : "The checklist will appear after the trip is analyzed."
                )}
            </div>
        `;

        updateChecklistProgress();
        return;
    }

    container.innerHTML = state.checklist.map(
        (item, index) => {
            const id =
                item.id ||
                item.rule_id ||
                item.key ||
                `item-${index}`;

            const checked =
                Boolean(state.checklistState[id]);

            const title =
                item.title ||
                item.name ||
                item.label ||
                `${state.language === "es" ? "Elemento" : "Item"} ${index + 1}`;

            const description =
                item.description ||
                item.message ||
                item.reason ||
                "";

            const status =
                item.status ||
                item.rule_status ||
                "";

            return `
                <label class="checklist-item ${
                    checked ? "completed" : ""
                }">
                    <input
                        type="checkbox"
                        data-checklist-id="${escapeAttribute(id)}"
                        ${checked ? "checked" : ""}
                    >

                    <span>
                        <span class="checklist-title">
                            ${escapeHtml(formatValue(title))}
                        </span>

                        ${
                            description
                                ? `
                                    <span class="checklist-meta">
                                        ${escapeHtml(
                                            formatResultText(description)
                                        )}
                                    </span>
                                `
                                : ""
                        }

                        ${
                            status
                                ? `
                                    <span class="checklist-meta">
                                        ${renderStatusBadge(status)}
                                    </span>
                                `
                                : ""
                        }
                    </span>
                </label>
            `;
        }
    ).join("");

    container
        .querySelectorAll(
            "input[data-checklist-id]"
        )
        .forEach((checkbox) => {
            checkbox.addEventListener(
                "change",
                () => {
                    const id =
                        checkbox.dataset.checklistId;

                    state.checklistState[id] =
                        checkbox.checked;

                    saveChecklistState();

                    const item =
                        checkbox.closest(
                            ".checklist-item"
                        );

                    if (item) {
                        item.classList.toggle(
                            "completed",
                            checkbox.checked
                        );
                    }

                    updateChecklistProgress();
                }
            );
        });

    updateChecklistProgress();
}

function updateChecklistProgress() {
    const progressBar = $("progress-bar");
    const progressText = $("progress-text");

    const total = state.checklist.length;

    const completed = state.checklist.filter(
        (item, index) => {
            const id =
                item.id ||
                item.rule_id ||
                item.key ||
                `item-${index}`;

            return Boolean(
                state.checklistState[id]
            );
        }
    ).length;

    const percent =
        total > 0
            ? Math.round((completed / total) * 100)
            : 0;

    if (progressBar) {
        progressBar.style.width = `${percent}%`;
    }

    if (progressText) {
        progressText.textContent =
            `${completed}/${total} — ${percent}%`;
    }

    const status = $("checklist-status");

    if (status) {
        status.textContent =
            total > 0 && completed === total
                ? t("checklistComplete")
                : `${completed} / ${total} ${t("checklistPending")}`;
    }
}

async function markChecklistComplete() {
    const total = state.checklist.length;

    if (!total) {
        return;
    }

    state.checklist.forEach(
        (item, index) => {
            const id =
                item.id ||
                item.rule_id ||
                item.key ||
                `item-${index}`;

            state.checklistState[id] = true;
        }
    );

    saveChecklistState();
    renderChecklist();

    const payload = {
        profile: state.profile,
        checklist: state.checklist.map(
            (item, index) => {
                const id =
                    item.id ||
                    item.rule_id ||
                    item.key ||
                    `item-${index}`;

                return {
                    id,
                    completed: true
                };
            }
        )
    };

    try {
        await apiFetch(
            "/api/checklist/update",
            {
                method: "POST",
                body: payload
            }
        );
    } catch (_) {
        /*
         * Local checklist state remains valid even if
         * the optional server update is unavailable.
         */
    }
}

function resetChecklist() {
    state.checklistState = {};
    saveChecklistState();
    renderChecklist();
}

function checklistStorageKey() {
    return `cuba_travel_checklist_${hashObject(
        state.profile
    )}`;
}

function saveChecklistState() {
    try {
        localStorage.setItem(
            checklistStorageKey(),
            JSON.stringify(state.checklistState)
        );
    } catch (_) {
        // LocalStorage may be unavailable.
    }
}

function loadChecklistStorage() {
    try {
        const raw = localStorage.getItem(
            checklistStorageKey()
        );

        if (!raw) {
            return {};
        }

        const parsed = JSON.parse(raw);

        return parsed &&
            typeof parsed === "object"
            ? parsed
            : {};
    } catch (_) {
        return {};
    }
}

function restoreChecklistState() {
    state.checklistState =
        loadChecklistStorage();
}

/* ============================================================
   OFFICIAL SOURCES
   ============================================================ */

async function loadSources() {
    try {
        const response =
            await apiFetch("/api/sources");

        state.sources =
            normalizeArray(
                response?.sources ||
                response?.items ||
                response
            );

        renderSources();
    } catch (_) {
        state.sources = [];
        renderSources();
    }
}

function renderSources() {
    const container = $("sources");

    if (!container) {
        return;
    }

    if (!state.sources.length) {
        container.innerHTML = `
            <div class="status-box info">
                ${escapeHtml(
                    state.language === "es"
                        ? "Las fuentes oficiales se mostrarán cuando estén disponibles."
                        : "Official sources will appear when available."
                )}
            </div>
        `;

        return;
    }

    container.innerHTML = state.sources.map(
        (source) => {
            const name =
                source.name ||
                source.title ||
                source.organization ||
                t("officialSource");

            const url =
                source.url ||
                source.website ||
                source.official_url ||
                source.official_directory_url;

            const status =
                source.status ||
                source.verification_status ||
                "";

            if (!url) {
                return `
                    <div class="source-item">
                        <div>
                            <div class="source-name">
                                ${escapeHtml(name)}
                            </div>

                            ${
                                status
                                    ? `<div class="source-status">
                                        ${escapeHtml(
                                            formatValue(status)
                                        )}
                                    </div>`
                                    : ""
                            }
                        </div>
                    </div>
                `;
            }

            return `
                <div class="source-item">
                    <div>
                        <div class="source-name">
                            ${escapeHtml(name)}
                        </div>

                        ${
                            status
                                ? `<div class="source-status">
                                    ${escapeHtml(
                                        formatValue(status)
                                    )}
                                </div>`
                                : ""
                        }
                    </div>

                    <a
                        href="${escapeAttribute(url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escapeHtml(t("openOfficial"))}
                    </a>
                </div>
            `;
        }
    ).join("");
}

/* ============================================================
   UI HELPERS
   ============================================================ */

function setStep(stepNumber) {
    document
        .querySelectorAll(".step")
        .forEach((step) => {
            const stepValue =
                Number(
                    step.dataset.step ||
                    step.getAttribute("data-step") ||
                    0
                );

            step.classList.toggle(
                "active",
                stepValue === stepNumber
            );
        });
}

function showLoading(message) {
    const loading = $("loading");

    if (!loading) {
        return;
    }

    loading.classList.remove("hidden");

    const text = loading.querySelector(
        ".loading-text"
    );

    if (text) {
        text.textContent = message;
    }
}

function hideLoading() {
    const loading = $("loading");

    if (loading) {
        loading.classList.add("hidden");
    }
}

function showError(message) {
    const error = $("error");

    if (!error) {
        return;
    }

    error.textContent = message;
    error.classList.remove("hidden");
}

function clearError() {
    const error = $("error");

    if (error) {
        error.textContent = "";
        error.classList.add("hidden");
    }
}

function scrollToElement(id) {
    const element = $(id);

    if (!element) {
        return;
    }

    window.setTimeout(() => {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 50);
}

/* ============================================================
   FORM HELPERS
   ============================================================ */

function getValue(id) {
    const element = $(id);

    if (!element) {
        return "";
    }

    return String(
        element.value ?? ""
    ).trim();
}

function getNumber(id) {
    const value = getValue(id);

    if (!value) {
        return null;
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : null;
}

function getChecked(id) {
    const element = $(id);

    return Boolean(
        element &&
        element.checked
    );
}

function removeEmpty(object) {
    return Object.fromEntries(
        Object.entries(object).filter(
            ([, value]) =>
                value !== "" &&
                value !== null &&
                value !== undefined
        )
    );
}

/* ============================================================
   DATA HELPERS
   ============================================================ */

function normalizeArray(value) {
    if (Array.isArray(value)) {
        return value;
    }

    if (
        value &&
        typeof value === "object"
    ) {
        return Object.values(value);
    }

    if (value === null || value === undefined) {
        return [];
    }

    return [value];
}

function formatValue(value) {
    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {
        return "—";
    }

    if (typeof value === "boolean") {
        return value
            ? state.language === "es"
                ? "Sí"
                : "Yes"
            : state.language === "es"
                ? "No"
                : "No";
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => formatValue(item))
            .join(", ");
    }

    if (typeof value === "object") {
        return (
            value.name ||
            value.title ||
            value.label ||
            JSON.stringify(value)
        );
    }

    return String(value);
}

function formatResultText(value) {
    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return value
            .map((item) =>
                formatResultText(item)
            )
            .join(" • ");
    }

    if (typeof value === "object") {
        return (
            value.message ||
            value.description ||
            value.text ||
            value.title ||
            JSON.stringify(value)
        );
    }

    return String(value);
}

/* ============================================================
   SECURITY / HTML ESCAPING
   ============================================================ */

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

/* ============================================================
   LOCAL STORAGE / HASH
   ============================================================ */

function hashObject(object) {
    const text = JSON.stringify(
        object || {}
    );

    let hash = 0;

    for (let i = 0; i < text.length; i++) {
        hash =
            ((hash << 5) - hash) +
            text.charCodeAt(i);

        hash |= 0;
    }

    return Math.abs(hash).toString(36);
}

/* ============================================================
   PUBLIC DEBUG HELPERS
   ============================================================ */

window.CubaTravelApp = {
    getState: () => ({
        language: state.language,
        profile: { ...state.profile },
        result: state.result,
        checklist: [...state.checklist],
        checklistState: {
            ...state.checklistState
        }
    }),

    reloadSources: loadSources,

    resetChecklist,

    setLanguage
};
