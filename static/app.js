document.addEventListener("DOMContentLoaded", function () {
console.log("CUBA AUTO TRAVEL 2026 - APP.JS CARGADO");

```
var languageButton = document.getElementById("language-toggle");

if (languageButton) {
    languageButton.addEventListener("click", function () {
        console.log("BOTON DE IDIOMA FUNCIONANDO");
    });
}

var visaButton = document.getElementById("visa-card");

if (visaButton) {
    visaButton.addEventListener("click", function () {
        console.log("VISA FUNCIONANDO");
    });
}

var dviajerosButton = document.getElementById("dviajeros-card");

if (dviajerosButton) {
    dviajerosButton.addEventListener("click", function () {
        console.log("D'VIAJEROS FUNCIONANDO");
    });
}
```

});
