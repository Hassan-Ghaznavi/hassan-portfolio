import {playCue} from './story-scenes.js';
const form=document.querySelector('#contact-form'),paper=document.querySelector('#contact-paper'),status=document.querySelector('#contact-status'),send=document.querySelector('#contact-send'),preview=document.querySelector('#contact-preview');
let startedAt=Date.now(),requestId=crypto.randomUUID(),busy=false,accepted=false;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
function fold(isPreview){
 playCue('fold');preview.disabled=true;paper.classList.add('folding');
 setTimeout(()=>{paper.classList.remove('folding');preview.disabled=false;if(isPreview)status.textContent='Fold preview only. Your note has not been sent.';},reduced.matches?100:1700);
}
preview.addEventListener('click',()=>{if(!busy&&!paper.classList.contains('folding')){status.textContent='Previewing the paper fold. Nothing is being sent.';fold(true);}});
async function connection(){
 try{const response=await fetch('/api/contact',{headers:{Accept:'application/json'}});const data=await response.json();send.disabled=!data.ready;status.textContent=data.ready?'Your note folds into a plane after delivery is confirmed.':'The inbox is not connected yet. You can preview the paper fold or reach me on LinkedIn.';return Boolean(data.ready);}catch{send.disabled=true;status.textContent='The inbox is not connected in this preview. Try the fold animation or use LinkedIn.';return false;}
}
form.addEventListener('input',()=>{if(accepted){accepted=false;requestId=crypto.randomUUID();startedAt=Date.now();send.disabled=false;send.textContent='Send my note ↗';}});
form.addEventListener('submit',async event=>{
 event.preventDefault();if(busy||accepted||!form.reportValidity())return;
 busy=true;send.disabled=true;preview.disabled=true;send.textContent='Sending…';status.textContent='Sending your note. Keeping the paper here until delivery is confirmed.';
 try{
  const body=Object.fromEntries(new FormData(form));body.startedAt=startedAt;body.requestId=requestId;
  const response=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const data=await response.json();if(!response.ok)throw new Error(data.error||'The note could not be sent.');
  accepted=true;send.textContent='Note accepted';let delivered=false,failed=false;
  for(let i=0;i<10;i++){
   if(i)await new Promise(resolve=>setTimeout(resolve,1800));
   let delivery;try{const check=await fetch('/api/contact?receipt='+encodeURIComponent(data.receipt));if(!check.ok)continue;delivery=await check.json();}catch{continue;}
   if(delivery.status==='delivered'){delivered=true;break;}if(delivery.status==='failed'){failed=true;break;}
  }
  if(delivered){document.dispatchEvent(new CustomEvent('doodle:celebrate'));status.textContent='Delivered. Your note has reached the receiving mail server.';fold(false);form.reset();requestId=crypto.randomUUID();startedAt=Date.now();send.textContent='Write another note';}
  else if(failed){status.textContent='The mail service reported a delivery problem. Your note is still here; please use LinkedIn.';}
  else {status.textContent='Your note was accepted for sending, but delivery is not confirmed yet. It has not been folded away. Please avoid resubmitting the same note.';}
 }catch(error){status.textContent=error.message||'The connection failed. Your note is still here.';send.disabled=false;send.textContent='Try sending again ↗';}
 finally{busy=false;preview.disabled=false;}
});
connection();
