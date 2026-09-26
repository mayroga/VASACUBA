const state={lang:"es",page:"home",visaStep:0,dviajerosStep:0,visaSimStep:0,dSimStep:0,airport:"MIA",destination:"HAV",data:{},sim:{visa:{},d:{}}};

const T={
es:{
homeTitle:"CUBA AUTO TRAVEL 2026",
homeSubtitle:"Guía práctica para viajar a Cuba",
homeText:"Revisa tu pasaporte, visa y D'Viajeros paso a paso. También puedes consultar vuelos y opciones de viaje.",
visa:"VISA",
dviajeros:"D'VIAJEROS",
passport:"PASAPORTE",
flights:"VUELOS",
guides:"GUÍAS",
official:"SITIO OFICIAL",
how:"¿CÓMO SE HACE?",
back:"VOLVER",
next:"SIGUIENTE",
previous:"ANTERIOR",
finish:"TERMINAR",
check:"REVISAR",
open:"ABRIR",
language:"ENGLISH",
visaTitle:"Visa para viajar a Cuba",
visaText:"Revisa los pasos antes de entrar al formulario oficial.",
dviajerosTitle:"D'Viajeros paso a paso",
dviajerosText:"Completa el formulario digital y conserva tu comprobante y código QR.",
passportTitle:"Pasaporte para viajar a Cuba",
passportText:"Revisa tus datos y la vigencia antes de comenzar.",
flightTitle:"Vuelos a Cuba",
flightText:"Consulta vuelos regulares, opciones charter y destinos.",
guideTitle:"Guías paso a paso",
guideText:"Información sencilla para revisar cada proceso.",
requirements:"REQUISITOS",
steps:"PASOS",
checklist:"LISTA DE REVISIÓN",
important:"IMPORTANTE",
sources:"FUENTES",
flightSearch:"BUSCAR VUELOS",
airport:"SALIDA",
destination:"DESTINO",
providers:"OPCIONES DE VUELO",
charters:"CHARTERS",
legal:"AVISO",
legalText:"CUBA AUTO TRAVEL 2026 es una guía informativa independiente. No pertenece al Gobierno de Cuba, a eVisa Cuba, a D'Viajeros ni a ninguna aerolínea. Verifica siempre la información vigente en las fuentes oficiales.",
practice:"PRACTICAR",
practiceVisa:"PRACTICAR VISA",
practiceD:"PRACTICAR D'VIAJEROS",
practiceText:"Practica la revisión de los datos antes de completar un formulario real.",
first:"PRIMERO",
answer:"RESPUESTA",
correct:"CORRECTO",
review:"REVISA DE NUEVO",
done:"LISTO",
homeButton:"EMPEZAR",
noData:"No se pudo cargar la información.",
officialVisa:"ABRIR VISA OFICIAL",
officialD:"ABRIR D'VIAJEROS",
officialCuba:"VER INFORMACIÓN OFICIAL",
visaStep1:"Revisa tu pasaporte",
visaStep2:"Prepara tus datos",
visaStep3:"Entra al sitio oficial",
visaStep4:"Completa la solicitud",
visaStep5:"Revisa antes de enviar",
visaStep6:"Conserva la información",
dStep1:"Entra a D'Viajeros",
dStep2:"Selecciona el idioma",
dStep3:"Completa tus datos",
dStep4:"Completa los datos del viaje",
dStep5:"Revisa todo",
dStep6:"Finaliza el formulario",
dStep7:"Guarda el QR",
},
en:{
homeTitle:"CUBA AUTO TRAVEL 2026",
homeSubtitle:"Practical guide for traveling to Cuba",
homeText:"Review your passport, visa and D'Viajeros step by step. You can also check flights and travel options.",
visa:"VISA",
dviajeros:"D'VIAJEROS",
passport:"PASSPORT",
flights:"FLIGHTS",
guides:"GUIDES",
official:"OFFICIAL WEBSITE",
how:"HOW DO I DO IT?",
back:"BACK",
next:"NEXT",
previous:"PREVIOUS",
finish:"FINISH",
check:"REVIEW",
open:"OPEN",
language:"ESPAÑOL",
visaTitle:"Visa to travel to Cuba",
visaText:"Review the steps before opening the official form.",
dviajerosTitle:"D'Viajeros step by step",
dviajerosText:"Complete the digital form and keep your confirmation and QR code.",
passportTitle:"Passport for travel to Cuba",
passportText:"Check your information and validity before starting.",
flightTitle:"Flights to Cuba",
flightText:"Check regular flights, charter options and destinations.",
guideTitle:"Step-by-step guides",
guideText:"Simple information to review each process.",
requirements:"REQUIREMENTS",
steps:"STEPS",
checklist:"REVIEW CHECKLIST",
important:"IMPORTANT",
sources:"SOURCES",
flightSearch:"SEARCH FLIGHTS",
airport:"DEPARTURE",
destination:"DESTINATION",
providers:"FLIGHT OPTIONS",
charters:"CHARTERS",
legal:"NOTICE",
legalText:"CUBA AUTO TRAVEL 2026 is an independent informational guide. It is not part of the Cuban Government, Cuba eVisa, D'Viajeros or any airline. Always verify current information with official sources.",
practice:"PRACTICE",
practiceVisa:"PRACTICE VISA",
practiceD:"PRACTICE D'VIAJEROS",
practiceText:"Practice reviewing your information before completing a real form.",
first:"FIRST",
answer:"ANSWER",
correct:"CORRECT",
review:"REVIEW AGAIN",
done:"DONE",
homeButton:"START",
noData:"The information could not be loaded.",
officialVisa:"OPEN OFFICIAL VISA",
officialD:"OPEN D'VIAJEROS",
officialCuba:"VIEW OFFICIAL INFORMATION",
visaStep1:"Check your passport",
visaStep2:"Prepare your information",
visaStep3:"Open the official website",
visaStep4:"Complete the application",
visaStep5:"Review before submitting",
visaStep6:"Keep your visa information",
dStep1:"Open D'Viajeros",
dStep2:"Choose your language",
dStep3:"Enter your information",
dStep4:"Enter trip information",
dStep5:"Review everything",
dStep6:"Finish the form",
dStep7:"Save the QR",
}
};

const visaSim=[
{q:{es:"¿Qué debes revisar primero?",en:"What should you check first?"},a:{es:"Tu pasaporte",en:"Your passport"}},
{q:{es:"¿Dónde debes comenzar la solicitud?",en:"Where should you begin the application?"},a:{es:"En el sitio oficial",en:"On the official website"}},
{q:{es:"¿Cómo debes escribir tus datos?",en:"How should you enter your information?"},a:{es:"Exactamente como aparecen en tu pasaporte",en:"Exactly as they appear on your passport"}}
];

const dSim=[
{q:{es:"¿Dónde debes completar D'Viajeros?",en:"Where should you complete D'Viajeros?"},a:{es:"En el sitio oficial",en:"On the official website"}},
{q:{es:"¿Qué debes revisar antes de finalizar?",en:"What should you review before finishing?"},a:{es:"Todos los datos",en:"All information"}},
{q:{es:"¿Qué debes conservar al terminar?",en:"What should you keep after finishing?"},a:{es:"El comprobante y código QR",en:"The confirmation and QR code"}}
];

const qs=s=>document.querySelector(s);
const qsa=s=>Array.from(document.querySelectorAll(s));
const esc=v=>String(v??"").replace(/[&<>"']/g,m=>({"&":"&","<":"<",">":">",'"':""","'":"'"}[m]));

function t(k){return T[state.lang][k]||T.es[k]||k}

function applyLanguage(){
document.documentElement.lang=state.lang;
qsa("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
qsa("[data-i18n-html]").forEach(el=>el.innerHTML=t(el.dataset.i18nHtml));
const btn=qs("#languageBtn");
if(btn)btn.textContent=t("language");
render();
}

function showPage(page){
state.page=page;
qsa(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));
qsa("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page));
window.scrollTo({top:0,behavior:"smooth"});
render();
}

function bind(){
qsa("[data-page]").forEach(el=>el.addEventListener("click",()=>showPage(el.dataset.page)));
const languageBtn=qs("#languageBtn");
if(languageBtn)languageBtn.addEventListener("click",()=>{
state.lang=state.lang==="es"?"en":"es";
try{localStorage.setItem("cat_lang",state.lang)}catch(e){}
applyLanguage();
});
qsa("[data-back]").forEach(el=>el.addEventListener("click",()=>showPage(el.dataset.back||"home")));
qsa("[data-official]").forEach(el=>el.addEventListener("click",()=>{
const url=el.dataset.official;
if(url)window.open(url,"_blank","noopener,noreferrer");
}));
document.addEventListener("click",e=>{
const el=e.target.closest("[data-open]");
if(!el)return;
const url=el.dataset.open;
if(url)window.open(url,"_blank","noopener,noreferrer");
});
}

async function getJSON(url){
const r=await fetch(url,{cache:"no-store"});
if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);
return r.json();
}

async function loadData(){
try{
const data=await getJSON("/api/data");
state.data=data||{};
}catch(e){
console.error("Data:",e);
state.data={};
}
try{
const flights=await getJSON("/api/flights");
state.data.flights=flights||{};
}catch(e){
console.error("Flights:",e);
}
render();
}

function render(){
renderHome();
renderVisa();
renderDViajeros();
renderPassport();
renderFlights();
renderGuides();
renderPractice();
}

function renderHome(){
const root=qs("#homeContent");
if(!root)return;
root.innerHTML=`

 <section class="hero-card">
  <div class="hero-copy">
   <span class="eyebrow">CUBA AUTO TRAVEL 2026</span>
   <h1>${esc(t("homeTitle"))}</h1>
   <h2>${esc(t("homeSubtitle"))}</h2>
   <p>${esc(t("homeText"))}</p>
   <div class="hero-actions">
    <button class="primary" data-page="visa">${esc(t("visa"))}</button>
    <button class="secondary" data-page="dviajeros">${esc(t("dviajeros"))}</button>
   </div>
  </div>
 </section>
 <section class="training-grid">
  <article class="info-card">
   <span class="card-icon">🛂</span>
   <h3>${esc(t("visa"))}</h3>
   <p>${esc(t("visaText"))}</p>
   <button class="primary" data-page="visa">${esc(t("open"))}</button>
  </article>
  <article class="info-card">
   <span class="card-icon">📋</span>
   <h3>${esc(t("dviajeros"))}</h3>
   <p>${esc(t("dviajerosText"))}</p>
   <button class="primary" data-page="dviajeros">${esc(t("open"))}</button>
  </article>
  <article class="info-card">
   <span class="card-icon">📕</span>
   <h3>${esc(t("passport"))}</h3>
   <p>${esc(t("passportText"))}</p>
   <button class="primary" data-page="passport">${esc(t("open"))}</button>
  </article>
  <article class="info-card">
   <span class="card-icon">✈️</span>
   <h3>${esc(t("flights"))}</h3>
   <p>${esc(t("flightText"))}</p>
   <button class="primary" data-page="flights">${esc(t("open"))}</button>
  </article>
 </section>
 <section class="notice-card">
  <h3>${esc(t("legal"))}</h3>
  <p>${esc(t("legalText"))}</p>
 </section>`;
 qsa("#homeContent [data-page]").forEach(el=>el.addEventListener("click",()=>showPage(el.dataset.page)));
}

function renderVisa(){
const root=qs("#visaContent");
if(!root)return;
const d=state.data.cuba_visa||{};
const lang=state.lang;
const req=d.requirements?.[lang]||[];
const steps=d.steps?.[lang]||[];
const checks=d.check_before_submit?.[lang]||[];
const official=d.official?.form_url||d.official?.url||"https://evisacuba.cu/";
const current=steps[state.visaStep]||{};
root.innerHTML=`

 <section class="page-header">
  <span class="eyebrow">${esc(t("visa"))}</span>
  <h1>${esc(d[`title_${lang}`]||t("visaTitle"))}</h1>
  <p>${esc(d[`intro_${lang}`]||t("visaText"))}</p>
 </section>
 <section class="content-card">
  <h2>${esc(t("requirements"))}</h2>
  <ul class="check-list">${req.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 </section>
 <section class="content-card">
  <h2>${esc(t("steps"))}</h2>
  <div class="step-box">
   <div class="step-number">${Number(current.number||state.visaStep+1)}</div>
   <div>
    <h3>${esc(current.title||"")}</h3>
    <p>${esc(current.text||"")}</p>
   </div>
  </div>
  <div class="step-progress">${steps.length?state.visaStep+1:0} / ${steps.length}</div>
  <div class="button-row">
   <button class="secondary" id="visaPrev" ${state.visaStep<=0?"disabled":""}>${esc(t("previous"))}</button>
   <button class="primary" id="visaNext">${state.visaStep>=steps.length-1?esc(t("finish")):esc(t("next"))}</button>
  </div>
 </section>
 <section class="content-card">
  <h2>${esc(t("checklist"))}</h2>
  <ul class="check-list">${checks.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 </section>
 <section class="action-card">
  <h2>${esc(t("how"))}</h2>
  <p>${esc(d[`intro_${lang}`]||"")}</p>
  <div class="button-row">
   <button class="primary" data-open="${esc(official)}">${esc(d.buttons?.[lang]?.official||t("officialVisa"))}</button>
  </div>
 </section>
 ${d.notice?.[lang]?`<section class="notice-card"><p>${esc(d.notice[lang])}</p></section>`:""}
 ${renderSources(d.sources)}`;
 const prev=qs("#visaPrev"),next=qs("#visaNext");
 if(prev)prev.onclick=()=>{if(state.visaStep>0){state.visaStep--;renderVisa()}};
 if(next)next.onclick=()=>{
  if(state.visaStep<steps.length-1){state.visaStep++;renderVisa()}
  else{state.visaStep=0;window.scrollTo({top:0,behavior:"smooth"})}
 };
 qsa("#visaContent [data-open]").forEach(el=>el.onclick=()=>window.open(el.dataset.open,"_blank","noopener,noreferrer"));
}

function renderDViajeros(){
const root=qs("#dviajerosContent");
if(!root)return;
const d=state.data.dviajeros||{};
const lang=state.lang;
const important=d[`important_${lang}`]||[];
const steps=d.steps?.[lang]||[];
const checks=d.check_before_submit?.[lang]||[];
const official=d.official?.url||"https://www.dviajeros.mitrans.gob.cu/";
const current=steps[state.dviajerosStep]||{};
root.innerHTML=`

 <section class="page-header">
  <span class="eyebrow">${esc(t("dviajeros"))}</span>
  <h1>${esc(d[`title_${lang}`]||t("dviajerosTitle"))}</h1>
  <p>${esc(d[`intro_${lang}`]||t("dviajerosText"))}</p>
 </section>
 <section class="content-card">
  <h2>${esc(t("important"))}</h2>
  <ul class="check-list">${important.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 </section>
 <section class="content-card">
  <h2>${esc(t("steps"))}</h2>
  <div class="step-box">
   <div class="step-number">${Number(current.number||state.dviajerosStep+1)}</div>
   <div>
    <h3>${esc(current.title||"")}</h3>
    <p>${esc(current.text||"")}</p>
   </div>
  </div>
  <div class="step-progress">${steps.length?state.dviajerosStep+1:0} / ${steps.length}</div>
  <div class="button-row">
   <button class="secondary" id="dPrev" ${state.dviajerosStep<=0?"disabled":""}>${esc(t("previous"))}</button>
   <button class="primary" id="dNext">${state.dviajerosStep>=steps.length-1?esc(t("finish")):esc(t("next"))}</button>
  </div>
 </section>
 <section class="content-card">
  <h2>${esc(t("checklist"))}</h2>
  <ul class="check-list">${checks.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 </section>
 <section class="action-card">
  <h2>${esc(t("how"))}</h2>
  <p>${esc(d[`intro_${lang}`]||"")}</p>
  <div class="button-row">
   <button class="primary" data-open="${esc(official)}">${esc(d.buttons?.[lang]?.official||t("officialD"))}</button>
  </div>
 </section>
 ${d.notice?.[lang]?`<section class="notice-card"><p>${esc(d.notice[lang])}</p></section>`:""}
 ${renderSources(d.sources)}`;
 const prev=qs("#dPrev"),next=qs("#dNext");
 if(prev)prev.onclick=()=>{if(state.dviajerosStep>0){state.dviajerosStep--;renderDViajeros()}};
 if(next)next.onclick=()=>{
  if(state.dviajerosStep<steps.length-1){state.dviajerosStep++;renderDViajeros()}
  else{state.dviajerosStep=0;window.scrollTo({top:0,behavior:"smooth"})}
 };
 qsa("#dviajerosContent [data-open]").forEach(el=>el.onclick=()=>window.open(el.dataset.open,"_blank","noopener,noreferrer"));
}

function renderPassport(){
const root=qs("#passportContent");
if(!root)return;
const d=state.data.passports||{};
const lang=state.lang;
const req=d.requirements?.[lang]||[];
const steps=d.steps?.[lang]||[];
const checks=d.checklist?.[lang]||[];
root.innerHTML=`

 <section class="page-header">
  <span class="eyebrow">${esc(t("passport"))}</span>
  <h1>${esc(d[`title_${lang}`]||t("passportTitle"))}</h1>
  <p>${esc(d[`intro_${lang}`]||t("passportText"))}</p>
 </section>
 <section class="content-card">
  <h2>${esc(t("requirements"))}</h2>
  <ul class="check-list">${req.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 </section>
 <section class="content-card">
  <h2>${esc(t("steps"))}</h2>
  <div class="passport-steps">${steps.map((x,i)=>`
   <article class="step-card">
    <div class="step-number">${Number(x.number||i+1)}</div>
    <div><h3>${esc(x.title||"")}</h3><p>${esc(x.text||"")}</p></div>
   </article>`).join("")}</div>
 </section>
 <section class="content-card">
  <h2>${esc(t("checklist"))}</h2>
  <ul class="check-list">${checks.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
 </section>
 <section class="action-card">
  <div class="button-row">
   <button class="primary" data-open="${esc(state.data.cuba_visa?.official?.url||"https://evisacuba.cu/")}">${esc(d.buttons?.[lang]?.visa||"IR A LA VISA")}</button>
   <button class="secondary" data-open="${esc(state.data.dviajeros?.official?.url||"https://www.dviajeros.mitrans.gob.cu/")}">${esc(d.buttons?.[lang]?.dviajeros||"IR A D'VIAJEROS")}</button>
  </div>
 </section>
 ${d.notice?.[lang]?`<section class="notice-card"><p>${esc(d.notice[lang])}</p></section>`:""}
 ${renderSources(d.sources)}`;
 qsa("#passportContent [data-open]").forEach(el=>el.onclick=()=>window.open(el.dataset.open,"_blank","noopener,noreferrer"));
}

function renderFlights(){
const root=qs("#flightsContent");
if(!root)return;
const f=state.data.flights||{};
const providers=f.providers||{};
const airports=f.airports||[];
const destinations=f.destinations||[];
const charters=f.charters||[];
root.innerHTML=`

 <section class="page-header">
  <span class="eyebrow">${esc(t("flights"))}</span>
  <h1>${esc(t("flightTitle"))}</h1>
  <p>${esc(t("flightText"))}</p>
 </section>
 <section class="content-card">
  <div class="flight-form">
   <label>${esc(t("airport"))}
    <select id="airportSelect">${airports.map(a=>`<option value="${esc(a.code)}" ${a.code===state.airport?"selected":""}>${esc(a.name)}${a.name_en&&state.lang==="en"?` — ${esc(a.name_en)}`:""}</option>`).join("")}</select>
   </label>
   <label>${esc(t("destination"))}
    <select id="destinationSelect">${destinations.map(d=>`<option value="${esc(d.code)}" ${d.code===state.destination?"selected":""}>${esc(state.lang==="en"?d.name_en:d.name)}</option>`).join("")}</select>
   </label>
  </div>
 </section>
 <section class="content-card">
  <h2>${esc(t("providers"))}</h2>
  <div class="video-grid">
   ${Object.entries(providers).map(([key,p])=>`
    <article class="info-card flight-card">
     <h3>${esc(p.name||p.name_es||key)}</h3>
     <p>${esc(p[`description_${state.lang}`]||p.description_es||"")}</p>
     <button class="primary" data-open="${esc(p.url||"")}">${esc(t("open"))}</button>
    </article>`).join("")}
  </div>
 </section>
 <section class="content-card">
  <h2>${esc(t("charters"))}</h2>
  <div class="video-grid">
   ${charters.map(c=>`
    <article class="info-card flight-card">
     <h3>${esc(c.name||"")}</h3>
     <p>${esc(c[`note_${state.lang}`]||c.note_es||"")}</p>
     <button class="secondary" data-open="${esc(c.source||"")}">${esc(t("open"))}</button>
    </article>`).join("")}
  </div>
 </section>`;
 const a=qs("#airportSelect"),d=qs("#destinationSelect");
 if(a)a.onchange=()=>{state.airport=a.value};
 if(d)d.onchange=()=>{state.destination=d.value};
 qsa("#flightsContent [data-open]").forEach(el=>el.onclick=()=>window.open(el.dataset.open,"_blank","noopener,noreferrer"));
}

function renderGuides(){
const root=qs("#guidesContent");
if(!root)return;
const visa=state.data.cuba_visa||{},d=state.data.dviajeros||{};
const lang=state.lang;
root.innerHTML=`

 <section class="page-header">
  <span class="eyebrow">${esc(t("guides"))}</span>
  <h1>${esc(t("guideTitle"))}</h1>
  <p>${esc(t("guideText"))}</p>
 </section>
 <section class="training-grid">
  <article class="info-card">
   <span class="card-icon">🛂</span>
   <h2>${esc(visa[`title_${lang}`]||t("visaTitle"))}</h2>
   <p>${esc(visa[`intro_${lang}`]||"")}</p>
   <button class="primary" data-page="visa">${esc(t("how"))}</button>
  </article>
  <article class="info-card">
   <span class="card-icon">📋</span>
   <h2>${esc(d[`title_${lang}`]||t("dviajerosTitle"))}</h2>
   <p>${esc(d[`intro_${lang}`]||"")}</p>
   <button class="primary" data-page="dviajeros">${esc(t("how"))}</button>
  </article>
  <article class="info-card">
   <span class="card-icon">📕</span>
   <h2>${esc(t("passportTitle"))}</h2>
   <p>${esc(t("passportText"))}</p>
   <button class="primary" data-page="passport">${esc(t("how"))}</button>
  </article>
 </section>`;
 qsa("#guidesContent [data-page]").forEach(el=>el.onclick=()=>showPage(el.dataset.page));
}

function renderPractice(){
const root=qs("#practiceContent");
if(!root)return;
const v=visaSim[state.visaSimStep%visaSim.length],d=dSim[state.dSimStep%dSim.length];
root.innerHTML=`

 <section class="page-header">
  <span class="eyebrow">${esc(t("practice"))}</span>
  <h1>${esc(t("practice"))}</h1>
  <p>${esc(t("practiceText"))}</p>
 </section>
 <section class="training-grid">
  <article class="info-card practice-card">
   <h2>${esc(t("practiceVisa"))}</h2>
   <span class="practice-label">${esc(t("first"))}</span>
   <h3>${esc(v.q[state.lang])}</h3>
   <p class="answer-box">${esc(v.a[state.lang])}</p>
   <button class="primary" id="visaPracticeNext">${esc(t("next"))}</button>
  </article>
  <article class="info-card practice-card">
   <h2>${esc(t("practiceD"))}</h2>
   <span class="practice-label">${esc(t("first"))}</span>
   <h3>${esc(d.q[state.lang])}</h3>
   <p class="answer-box">${esc(d.a[state.lang])}</p>
   <button class="primary" id="dPracticeNext">${esc(t("next"))}</button>
  </article>
 </section>`;
 const vn=qs("#visaPracticeNext"),dn=qs("#dPracticeNext");
 if(vn)vn.onclick=()=>{state.visaSimStep=(state.visaSimStep+1)%visaSim.length;renderPractice()};
 if(dn)dn.onclick=()=>{state.dSimStep=(state.dSimStep+1)%dSim.length;renderPractice()};
}

function renderSources(sources){
if(!Array.isArray(sources)||!sources.length)return "";
return `<section class="content-card sources-card"><h2>${esc(t("sources"))}</h2><div class="source-list">${sources.map(s=>`<a href="${esc(s.url||"#")}" target="_blank" rel="noopener noreferrer">${esc(s.name||s.url||"")}</a>`).join("")}</div></section>`;
}

function restoreLanguage(){
try{
const saved=localStorage.getItem("cat_lang");
if(saved==="en"||saved==="es")state.lang=saved;
}catch(e){}
}

function start(){
restoreLanguage();
bind();
applyLanguage();
loadData();
}

document.addEventListener("DOMContentLoaded",start);
