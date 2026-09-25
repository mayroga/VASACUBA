"use strict";
const state={lang:"es",page:"home",visaStep:0,dviajerosStep:0,airport:"MIA",destination:"HAV",visaData:null,dviajerosData:null,flightData:null};
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const T={
es:{
subtitle:"Tu guía para viajar a Cuba sin miedo y paso a paso",eyebrow:"VIAJA PREPARADO",heroTitle:"¿Vas a viajar a Cuba?",heroText:"No tengas miedo a la visa ni a D'Viajeros. Aquí te explicamos qué hacer, paso a paso, antes de abrir los formularios oficiales.",visaBtn:"HACER / REVISAR MI VISA",dviajerosBtn:"HACER D'VIAJEROS",privacyNote:"Tus datos personales y de pasaporte se introducen directamente en los sitios oficiales. CUBA AUTO TRAVEL no necesita guardar esos datos.",quickVisa:"VISA",quickVisaText:"Qué necesitas y cómo solicitarla",quickDviajerosText:"Cómo llenar el formulario y obtener tu QR",quickFlights:"VUELOS",quickFlightsText:"Google Flights, American y charters",back:"← Volver",visaTitle:"Visa para viajar a Cuba",visaIntro:"Primero entiende el proceso. Después abre el formulario oficial.",important:"IMPORTANTE",visaWarning:"La información puede cambiar. Verifica siempre los requisitos actuales en las fuentes oficiales.",videoStyle:"EXPLICACIÓN PASO A PASO",videoStyleText:"Como si estuvieras viendo un tutorial.",previous:"← ANTERIOR",next:"SIGUIENTE →",readyVisa:"¿Listo para hacer la visa?",readyVisaText:"Cuando entiendas los pasos, entra directamente al sitio oficial.",openVisa:"ABRIR VISA OFICIAL ↗",dviajerosIntro:"Vamos a hacerlo como un tutorial: un paso, una revisión y después el siguiente.",dviajerosWarning:"Utiliza el sitio oficial y revisa tus datos antes de finalizar.",dviajerosVideo:"Te acompañamos desde el inicio hasta el código QR.",readyDviajeros:"¿Listo para hacer D'Viajeros?",readyDviajerosText:"Abre el formulario oficial cuando estés preparado.",openDviajeros:"ABRIR D'VIAJEROS ↗",flightsTitle:"Busca tu vuelo a Cuba",flightsIntro:"Compara opciones y confirma siempre ruta, fecha, equipaje, precio y condiciones antes de comprar.",googleText:"Compara vuelos y diferentes aerolíneas.",searchFlights:"BUSCAR VUELOS ↗",americanText:"Consulta las rutas disponibles de American hacia Cuba.",americanBtn:"VER AMERICAN ↗",charterTitle:"Charters",charterText:"Consulta opciones de vuelos charter y verifica directamente disponibilidad y precio.",charterBtn:"VER CHARTERS ↗",departureTitle:"¿Desde dónde buscas?",destinationTitle:"¿A dónde vas?",compareRoute:"BUSCAR ESTA RUTA EN GOOGLE FLIGHTS ↗",charterInfoTitle:"Opciones de charter",charterInfoText:"Las rutas y frecuencias pueden cambiar. Confirma directamente antes de comprar.",usRuleTitle:"SI VIAJAS DESDE ESTADOS UNIDOS",usRuleText:"Viajar a Cuba desde EE. UU. está sujeto a las categorías de viaje autorizadas y a las reglas aplicables. Turismo por sí solo no es una categoría autorizada.",readRules:"LEER INFORMACIÓN DE VIAJE ↗",finalTitle:"Antes de viajar",finalIntro:"Una última revisión puede ayudarte a evitar errores.",finalPassport:"Pasaporte revisado",finalVisa:"Visa revisada",finalInsurance:"Seguro de viaje revisado",finalFlight:"Vuelo y equipaje confirmados",finalDviajeros:"D'Viajeros completado",finalQR:"Código QR guardado",backVisa:"REVISAR VISA",backDviajeros:"REVISAR D'VIAJEROS",footer:"Guía informativa independiente. Verifica siempre los requisitos y condiciones actuales en los sitios oficiales."
},
en:{
subtitle:"Your step-by-step guide to traveling to Cuba",eyebrow:"TRAVEL PREPARED",heroTitle:"Are you traveling to Cuba?",heroText:"Don't worry about the visa or D'Viajeros. We explain what to do step by step before you open the official forms.",visaBtn:"DO / REVIEW MY VISA",dviajerosBtn:"DO D'VIAJEROS",privacyNote:"Your personal and passport information is entered directly on official websites. CUBA AUTO TRAVEL does not need to store it.",quickVisa:"VISA",quickVisaText:"What you need and how to apply",quickDviajerosText:"How to complete the form and get your QR code",quickFlights:"FLIGHTS",quickFlightsText:"Google Flights, American and charters",back:"← Back",visaTitle:"Visa to travel to Cuba",visaIntro:"Understand the process first. Then open the official form.",important:"IMPORTANT",visaWarning:"Information can change. Always verify current requirements with official sources.",videoStyle:"STEP-BY-STEP EXPLANATION",videoStyleText:"Just like watching a tutorial.",previous:"← PREVIOUS",next:"NEXT →",readyVisa:"Ready to apply for the visa?",readyVisaText:"Once you understand the steps, go directly to the official website.",openVisa:"OPEN OFFICIAL VISA ↗",dviajerosIntro:"Let's do it like a tutorial: one step, one review, then the next.",dviajerosWarning:"Use the official website and review your information before finishing.",dviajerosVideo:"We guide you from the beginning to the QR code.",readyDviajeros:"Ready to complete D'Viajeros?",readyDviajerosText:"Open the official form when you are ready.",openDviajeros:"OPEN D'VIAJEROS ↗",flightsTitle:"Find your flight to Cuba",flightsIntro:"Compare options and always confirm route, date, baggage, price and conditions before buying.",googleText:"Compare flights and different airlines.",searchFlights:"SEARCH FLIGHTS ↗",americanText:"Check available American Airlines routes to Cuba.",americanBtn:"VIEW AMERICAN ↗",charterTitle:"Charters",charterText:"Check charter flight options and verify availability and price directly.",charterBtn:"VIEW CHARTERS ↗",departureTitle:"Where are you flying from?",destinationTitle:"Where are you going?",compareRoute:"SEARCH THIS ROUTE ON GOOGLE FLIGHTS ↗",charterInfoTitle:"Charter options",charterInfoText:"Routes and frequencies can change. Confirm directly before buying.",usRuleTitle:"IF YOU ARE TRAVELING FROM THE UNITED STATES",usRuleText:"Travel to Cuba from the U.S. is subject to authorized travel categories and applicable rules. Tourism alone is not an authorized category.",readRules:"READ TRAVEL INFORMATION ↗",finalTitle:"Before you travel",finalIntro:"One final review can help you avoid mistakes.",finalPassport:"Passport checked",finalVisa:"Visa checked",finalInsurance:"Travel insurance checked",finalFlight:"Flight and baggage confirmed",finalDviajeros:"D'Viajeros completed",finalQR:"QR code saved",backVisa:"REVIEW VISA",backDviajeros:"REVIEW D'VIAJEROS",footer:"Independent informational guide. Always verify current requirements and conditions on official websites."
}};
function applyLanguage(){
document.documentElement.lang=state.lang;
$$("[data-i18n]").forEach(e=>{const k=e.dataset.i18n;if(T[state.lang][k]!==undefined)e.textContent=T[state.lang][k]});
$("#languageBtn").textContent=state.lang==="es"?"ENGLISH":"ESPAÑOL";
renderVisa();renderDviajeros();renderCharters();
}
function showPage(id){
state.page=id;
$$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
window.scrollTo({top:0,behavior:"smooth"});
}
function renderSteps(containerId,data,index){
const box=$(containerId);if(!box||!data?.length)return;
const s=data[index]||data[0];
box.innerHTML=`<article class="step active"><div class="step-number">${s.number}</div><div><span class="step-label">${state.lang==="es"?"PASO":"STEP"} ${s.number}</span><h3>${escapeHTML(s.title)}</h3><p>${escapeHTML(s.text)}</p></div></article>`;
}
function renderVisa(){
const d=state.visaData?.steps?.[state.lang]||[
{number:1,title:state.lang==="es"?"Revisa tu pasaporte":"Check your passport",text:state.lang==="es"?"Comprueba que tu pasaporte esté válido.":"Make sure your passport is valid."}
];
state.visaStep=Math.min(state.visaStep,Math.max(0,d.length-1));
renderSteps("#visaSteps",d,state.visaStep);
const c=$("#visaCounter");if(c)c.textContent=`${state.visaStep+1} / ${d.length}`;
const list=state.visaData?.check_before_submit?.[state.lang]||[];
const cb=$("#visaChecklist");
if(cb)cb.innerHTML=`<h3>${state.lang==="es"?"REVISA ANTES DE ENVIAR":"CHECK BEFORE SUBMITTING"}</h3><div class="check-list">${list.map(x=>`<div>✓ ${escapeHTML(x)}</div>`).join("")}</div>`;
const prev=$("#visaPrev"),next=$("#visaNext");
if(prev)prev.disabled=state.visaStep===0;
if(next)next.disabled=state.visaStep===d.length-1;
}
function renderDviajeros(){
const d=state.dviajerosData?.steps?.[state.lang]||[];
state.dviajerosStep=Math.min(state.dviajerosStep,Math.max(0,d.length-1));
renderSteps("#dviajerosSteps",d,state.dviajerosStep);
const c=$("#dviajerosCounter");if(c)c.textContent=`${state.dviajerosStep+1} / ${d.length}`;
const list=state.dviajerosData?.check_before_submit?.[state.lang]||[];
const cb=$("#dviajerosChecklist");
if(cb)cb.innerHTML=`<h3>${state.lang==="es"?"REVISA ANTES DE FINALIZAR":"CHECK BEFORE FINISHING"}</h3><div class="check-list">${list.map(x=>`<div>✓ ${escapeHTML(x)}</div>`).join("")}</div>`;
const prev=$("#dviajerosPrev"),next=$("#dviajerosNext");
if(prev)prev.disabled=state.dviajerosStep===0;
if(next)next.disabled=state.dviajerosStep===d.length-1;
}
function renderCharters(){
const box=$("#charterList"),list=state.flightData?.charters||[];
if(!box)return;
box.innerHTML=list.map(x=>`<article class="charter-item"><div><strong>${escapeHTML(x.name)}</strong><span>${escapeHTML(x.type||"Charter")}</span><p>${escapeHTML(x[state.lang==="es"?"note_es":"note_en"]||"")}</p></div>${x.source?`<a href="${safeURL(x.source)}" target="_blank" rel="noopener noreferrer">↗</a>`:""}</article>`).join("");
}
function googleURL(){
const from=state.airport,to=state.destination;
return `https://www.google.com/travel/flights?q=flights%20from%20${encodeURIComponent(from)}%20to%20${encodeURIComponent(to)}`;
}
function escapeHTML(v){
return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}
function safeURL(v){
try{const u=new URL(v);return["http:","https:"].includes(u.protocol)?u.href:"#"}catch{return"#"}
}
async function loadData(){
try{
const r=await fetch("/api/data",{cache:"no-store"});if(r.ok){const d=await r.json();state.visaData=d.cuba_visa;state.dviajerosData=d.dviajeros}
}catch(e){}
try{
const r=await fetch("/api/flights",{cache:"no-store"});if(r.ok)state.flightData=await r.json()
}catch(e){}
renderVisa();renderDviajeros();renderCharters();
}
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));
$("#languageBtn")?.addEventListener("click",()=>{state.lang=state.lang==="es"?"en":"es";applyLanguage()});
$("#visaPrev")?.addEventListener("click",()=>{if(state.visaStep>0){state.visaStep--;renderVisa()}});
$("#visaNext")?.addEventListener("click",()=>{const d=state.visaData?.steps?.[state.lang]||[];if(state.visaStep<d.length-1){state.visaStep++;renderVisa()}});
$("#dviajerosPrev")?.addEventListener("click",()=>{if(state.dviajerosStep>0){state.dviajerosStep--;renderDviajeros()}});
$("#dviajerosNext")?.addEventListener("click",()=>{const d=state.dviajerosData?.steps?.[state.lang]||[];if(state.dviajerosStep<d.length-1){state.dviajerosStep++;renderDviajeros()}});
$$(".airport").forEach(b=>b.addEventListener("click",()=>{$$(".airport").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.airport=b.dataset.airport}));
$$(".destination").forEach(b=>b.addEventListener("click",()=>{$$(".destination").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.destination=b.dataset.destination}));
$("#googleRouteBtn")?.addEventListener("click",()=>window.open(googleURL(),"_blank","noopener,noreferrer"));
document.addEventListener("keydown",e=>{
if(e.key==="Escape"&&state.page!=="home")showPage("home");
});
applyLanguage();
loadData();
