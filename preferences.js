const root=document.documentElement;const system=matchMedia('(prefers-color-scheme: dark)');let saved;try{saved=localStorage.getItem('paper-theme');}catch{}
const toggle=document.createElement('button');toggle.type='button';toggle.className='sound-toggle';document.querySelector('.site-header nav').append(toggle);
function apply(dark){root.dataset.theme=dark?'dark':'light';toggle.textContent=dark?'Day paper':'Night paper';toggle.setAttribute('aria-pressed',String(dark));}apply(saved?saved==='dark':system.matches);
toggle.addEventListener('click',()=>{apply(root.dataset.theme!=='dark');try{localStorage.setItem('paper-theme',root.dataset.theme);}catch{}});
system.addEventListener('change',e=>{if(!saved)apply(e.matches);});
