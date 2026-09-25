"use strict";

const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);

function formData(form){
    const data={};
    new FormData(form).forEach((value,key)=>{
        const v=String(value).trim();
        data[key]=v||null;
    });
    return data;
}

function showResult(element,data){
    if(!element)return;
    element.innerHTML="";
    const pre=document.createElement("pre");
    pre.textContent=JSON.stringify(data,null,2);
    element.appendChild(pre);
}

function showError(element,error){
    if(!element)return;
    element.innerHTML="";
    const p=document.createElement("p");
    p.className="error";
    p.textContent=error||"No fue posible realizar la consulta.";
    element.appendChild(p);
}

async function request(url,payload){
    const response=await fetch(url,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
    });
    let data;
    try{
        data=await response.json();
    }catch{
        throw new Error("El servidor no devolvió una respuesta válida.");
    }
    if(!response.ok){
        throw new Error(data.detail||"Error en la consulta.");
    }
    return data;
}

async function submitForm(form,url,resultSelector){
    const result=$(resultSelector);
    const button=form.querySelector("button[type='submit']");
    if(button)button.disabled=true;
    if(result)result.textContent="Consultando...";
    try{
        const data=await request(url,formData(form));
        showResult(result,data);
    }catch(error){
        showError(result,error.message);
    }finally{
        if(button)button.disabled=false;
    }
}

$$(".tab").forEach(tab=>{
    tab.addEventListener("click",()=>{
        $$(".tab").forEach(x=>x.classList.remove("active"));
        $$(".panel").forEach(x=>x.classList.remove("active"));
        tab.classList.add("active");
        const section=$("#"+tab.dataset.section);
        if(section)section.classList.add("active");
    });
});

$("#visaForm")?.addEventListener("submit",e=>{
    e.preventDefault();
    submitForm(e.currentTarget,"/api/visa/check","#visaResult");
});

$("#dviajerosForm")?.addEventListener("submit",e=>{
    e.preventDefault();
    submitForm(e.currentTarget,"/api/dviajeros/check","#dviajerosResult");
});

$("#passportForm")?.addEventListener("submit",e=>{
    e.preventDefault();
    submitForm(e.currentTarget,"/api/passports/check","#passportResult");
});
