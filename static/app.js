const state={lang:"es",page:"home",visaStep:0,dviajerosStep:0,visaSimStep:0,dSimStep:0,airport:"MIA",destination:"HAV",data:{},sim:{visa:{},d:{}},token:null,expiresAt:0,access:false,accessType:"",config:null,timer:null};

const T={es:{brandSub:"Guía práctica para viajar preparado",heroTitle:"¿Vas a viajar a Cuba?",heroText:"No tengas miedo a la visa ni a D'Viajeros. Te mostramos qué revisar y dónde hacer cada trámite.",visaButton:"HACER / REVISAR MI VISA",dviajerosButton:"HACER D'VIAJEROS",privacyNote:"No necesitas guardar aquí los datos de tu pasaporte. Usa esta aplicación como guía y realiza los trámites en los sitios oficiales.",quickVisa:"Visa",quickVisaText:"Qué revisar antes de solicitarla",quickDviajerosText:"Formulario digital paso a paso",quickFlights:"Vuelos",quickFlightsText:"Busca vuelos y opciones a Cuba",trainingTitle:"APRENDE ANTES DE HACERLO",trainingText:"Practica primero con una simulación. Así llegarás al formulario oficial sabiendo qué vas a encontrar.",practiceVisa:"Practicar la Visa",practiceVisaText:"Mira y practica los campos antes de entrar a eVisa Cuba.",practiceD:"Practicar D'Viajeros",practiceDText:"Aprende el orden de los datos antes de abrir D'Viajeros.",startPractice:"COMENZAR PRÁCTICA →",back:"← Volver",important:"IMPORTANTE",tutorial:"GUÍA PASO A PASO",followSteps:"Sigue cada paso con calma.",previous:"ANTERIOR",next:"SIGUIENTE",checkBefore:"✓ Revisa antes de enviar",openOfficial:"ABRIR SITIO OFICIAL",openOfficialD:"ABRIR D'VIAJEROS",visaTitle:"Visa para viajar a Cuba",dviajerosTitle:"D'Viajeros paso a paso",visaWarning:"Revisa siempre los requisitos oficiales antes de enviar una solicitud.",dviajerosWarning:"Completa la información con cuidado y conserva el código QR.",officialVisaTitle:"Portal oficial eVisa Cuba",officialVisaText:"Realiza la solicitud directamente en el sitio oficial.",officialDTitle:"Sitio oficial D'Viajeros",officialDText:"Completa el formulario directamente en el sitio oficial.",flightsTitle:"Busca tu vuelo",flightsIntro:"Compara opciones y confirma siempre ruta, fecha, precio y condiciones directamente con el proveedor.",routeSearch:"Buscar ruta",searchFlights:"BUSCAR VUELOS",chartersTitle:"Opciones de vuelos charter",usWarningTitle:"SI VIAJAS DESDE EE. UU.",usWarningText:"Las reglas estadounidenses para viajar a Cuba desde o a través de EE. UU. tienen requisitos específicos. Verifica tu categoría autorizada y las condiciones actuales antes de comprar.",finalTitle:"Antes de viajar",finalIntro:"Haz una última revisión antes de salir.",final1:"Pasaporte revisado",final2:"Visa revisada",final3:"Seguro de viaje revisado",final4:"D'Viajeros completado",final5:"Código QR guardado",final6:"Vuelo y documentos revisados",reviewVisa:"REVISAR VISA",reviewD:"REVISAR D'VIAJEROS",legalTitle:"AVISO LEGAL",legalCompany:"MAY ROGA LLC — empresa de apoyo de CUBA AUTO TRAVEL 2026",legalCompanyShort:"MAY ROGA LLC — empresa de apoyo",legalText:"CUBA AUTO TRAVEL 2026 es una aplicación informativa independiente. MAY ROGA LLC proporciona apoyo para el desarrollo y funcionamiento de esta guía, pero no es una agencia gubernamental ni representa al Gobierno de Cuba, embajadas, consulados, autoridades migratorias, eVisa Cuba, D'Viajeros, aerolíneas ni otras entidades oficiales.",legalResponsibility:"MAY ROGA LLC y CUBA AUTO TRAVEL 2026 no emiten, aprueban ni garantizan visas, permisos de entrada, códigos QR, vuelos, reservas, precios, seguros ni admisión a Cuba. La información puede cambiar. El viajero debe verificar los requisitos directamente con las fuentes oficiales y proveedores correspondientes.",legalAdvice:"Esta aplicación ofrece información general y orientación práctica. No constituye asesoría legal, migratoria, consular, financiera, médica ni una garantía de viaje.",legalPrivacy:"No introduzcas aquí información sensible que no sea necesaria. Cuando un trámite requiera datos personales, utiliza directamente el sitio oficial correspondiente.",legalLinks:"Aviso legal",footerText:"Guía informativa independiente para pasajeros.",simulation:"SIMULACIÓN — NO ES EL FORMULARIO OFICIAL",simulationText:"Usa datos de ejemplo. No introduzcas aquí datos reales de tu pasaporte.",visaPracticeTitle:"Practica la Visa antes de solicitarla",visaPracticeIntro:"Esta pantalla es una simulación para que conozcas el orden de los campos. No es eVisa Cuba y no envía información.",watchVisa:"Mira primero",watchVisaText:"Conoce el proceso antes de comenzar.",visaVideoTitle:"Tutorial de Visa Cuba",visaVideoText:"Puedes consultar tutoriales y explicaciones sobre el proceso antes de entrar al portal oficial.",watchYoutube:"VER TUTORIALES EN YOUTUBE",visaSimTitle:"Solicitud de visa — práctica",stepWord:"PASO",tip:"CONSEJO:",practiceTip:"Cuando llegues al sitio oficial, ten tu pasaporte delante y escribe los datos exactamente como aparecen en él.",dPracticeTitle:"Practica D'Viajeros antes de abrirlo",dPracticeIntro:"Aprende el orden y el tipo de información que encontrarás. Esta es una simulación y no envía nada al sistema oficial.",watchD:"Mira primero",watchDText:"Observa el proceso antes de comenzar.",dVideoTitle:"Tutorial D'Viajeros",dVideoText:"Consulta videos explicativos y familiarízate con el formulario antes de completarlo.",dSimTitle:"D'Viajeros — práctica",dPracticeTip:"Ten a mano pasaporte, vuelo y datos del viaje. La práctica no guarda ni envía lo que escribas.",savePractice:"GUARDAR PRÁCTICA",clearPractice:"BORRAR PRÁCTICA",savedPractice:"Práctica guardada en este dispositivo.",clearedPractice:"Práctica borrada.",optional:"OPCIONAL",accessTitle:"CUBA AUTO TRAVEL 2026",accessText:"Accede al servicio para utilizar la guía completa.",payTitle:"PAGO ÚNICO",payText:"Acceso al servicio por 18 minutos.",payButton:"PAGAR $20 Y ENTRAR",adminTitle:"ACCESO",username:"Usuario",password:"Contraseña",login:"ENTRAR",close:"CERRAR",wrongLogin:"Usuario o contraseña incorrectos.",paymentError:"No fue posible iniciar el pago. Inténtalo nuevamente.",paymentCancelled:"El pago fue cancelado.",paymentChecking:"Verificando tu pago...",paymentApproved:"Pago confirmado. Preparando tu acceso...",expiredTitle:"TIEMPO TERMINADO",expiredText:"Los 18 minutos de servicio han terminado.",expiredButton:"VOLVER A ENTRAR",remaining:"Tiempo restante",minutes:"min",seconds:"s"},en:{brandSub:"Practical guide to travel prepared",heroTitle:"Are you traveling to Cuba?",heroText:"Don't be afraid of the visa or D'Viajeros. We show you what to check and where to complete each process.",visaButton:"DO / REVIEW MY VISA",dviajerosButton:"DO D'VIAJEROS",privacyNote:"You do not need to store your passport information here. Use this app as a guide and complete official procedures on official websites.",quickVisa:"Visa",quickVisaText:"What to check before applying",quickDviajerosText:"Digital form step by step",quickFlights:"Flights",quickFlightsText:"Search flights and options to Cuba",trainingTitle:"LEARN BEFORE YOU DO IT",trainingText:"Practice first with a simulation so you know what to expect when you open the official form.",practiceVisa:"Practice the Visa",practiceVisaText:"See and practice the fields before opening Cuba eVisa.",practiceD:"Practice D'Viajeros",practiceDText:"Learn the order of the information before opening D'Viajeros.",startPractice:"START PRACTICE →",back:"← Back",important:"IMPORTANT",tutorial:"STEP-BY-STEP GUIDE",followSteps:"Follow each step calmly.",previous:"PREVIOUS",next:"NEXT",checkBefore:"✓ Check before submitting",openOfficial:"OPEN OFFICIAL SITE",openOfficialD:"OPEN D'VIAJEROS",visaTitle:"Visa to travel to Cuba",dviajerosTitle:"D'Viajeros step by step",visaWarning:"Always check official requirements before submitting an application.",dviajerosWarning:"Complete the information carefully and keep your QR code.",officialVisaTitle:"Official Cuba eVisa portal",officialVisaText:"Submit your application directly on the official website.",officialDTitle:"Official D'Viajeros website",officialDText:"Complete the form directly on the official website.",flightsTitle:"Find your flight",flightsIntro:"Compare options and always confirm route, date, price and conditions directly with the provider.",routeSearch:"Search route",searchFlights:"SEARCH FLIGHTS",chartersTitle:"Charter flight options",usWarningTitle:"IF YOU TRAVEL FROM THE U.S.",usWarningText:"U.S. rules for travel to Cuba from or through the U.S. have specific requirements. Verify your authorized category and current conditions before purchasing.",finalTitle:"Before traveling",finalIntro:"Do one final review before leaving.",final1:"Passport checked",final2:"Visa checked",final3:"Travel insurance checked",final4:"D'Viajeros completed",final5:"QR code saved",final6:"Flight and documents checked",reviewVisa:"REVIEW VISA",reviewD:"REVIEW D'VIAJEROS",legalTitle:"LEGAL NOTICE",legalCompany:"MAY ROGA LLC — support company for CUBA AUTO TRAVEL 2026",legalCompanyShort:"MAY ROGA LLC — support company",legalText:"CUBA AUTO TRAVEL 2026 is an independent informational application. MAY ROGA LLC provides support for the development and operation of this guide, but it is not a government agency and does not represent the Cuban Government, embassies, consulates, immigration authorities, Cuba eVisa, D'Viajeros, airlines or other official entities.",legalResponsibility:"MAY ROGA LLC and CUBA AUTO TRAVEL 2026 do not issue, approve or guarantee visas, entry permits, QR codes, flights, reservations, prices, insurance or admission to Cuba. Information may change. Travelers must verify requirements directly with official sources and the applicable providers.",legalAdvice:"This application provides general information and practical guidance. It is not legal, immigration, consular, financial or medical advice and does not guarantee travel.",legalPrivacy:"Do not enter unnecessary sensitive information here. When a procedure requires personal data, use the corresponding official website directly.",legalLinks:"Legal notice",footerText:"Independent informational guide for travelers.",simulation:"SIMULATION — NOT THE OFFICIAL FORM",simulationText:"Use example information. Do not enter real passport information here.",visaPracticeTitle:"Practice the Visa before applying",visaPracticeIntro:"This screen is a simulation so you can learn the order of the fields. It is not Cuba eVisa and sends no information.",watchVisa:"WATCH FIRST",watchVisaText:"Learn the process before starting.",visaVideoTitle:"Cuba Visa Tutorial",visaVideoText:"You can review tutorials and explanations before entering the official portal.",watchYoutube:"WATCH YOUTUBE TUTORIALS",visaSimTitle:"Visa application — practice",stepWord:"STEP",tip:"TIP:",practiceTip:"When you reach the official website, keep your passport in front of you and enter the information exactly as it appears.",dPracticeTitle:"Practice D'Viajeros before opening it",dPracticeIntro:"Learn the order and type of information you will find. This is a simulation and sends nothing to the official system.",watchD:"WATCH FIRST",watchDText:"Observe the process before starting.",dVideoTitle:"D'Viajeros Tutorial",dVideoText:"Review explanatory videos and become familiar with the form before completing it.",dSimTitle:"D'Viajeros — practice",dPracticeTip:"Have your passport, flight and trip information ready. The practice does not store or send what you enter.",savePractice:"SAVE PRACTICE",clearPractice:"CLEAR PRACTICE",savedPractice:"Practice saved on this device.",clearedPractice:"Practice cleared.",optional:"OPTIONAL",accessTitle:"CUBA AUTO TRAVEL 2026",accessText:"Access the service to use the complete guide.",payTitle:"ONE-TIME PAYMENT",payText:"18-minute service access.",payButton:"PAY $20 AND ENTER",adminTitle:"ACCESS",username:"Username",password:"Password",login:"ENTER",close:"CLOSE",wrongLogin:"Incorrect username or password.",paymentError:"Unable to start payment. Please try again.",paymentCancelled:"Payment was cancelled.",paymentChecking:"Verifying your payment...",paymentApproved:"Payment confirmed. Preparing your access...",expiredTitle:"TIME EXPIRED",expiredText:"Your 18-minute service has ended.",expiredButton:"START AGAIN",remaining:"Time remaining",minutes:"min",seconds:"s"}};

const visaSim={es:[["country","País donde solicita","Ejemplo: Estados Unidos","select","required"],["consulate","Consulado","Ejemplo: Consulado correspondiente","select","required"],["nationality","Nacionalidad","Ejemplo: Estados Unidos","select","required"],["passport","Pasaporte","Ejemplo: X12345678","text","required"],["given","Nombre","Ejemplo: JUAN CARLOS","text","required"],["middle","Segundo nombre","Ejemplo: ANDRES","text","optional"],["surname","Primer apellido","Ejemplo: GARCIA","text","required"],["surname2","Segundo apellido","Ejemplo: RODRIGUEZ","text","optional"],["birth","Fecha de nacimiento","Ejemplo: 15/05/1985","text","required"],["email","Correo electrónico","Ejemplo: ejemplo@email.com","email","required"],["email2","Repita el correo electrónico","Ejemplo: ejemplo@email.com","email","required"],["sex","Sexo o género","Selecciona una opción","select","required"],["phone","Teléfono","Ejemplo: +1 305 555 0000","text","optional"]],en:[["country","Country where you apply","Example: United States","select","required"],["consulate","Consulate","Example: Corresponding consulate","select","required"],["nationality","Nationality","Example: United States","select","required"],["passport","Passport","Example: X12345678","text","required"],["given","First name","Example: JUAN CARLOS","text","required"],["middle","Middle name","Example: ANDRES","text","optional"],["surname","First surname","Example: GARCIA","text","required"],["surname2","Second surname","Example: RODRIGUEZ","text","optional"],["birth","Date of birth","Example: 05/15/1985","text","required"],["email","Email address","Example: example@email.com","email","required"],["email2","Repeat email address","Example: example@email.com","email","required"],["sex","Sex or gender","Select an option","select","required"],["phone","Phone number","Example: +1 305 555 0000","text","optional"]]};

const dSim={es:[["name","Nombre","Ejemplo: JUAN","text","required"],["surname","Apellidos","Ejemplo: GARCIA","text","required"],["passport","Pasaporte","Ejemplo: X12345678","text","required"],["birth","Fecha de nacimiento","Ejemplo: 15/05/1985","text","required"],["nationality","Nacionalidad","Ejemplo: Estados Unidos","text","required"],["flight","Vuelo","Ejemplo: AA123","text","required"],["travelDate","Fecha del viaje","Ejemplo: 15/10/2026","text","required"],["destination","Destino","Ejemplo: La Habana","text","required"],["review","Revisión final","Comprueba todos los datos antes de finalizar","review","required"]],en:[["name","First name","Example: JUAN","text","required"],["surname","Surname","Example: GARCIA","text","required"],["passport","Passport","Example: X12345678","text","required"],["birth","Date of birth","Example: 05/15/1985","text","required"],["nationality","Nationality","Example: United States","text","required"],["flight","Flight","Example: AA123","text","required"],["travelDate","Travel date","Example: 10/15/2026","text","required"],["destination","Destination","Example: Havana","text","required"],["review","Final review","Check all information before finishing","review","required"]]};

function qs(s){return document.querySelector(s)}
function qsa(s){return[...document.querySelectorAll(s)]}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function applyLanguage(){
 document.documentElement.lang=state.lang;
 const t=T[state.lang];
 qsa("[data-i18n]").forEach(e=>{const k=e.dataset.i18n;if(t[k]!==undefined)e.textContent=t[k]});
 const lb=qs("#languageBtn");if(lb)lb.textContent=state.lang==="es"?"ENGLISH":"ESPAÑOL";
 const g=qs("#catAccessGate");
 if(g){
  const ids={catAccessTitle:"accessTitle",catAccessText:"accessText",catPayTitle:"payTitle",catPayText:"payText",catPayBtn:"payButton",catAdminTitle:"adminTitle",catUsernameLabel:"username",catPasswordLabel:"password",catLoginBtn:"login",catCloseAdmin:"close",catExpiredTitle:"expiredTitle",catExpiredText:"expiredText",catExpiredBtn:"expiredButton"};
  Object.entries(ids).forEach(([id,k])=>{const e=qs("#"+id);if(e)e.textContent=t[k]});
 }
 renderSim("visa");renderSim("d")
}

function showPage(id){
 if(!state.access)return;
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
 if(languageBtn)languageBtn.addEventListener("click",()=>{state.lang=state.lang==="es"?"en":"es";applyLanguage();renderAll()});
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
 qs("#clearDPractice")?.addEventListener("click",()=>clearPractice("d"))
}

async function loadData(){
 if(!state.access||!state.token)return;
 try{
  const r=await fetch("/api/data",{headers:{Authorization:`Bearer ${state.token}`},cache:"no-store"});
  if(r.ok)state.data=await r.json();else if(r.status===401||r.status===403){expireAccess();return}
 }catch(e){console.warn("Datos no disponibles:",e);return}
 try{
  const r=await fetch("/api/flights",{headers:{Authorization:`Bearer ${state.token}`},cache:"no-store"});
  if(r.ok)state.data.flights=await r.json();else if(r.status===401||r.status===403){expireAccess();return}
 }catch(e){console.warn("Vuelos no disponibles:",e)}
 renderAll()
}

function renderAll(){if(!state.access)return;renderGuide("visa");renderGuide("dviajeros");renderFlights();renderSim("visa");renderSim("d")}

function renderGuide(type){
 const key=type==="visa"?"cuba_visa":"dviajeros",d=state.data[key]||{},lang=state.lang,intro=qs("#"+type+"Intro");
 if(intro)intro.textContent=d["intro_"+lang]||"";
 const steps=d.steps?.[lang]||[],i=type==="visa"?state.visaStep:state.dviajerosStep,box=qs("#"+type+"Steps");
 if(!box)return;
 if(!steps.length){box.innerHTML='<div class="step"><div class="step-number">✓</div><div><h3>Información disponible</h3><p>Abre el portal oficial para continuar.</p></div></div>';return}
 const s=steps[Math.min(i,steps.length-1)];
 box.innerHTML=`<div class="step"><div class="step-number">${esc(s.number)}</div><div><div class="step-label">${state.lang==="es"?"PASO":"STEP"} ${esc(s.number)}</div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></div>`;
 const counter=qs("#"+type+"Counter");if(counter)counter.textContent=`${i+1} / ${steps.length}`;
 const prev=qs("#"+type+"Prev"),next=qs("#"+type+"Next");if(prev)prev.disabled=i===0;if(next)next.disabled=i===steps.length-1;
 const list=d.check_before_submit?.[lang]||d.checklist?.[lang]||[],cl=qs("#"+type+"Checklist");if(cl)cl.innerHTML=list.map(x=>`<div>✓ ${esc(x)}</div>`).join("")
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
 const f=state.data.flights;if(!f)return;
 const providers=Object.values(f.providers||{}),box=qs("#flightProviders");
 if(box)box.innerHTML=providers.map(p=>`<div class="flight-card"><span class="flight-icon">✈️</span><h3>${esc(p.name||p.name_es||"Flight provider")}</h3><p>${esc(p[state.lang==="es"?"description_es":"description_en"]||"")}</p><a class="primary" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${state.lang==="es"?"ABRIR":"OPEN"}</a></div>`).join("");
 const ab=qs("#airportButtons"),db=qs("#destinationButtons");
 if(ab)ab.innerHTML=(f.airports||[]).map(a=>`<button class="airport ${state.airport===a.code?"selected":""}" data-air="${esc(a.code)}" type="button">${esc(a.code)} · ${esc(state.lang==="es"?a.name:a.name_en)}</button>`).join("");
 if(db)db.innerHTML=(f.destinations||[]).map(d=>`<button class="destination ${state.destination===d.code?"selected":""}" data-dest="${esc(d.code)}" type="button">${esc(d.code)} · ${esc(state.lang==="es"?d.name:d.name_en)}</button>`).join("");
 qsa("[data-air]").forEach(b=>b.onclick=()=>{state.airport=b.dataset.air;renderFlights()});
 qsa("[data-dest]").forEach(b=>b.onclick=()=>{state.destination=b.dataset.dest;renderFlights()});
 const cb=qs("#charterList");
 if(cb)cb.innerHTML=(f.charters||[]).map(c=>`<div class="charter-item"><div><strong>${esc(c.name)}</strong><span>${esc(c.type)}</span><p>${esc(c[state.lang==="es"?"note_es":"note_en"]||"")}</p></div><a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer">↗</a></div>`).join("");
 const g=qs("#googleRoute");
 if(g)g.onclick=()=>window.open(`https://www.google.com/travel/flights?hl=${state.lang}&curr=USD#flt=${encodeURIComponent(state.airport)}.${encodeURIComponent(state.destination)}.${encodeURIComponent(state.airport)}`,"_blank")
}

function getPracticeKey(type){return type==="visa"?"cuba_auto_travel_visa_practice":"cuba_auto_travel_d_practice"}

function loadPractice(type){
 try{
  const raw=localStorage.getItem(getPracticeKey(type)),data=raw?JSON.parse(raw):{};
  if(data&&typeof data==="object"&&!Array.isArray(data))state.sim[type]=data;else state.sim[type]={};
  return state.sim[type]
 }catch(e){state.sim[type]={};return state.sim[type]}
}

function captureCurrent(type){
 const fields=type==="visa"?visaSim[state.lang]:dSim[state.lang],box=qs(type==="visa"?"#visaSimFields":"#dSimFields");
 if(!box)return;
 const step=type==="visa"?state.visaSimStep:state.dSimStep,f=fields[step];
 if(!f||f[3]==="review")return;
 const input=box.querySelector("[data-practice-field]");
 if(input)state.sim[type][f[0]]=input.value
}

function savePractice(type){
 captureCurrent(type);
 try{
  localStorage.setItem(getPracticeKey(type),JSON.stringify(state.sim[type]||{}));
  showPracticeMessage(type,T[state.lang].savedPractice)
 }catch(e){console.warn("No se pudo guardar la práctica:",e)}
}

function clearPractice(type){
 try{
  localStorage.removeItem(getPracticeKey(type));
  state.sim[type]={};
  if(type==="visa")state.visaSimStep=0;else state.dSimStep=0;
  renderSim(type);
  showPracticeMessage(type,T[state.lang].clearedPractice)
 }catch(e){console.warn("No se pudo borrar la práctica:",e)}
}

function showPracticeMessage(type,message){
 const id=type==="visa"?"#visaPracticeMessage":"#dPracticeMessage",el=qs(id);
 if(!el)return;
 el.textContent=message;
 el.style.display="block";
 clearTimeout(el._timer);
 el._timer=setTimeout(()=>{el.style.display="none"},3000)
}

function renderSim(type){
 const data=type==="visa"?visaSim[state.lang]:dSim[state.lang],step=type==="visa"?state.visaSimStep:state.dSimStep,box=qs(type==="visa"?"#visaSimFields":"#dSimFields");
 if(!box)return;
 const saved=loadPractice(type),f=data[step];if(!f)return;
 if(f[3]==="review"){
  box.innerHTML=`<div class="sim-fields"><div class="sim-field active"><label>${esc(f[1])}</label><div class="practice-tip">✓ ${esc(f[2])}</div><p class="field-help">${esc(T[state.lang].simulationText)}</p></div></div>`
 }else{
  const required=f[4]==="required",marker=required?` <span aria-hidden="true">*</span>`:` <small>${esc(T[state.lang].optional)}</small>`,value=saved[f[0]]??"";
  let field="";
  if(f[3]==="select")field=`<select data-practice-field="${esc(f[0])}" autocomplete="off"><option value="">${esc(f[2])}</option><option value="${state.lang==="es"?"Ejemplo A":"Example A"}">${state.lang==="es"?"Ejemplo A":"Example A"}</option><option value="${state.lang==="es"?"Ejemplo B":"Example B"}">${state.lang==="es"?"Ejemplo B":"Example B"}</option></select>`;
  else field=`<input data-practice-field="${esc(f[0])}" type="${esc(f[3])}" value="${esc(value)}" placeholder="${esc(f[2])}" autocomplete="off" autocapitalize="characters" spellcheck="false">`;
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
  if(n)n.textContent=step+1;if(tt)tt.textContent=total;if(c)c.textContent=`${step+1} / ${total}`;if(p)p.disabled=step===0;if(nx)nx.disabled=step===total-1
 }else{
  const n=qs("#dSimNumber"),tt=qs("#dSimTotal"),c=qs("#dSimCounter"),p=qs("#dSimPrev"),nx=qs("#dSimNext");
  if(n)n.textContent=step+1;if(tt)tt.textContent=total;if(c)c.textContent=`${step+1} / ${total}`;if(p)p.disabled=step===0;if(nx)nx.disabled=step===total-1
 }
 const msg=qs(type==="visa"?"#visaPracticeMessage":"#dPracticeMessage");if(msg&&msg.textContent)msg.style.display="block"
}

function moveSim(type,n){
 const arr=type==="visa"?visaSim[state.lang]:dSim[state.lang];
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

/* ==================== ACCESO / STRIPE ==================== */

function gateStyles(){
 if(qs("#catAccessStyles"))return;
 const s=document.createElement("style");
 s.id="catAccessStyles";
 s.textContent=`#catAccessGate{position:fixed;inset:0;z-index:999999;background:linear-gradient(145deg,#075985,#0c4a6e 55%,#082f49);display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto;font-family:inherit}#catAccessGate *{box-sizing:border-box}#catAccessCard{width:min(94vw,560px);background:#fff;border-radius:24px;padding:30px 25px;box-shadow:0 20px 60px #0006;text-align:center;color:#123047}#catAccessCard h1{margin:0 0 8px;color:#075985;font-size:27px}#catAccessCard>p{margin:0 auto 22px;color:#617789;line-height:1.5;max-width:470px}#catAccessOptions{display:grid;grid-template-columns:1fr;gap:14px}.catAccessPanel{border:1px solid #dce9ef;border-radius:18px;padding:22px 17px;background:#f8fcfe}.catAccessPanel h2{font-size:17px;margin:0 0 7px;color:#075985}.catAccessPanel p{font-size:13px;color:#617789;min-height:20px;margin:0 0 14px;line-height:1.45}.catAccessBtn{width:100%;border:0;border-radius:12px;padding:14px 10px;font-weight:900;cursor:pointer;font-size:14px;background:#075985;color:#fff}.catAccessBtn:hover{background:#0c4a6e}.catAccessBtn:disabled{opacity:.6;cursor:wait}.catAdmin{display:none;margin-top:16px;border-top:1px solid #dce9ef;padding-top:18px}.catAdmin input{width:100%;padding:13px;border:1px solid #bfd2dc;border-radius:10px;margin:5px 0 8px;font-size:16px}.catAdmin label{display:block;text-align:left;font-size:12px;font-weight:900;color:#426174;margin-top:5px}.catAdminActions{display:flex;gap:9px;margin-top:8px}.catAdminActions button{flex:1}.catAccessMsg{min-height:20px;margin:15px 0 0;font-size:13px;font-weight:800;color:#075985}.catAccessTimer{display:none;margin:0 auto 15px;font-size:13px;font-weight:900;color:#075985}.catAccessExpired{display:none}.catAccessExpired h2{color:#075985;font-size:22px;margin:0 0 8px}.catAccessExpired p{color:#617789;line-height:1.5}@media(max-width:650px){#catAccessCard{padding:25px 18px;border-radius:20px}#catAccessCard h1{font-size:23px}.catAdminActions{flex-direction:column}}`;
 document.head.appendChild(s)
}

function createGate(){
 gateStyles();
 let g=qs("#catAccessGate");
 if(g)return g;
 g=document.createElement("div");
 g.id="catAccessGate";
 g.innerHTML=`<div id="catAccessCard"><div id="catAccessMain"><h1 id="catAccessTitle">${T[state.lang].accessTitle}</h1><p id="catAccessText">${T[state.lang].accessText}</p><div id="catAccessTimer" class="catAccessTimer"></div><div id="catAccessOptions"><div class="catAccessPanel"><h2 id="catPayTitle">${T[state.lang].payTitle}</h2><p id="catPayText">${T[state.lang].payText}</p><button class="catAccessBtn" id="catPayBtn" type="button">${T[state.lang].payButton}</button></div></div><div class="catAdmin" id="catAdmin"><h2 id="catAdminTitle">${T[state.lang].adminTitle}</h2><label id="catUsernameLabel" for="catUsername">${T[state.lang].username}</label><input id="catUsername" autocomplete="username"><label id="catPasswordLabel" for="catPassword">${T[state.lang].password}</label><input id="catPassword" type="password" autocomplete="current-password"><div class="catAdminActions"><button class="catAccessBtn" id="catLoginBtn" type="button">${T[state.lang].login}</button><button class="catAccessBtn" id="catCloseAdmin" type="button">${T[state.lang].close}</button></div></div><div class="catAccessMsg" id="catAccessMsg"></div></div><div class="catAccessExpired" id="catAccessExpired"><h2 id="catExpiredTitle">${T[state.lang].expiredTitle}</h2><p id="catExpiredText">${T[state.lang].expiredText}</p><button class="catAccessBtn" id="catExpiredBtn" type="button">${T[state.lang].expiredButton}</button></div></div>`;
 document.body.appendChild(g);
 qs("#catPayBtn")?.addEventListener("click",startCheckout);
 qs("#catLoginBtn")?.addEventListener("click",adminLogin);
 qs("#catCloseAdmin")?.addEventListener("click",closeAdmin);
 qs("#catExpiredBtn")?.addEventListener("click",()=>showAccessGate(false));
 let taps=0,last=0;
 const secretTap=e=>{
  if(e.target.closest("button,input,a,select,textarea"))return;
  const now=Date.now();
  if(now-last>850)taps=0;
  taps++;
  last=now;
  if(taps>=3){taps=0;openAdmin()}
 };
 g.addEventListener("pointerup",secretTap);
 return g
}

function setAccessMessage(msg,error=false){
 const el=qs("#catAccessMsg");
 if(el){el.textContent=msg||"";el.style.color=error?"#b42318":"#075985"}
}

function openAdmin(){
 const a=qs("#catAdmin");
 if(a)a.style.display="block";
 setAccessMessage("");
 const u=qs("#catUsername");
 if(u)setTimeout(()=>u.focus(),80)
}

function closeAdmin(){
 const a=qs("#catAdmin");
 if(a)a.style.display="none";
 const u=qs("#catUsername"),p=qs("#catPassword");
 if(u)u.value="";
 if(p)p.value="";
 setAccessMessage("")
}

function showAccessGate(expired=false){
 state.access=false;
 if(state.timer){clearInterval(state.timer);state.timer=null}
 qsa(".page").forEach(p=>p.style.display="none");
 const g=createGate();
 g.style.display="flex";
 const main=qs("#catAccessMain"),ex=qs("#catAccessExpired");
 if(main)main.style.display=expired?"none":"block";
 if(ex)ex.style.display=expired?"block":"none";
 if(!expired)closeAdmin()
}

function hideAccessGate(){
 const g=qs("#catAccessGate");
 if(g)g.style.display="none";
 qsa(".page").forEach(p=>p.style.display="");
 state.access=true
}

async function getConfig(){
 try{
  const r=await fetch("/api/auth/config",{cache:"no-store"});
  if(!r.ok)throw new Error("config");
  state.config=await r.json();
  return state.config
 }catch(e){
  setAccessMessage(state.lang==="es"?"No se pudo conectar con el servicio.":"Unable to connect to the service.",true);
  return null
 }
}

function saveAccess(token,seconds,type){
 if(!token)return false;
 const duration=Math.min(1080,Math.max(0,Number(seconds||1080)));
 if(duration<=0)return false;
 state.token=token;
 state.expiresAt=Date.now()+duration*1000;
 state.accessType=type||"paid";
 try{
  sessionStorage.setItem("cat_access_token",token);
  sessionStorage.setItem("cat_access_expires",String(state.expiresAt));
  sessionStorage.setItem("cat_access_type",state.accessType)
 }catch(e){}
 startAccessTimer();
 return true
}

function clearStoredAccess(){
 state.token=null;
 state.expiresAt=0;
 state.accessType="";
 try{
  sessionStorage.removeItem("cat_access_token");
  sessionStorage.removeItem("cat_access_expires");
  sessionStorage.removeItem("cat_access_type")
 }catch(e){}
}

function startAccessTimer(){
 if(state.timer)clearInterval(state.timer);
 updateAccessTimer();
 state.timer=setInterval(updateAccessTimer,1000)
}

function updateAccessTimer(){
 if(!state.token)return;
 const left=Math.max(0,state.expiresAt-Date.now());
 if(left<=0){expireAccess();return}
 const sec=Math.floor(left/1000),m=Math.floor(sec/60),s=sec%60;
 const text=`${T[state.lang].remaining}: ${m} ${T[state.lang].minutes} ${String(s).padStart(2,"0")} ${T[state.lang].seconds}`;
 const timer=qs("#catAccessTimer");
 if(timer){timer.textContent=text;timer.style.display="block"}
 const homeTimer=qs("#accessCountdown");
 if(homeTimer)homeTimer.textContent=text
}

async function validateStoredAccess(){
 let token="",expires=0;
 try{
  token=sessionStorage.getItem("cat_access_token")||"";
  expires=Number(sessionStorage.getItem("cat_access_expires")||0)
 }catch(e){}
 if(!token||!expires||expires<=Date.now())return false;
 try{
  const r=await fetch("/api/auth/check",{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
  if(!r.ok)return false;
  const d=await r.json();
  if(!d.valid||Number(d.remaining_seconds)<=0)return false;
  return saveAccess(token,Number(d.remaining_seconds),sessionStorage.getItem("cat_access_type")||"paid")
 }catch(e){return false}
}

async function startCheckout(){
 setAccessMessage(T[state.lang].paymentChecking);
 const b=qs("#catPayBtn");
 if(b){b.disabled=true;b.dataset.old=b.textContent;b.textContent="..."}
 try{
  const r=await fetch("/api/auth/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!d.url)throw new Error(d.detail||"checkout");
  window.location.href=d.url
 }catch(e){
  console.warn("Stripe checkout:",e);
  setAccessMessage(T[state.lang].paymentError,true);
  if(b){b.disabled=false;b.textContent=b.dataset.old||T[state.lang].payButton}
 }
}

async function verifyStripeReturn(){
 const params=new URLSearchParams(window.location.search),sid=params.get("stripe_session_id");
 if(!sid)return false;
 setAccessMessage(T[state.lang].paymentChecking);
 try{
  const r=await fetch(`/api/auth/verify?session_id=${encodeURIComponent(sid)}`,{cache:"no-store"});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!d.access_token)throw new Error(d.detail||"payment");
  if(!saveAccess(d.access_token,Number(d.expires_in||1080),d.type||"paid"))throw new Error("token");
  setAccessMessage(T[state.lang].paymentApproved);
  window.history.replaceState({},document.title,window.location.pathname);
  return true
 }catch(e){
  console.warn("Stripe verify:",e);
  setAccessMessage(T[state.lang].paymentError,true);
  return false
 }
}

async function adminLogin(){
 const u=qs("#catUsername"),p=qs("#catPassword"),b=qs("#catLoginBtn");
 const username=u?.value?.trim()||"",password=p?.value||"";
 if(!username||!password){setAccessMessage(T[state.lang].wrongLogin,true);return}
 if(b)b.disabled=true;
 try{
  const r=await fetch("/api/auth/admin",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username,password})});
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!d.access_token){
   console.warn("Admin login:",r.status,d);
   setAccessMessage(T[state.lang].wrongLogin,true);
   return
  }
  if(!saveAccess(d.access_token,Number(d.expires_in||1080),d.type||"admin")){
   setAccessMessage(T[state.lang].wrongLogin,true);
   return
  }
  hideAccessGate();
  await loadData()
 }catch(e){
  console.warn("Admin login:",e);
  setAccessMessage(T[state.lang].wrongLogin,true)
 }finally{
  if(b)b.disabled=false
 }
}

function expireAccess(){
 clearStoredAccess();
 if(state.timer){clearInterval(state.timer);state.timer=null}
 state.access=false;
 showAccessGate(true)
}

async function initializeAccess(){
 createGate();
 showAccessGate(false);
 const config=await getConfig();
 if(!config)return;
 const verified=await verifyStripeReturn();
 if(verified){hideAccessGate();await loadData();return}
 const saved=await validateStoredAccess();
 if(saved){hideAccessGate();await loadData();return}
 const params=new URLSearchParams(window.location.search);
 if(params.get("payment")==="cancelled"){
  setAccessMessage(T[state.lang].paymentCancelled,true);
  window.history.replaceState({},document.title,window.location.pathname)
 }
}

function start(){
 bind();
 applyLanguage();
 initializeAccess()
}

document.addEventListener("DOMContentLoaded",start);
