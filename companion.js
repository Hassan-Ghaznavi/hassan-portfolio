import {notes} from './portfolio-notes.js';
import {makeIndex,retrieve} from './lib/retrieval.mjs';
const launcher=document.querySelector('#pencil-launcher');
const panel=document.querySelector('#pencil-panel');
const close=document.querySelector('#pencil-close');
const input=document.querySelector('#pencil-question');
const log=document.querySelector('#pencil-messages');
let scene,loading;
async function setOpen(open){
 panel.hidden=!open;launcher.setAttribute('aria-expanded',String(open));
 if(!open){scene?.setActive(false);launcher.focus();return;}
 input.focus();
 if(!loading){loading=import('./companion-scene.js').then(m=>m.mountCompanion(document.querySelector('#pencil-canvas'))).then(result=>{scene=result;scene.setActive(!panel.hidden);}).catch(()=>{document.querySelector('.pencil-model').hidden=true;});}
 scene?.setActive(true);
}
launcher.addEventListener('click',()=>setOpen(panel.hidden));
close.addEventListener('click',()=>setOpen(false));
panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();setOpen(false);}});

function message(text,className){const p=document.createElement('p');p.className=className;p.textContent=text;log.append(p);return p;}
const localIndex=makeIndex(notes);const state=document.querySelector('.pencil-companion');const note=document.querySelector('.guide-note');
let aiReady=false,busy=false;
fetch('/api/chat').then(r=>r.json()).then(data=>{aiReady=data.ready===true;note.textContent=aiReady?'AI answers grounded in Hassan’s portfolio. Sources included.':'Local portfolio notes · AI connection not configured.';}).catch(()=>{note.textContent='Local portfolio notes · AI is unavailable.';});
function reply(text,sources=[]){const p=message(text,'guide-answer');for(const source of sources){if(!/^#[a-z0-9-]+$/.test(source.href))continue;const link=document.createElement('a');link.href=source.href;link.textContent='Read: '+source.source;p.append(document.createElement('br'),link);link.addEventListener('click',()=>{if(innerWidth<720)setOpen(false);});}}
document.querySelector('#pencil-form').addEventListener('submit',async event=>{
 event.preventDefault();const question=input.value.trim();if(!question||busy)return;
 busy=true;state.dataset.state='thinking';const button=event.currentTarget.querySelector('button');button.disabled=true;message(question,'guide-question');input.value='';
 const thinking=message('Doodle is checking his notes…','guide-thinking');log.scrollTop=log.scrollHeight;
 try{
  if(aiReady){const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question}),signal:AbortSignal.timeout(25000)});const data=await response.json();if(!response.ok)throw Error(data.error||'AI is unavailable.');reply(data.answer,data.sources);}
  else{const matches=retrieve(question,localIndex);if(matches.length)reply(matches[0].text,[matches[0]]);else reply('That detail isn’t in my notes yet. Try a project name, skills, education, or awards.');}
  state.dataset.state='happy';
 }catch{reply('My AI connection is unavailable right now. You can still explore the project chapters below.');state.dataset.state='idle';}
 finally{thinking.remove();busy=false;button.disabled=false;while(log.children.length>19)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;setTimeout(()=>{if(!busy)state.dataset.state='idle';},900);}
});
document.addEventListener('pencil:ask',event=>{setOpen(true);input.value=String(event.detail||'Who is Hassan?').slice(0,250);document.querySelector('#pencil-form').requestSubmit();close.focus({preventScroll:true});});

document.addEventListener('doodle:celebrate',()=>{state.dataset.state='happy';setTimeout(()=>{if(!busy)state.dataset.state='idle';},1000);});
