"use strict";
document.addEventListener("DOMContentLoaded",()=>{

const $=id=>document.getElementById(id),STORE="cuba_auto_travel_2026_practice",API={visa:"/api/visa/practice",dviajeros:"/api/dviajeros/practice"};
let db=(()=>{try{return JSON.parse(localStorage.getItem(STORE)||"{}")}catch{return{}}})(),moduleName="",practice=null,screen=0;

const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const attr=v=>esc(v).replace(/`/g,"&#096;");
const clean=v=>String(v??"").trim();
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(db))}catch{}};
const saveCurrent=()=>{if(!moduleName||!practice)return;db[moduleName]={answers:practice.answers||{},screen,completed:!!practice.completed};save()};
const hide=()=>document.querySelectorAll(".app-section").forEach(e=>e.classList.add("hidden"));
const home=()=>{hide();$("intro")?.classList.remove("hidden");$("modules")?.classList.remove("hidden");scrollTo({top:0,behavior:"smooth"})};
const section=()=>{hide();ensure().classList.remove("hidden");scrollTo({top:0,behavior:"smooth"})};
const ensure=()=>{let e=$("practice-section");if(e)return e;e=document.createElement("section");e.id="practice-section";e.className="app-section hidden";(document.querySelector("main")||document.body).appendChild(e);return e};
const value=n=>practice?.answers?.[n]??"";
const answer=(n,v)=>{practice.answers||(practice.answers={});practice.answers[n]=v;saveCurrent()};

const get=async url=>{
 const r=await fetch(url,{headers:{Accept:"application/json"}});
 let j={};try{j=await r.json()}catch{}
 if(!r.ok)throw Error(j.detail||j.message||"No se pudo cargar la práctica.");
 return j
};

const image=s=>{
 const src=s?.image||s?.image_url||s?.illustration||s?.screenshot||"";
 return src?`<div class="practice-visual"><img src="${attr(src)}" alt="${attr(s.image_alt||s.title||"Ejemplo de práctica")}" loading="lazy" onerror="this.closest('.practice-visual')?.remove()"><div class="visual-label">PRÁCTICA · CUBA AUTO TRAVEL 2026</div></div>`:""
};

const gallery=s=>{
 const a=Array.isArray(s?.images)?s.images:[];
 if(!a.length)return"";
 return`<div class="practice-gallery">${a.map((x,i)=>{
  const src=typeof x==="string"?x:(x?.url||x?.image||x?.image_url||"");
  if(!src)return"";
  const alt=typeof x==="object"?(x.alt||s.title||`Ejemplo ${i+1}`):(s.title||`Ejemplo ${i+1}`);
  const cap=typeof x==="object"?(x.caption||`Ejemplo ${i+1}`):`Ejemplo ${i+1}`;
  return`<figure><img src="${attr(src)}" alt="${attr(alt)}" loading="lazy" onerror="this.closest('figure')?.remove()"><figcaption>${esc(cap)}</figcaption></figure>`
 }).join("")}</div>`
};

const choices=f=>{
 const a=f.options||f.choices||f.values||[];
 if(!Array.isArray(a)||!a.length)return"";
 const cur=String(value(f.name));
 return`<div class="choice-grid" data-choice="${attr(f.name)}">${a.map(x=>{
  const o=typeof x==="string"?{value:x,label:x}:x||{};
  const v=o.value??o.id??o.code??o.label??"",label=o.label??o.name??v,desc=o.description||"",img=o.image||o.image_url||"";
  const sel=String(v)===cur;
  return`<button type="button" class="choice-card ${sel?"selected":""}" data-field="${attr(f.name)}" data-value="${attr(v)}">${img?`<span class="choice-image"><img src="${attr(img)}" alt="${attr(label)}" loading="lazy" onerror="this.closest('.choice-image')?.remove()"></span>`:""}<strong>${esc(label)}</strong>${desc?`<span>${esc(desc)}</span>`:""}<span class="choice-check">${sel?"✓":"○"}</span></button>`
 }).join("")}</div>`
};

const field=f=>{
 const type=String(f.type||f.input_type||"text").toLowerCase();
 if(type==="choice"||type==="select"||type==="radio"||type==="boolean"||Array.isArray(f.options)||Array.isArray(f.choices))
  return`<div class="practice-field choice-field ${f.required?"required":""}"><div class="field-label">${esc(f.label||f.question||f.name)}${f.required?" *":""}</div>${f.help?`<div class="field-help">${esc(f.help)}</div>`:""}${choices(f)}${f.example?`<div class="practice-example"><strong>Ejemplo:</strong> ${esc(f.example)}</div>`:""}</div>`;
 const multi=type==="textarea"||f.multiline===true;
 return`<div class="practice-field ${f.required?"required":""}"><label for="practice-${attr(f.name)}">${esc(f.label||f.question||f.name)}${f.required?" *":""}</label>${f.help?`<div class="field-help">${esc(f.help)}</div>`:""}${multi?`<textarea id="practice-${attr(f.name)}" name="${attr(f.name)}" rows="3" placeholder="${attr(f.placeholder||"Escribe solamente lo necesario")}">${esc(value(f.name))}</textarea>`:`<input id="practice-${attr(f.name)}" name="${attr(f.name)}" type="${type==="date"?"date":"text"}" value="${attr(value(f.name))}" placeholder="${attr(f.placeholder||"")}" autocomplete="off">`}${f.example?`<div class="practice-example"><strong>Ejemplo:</strong> ${esc(f.example)}</div>`:""}</div>`
};

const prepare=a=>Array.isArray(a)&&a.length?`<div class="prepare-box"><strong>Antes de continuar</strong><ul>${a.map(x=>`<li>${esc(typeof x==="string"?x:(x.text||x.label||""))}</li>`).join("")}</ul></div>`:"";

const notice=(text,type="info")=>text?`<div class="practice-notice ${type}"><strong>${type==="warning"?"Importante":"Recuerda"}</strong><p>${esc(text)}</p></div>`:"";

const review=()=>{
 const rows=[];
 (practice?.screens||[]).forEach(s=>(s.fields||[]).forEach(f=>{
  const v=value(f.name);
  if(v!==undefined&&v!==null&&clean(v))rows.push(`<div class="review-row"><div><strong>${esc(f.label||f.name)}</strong>${f.help?`<small>${esc(f.help)}</small>`:""}</div><span>${esc(v)}</span></div>`)
 }));
 return rows.length?`<div class="practice-review">${rows.join("")}</div>`:`<div class="practice-notice info"><strong>Aún no hay respuestas</strong><p>Comienza la práctica y tus respuestas quedarán guardadas en este dispositivo.</p></div>`
};

const bindChoices=()=>document.querySelectorAll(".choice-card").forEach(b=>b.onclick=()=>{
 const f=b.dataset.field,v=b.dataset.value;
 answer(f,v);
 document.querySelectorAll(`.choice-card[data-field="${CSS.escape(f)}"]`).forEach(x=>{x.classList.remove("selected");const c=x.querySelector(".choice-check");if(c)c.textContent="○"});
 b.classList.add("selected");const c=b.querySelector(".choice-check");if(c)c.textContent="✓";
});

const collect=()=>{
 const s=practice?.screens?.[screen];if(!s)return true;
 const box=ensure();let ok=true,first=null;
 (s.fields||[]).forEach(f=>{
  const cs=box.querySelectorAll(`.choice-card[data-field="${CSS.escape(f.name)}"]`);
  if(cs.length){if(f.required&&!clean(value(f.name))){ok=false;first=first||cs[0]}return}
  const el=box.querySelector(`[name="${CSS.escape(f.name)}"]`);
  if(!el)return;
  const v=clean(el.value);
  if(f.required&&!v){ok=false;first=first||el;el.classList.add("field-error")}else{el.classList.remove("field-error");answer(f.name,v)}
 });
 if(!ok){
  let e=box.querySelector(".practice-error");
  if(!e){e=document.createElement("div");e.className="practice-error";e.innerHTML="<strong>Falta una respuesta</strong><p>Selecciona o completa los datos obligatorios para continuar.</p>";box.querySelector(".practice-card")?.prepend(e)}
  first?.focus();return false
 }
 return true
};

const render=()=>{
 const ss=practice?.screens||[];
 if(!ss.length)return error("El módulo no contiene pasos de práctica.");
 screen=Math.max(0,Math.min(screen,ss.length-1));
 const s=ss[screen],last=screen===ss.length-1,p=Math.round((screen+1)/ss.length*100),box=ensure();
 box.innerHTML=`<button type="button" class="back-button" id="practice-home">← Volver al inicio</button><div class="practice-card"><div class="practice-progress"><div class="progress-title"><span>PRÁCTICA</span><span>PASO ${screen+1} DE ${ss.length}</span></div><div class="progress"><i style="width:${p}%"></i></div></div>${s.badge?`<div class="practice-badge">${esc(s.badge)}</div>`:""}<h2>${esc(s.title||"Paso de práctica")}</h2>${s.question?`<div class="practice-question">${esc(s.question)}</div>`:""}${s.explanation?`<p class="practice-explanation">${esc(s.explanation)}</p>`:""}${image(s)}${gallery(s)}${prepare(s.prepare)}${s.fields?.length?`<div class="practice-fields">${s.fields.map(field).join("")}</div>`:""}${s.review===true||s.id==="review"?review():""}${notice(s.warning,"warning")}${notice(s.important,"info")}${s.portal_note?`<div class="portal-note"><strong>En el portal oficial</strong><p>${esc(s.portal_note)}</p></div>`:""}<div class="practice-actions"><button type="button" class="back-button" id="practice-back" ${screen===0?"disabled":""}>← Anterior</button><button type="button" class="primary-button" id="practice-next">${last?"Terminar práctica":"Guardar y continuar →"}</button></div></div>`;
 section();bindChoices();
 $("practice-home")?.addEventListener("click",home);
 $("practice-back")?.addEventListener("click",()=>{if(screen>0){collect();screen--;saveCurrent();render()}});
 $("practice-next")?.addEventListener("click",()=>{if(!collect())return;if(!last){screen++;saveCurrent();render()}else finish()});
};

const finish=()=>{
 practice.completed=true;saveCurrent();
 const official=moduleName==="visa"?"https://evisacuba.cu/":"https://dviajeros.mitrans.gob.cu/";
 const title=moduleName==="visa"?"Práctica de Visa completada":"Práctica de D'Viajeros completada";
 const box=ensure();
 box.innerHTML=`<button type="button" class="back-button" id="practice-home">← Volver al inicio</button><div class="practice-card practice-complete"><div class="practice-badge">PRÁCTICA COMPLETADA</div><h2>${esc(title)}</h2><p class="practice-explanation">Ahora puedes revisar lo que practicaste y utilizarlo como referencia al completar el proceso oficial.</p><div class="practice-notice info"><strong>Importante</strong><p>Esta práctica no fue enviada a las autoridades. No realiza pagos, no solicita ni aprueba una visa, no presenta D'Viajeros y no genera un QR oficial.</p></div><h3>Lo que practicaste</h3>${review()}<div class="practice-actions"><button type="button" class="back-button" id="practice-edit">← Volver a practicar</button><a class="primary-button official-link-button" href="${official}" target="_blank" rel="noopener noreferrer">Ir al portal oficial →</a></div><div class="portal-note"><strong>Ahora sí</strong><p>Usa esta práctica como referencia y completa directamente el trámite oficial.</p></div></div>`;
 section();
 $("practice-home")?.addEventListener("click",home);
 $("practice-edit")?.addEventListener("click",()=>{practice.completed=false;screen=0;saveCurrent();render()});
};

const error=m=>{
 const box=ensure();
 box.innerHTML=`<button type="button" class="back-button" id="practice-home">← Volver al inicio</button><div class="practice-card"><div class="practice-error"><strong>No se pudo abrir la práctica</strong><p>${esc(m)}</p></div></div>`;
 section();$("practice-home")?.addEventListener("click",home)
};

const start=async type=>{
 moduleName=type;
 try{
  practice=await get(API[type])||{};
  practice.answers={...(db[type]?.answers||{})};
  practice.completed=false;
  screen=Number(db[type]?.completed?0:db[type]?.screen||0);
  render()
 }catch(e){error(e.message||"No se pudo cargar el módulo.")}
};

$("visa-button")?.addEventListener("click",()=>start("visa"));
$("dviajeros-button")?.addEventListener("click",()=>start("dviajeros"));

document.querySelectorAll("[data-module]").forEach(b=>b.addEventListener("click",()=>{
 const t=b.dataset.module;if(t==="visa"||t==="dviajeros")start(t)
}));

$("clear-all")?.addEventListener("click",()=>{
 if(moduleName)delete db[moduleName];
 save();practice=null;screen=0;home()
});

if(!document.getElementById("cuba-practice-style")){
 const st=document.createElement("style");
 st.id="cuba-practice-style";
 st.textContent=`
.practice-card{background:#fff;border:1px solid #dce4ec;border-radius:18px;padding:24px;margin:20px 0 35px;box-shadow:0 5px 20px rgba(0,0,0,.07)}
.practice-progress{margin-bottom:22px}.progress-title{display:flex;justify-content:space-between;color:#586779;font-size:12px;font-weight:800}.progress{height:7px;background:#e8edf2;border-radius:10px;overflow:hidden;margin-top:8px}.progress i{display:block;height:100%;background:#123c69;border-radius:10px;transition:width .25s}
.practice-badge{display:inline-block;background:#eef4f9;color:#123c69;border-radius:20px;padding:7px 12px;font-size:12px;font-weight:800;margin-bottom:12px}
.practice-question{font-size:21px;font-weight:700;line-height:1.35;margin:15px 0}.practice-explanation{color:#526173;font-size:16px;line-height:1.6}
.practice-visual{margin:20px 0;border:1px solid #dbe3eb;border-radius:14px;overflow:hidden;background:#f7f9fb}.practice-visual img{display:block;width:100%;max-height:560px;object-fit:contain;background:#f7f9fb}.visual-label{padding:8px 12px;background:#eef3f7;color:#526173;font-size:11px;font-weight:800}
.practice-gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin:20px 0}.practice-gallery figure{margin:0;border:1px solid #dce4ec;border-radius:12px;overflow:hidden;background:#fafbfd}.practice-gallery img{display:block;width:100%;height:220px;object-fit:contain;background:#f4f7fa}.practice-gallery figcaption{padding:9px;font-size:13px;color:#566475}
.prepare-box,.practice-notice,.portal-note{margin:18px 0;padding:15px 17px;border-radius:11px;background:#f3f7fa;border:1px solid #dce5ec;color:#384858;line-height:1.55}.prepare-box ul{margin:9px 0 0;padding-left:20px}.practice-notice.warning{background:#fff8e7;border-color:#ead9a5}.practice-notice p,.portal-note p{margin:6px 0 0}
.practice-fields{display:flex;flex-direction:column;gap:18px;margin-top:20px}.practice-field label,.field-label{display:block;font-weight:700;margin-bottom:7px}.field-help{color:#657384;font-size:14px;margin-bottom:8px}
.practice-field input,.practice-field textarea{width:100%;border:1px solid #cbd5df;border-radius:9px;padding:12px;font-size:16px;font-family:inherit;background:#fff}.practice-field input:focus,.practice-field textarea:focus{outline:2px solid #a9c8e5;border-color:#4c89c7}.field-error{border-color:#b3261e!important;background:#fff8f7!important}
.choice-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}.choice-card{position:relative;border:2px solid #d7e0e8;border-radius:13px;background:#fff;padding:16px;min-height:100px;cursor:pointer;text-align:left;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:6px;font-family:inherit;transition:.15s}.choice-card:hover{border-color:#7ca7cb;transform:translateY(-1px)}.choice-card.selected{border-color:#123c69;background:#f2f7fb}.choice-card strong{font-size:16px;color:#172033}.choice-card>span:not(.choice-image):not(.choice-check){color:#617082;font-size:13px;line-height:1.35}.choice-image{width:100%;height:90px;display:flex;align-items:center;justify-content:center}.choice-image img{max-width:100%;max-height:90px;object-fit:contain}.choice-check{position:absolute;top:9px;right:10px;font-weight:900;color:#123c69}
.practice-example{margin-top:7px;padding:8px 10px;border-radius:7px;background:#f6f8fa;color:#5e6c7c;font-size:13px}.practice-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-top:25px}.practice-actions a{text-decoration:none}
.practice-review{border:1px solid #dce4ec;border-radius:11px;overflow:hidden;margin:18px 0}.review-row{display:grid;grid-template-columns:minmax(150px,32%) 1fr;gap:15px;padding:12px 14px;border-bottom:1px solid #e5eaf0}.review-row:last-child{border-bottom:0}.review-row strong{display:block}.review-row small{display:block;color:#6a7786;margin-top:3px}.review-row span{overflow-wrap:anywhere}
.practice-error{margin-bottom:18px;padding:15px 17px;border-radius:11px;border:1px solid #e2b6b3;background:#fff5f4;color:#7c211c}.practice-error p{margin:5px 0 0}
@media(max-width:650px){.practice-card{padding:17px}.practice-question{font-size:18px}.choice-grid{grid-template-columns:1fr}.review-row{grid-template-columns:1fr;gap:4px}.practice-actions{flex-direction:column;align-items:stretch}.practice-actions button,.practice-actions a{width:100%;text-align:center}}
`;
 document.head.appendChild(st)
}

});
