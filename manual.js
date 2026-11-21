const overlay=document.querySelector('#manual-intro');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let timer;
function finish(){clearTimeout(timer);overlay.classList.add('intro-leaving');setTimeout(()=>{overlay.hidden=true;overlay.classList.remove('intro-opening','intro-leaving');},reduced.matches?0:350);try{sessionStorage.setItem('manual-opened','yes');}catch{}}
function open(){if(reduced.matches)return;clearTimeout(timer);overlay.hidden=false;overlay.classList.remove('intro-leaving','intro-opening');requestAnimationFrame(()=>overlay.classList.add('intro-opening'));timer=setTimeout(finish,2900);}
document.querySelector('#manual-skip').addEventListener('click',finish);
document.querySelector('#manual-replay').addEventListener('click',open);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!overlay.hidden)finish();});
reduced.addEventListener('change',()=>{if(reduced.matches)finish();});
let seen=false;try{seen=sessionStorage.getItem('manual-opened')==='yes';}catch{}
if(!seen&&!location.hash)open();
// Reading progress is tied to actual document position, never a simulated loader.
const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
let pending=false;function update(){pending=false;const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?scrollY/total:0})`;}
function schedule(){if(!pending){pending=true;requestAnimationFrame(update);}}
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);new ResizeObserver(schedule).observe(document.body);schedule();
