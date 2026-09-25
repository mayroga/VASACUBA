const state={lang:"es",page:"home",visaStep:0,dviajerosStep:0,visaSimStep:0,dSimStep:0,airport:"MIA",destination:"HAV",data:{},sim:{visa:{},d:{}}};

const T={
es:{
brandSub:"Guía práctica para viajar preparado",heroTitle:"¿Vas a viajar a Cuba?",heroText:"No tengas miedo a la visa ni a D'Viajeros. Te mostramos qué revisar y dónde hacer cada trámite.",visaButton:"HACER / REVISAR MI VISA",dviajerosButton:"HACER D'VIAJEROS",privacyNote:"No necesitas guardar aquí los datos de tu pasaporte. Usa esta aplicación como guía y realiza los trámites en los sitios oficiales.",quickVisa:"Visa",quickVisaText:"Qué revisar antes de solicitarla",quickDviajerosText:"Formulario digital paso a paso",quickFlights:"Vuelos",quickFlightsText:"Busca vuelos y opciones a Cuba",trainingTitle:"APRENDE ANTES DE HACERLO",trainingText:"Practica primero con una simulación. Así llegarás al formulario oficial sabiendo qué vas a encontrar.",practiceVisa:"Practicar la Visa",practiceVisaText:"Mira y practica los campos antes de entrar a eVisa Cuba.",practiceD:"Practicar D'Viajeros",practiceDText:"Aprende el orden de los datos antes de abrir D'Viajeros.",startPractice:"COMENZAR PRÁCTICA →",back:"← Volver",important:"IMPORTANTE",tutorial:"GUÍA PASO A PASO",followSteps:"Sigue cada paso con calma.",previous:"ANTERIOR",next:"SIGUIENTE",checkBefore:"✓ Revisa antes de enviar",openOfficial:"ABRIR SITIO OFICIAL",openOfficialD:"ABRIR D'VIAJEROS",visaTitle:"Visa para viajar a Cuba",dviajerosTitle:"D'Viajeros paso a paso",visaWarning:"Revisa siempre los requisitos oficiales antes de enviar una solicitud.",dviajerosWarning:"Completa la información con cuidado y conserva el código QR.",officialVisaTitle:"Portal oficial eVisa Cuba",officialVisaText:"Realiza la solicitud directamente en el sitio oficial.",officialDTitle:"Sitio oficial D'Viajeros",officialDText:"Completa el formulario directamente en el sitio oficial.",flightsTitle:"Busca tu vuelo",flightsIntro:"Compara opciones y confirma siempre ruta, fecha, precio y condiciones directamente con el proveedor.",routeSearch:"Buscar ruta",searchFlights:"BUSCAR VUELOS",chartersTitle:"Opciones de vuelos charter",usWarningTitle:"SI VIAJAS DESDE EE. UU.",usWarningText:"Las reglas estadounidenses para viajar a Cuba desde o a través de EE. UU. tienen requisitos específicos. Verifica tu categoría autorizada y las condiciones actuales antes de comprar.",finalTitle:"Antes de viajar",finalIntro:"Haz una última revisión antes de salir.",final1:"Pasaporte revisado",final2:"Visa revisada",final3:"Seguro de viaje revisado",final4:"D'Viajeros completado",final5:"Código QR guardado",final6:"Vuelo y documentos revisados",reviewVisa:"REVISAR VISA",reviewD:"REVISAR D'VIAJEROS",legalTitle:"AVISO LEGAL",legalCompany:"MAY ROGA LLC — empresa de apoyo de CUBA AUTO TRAVEL 2026",legalCompanyShort:"MAY ROGA LLC — empresa de apoyo",legalText:"CUBA AUTO TRAVEL 2026 es una aplicación informativa independiente. MAY ROGA LLC proporciona apoyo para el desarrollo y funcionamiento de esta guía, pero no es una agencia gubernamental ni representa al Gobierno de Cuba, embajadas, consulados, autoridades migratorias, eVisa Cuba, D'Viajeros, aerolíneas ni otras entidades oficiales.",legalResponsibility:"MAY ROGA LLC y CUBA AUTO TRAVEL 2026 no emiten, aprueban ni garantizan visas, permisos de entrada, códigos QR, vuelos, reservas, precios, seguros ni admisión a Cuba. La información puede cambiar. El viajero debe verificar los requisitos directamente con las fuentes oficiales y proveedores correspondientes.",legalAdvice:"Esta aplicación ofrece información general y orientación práctica. No constituye asesoría legal, migratoria, consular, financiera, médica ni una garantía de viaje.",legalPrivacy:"No introduzcas aquí información sensible que no sea necesaria. Cuando un trámite requiera datos personales, utiliza directamente el sitio oficial correspondiente.",legalLinks:"Aviso legal",footerText:"Guía informativa independiente para pasajeros.",simulation:"SIMULACIÓN — NO ES EL FORMULARIO OFICIAL",simulationText:"Usa datos de ejemplo. No introduzcas aquí datos reales de tu pasaporte.",visaPracticeTitle:"Practica la Visa antes de solicitarla",visaPracticeIntro:"Esta pantalla es una simulación para que conozcas el orden de los campos. No es eVisa Cuba y no envía información.",watchVisa:"Mira primero",watchVisaText:"Conoce el proceso antes de comenzar.",visaVideoTitle:"Tutorial de Visa Cuba",visaVideoText:"Puedes consultar tutoriales y explicaciones sobre el proceso antes de entrar al portal oficial.",watchYoutube:"VER TUTORIALES EN YOUTUBE",visaSimTitle:"Solicitud de visa — práctica",stepWord:"PASO",tip:"CONSEJO:",practiceTip:"Cuando llegues al sitio oficial, ten tu pasaporte delante y escribe los datos exactamente como aparecen en él.",dPracticeTitle:"Practica D'Viajeros antes de abrirlo",dPracticeIntro:"Aprende el orden y el tipo de información que encontrarás. Esta es una simulación y no envía nada al sistema oficial.",watchD:"Mira primero",watchDText:"Observa el proceso antes de comenzar.",dVideoTitle:"Tutorial D'Viajeros",dVideoText:"Consulta videos explicativos y familiarízate con el formulario antes de completarlo.",dSimTitle:"D'Viajeros — práctica",dPracticeTip:"Ten a mano pasaporte, vuelo y datos del viaje. La práctica no guarda ni envía lo que escribas.",savePractice:"GUARDAR PRÁCTICA",clearPractice:"BORRAR PRÁCTICA",savedPractice:"Práctica guardada en este dispositivo.",clearedPractice:"Práctica borrada.",reviewPractice:"REVISAR DATOS",transcribePractice:"LISTO PARA PASAR AL OFICIAL",optional:"OPCIONAL",required:"OBLIGATORIO",homeDVideoTitle:"CÓMO HACER D'VIAJEROS",homeDVideoText:"Mira un tutorial paso a paso antes de completar el formulario.",homeVisaVideoTitle:"CÓMO HACER LA VISA",homeVisaVideoText:"Mira tutoriales sobre cómo completar la solicitud de visa antes de entrar a eVisa Cuba.",homeWatchVideo:"VER VIDEO →"
},
en:{
brandSub:"Practical guide to travel prepared",heroTitle:"Are you traveling to Cuba?",heroText:"Don't be afraid of the visa or D'Viajeros. We show you what to check and where to complete each process.",visaButton:"DO / REVIEW MY VISA",dviajerosButton:"DO D'VIAJEROS",privacyNote:"You do not need to store your passport information here. Use this app as a guide and complete official procedures on official websites.",quickVisa:"Visa",quickVisaText:"What to check before applying",quickDviajerosText:"Digital form step by step",quickFlights:"Flights",quickFlightsText:"Search flights and options to Cuba",trainingTitle:"LEARN BEFORE YOU DO IT",trainingText:"Practice first with a simulation so you know what to expect when you open the official form.",practiceVisa:"Practice the Visa",practiceVisaText:"See and practice the fields before opening Cuba eVisa.",practiceD:"Practice D'Viajeros",practiceDText:"Learn the order of the information before opening D'Viajeros.",startPractice:"START PRACTICE →",back:"← Back",important:"IMPORTANT",tutorial:"STEP-BY-STEP GUIDE",followSteps:"Follow each step calmly.",previous:"PREVIOUS",next:"NEXT",checkBefore:"✓ Check before submitting",openOfficial:"OPEN OFFICIAL SITE",openOfficialD:"OPEN D'VIAJEROS",visaTitle:"Visa to travel to Cuba",dviajerosTitle:"D'Viajeros step by step",visaWarning:"Always check official requirements before submitting an application.",dviajerosWarning:"Complete the information carefully and keep your QR code.",officialVisaTitle:"Official Cuba eVisa portal",officialVisaText:"Submit your application directly on the official website.",officialDTitle:"Official D'Viajeros website",officialDText:"Complete the form directly on the official website.",flightsTitle:"Find your flight",flightsIntro:"Compare options and always confirm route, date, price and conditions directly with the provider.",routeSearch:"Search route",searchFlights:"SEARCH FLIGHTS",chartersTitle:"Charter flight options",usWarningTitle:"IF YOU TRAVEL FROM THE U.S.",usWarningText:"U.S. rules for travel to Cuba from or through the U.S. have specific requirements. Verify your authorized category and current conditions before purchasing.",finalTitle:"Before traveling",finalIntro:"Do one final review before leaving.",final1:"Passport checked",final2:"Visa checked",final3:"Travel insurance checked",final4:"D'Viajeros completed",final5:"QR code saved",final6:"Flight and documents checked",reviewVisa:"REVIEW VISA",reviewD:"REVIEW D'VIAJEROS",legalTitle:"LEGAL NOTICE",legalCompany:"MAY ROGA LLC — support company for CUBA AUTO TRAVEL 2026",legalCompanyShort:"MAY ROGA LLC — support company",legalText:"CUBA AUTO TRAVEL 2026 is an independent informational application. MAY ROGA LLC provides support for the development and operation of this guide, but it is not a government agency and does not represent the Cuban Government, embassies, consulates, immigration authorities, Cuba eVisa, D'Viajeros, airlines or other official entities.",legalResponsibility:"MAY ROGA LLC and CUBA AUTO TRAVEL 2026 do not issue, approve or guarantee visas, entry permits, QR codes, flights, reservations, prices, insurance or admission to Cuba. Information may change. Travelers must verify requirements directly with official sources and the applicable providers.",legalAdvice:"This application provides general information and practical guidance. It is not legal, immigration, consular, financial or medical advice and does not guarantee travel.",legalPrivacy:"Do not enter unnecessary sensitive information here. When a procedure requires personal data, use the corresponding official website directly.",legalLinks:"Legal notice",footerText:"Independent informational guide for travelers.",simulation:"SIMULATION — NOT THE OFFICIAL FORM",simulationText:"Use example information. Do not enter real passport information here.",visaPracticeTitle:"Practice the Visa before applying",visaPracticeIntro:"This screen is a simulation so you can learn the order of the fields. It is not Cuba eVisa and sends no information.",watchVisa:"WATCH FIRST",watchVisaText:"Learn the process before starting.",visaVideoTitle:"Cuba Visa Tutorial",visaVideoText:"You can review tutorials and explanations before entering the official portal.",watchYoutube:"WATCH YOUTUBE TUTORIALS",visaSimTitle:"Visa application — practice",stepWord:"STEP",tip:"TIP:",practiceTip:"When you reach the official website, keep your passport in front of you and enter the information exactly as it appears.",dPracticeTitle:"Practice D'Viajeros before opening it",dPracticeIntro:"Learn the order and type of information you will find. This is a simulation and sends nothing to the official system.",watchD:"WATCH FIRST",watchDText:"Observe the process before starting.",dVideoTitle:"D'Viajeros Tutorial",dVideoText:"Review explanatory videos and become familiar with the form before completing it.",dSimTitle:"D'Viajeros — practice",dPracticeTip:"Have your passport, flight and trip information ready. The practice does not store or send what you enter.",savePractice:"SAVE PRACTICE",clearPractice:"CLEAR PRACTICE",savedPractice:"Practice saved on this device.",clearedPractice:"Practice cleared.",reviewPractice:"REVIEW DATA",transcribePractice:"READY FOR OFFICIAL FORM",optional:"OPTIONAL",required:"REQUIRED",homeDVideoTitle:"HOW TO COMPLETE D'VIAJEROS",homeDVideoText:"Watch a step-by-step tutorial before completing the form.",homeVisaVideoTitle:"HOW TO APPLY FOR THE VISA",homeVisaVideoText:"Watch tutorials on completing the visa application before opening Cuba eVisa.",homeWatchVideo:"WATCH VIDEO →"
}};

const visaSim={
es:[
["country","País donde solicita","Ejemplo: Estados Unidos","select","required"],
["consulate","Consulado","Ejemplo: Consulado correspondiente","select","required"],
["nationality","Nacionalidad","Ejemplo: Estados Unidos","select","required"],
["passport","Pasaporte","Ejemplo: X12345678","text","required"],
["given","Nombre","Ejemplo: JUAN CARLOS","text","required"],
["middle","Segundo nombre","Ejemplo: ANDRES","text","optional"],
["surname","Primer apellido","Ejemplo: GARCIA","text","required"],
["surname2","Segundo apellido","Ejemplo: RODRIGUEZ","text","optional"],
["birth","Fecha de nacimiento","Ejemplo: 15/05/1985","text","required"],
["email","Correo electrónico","Ejemplo: [ejemplo@email.com](mailto:ejemplo@email.com)","email","required"],
["email2","Repita el correo electrónico","Ejemplo: [ejemplo@email.com](mailto:ejemplo@email.com)","email","required"],
["sex","Sexo o género","Selecciona una opción","select","required"],
["phone","Teléfono","Ejemplo: +1 305 555 0000","text","optional"]
],
en:[
["country","Country where you apply","Example: United States","select","required"],
["consulate","Consulate","Example: Corresponding consulate","select","required"],
["nationality","Nationality","Example: United States","select","required"],
["passport","Passport","Example: X12345678","text","required"],
["given","First name","Example: JUAN CARLOS","text","required"],
["middle","Middle name","Example: ANDRES","text","optional"],
["surname","First surname","Example: GARCIA","text","required"],
["surname2","Second surname","Example: RODRIGUEZ","text","optional"],
["birth","Date of birth","Example: 05/15/1985","text","required"],
["email","Email address","Example: [example@email.com](mailto:example@email.com)","email","required"],
["email2","Repeat email address","Example: [example@email.com](mailto:example@email.com)","email","required"],
["sex","Sex or gender","Select an option","select","required"],
["phone","Phone number","Example: +1 305 555 0000","text","optional"]
]};

const dSim={
es:[
["name","Nombre","Ejemplo: JUAN","text","required"],
["surname","Apellidos","Ejemplo: GARCIA","text","required"],
["passport","Pasaporte","Ejemplo: X12345678","text","required"],
["birth","Fecha de nacimiento","Ejemplo: 15/05/1985","text","required"],
["nationality","Nacionalidad","Ejemplo: Estados Unidos","text","required"],
["flight","Vuelo","Ejemplo: AA123","text","required"],
["travelDate","Fecha del viaje","Ejemplo: 15/10/2026","text","required"],
["destination","Destino","Ejemplo: La Habana","text","required"],
["review","Revisión final","Comprueba todos los datos antes de finalizar","review","required"]
],
en:[
["name","First name","Example: JUAN","text","required"],
["surname","Surname","Example: GARCIA","text","required"],
["passport","Passport","Example: X12345678","text","required"],
["birth","Date of birth","Example: 05/15/1985","text","required"],
["nationality","Nationality","Example: United States","text","required"],
["flight","Flight","Example: AA123","text","required"],
["travelDate","Travel date","Example: 10/15/2026","text","required"],
["destination","Destination","Example: Havana","text","required"],
["review","Final review","Check all information before finishing","review","required"]
]};

function qs(s){return document.querySelector(s)}
function qsa(s){return [...document.querySelectorAll(s)]}

function esc(v){
return String(v??"").replace(/[&<>"']/g,c=>({"&":"&","<":"<",">":">",'"':""","'":"'"}[c]))
}

function applyLanguage(){
document.documentElement.lang=state.lang;
const t=T[state.lang];
qsa("[data-i18n]").forEach(e=>{
const k=e.dataset.i18n;
if(t[k]!==undefined)e.textContent=t[k]
});
const lb=qs("#languageBtn");
if(lb)lb.textContent=state.lang==="es"?"ENGLISH":"ESPAÑOL";
renderSim("visa");
renderSim("d")
}

function showPage(id){
qsa(".page").forEach(p=>p.classList.toggle("active",p.id===id));
state.page=id;
window.scrollTo({top:0,behavior:"smooth"});
if(id==="visa")renderGuide("visa");
if(id==="dviajeros")renderGuide("dviajeros");
if(id==="visaPractice")renderSim("visa");
if(id==="dPractice")renderSim("d")
}

function bind(){
qsa("[data-go]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.go)));

const languageBtn=qs("#languageBtn");
if(languageBtn)languageBtn.addEventListener("click",()=>{
state.lang=state.lang==="es"?"en":"es";
applyLanguage();
renderAll()
});

qs("#visaPrev")?.addEventListener("click",()=>moveGuide("visa",-1));
qs("#visaNext")?.addEventListener("click",()=>moveGuide("visa",1));
qs("#dviajerosPrev")?.addEventListener("click",()=>moveGuide("dviajeros",-1));
qs("#dviajerosNext")?.addEventListener("click",()=>moveGuide("dviajeros",1));
qs("#visaSimPrev")?.addEventListener("click",()=>moveSim("visa",-1));
qs("#visaSimNext")?.addEventListener("click",()=>moveSim("visa",1));
qs("#dSimPrev")?.addEventListener("click",()=>moveSim("d",-1));
qs("#dSimNext")?.addEventListener("click",()=>moveSim("d",1));

qs("#saveVisaPractice")?.addEventListener("click",()=>savePractice("visa"));
qs("#clearVisaPractice")?.addEventListener("click",()=>clearPractice("visa"));
qs("#saveDPractice")?.addEventListener("click",()=>savePractice("d"));
qs("#clearDPractice")?.addEventListener("click",()=>clearPractice("d"));
}

async function loadData(){
try{
const r=await fetch("/api/data",{cache:"no-store"});
if(r.ok)state.data=await r.json()
}catch(e){console.warn("Datos no disponibles:",e)}

try{
const r=await fetch("/api/flights",{cache:"no-store"});
if(r.ok)state.data.flights=await r.json()
}catch(e){console.warn("Vuelos no disponibles:",e)}

renderAll()
}

function renderAll(){
renderGuide("visa");
renderGuide("dviajeros");
renderFlights();
renderSim("visa");
renderSim("d")
}

function renderGuide(type){
const key=type==="visa"?"cuba_visa":"dviajeros";
const d=state.data[key]||{};
const lang=state.lang;
const intro=qs("#"+type+"Intro");
if(intro)intro.textContent=d["intro_"+lang]||"";

const steps=(d.steps&&d.steps[lang])||[];
const i=type==="visa"?state.visaStep:state.dviajerosStep;
const box=qs("#"+type+"Steps");
if(!box)return;

if(!steps.length){
box.innerHTML='<div class="step"><div class="step-number">✓</div><div><h3>Información disponible</h3><p>Abre el portal oficial para continuar.</p></div></div>';
return
}

const s=steps[Math.min(i,steps.length-1)];
box.innerHTML=`<div class="step"><div class="step-number">${esc(s.number)}</div><div><div class="step-label">${state.lang==="es"?"PASO":"STEP"} ${esc(s.number)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`;

const counter=qs("#"+type+"Counter");
if(counter)counter.textContent=`${i+1} / ${steps.length}`;

const prev=qs("#"+type+"Prev"),next=qs("#"+type+"Next");
if(prev)prev.disabled=i===0;
if(next)next.disabled=i===steps.length-1;

const list=d.check_before_submit?.[lang]||d.checklist?.[lang]||[];
const cl=qs("#"+type+"Checklist");
if(cl)cl.innerHTML=list.map(x=>`<div>✓ ${esc(x)}</div>`).join("")
}

function moveGuide(type,n){
if(type==="visa"){
const max=(state.data.cuba_visa?.steps?.[state.lang]||[]).length;
state.visaStep=Math.max(0,Math.min(state.visaStep+n,Math.max(0,max-1)));
renderGuide(type)
}else{
const max=(state.data.dviajeros?.steps?.[state.lang]||[]).length;
state.dviajerosStep=Math.max(0,Math.min(state.dviajerosStep+n,Math.max(0,max-1)));
renderGuide(type)
}
}

function renderFlights(){
const f=state.data.flights;
if(!f)return;

const providers=Object.values(f.providers||{});
const box=qs("#flightProviders");

if(box)box.innerHTML=providers.map(p=>`<div class="flight-card"><span class="flight-icon">✈️</span><h3>${esc(p.name||p.name_es||"Flight provider")}</h3><p>${esc(p[state.lang==="es"?"description_es":"description_en"]||"")}</p><a class="primary" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${state.lang==="es"?"ABRIR":"OPEN"}</a></div>`).join("");

const ab=qs("#airportButtons"),db=qs("#destinationButtons");

if(ab)ab.innerHTML=(f.airports||[]).map(a=>`<button class="airport ${state.airport===a.code?"selected":""}" data-air="${esc(a.code)}" type="button">${esc(a.code)} · ${esc(state.lang==="es"?a.name:a.name_en)}</button>`).join("");

if(db)db.innerHTML=(f.destinations||[]).map(d=>`<button class="destination ${state.destination===d.code?"selected":""}" data-dest="${esc(d.code)}" type="button">${esc(d.code)} · ${esc(state.lang==="es"?d.name:d.name_en)}</button>`).join("");

qsa("[data-air]").forEach(b=>b.onclick=()=>{
state.airport=b.dataset.air;
renderFlights()
});

qsa("[data-dest]").forEach(b=>b.onclick=()=>{
state.destination=b.dataset.dest;
renderFlights()
});

const cb=qs("#charterList");
if(cb)cb.innerHTML=(f.charters||[]).map(c=>`<div class="charter-item"><div><strong>${esc(c.name)}</strong><span>${esc(c.type)}</span><p>${esc(c[state.lang==="es"?"note_es":"note_en"]||"")}</p></div><a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer">↗</a></div>`).join("");

const g=qs("#googleRoute");
if(g)g.onclick=()=>window.open(`https://www.google.com/travel/flights?hl=${state.lang}&curr=USD#flt=${encodeURIComponent(state.airport)}.${encodeURIComponent(state.destination)}.${encodeURIComponent(state.airport)}`,"_blank")
}

function getPracticeKey(type){
return type==="visa"?"cuba_auto_travel_visa_practice":"cuba_auto_travel_d_practice"
}

function loadPractice(type){
try{
const raw=localStorage.getItem(getPracticeKey(type));
const data=raw?JSON.parse(raw):{};
if(data&&typeof data==="object"&&!Array.isArray(data))state.sim[type]=data;
else state.sim[type]={};
return state.sim[type]
}catch(e){
state.sim[type]={};
return state.sim[type]
}
}

function captureCurrent(type){
const fields=type==="visa"?visaSim[state.lang]:dSim;
const box=qs(type==="visa"?"#visaSimFields":"#dSimFields");
if(!box)return;

const step=type==="visa"?state.visaSimStep:state.dSimStep;
const f=fields[step];
if(!f||f[3]==="review")return;

const input=box.querySelector("[data-practice-field]");
if(input)state.sim[type][f[0]]=input.value
}

function savePractice(type){
captureCurrent(type);
try{
localStorage.setItem(getPracticeKey(type),JSON.stringify(state.sim[type]||{}));
showPracticeMessage(type,T[state.lang].savedPractice)
}catch(e){
console.warn("No se pudo guardar la práctica:",e)
}
}

function clearPractice(type){
try{
localStorage.removeItem(getPracticeKey(type));
state.sim[type]={};
if(type==="visa")state.visaSimStep=0;
else state.dSimStep=0;
renderSim(type);
showPracticeMessage(type,T[state.lang].clearedPractice)
}catch(e){
console.warn("No se pudo borrar la práctica:",e)
}
}

function showPracticeMessage(type,message){
const id=type==="visa"?"#visaPracticeMessage":"#dPracticeMessage";
const el=qs(id);
if(!el)return;
el.textContent=message;
el.style.display="block";
clearTimeout(el._timer);
el._timer=setTimeout(()=>{el.style.display="none"},3000)
}

function renderSim(type){
const data=type==="visa"?visaSim[state.lang]:dSim;
const step=type==="visa"?state.visaSimStep:state.dSimStep;
const box=qs(type==="visa"?"#visaSimFields":"#dSimFields");
if(!box)return;

const saved=loadPractice(type);
const f=data[step];
if(!f)return;

if(f[3]==="review"){
box.innerHTML=`<div class="sim-fields"><div class="sim-field active"><label>${esc(f[1])}</label><div class="practice-tip">✓ ${esc(f[2])}</div><p class="field-help">${esc(T[state.lang].simulationText)}</p></div></div>`
}else{
const required=f[4]==="required";
const marker=required?` <span aria-hidden="true">*</span>`:` <small>${esc(T[state.lang].optional)}</small>`;
const value=saved[f[0]]??"";
let field="";

if(f[3]==="select"){
field=`<select data-practice-field="${esc(f[0])}" autocomplete="off"><option value="">${esc(f[2])}</option><option value="${state.lang==="es"?"Ejemplo A":"Example A"}">${state.lang==="es"?"Ejemplo A":"Example A"}</option><option value="${state.lang==="es"?"Ejemplo B":"Example B"}">${state.lang==="es"?"Ejemplo B":"Example B"}</option></select>`
}else{
field=`<input data-practice-field="${esc(f[0])}" type="${esc(f[3])}" value="${esc(value)}" placeholder="${esc(f[2])}" autocomplete="off" autocapitalize="characters" spellcheck="false">`
}

box.innerHTML=`<div class="sim-fields"><div class="sim-field active"><label>${esc(f[1])}${marker}</label>${field}<p class="field-help">${esc(T[state.lang].simulationText)}</p></div></div>`;

const input=box.querySelector("[data-practice-field]");
if(input){
input.value=value;
input.addEventListener("input",()=>{state.sim[type][f[0]]=input.value});
input.addEventListener("change",()=>{state.sim[type][f[0]]=input.value})
}
}

const total=data.length;

if(type==="visa"){
const n=qs("#visaSimNumber"),tt=qs("#visaSimTotal"),c=qs("#visaSimCounter"),p=qs("#visaSimPrev"),nx=qs("#visaSimNext");
if(n)n.textContent=step+1;
if(tt)tt.textContent=total;
if(c)c.textContent=`${step+1} / ${total}`;
if(p)p.disabled=step===0;
if(nx)nx.disabled=step===total-1
}else{
const n=qs("#dSimNumber"),tt=qs("#dSimTotal"),c=qs("#dSimCounter"),p=qs("#dSimPrev"),nx=qs("#dSimNext");
if(n)n.textContent=step+1;
if(tt)tt.textContent=total;
if(c)c.textContent=`${step+1} / ${total}`;
if(p)p.disabled=step===0;
if(nx)nx.disabled=step===total-1
}

const msg=qs(type==="visa"?"#visaPracticeMessage":"#dPracticeMessage");
if(msg&&msg.textContent)msg.style.display="block"
}

function moveSim(type,n){
const arr=type==="visa"?visaSim[state.lang]:dSim;
if(!arr.length)return;

captureCurrent(type);

if(type==="visa"){
state.visaSimStep=Math.max(0,Math.min(state.visaSimStep+n,arr.length-1));
renderSim(type)
}else{
state.dSimStep=Math.max(0,Math.min(state.dSimStep+n,arr.length-1));
renderSim(type)
}
}

function start(){
bind();
applyLanguage();
loadData()
}

document.addEventListener("DOMContentLoaded",start);
