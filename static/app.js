const state={lang:localStorage.getItem("cat_lang")||"es",data:null,flights:null,access:false,token:"",expiresAt:0,accessType:"",timer:null,config:null};
const T={
es:{
accessTitle:"CUBA AUTO TRAVEL 2026",accessText:"Accede al servicio para utilizar la guía completa.",payTitle:"PAGO ÚNICO",payText:"Acceso al servicio por 18 minutos.",payButton:"PAGAR $20 Y ENTRAR",adminTitle:"Acceso",username:"Usuario",password:"Contraseña",login:"ENTRAR",close:"CERRAR",wrongLogin:"Usuario o contraseña incorrectos.",paymentChecking:"Verificando el pago...",paymentApproved:"Pago aprobado. Acceso activado.",paymentError:"No fue posible verificar el pago.",expired:"El acceso ha terminado.",minutes:"min",visa:"Visa",dviajeros:"D'Viajeros",passport:"Pasaporte",flights:"Vuelos",home:"Inicio",sources:"Fuentes oficiales",open:"ABRIR",guide:"¿CÓMO SE HACE?",back:"VOLVER",check:"REVISAR",official:"OFICIAL",loading:"Cargando...",error:"No se pudo cargar la información.",remaining:"Tiempo restante",accessActive:"Acceso activo"
},
en:{
accessTitle:"CUBA AUTO TRAVEL 2026",accessText:"Access the service to use the complete guide.",payTitle:"ONE-TIME PAYMENT",payText:"Service access for 18 minutes.",payButton:"PAY $20 AND ENTER",adminTitle:"Access",username:"Username",password:"Password",login:"ENTER",close:"CLOSE",wrongLogin:"Incorrect username or password.",paymentChecking:"Checking payment...",paymentApproved:"Payment approved. Access activated.",paymentError:"Payment could not be verified.",expired:"Access has ended.",minutes:"min",visa:"Visa",dviajeros:"D'Viajeros",passport:"Passport",flights:"Flights",home:"Home",sources:"Official sources",open:"OPEN",guide:"HOW DO I DO IT?",back:"BACK",check:"CHECK",official:"OFFICIAL",loading:"Loading...",error:"Information could not be loaded.",remaining:"Time remaining",accessActive:"Access active"
}};
const qs=s=>document.querySelector(s),qsa=s=>[...document.querySelectorAll(s)],esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&","<":"<",">":">",'"':""","'":"'"}[m]));
function langText(es,en){return state.lang==="en"?(en||es):(es||en)}
function setLang(l){state.lang=l==="en"?"en":"es";localStorage.setItem("cat_lang",state.lang);document.documentElement.lang=state.lang;render()}
function setAccessMessage(m,error=false){const e=qs("#catAccessMessage");if(e){e.textContent=m||"";e.classList.toggle("error",!!error)}}
function saveAccess(token,seconds,kind){
const s=Math.max(0,Math.min(Number(seconds)||1080,1080));
if(!token||s<=0)return false;
state.token=token;state.expiresAt=Date.now()+s*1000;state.accessType=kind||"paid";state.access=true;
try{sessionStorage.setItem("cat_access_token",token);sessionStorage.setItem("cat_access_expires",String(state.expiresAt));sessionStorage.setItem("cat_access_type",state.accessType)}catch(e){}
startTimer();return true
}
function clearAccess(){
state.access=false;state.token="";state.expiresAt=0;state.accessType="";
if(state.timer)clearInterval(state.timer);
state.timer=null;
try{sessionStorage.removeItem("cat_access_token");sessionStorage.removeItem("cat_access_expires");sessionStorage.removeItem("cat_access_type")}catch(e){}
}
function startTimer(){
if(state.timer)clearInterval(state.timer);
state.timer=setInterval(()=>{
const left=Math.max(0,state.expiresAt-Date.now());
updateTimer(left);
if(left<=0){clearAccess();showAccessGate(true)}
},1000);
updateTimer(Math.max(0,state.expiresAt-Date.now()))
}
function updateTimer(ms){
const e=qs("#catTimer");
if(!e)return;
const sec=Math.ceil(Math.max(0,ms)/1000),m=Math.floor(sec/60),s=sec%60;
e.textContent=`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
function showAccessGate(expired=false){
const g=qs("#catAccessGate"),a=qs("#catApp");
if(g)g.hidden=false;
if(a)a.hidden=true;
state.access=false;
if(expired)setAccessMessage(T[state.lang].expired,true)
}
function hideAccessGate(){
const g=qs("#catAccessGate"),a=qs("#catApp");
if(g)g.hidden=true;
if(a)a.hidden=false;
state.access=true
}
function createGate(){
let g=qs("#catAccessGate");
if(g)return;
g=document.createElement("section");
g.id="catAccessGate";
g.className="access-gate";
g.innerHTML=`<div class="access-card">

 <div class="access-brand">${T[state.lang].accessTitle}</div>
 <h1>${T[state.lang].payTitle}</h1>
 <p>${T[state.lang].accessText}</p>
 <p>${T[state.lang].payText}</p>
 <button id="catPayBtn" class="primary" type="button">${T[state.lang].payButton}</button>
 <div id="catAccessMessage" aria-live="polite"></div>
 <div id="catAdminPanel" hidden>
  <h2>${T[state.lang].adminTitle}</h2>
  <input id="catUsername" type="text" autocomplete="username" placeholder="${T[state.lang].username}">
  <input id="catPassword" type="password" autocomplete="current-password" placeholder="${T[state.lang].password}">
  <button id="catLoginBtn" class="secondary" type="button">${T[state.lang].login}</button>
  <button id="catCloseAdmin" class="secondary" type="button">${T[state.lang].close}</button>
 </div>
 <div id="catTimerWrap" hidden><span>${T[state.lang].remaining}</span> <strong id="catTimer">18:00</strong></div>
 </div>`;
 document.body.prepend(g);
 const pay=qs("#catPayBtn");
 if(pay)pay.addEventListener("click",startCheckout);
 const login=qs("#catLoginBtn");
 if(login)login.addEventListener("click",adminLogin);
 const close=qs("#catCloseAdmin");
 if(close)close.addEventListener("click",()=>{const p=qs("#catAdminPanel");if(p)p.hidden=true});
 let taps=0,last=0;
 const secretTap=e=>{
  if(e.target.closest("button,input,a,select,textarea"))return;
  const now=Date.now();
  if(now-last>850)taps=0;
  taps++;last=now;
  if(taps>=3){taps=0;openAdmin()}
 };
 g.addEventListener("pointerup",secretTap)
}
function openAdmin(){
 const p=qs("#catAdminPanel");
 if(p){p.hidden=false;qs("#catUsername")?.focus()}
}
async function getConfig(){
 try{
  const r=await fetch("/api/auth/config",{cache:"no-store"});
  const d=await r.json().catch(()=>({}));
  if(r.ok)state.config=d
 }catch(e){console.warn("Auth config:",e)}
}
async function startCheckout(){
 const b=qs("#catPayBtn");
 if(b)b.disabled=true;
 setAccessMessage(T[state.lang].paymentChecking);
 try{
  const r=await fetch("/api/auth/checkout",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({})
  });
  const d=await r.json().catch(()=>({}));
  if(!r.ok||!d.url)throw new Error(d.detail||"checkout");
  window.location.href=d.url
 }catch(e){
  console.warn("Stripe checkout:",e);
  setAccessMessage(e.message||T[state.lang].paymentError,true);
  if(b)b.disabled=false
 }
}
async function verifyStripeReturn(){
 const params=new URLSearchParams(window.location.search),sid=params.get("stripe_session_id");
 if(!sid)return false;
 setAccessMessage(T[state.lang].paymentChecking);
 try{
  const r=await fetch("/api/auth/verify",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({session_id:sid})
  });
  const d=await r.json().catch(()=>({}));
  const token=d.access_token||d.token||"";
  if(!r.ok||!token)throw new Error(d.detail||"payment");
  if(!saveAccess(token,Number(d.expires_in||d.remaining_seconds||1080),d.kind||"paid"))throw new Error("token");
  setAccessMessage(T[state.lang].paymentApproved);
  window.history.replaceState({},document.title,window.location.pathname);
  hideAccessGate();
  await loadData();
  return true
 }catch(e){
  console.warn("Stripe verify:",e);
  setAccessMessage(e.message||T[state.lang].paymentError,true);
  return false
 }
}
async function adminLogin(){
 const u=qs("#catUsername"),p=qs("#catPassword"),b=qs("#catLoginBtn");
 const username=u?.value?.trim()||"",password=p?.value||"";
 if(!username||!password){setAccessMessage(T[state.lang].wrongLogin,true);return}
 if(b)b.disabled=true;
 try{
  const r=await fetch("/api/auth/admin",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({username,password})
  });
  const d=await r.json().catch(()=>({}));
  const token=d.access_token||d.token||"";
  if(!r.ok||!token){
   console.warn("Admin login:",r.status,d);
   setAccessMessage(d.detail||T[state.lang].wrongLogin,true);
   return
  }
  if(!saveAccess(token,Number(d.expires_in||d.remaining_seconds||1080),d.kind||"admin")){
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
  return saveAccess(token,Number(d.remaining_seconds),d.kind||sessionStorage.getItem("cat_access_type")||"paid")
 }catch(e){return false}
}
function authHeaders(){
 return state.token?{Authorization:`Bearer ${state.token}`}:{}
}
async function apiFetch(url,options={}){
 const opts={...options,headers:{...(options.headers||{}),...authHeaders()}};
 const r=await fetch(url,opts);
 if(r.status===401||r.status===403){
  clearAccess();showAccessGate(true)
 }
 return r
}
async function loadData(){
 if(!state.access||!state.token)return false;
 try{
  const [dr,fr]=await Promise.all([apiFetch("/api/data",{cache:"no-store"}),apiFetch("/api/flights",{cache:"no-store"})]);
  if(!dr.ok||!fr.ok)throw new Error("load");
  state.data=await dr.json();
  state.flights=await fr.json();
  render();
  return true
 }catch(e){
  console.warn("Load data:",e);
  const m=qs("#catContent");
  if(m)m.innerHTML=`<div class="notice error">${esc(T[state.lang].error)}</div>`;
  return false
 }
}
function render(){
 renderLanguage();
 renderData();
 renderFlights();
}
function renderLanguage(){
 document.documentElement.lang=state.lang;
 qsa("[data-es][data-en]").forEach(e=>{e.textContent=state.lang==="en"?e.dataset.en:e.dataset.es});
 qsa("[data-lang]").forEach(e=>e.classList.toggle("active",e.dataset.lang===state.lang));
}
function renderData(){
 if(!state.data)return;
 const d=state.data;
 const visa=d.cuba_visa||{},dv=d.dviajeros||{},ps=d.passports||{};
 const title=qs("#catContentTitle");
 if(title)title.textContent=langText("CUBA AUTO TRAVEL 2026","CUBA AUTO TRAVEL 2026");
 const content=qs("#catContent");
 if(!content)return;
 content.innerHTML=`
 <section class="training-grid">
  ${dataCard("visa",visa)}
  ${dataCard("dviajeros",dv)}
  ${passportCard(ps)}
 </section>`;
 bindDataButtons()
}
function dataCard(type,d){
 const title=langText(d.title_es,d.title_en),intro=langText(d.intro_es,d.intro_en);
 const req=d.requirements?.[state.lang]||d.requirements?.es||[];
 const steps=d.steps?.[state.lang]||d.steps?.es||[];
 const checks=d.check_before_submit?.[state.lang]||d.check_before_submit?.es||d.checklist?.[state.lang]||d.checklist?.es||[];
 const btn=d.buttons?.[state.lang]||d.buttons?.es||{};
 const official=type==="visa"?(d.official?.url||"https://evisacuba.cu/"):(d.official?.url||"https://www.dviajeros.mitrans.gob.cu/");
 return `<article class="training-card" id="card-${type}">
 <div class="card-badge">${type==="visa"?T[state.lang].visa:T[state.lang].dviajeros}</div>
 <h2>${esc(title)}</h2>
 <p>${esc(intro)}</p>
 ${req.length?`<h3>${state.lang==="en"?"Requirements":"Requisitos"}</h3><ul>${req.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
 ${steps.length?`<h3>${state.lang==="en"?"Steps":"Pasos"}</h3><ol>${steps.map(x=>`<li>${typeof x==="string"?esc(x):`<strong>${esc(x.title)}</strong><span>${esc(x.text)}</span>`}`).join("")}</ol>`:""}
 ${checks.length?`<h3>${state.lang==="en"?"Check before finishing":"Revisa antes de terminar"}</h3><ul class="check-list">${checks.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
 <div class="button-row"><a class="primary" href="${esc(official)}" target="_blank" rel="noopener">${esc(btn.official||btn.visa||T[state.lang].open)}</a></div>
 ${d.notice_es||d.notice_en?`<div class="notice">${esc(langText(d.notice_es,d.notice_en))}</div>`:""}
 </article>`
}
function passportCard(d){
 const title=langText(d.title_es,d.title_en),intro=langText(d.intro_es,d.intro_en);
 const req=d.requirements?.[state.lang]||d.requirements?.es||[];
 const steps=d.steps?.[state.lang]||d.steps?.es||[];
 const checks=d.checklist?.[state.lang]||d.checklist?.es||[];
 const b=d.buttons?.[state.lang]||d.buttons?.es||{};
 return `<article class="training-card" id="card-passport">
 <div class="card-badge">${esc(T[state.lang].passport)}</div>
 <h2>${esc(title)}</h2>
 <p>${esc(intro)}</p>
 ${req.length?`<h3>${state.lang==="en"?"Requirements":"Requisitos"}</h3><ul>${req.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
 ${steps.length?`<h3>${state.lang==="en"?"Steps":"Pasos"}</h3><ol>${steps.map(x=>`<li>${typeof x==="string"?esc(x):`<strong>${esc(x.title)}</strong><span>${esc(x.text)}</span>`}</li>`).join("")}</ol>`:""}
 ${checks.length?`<h3>${state.lang==="en"?"Checklist":"Lista de comprobación"}</h3><ul class="check-list">${checks.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:""}
 <div class="button-row">
  <a class="primary" href="https://evisacuba.cu/" target="_blank" rel="noopener">${esc(b.visa||T[state.lang].visa)}</a>
  <a class="secondary" href="https://www.dviajeros.mitrans.gob.cu/" target="_blank" rel="noopener">${esc(b.dviajeros||T[state.lang].dviajeros)}</a>
 </div>
 ${d.notice_es||d.notice_en?`<div class="notice">${esc(langText(d.notice_es,d.notice_en))}</div>`:""}
 </article>`
}
function bindDataButtons(){}
function renderFlights(){
 const e=qs("#catFlights");
 if(!e||!state.flights)return;
 const p=state.flights.providers||{},a=state.flights.airports||[],d=state.flights.destinations||[],c=state.flights.charters||[];
 e.innerHTML=`<section class="flight-panel">
 <h2>${esc(T[state.lang].flights)}</h2>
 <div class="video-grid">
  ${Object.values(p).map(x=>`<article class="video-card"><h3>${esc(x.name||x.name_es||x.name_en)}</h3><p>${esc(langText(x.description_es,x.description_en))}</p><a class="primary" href="${esc(x.url)}" target="_blank" rel="noopener">${esc(T[state.lang].open)}</a></article>`).join("")}
 </div>
 <div class="flight-lists">
  <div><h3>${state.lang==="en"?"Airports":"Aeropuertos"}</h3><ul>${a.map(x=>`<li><strong>${esc(x.code)}</strong> — ${esc(state.lang==="en"?x.name_en:x.name)}</li>`).join("")}</ul></div>
  <div><h3>${state.lang==="en"?"Destinations":"Destinos"}</h3><ul>${d.map(x=>`<li><strong>${esc(x.code)}</strong> — ${esc(state.lang==="en"?x.name_en:x.name)}</li>`).join("")}</ul></div>
 </div>
 <div class="flight-lists"><div><h3>${state.lang==="en"?"Charters":"Charters"}</h3><ul>${c.map(x=>`<li><strong>${esc(x.name)}</strong> — ${esc(langText(x.note_es,x.note_en))}${x.source?` <a href="${esc(x.source)}" target="_blank" rel="noopener">${esc(T[state.lang].sources)}</a>`:""}</li>`).join("")}</ul></div></div>
 </section>`
}
async function initializeAccess(){
 createGate();
 showAccessGate(false);
 await getConfig();
 if(await verifyStripeReturn())return;
 if(await validateStoredAccess()){
  hideAccessGate();
  await loadData();
  return
 }
 clearAccess();
 showAccessGate(false)
}
document.addEventListener("DOMContentLoaded",async()=>{
 qsa("[data-lang]").forEach(b=>b.addEventListener("click",()=>setLang(b.dataset.lang)));
 initializeAccess()
});
