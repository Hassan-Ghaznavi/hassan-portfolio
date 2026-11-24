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
const readiness=fetch('/api/chat',{cache:'no-store',signal:AbortSignal.timeout(8000)}).then(r=>r.json()).then(data=>{aiReady=data.ready===true;}).catch(()=>{});
note.textContent='Ask about Hassan’s work, skills or story. Questions may be processed by Google.';
function reply(text,sources=[]){const p=message(text,'guide-answer');for(const source of sources){if(!/^#[a-z0-9-]+$/.test(source.href))continue;const link=document.createElement('a');link.href=source.href;link.textContent='Read: '+source.source;p.append(document.createElement('br'),link);link.addEventListener('click',()=>{if(innerWidth<720)setOpen(false);});}}
document.querySelector('#pencil-form').addEventListener('submit',async event=>{
 event.preventDefault();const question=input.value.trim();if(!question||busy)return;
 busy=true;state.dataset.state='thinking';const button=event.currentTarget.querySelector('button');button.disabled=true;message(question,'guide-question');input.value='';
 const thinking=message('Doodle is checking his notes…','guide-thinking');log.scrollTop=log.scrollHeight;
 try{
  await readiness;
  if(aiReady){const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question}),signal:AbortSignal.timeout(55000)});const data=await response.json();if(!response.ok){const failure=Error('AI unavailable');failure.status=response.status;throw failure;}reply(data.answer,data.sources);}
  else{const matches=retrieve(question,localIndex);if(matches.length)reply(matches[0].text,[matches[0]]);else reply('That detail isn’t in my notes yet. Try a project name, skills, education, or awards.');}
  state.dataset.state='happy';
 }catch(error){const matches=retrieve(question,localIndex);reply(matches.length?'From my saved portfolio notes: '+matches[0].text: (error.status===429?'I’m taking a short break. Please try again later.':'I couldn’t connect just now. Please try again, or ask about a project by name.'),matches.length?[matches[0]]:[]);state.dataset.state='idle';}
 finally{thinking.remove();busy=false;button.disabled=false;while(log.children.length>19)log.firstElementChild.remove();log.scrollTop=log.scrollHeight;setTimeout(()=>{if(!busy)state.dataset.state='idle';},900);}
});
document.addEventListener('pencil:ask',event=>{setOpen(true);input.value=String(event.detail||'Who is Hassan?').slice(0,250);document.querySelector('#pencil-form').requestSubmit();close.focus({preventScroll:true});});

document.addEventListener('doodle:celebrate',()=>{state.dataset.state='happy';setTimeout(()=>{if(!busy)state.dataset.state='idle';},1000);});

// Short, event-driven asides describe real actions without sending automatic AI requests.
const aside=document.createElement('div');aside.className='doodle-book-aside';aside.hidden=true;
const asideText=document.createElement('p');asideText.setAttribute('role','status');asideText.setAttribute('aria-live','polite');
const asideAsk=document.createElement('button');asideAsk.type='button';asideAsk.textContent='Ask me about it';
const asideClose=document.createElement('button');asideClose.type='button';asideClose.className='doodle-aside-close';asideClose.setAttribute('aria-label','Dismiss Doodle’s note');asideClose.textContent='×';aside.append(asideClose,asideText,asideAsk);state.append(aside);
let asideTimer,asideQuestion='';
function hideAside(){clearTimeout(asideTimer);aside.hidden=true;state.classList.remove('doodle-noticing');}
asideClose.addEventListener('click',hideAside);
asideAsk.addEventListener('click',()=>{const question=asideQuestion;hideAside();document.dispatchEvent(new CustomEvent('pencil:ask',{detail:question}));});
launcher.addEventListener('click',hideAside);
document.addEventListener('doodle:book',event=>{
 if(!event.detail?.open){hideAside();return;}
 const {id,title,note:description}=event.detail;
 asideQuestion=id?`Tell me about ${title}`:'What did Hassan build during his internship?';
 asideText.textContent=id?`${title}. ${description}`:'A whole book of little experiments. Pick a bookmark and explore.';
 asideAsk.textContent=id?'Ask me about this game':'Ask about the internship';
 state.classList.add('doodle-noticing');aside.hidden=false;clearTimeout(asideTimer);asideTimer=setTimeout(hideAside,8000);
});
aside.addEventListener('focusin',()=>clearTimeout(asideTimer));aside.addEventListener('focusout',()=>{asideTimer=setTimeout(hideAside,8000);});

// Optional browser speech: never request microphone access or call a paid API.
if('speechSynthesis' in window){
 const read=document.createElement('button');read.type='button';read.className='button outline';read.textContent='Read latest answer';
 const stop=document.createElement('button');stop.type='button';stop.className='button outline';stop.textContent='Stop reading';
 read.addEventListener('click',()=>{const answer=log.querySelector('.guide-answer:last-of-type')||[...log.querySelectorAll('.guide-answer')].pop();if(!answer)return;speechSynthesis.cancel();const speech=new SpeechSynthesisUtterance(answer.textContent);const voices=speechSynthesis.getVoices().filter(v=>/^en[-_]/i.test(v.lang));speech.voice=voices.find(v=>/Natural|Online.*(Guy|Andrew|Ryan)|Google UK English Male/i.test(v.name))||voices.find(v=>/Google|Aria|Jenny|Samantha/i.test(v.name))||voices[0]||null;speech.lang=speech.voice?.lang||'en-US';speech.rate=.94;speech.pitch=1.06;speech.volume=1;speechSynthesis.speak(speech);});
 stop.addEventListener('click',()=>speechSynthesis.cancel());const speechControls=document.createElement('div');speechControls.className='doodle-speech-controls';speechControls.append(read,stop);panel.append(speechControls);close.addEventListener('click',()=>speechSynthesis.cancel());
}
