"use strict";
document.addEventListener("DOMContentLoaded",()=>{
const $=id=>document.getElementById(id);
const esc=v=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");
const statusClass=s=>{s=String(s||"").toUpperCase();return s==="READY"||s==="CONFIRMED"?"status-ready":s==="VERIFY"?"status-verify":s==="INCOMPLETE"?"status-incomplete":""};
const statusText=s=>({READY:"PREPARADO",VERIFY:"VERIFICAR",INCOMPLETE:"INCOMPLETO",CONFIRMED:"CONFIRMADO"})[String(s||"").toUpperCase()]||String(s||"");
const show=id=>{document.querySelectorAll(".app-section").forEach(x=>x.classList.add("hidden"));$(id)?.classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})};
const home=()=>{document.querySelectorAll(".app-section").forEach(x=>x.classList.add("hidden"));$("intro")?.classList.remove("hidden");$("modules")?.classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"})};
$("visa-button")?.addEventListener("click",()=>show("visa-section"));
$("dviajeros-button")?.addEventListener("click",()=>show("dviajeros-section"));
$("passport-button")?.addEventListener("click",()=>show("passport-section"));
document.querySelectorAll(".back-button").forEach(b=>b.addEventListener("click",home));
const formData=form=>{const d={};form.querySelectorAll("input,textarea,select").forEach(e=>{if(!e.name)return;d[e.name]=e.type==="checkbox"?e.checked:e.value.trim()});return d};
const error=(el,msg)=>{el.classList.remove("hidden");el.innerHTML=`<div class="error-box"><strong>Error</strong><p>${esc(msg)}</p></div>`};
const renderChecks=checks=>(checks||[]).map(c=>`<div class="result-item"><strong>${esc(c.id)}</strong><span class="status ${statusClass(c.status)}">${esc(statusText(c.status))}</span><p>${esc(c.message)}</p></div>`).join("");
const renderMissing=fields=>fields?.length?`<div class="result-item"><strong>Datos que faltan</strong><ul>${fields.map(f=>`<li>${esc(f)}</li>`).join("")}</ul></div>`:"";
const portal=url=>url?`<a class="official-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Abrir portal oficial →</a>`:"";
const resultHeader=(title,status)=>`<h3>${title}</h3><p>Estado: <span class="status ${statusClass(status)}">${esc(statusText(status))}</span></p>`;
async function post(url,data){const r=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw new Error(j.detail||"No se pudo procesar la solicitud.");return j}
$("visa-form")?.addEventListener("submit",async e=>{
e.preventDefault();const r=$("visa-result");r.classList.remove("hidden");r.innerHTML="<p>Revisando información...</p>";
try{const d=await post("/api/visa/evaluate",formData(e.target));let h=resultHeader("Resultado de la preparación de Visa / eVisa",d.status);
h+=renderMissing(d.missing_fields);h+=`<div class="result-item"><strong>Qué significa</strong><p>Esta revisión prepara tus datos. No determina por sí sola si necesitas visa ni emite una visa.</p></div>`;h+=renderChecks(d.checks);h+=d.app_issues_visa?"":"<div class=\"result-item\"><strong>Después</strong><p>Cuando termines la preparación, verifica la información y continúa en el portal oficial.</p></div>";h+=portal(d.official_portal);r.innerHTML=h}catch(x){error(r,x.message)}});
$("dviajeros-form")?.addEventListener("submit",async e=>{
e.preventDefault();const r=$("dviajeros-result");r.classList.remove("hidden");r.innerHTML="<p>Revisando información...</p>";let d=formData(e.target);d.health_information=d.health_information?{declaration:d.health_information}:{};d.customs_information=d.customs_information?{declaration:d.customs_information}:{};
try{const x=await post("/api/dviajeros/evaluate",d);let h=resultHeader("Resultado de la preparación de D'Viajeros",x.status);h+=renderMissing(x.missing_fields);h+=`<div class="result-item"><strong>Estado oficial</strong><p>Esta aplicación no ha enviado el formulario oficial y no ha generado el QR oficial.</p></div><div class="result-item"><strong>Secciones</strong>${(x.modules||[]).map(m=>`<div class="module-check"><strong>${esc(m.title)}</strong><span class="status ${statusClass(m.status)}">${esc(statusText(m.status))}</span></div>`).join("")}</div>`;h+=portal(x.official_portal);r.innerHTML=h}catch(x){error(r,x.message)}});
$("passport-form")?.addEventListener("submit",async e=>{
e.preventDefault();const r=$("passport-result");r.classList.remove("hidden");r.innerHTML="<p>Revisando pasaporte...</p>";
try{const d=await post("/api/passports/evaluate",formData(e.target));let h=resultHeader("Resultado de la revisión del pasaporte",d.status);h+=renderMissing(d.missing_fields);h+=`<div class="result-item"><strong>Importante</strong><p>Esta revisión solamente comprueba que los datos estén preparados de forma básica. No determina la validez oficial del pasaporte.</p></div>`;h+=renderChecks(d.checks);r.innerHTML=h}catch(x){error(r,x.message)}});
$("clear-all")?.addEventListener("click",()=>{document.querySelectorAll("form").forEach(f=>f.reset());document.querySelectorAll(".result").forEach(r=>{r.classList.add("hidden");r.innerHTML=""});home()});
$("official-visa")?.addEventListener("click",()=>window.open("https://evisacuba.cu/","_blank","noopener,noreferrer"));
$("official-dviajeros")?.addEventListener("click",()=>window.open("https://dviajeros.mitrans.gob.cu/","_blank","noopener,noreferrer"));
});
