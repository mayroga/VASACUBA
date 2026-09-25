"use strict";
document.addEventListener("DOMContentLoaded",()=>{
const $=id=>document.getElementById(id),API={visa:"/api/visa/practice",dviajeros:"/api/dviajeros/practice"},STORE="cuba_auto_travel_2026_practice";
const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const getStore=()=>{try{return JSON.parse(localStorage.getItem(STORE)||"{}")}catch{return{}}};
const setStore=x=>localStorage.setItem(STORE,JSON.stringify(x));
const statusClass=s=>{s=String(s||"").toUpperCase();return s==="READY"||s==="CONFIRMED"?"status-ready":s==="VERIFY"?"status-verify":s==="INCOMPLETE"?"status-incomplete":""};
const statusText=s=>({READY:"PREPARADO",CONFIRMED:"CONFIRMADO",VERIFY:"VERIFICAR",INCOMPLETE:"INCOMPLETO"})[String(s||"").toUpperCase()]||String(s||"");
const state=getStore();
let practice={visa:null,dviajeros:null},module="",screen=0;

const hideAll=()=>document.querySelectorAll(".app-section").forEach(x=>x.classList.add("hidden"));
const showIntro=()=>{hideAll();$("intro")?.classList.remove("hidden");$("modules")?.classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})};
const setText=(id,t)=>{const e=$(id);if(e)e.textContent=t};
const section=()=>{hideAll();$("practice-section")?.classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})};

async function get(url){
 const r=await fetch(url);
 const j=await r.json().catch(()=>({}));
 if(!r.ok)throw new Error(j.detail||"No se pudo cargar la información.");
 return j
}

function save(){
 state[module]={screen,answers:practice[module]?.answers||{},completed:practice[module]?.completed||false};
 setStore(state)
}

function answers(){
 return practice[module]?.answers||{}
}

function inputValue(field){
 const a=answers();
 return a[field.name]??""
}

function fieldHTML(f){
 const value=esc(inputValue(f));
 const req=f.required?" required":"";
 const example=f.example?`<div class="practice-example"><strong>Ejemplo:</strong> ${esc(f.example)}</div>`:"";
 const help=f.help?`<div class="help-text">${esc(f.help)}</div>`:"";
 return `<div class="form-group ${f.required?"required":""}">
<label for="practice-${esc(f.name)}">${esc(f.label)}${f.required?" *":""}</label>
<input id="practice-${esc(f.name)}" name="${esc(f.name)}" value="${value}"${req} autocomplete="off">
${help}${example}
</div>`
}

function prepareHTML(items){
 return items?.length?`<div class="info-box"><strong>Antes de continuar</strong><ul>${items.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""
}

function screenHTML(s,index,total){
 const isLast=index===total-1;
 const a=answers();
 let fields=(s.fields||[]).map(fieldHTML).join("");
 if(!fields&&s.id==="intro")fields=`<div class="info-box"><strong>Esta es una práctica.</strong><p>Lee la explicación y continúa cuando estés listo.</p></div>`;
 if(!fields&&s.id==="review"){
  const all=[];
  Object.keys(a).forEach(k=>all.push(`<div class="review-row"><strong>${esc(k)}</strong><span>${esc(a[k])}</span></div>`));
  fields=all.length?`<div class="practice-review">${all.join("")}</div>`:`<div class="info-box">Todavía no hay respuestas guardadas.</div>`
 }
 const warning=s.warning?`<div class="warning"><strong>Importante</strong><p>${esc(s.warning)}</p></div>`:"";
 const important=s.important?`<div class="info-box"><strong>Recuerda</strong><p>${esc(s.important)}</p></div>`:"";
 const prepare=prepareHTML(s.prepare);
 return `<div class="practice-card">
<div class="practice-top"><span>PRÁCTICA · ${index+1} / ${total}</span><div class="progress"><i style="width:${Math.round((index+1)/total*100)}%"></i></div></div>
<h2>${esc(s.title)}</h2>
${s.explanation?`<p class="practice-explanation">${esc(s.explanation)}</p>`:""}
${prepare}
${fields?`<div class="form-grid practice-fields">${fields}</div>`:""}
${s.review?`<div class="info-box"><strong>Revisa</strong><p>${esc(s.review)}</p></div>`:""}
${warning}${important}
<div class="practice-actions">
<button type="button" class="back-button" id="practice-back"${index===0?" disabled":""}>← Anterior</button>
<button type="button" class="primary-button" id="practice-next">${isLast?"Terminar práctica":"Guardar y continuar →"}</button>
</div>
</div>`
}

function ensurePracticeBox(){
 let box=$("practice-section");
 if(!box){
  box=document.createElement("section");
  box.id="practice-section";
  box.className="app-section hidden";
  const main=document.querySelector("main");
  (main||document.body).appendChild(box)
 }
 return box
}

function render(){
 const p=practice[module];
 if(!p)return;
 const screens=p.screens||[];
 if(!screens.length)return;
 screen=Math.max(0,Math.min(screen,screens.length-1));
 const box=ensurePracticeBox();
 const s=screens[screen];
 box.innerHTML=`<button type="button" class="back-button" id="practice-home">← Volver al inicio</button>${screenHTML(s,screen,screens.length)}`;
 section();
 $("practice-home")?.addEventListener("click",showIntro);
 $("practice-back")?.addEventListener("click",()=>{collect();if(screen>0){screen--;save();render()}});
 $("practice-next")?.addEventListener("click",()=>{if(!collect())return;if(screen<screens.length-1){screen++;save();render()}else finish()});
}

function collect(){
 const p=practice[module];
 const s=p?.screens?.[screen];
 if(!s)return true;
 const box=$("practice-section");
 if(!box)return true;
 const data={...answers()};
 let valid=true;
 (s.fields||[]).forEach(f=>{
  const el=box.querySelector(`[name="${CSS.escape(f.name)}"]`);
  if(el){
   const v=el.value.trim();
   data[f.name]=v;
   if(f.required&&!v){el.focus();el.style.borderColor="#b3261e";valid=false}else el.style.borderColor="";
  }
 });
 if(!valid){
  let e=box.querySelector(".practice-error");
  if(!e){e=document.createElement("div");e.className="error-box practice-error";e.innerHTML="<strong>Falta información</strong><p>Completa los campos obligatorios antes de continuar.</p>";box.querySelector(".practice-card")?.prepend(e)}
  return false
 }
 p.answers=data;
 p.current_screen=screen+1;
 save();
 return true
}

function finish(){
 const p=practice[module],screens=p.screens||[];
 p.completed=true;
 p.current_screen=screens.length;
 save();
 const box=ensurePracticeBox();
 box.innerHTML=`<button type="button" class="back-button" id="practice-home">← Volver al inicio</button>
<div class="practice-card">
<div class="practice-top"><span>PRÁCTICA COMPLETA</span><div class="progress"><i style="width:100%"></i></div></div>
<h2>Tu práctica está completa</h2>
<p class="practice-explanation">Ya puedes revisar lo que preparaste y después transcribirlo en el portal oficial.</p>
<div class="info-box"><strong>Importante</strong><p>Esta práctica no fue enviada a las autoridades. No generó una visa, no realizó un pago y no generó un QR oficial.</p></div>
<div class="practice-review">${Object.entries(p.answers||{}).map(([k,v])=>`<div class="review-row"><strong>${esc(k)}</strong><span>${esc(v)}</span></div>`).join("")||"<p>No hay respuestas guardadas.</p>"}</div>
<div class="practice-actions">
<button type="button" class="back-button" id="practice-edit">← Revisar práctica</button>
<a class="official-link" href="${module==="visa"?"https://evisacuba.cu/":"https://dviajeros.mitrans.gob.cu/"}" target="_blank" rel="noopener noreferrer">Abrir portal oficial →</a>
</div>
</div>`;
 section();
 $("practice-home")?.addEventListener("click",showIntro);
 $("practice-edit")?.addEventListener("click",()=>{screen=0;render()});
}

async function start(type){
 try{
  module=type;
  const data=await get(API[type]);
  practice[type]=data;
  const saved=state[type];
  practice[type].answers=saved?.answers||{};
  practice[type].completed=false;
  screen=saved?.completed?0:(saved?.screen||0);
  render()
 }catch(e){
  const box=ensurePracticeBox();
  box.innerHTML=`<div class="error-box"><strong>Error</strong><p>${esc(e.message)}</p></div>`;
  section()
 }
}

function bindExisting(){
 $("visa-button")?.addEventListener("click",()=>start("visa"));
 $("dviajeros-button")?.addEventListener("click",()=>start("dviajeros"));
 $("passport-button")?.addEventListener("click",()=>showPassport());
 document.querySelectorAll(".back-button").forEach(b=>{
  if(b.id!=="practice-back"&&b.id!=="practice-home")b.addEventListener("click",showIntro)
 });
 $("clear-all")?.addEventListener("click",()=>{
  localStorage.removeItem(STORE);
  Object.keys(state).forEach(k=>delete state[k]);
  practice={visa:null,dviajeros:null};
  showIntro()
 });
}

function showPassport(){
 hideAll();
 const s=$("passport-section");
 if(s)s.classList.remove("hidden");
 else{
  const box=ensurePracticeBox();
  box.innerHTML=`<div class="practice-card"><h2>Preparación del pasaporte</h2><p>Usa el módulo de pasaporte para revisar y preparar tus datos antes de continuar.</p><a class="official-link" href="#passport-section">Ir al módulo de pasaporte →</a></div>`;
  box.classList.remove("hidden")
 }
 window.scrollTo({top:0,behavior:"smooth"})
}

function injectPracticeStyle(){
 if(document.getElementById("practice-inline-style"))return;
 const s=document.createElement("style");
 s.id="practice-inline-style";
 s.textContent=`
.practice-card{background:#fff;border:1px solid #dbe3ec;border-radius:14px;padding:24px;box-shadow:0 4px 16px rgba(20,45,70,.07)}
.practice-top{color:#526173;font-size:12px;font-weight:800;letter-spacing:.5px;margin-bottom:20px}
.progress{height:7px;background:#e7edf3;border-radius:10px;margin-top:8px;overflow:hidden}
.progress i{display:block;height:100%;background:#1261a0;border-radius:10px}
.practice-explanation{font-size:17px;color:#46576a;max-width:850px}
.practice-example{margin-top:6px;padding:7px 9px;background:#f5f8fb;border-radius:6px;color:#5b6878;font-size:13px}
.practice-review{border:1px solid #dce4ec;border-radius:9px;overflow:hidden;margin:18px 0}
.review-row{display:grid;grid-template-columns:minmax(150px,30%) 1fr;gap:15px;padding:11px 13px;border-bottom:1px solid #e4eaf0}
.review-row:last-child{border-bottom:0}
.review-row span{overflow-wrap:anywhere}
.practice-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:22px}
.practice-actions button,.practice-actions a{flex:0 0 auto}
@media(max-width:600px){.review-row{grid-template-columns:1fr;gap:3px}.practice-card{padding:17px}}
`;
 document.head.appendChild(s)
}

injectPracticeStyle();
bindExisting();
});
