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
const notes=[
 {terms:['award','win','won','competition','gamecon','two','lights','escape','best','standout'],text:'Two Lights One Escape won at GameCon and at the project evaluation. Hassan worked on gameplay, light-based puzzles, movement, interactions, and UI as part of the team.',href:'#two-lights',source:'Two Lights / two wins'},
 {terms:['paper','plane','dash','unreal','flight'],text:'Paper Plane Dash is an Unreal Engine 5 team project. Hassan led development of lane switching, banking, and flight-energy mechanics. Its gameplay and browser interpretation now live together in that chapter.',href:'#paper-dash',source:'Paper Plane Dash'},
 {terms:['sunken','greed','whale','underwater','swim','vr'],text:'Sunken Greed is a Unity VR team project Hassan worked on, featuring physical swimming and hands-on underwater interactions. Its chapter includes the scroll-driven whale sketch and actual gameplay.',href:'#sketch-sea',source:'Sunken Greed'},
 {terms:['intern','internship','airidev','solo','ten','10','months'],text:'During his ongoing AIRIDEV internship, Hassan developed 10+ games in four months, handling development alone. This portfolio shares approved project images; internship gameplay and source files remain private.',href:'#internship',source:'AIRIDEV collection'},
 {terms:['skill','skills','technology','technologies','unity','language','code','tools','stack'],text:'Hassan’s toolkit includes Unity, Unreal Engine 5, Blender, Maya, C#, C++, Python, JavaScript, and Three.js, alongside gesture tracking and backend tools.',href:'#skills',source:'Toolkit'},
 {terms:['education','university','cgpa','study','studies','ned','academic'],text:'Hassan studies Computer Science & Information Technology at NED University, specializing in Gaming & Animation, with a 3.85 CGPA.',href:'#journey',source:'Education & journey'},
 {terms:['smile','jam','ggj','cega'],text:'Hassan co-developed Behind the Smile during Global Game Jam 2026 at the CEGA Karachi site. You can watch the team’s project in its chapter.',href:'#behind-smile',source:'Behind the Smile'},
 {terms:['blender','render','art','environment','model','modeling','cave','ocean','airpods'],text:'The render room collects Hassan’s Cave Scene, Stormy Ocean and AirPods animations, plus his forest, perfume and Rubik’s cube renders. These are images of his 3D work, with motion added to their presentation.',href:'#blender-studies',source:'The render room'},
 {terms:['about','hassan','karachi','profile','who','contact','hire','linkedin'],text:'Hassan Ghaznavi is a game developer and 3D environment artist based in Karachi. He also leads the Game Development & Animation domain at Gameverse Society. His LinkedIn is linked in the About section.',href:'#about',source:'About Hassan'}
];
function message(text,className){const p=document.createElement('p');p.className=className;p.textContent=text;log.append(p);return p;}
document.querySelector('#pencil-form').addEventListener('submit',event=>{
 event.preventDefault();const question=input.value.trim();if(!question)return;
 message(question,'guide-question');const tokens=question.toLowerCase().match(/[a-z0-9]+/g)||[];
 const ranked=notes.map(note=>({note,score:tokens.reduce((sum,token)=>sum+(note.terms.includes(token)?1:0),0)})).sort((a,b)=>b.score-a.score);
 const match=ranked[0];
 if(match.score){const reply=message(match.note.text,'guide-answer');const link=document.createElement('a');link.href=match.note.href;link.textContent='Read: '+match.note.source;reply.append(document.createElement('br'),link);link.addEventListener('click',()=>{if(innerWidth<720)setOpen(false);});}
 else message('I don’t have that information in these portfolio notes. Try a project name, skills, education, or awards. The full AI / RAG connection is not enabled yet.','guide-answer');
 while(log.children.length>17)log.firstElementChild.remove();input.value='';log.scrollTop=log.scrollHeight;
});
