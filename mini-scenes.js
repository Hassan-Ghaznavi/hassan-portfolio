import * as THREE from 'three';
// A single transparent renderer serves all miniatures using viewport scissoring.
// Each region retains a static illustration if WebGL is unavailable.
export function mountMiniScenes(regions){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<720?1:1.25));renderer.setClearColor(0,0);renderer.autoClear=false;renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.domElement.className='mini-scenes-layer';renderer.domElement.setAttribute('aria-hidden','true');document.body.append(renderer.domElement);
 const paper=new THREE.MeshToonMaterial({color:0xe4d7bf}),red=new THREE.MeshToonMaterial({color:0xb44a35}),dark=new THREE.MeshToonMaterial({color:0x544b40}),light=new THREE.MeshToonMaterial({color:0xf8efdf});
 const edgeMaterial=new THREE.LineBasicMaterial({color:0x463e34,transparent:true,opacity:.8});
 function solid(geometry,material,parent,position=[0,0,0]){const mesh=new THREE.Mesh(geometry,material);mesh.position.set(...position);parent.add(mesh);const edges=new THREE.LineSegments(new THREE.EdgesGeometry(geometry,28),edgeMaterial);mesh.add(edges);return mesh;}
 function ball(parent,scale,position,mat=paper){const m=solid(new THREE.SphereGeometry(1,20,12),mat,parent,position);m.scale.set(...scale);return m;}
 function ring(parent,r,y,mat=dark){const m=solid(new THREE.TorusGeometry(r,.018,4,50),mat,parent,[0,y,0]);m.rotation.x=-Math.PI/2;return m;}
 function curve(parent,points,color=0x5e5142){const path=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(path.getPoints(70)),new THREE.LineBasicMaterial({color}));parent.add(line);return line;}
 function gear(parent,x,y,radius){const shape=new THREE.Shape();for(let i=0;i<=64;i++){const a=i/64*Math.PI*2;const r=radius*(i%4<2?1:.80);const x=Math.cos(a)*r,y=Math.sin(a)*r;i?shape.lineTo(x,y):shape.moveTo(x,y);}const hole=new THREE.Path();hole.absarc(0,0,radius*.24,0,Math.PI*2,true);shape.holes.push(hole);return solid(new THREE.ExtrudeGeometry(shape,{depth:.32,bevelEnabled:false,curveSegments:20}),paper,parent,[x,y,0]);}
 function roundedBox(w,h,d,r){const shape=new THREE.Shape(),x=-w/2,y=-h/2;shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);const geometry=new THREE.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:5});geometry.translate(0,0,-d/2);return geometry;}
 function create(kind){
  const root=new THREE.Group();let animate=()=>{};
  if(kind==='ink-bleed'){
   const points=[];for(let i=0;i<=22;i++){const u=i/22;points.push(new THREE.Vector2(Math.sin(Math.PI*u)*(.30+.13*(1-u)),u*1.15));}
   const drop=solid(new THREE.LatheGeometry(points,22),red,root);
   const pool=ball(root,[.8,.035,.6],[0,-.68,0],red),ripples=[ring(root,.75,-.62),ring(root,.95,-.63)];
   animate=(t,p)=>{const phase=(t*.42+p*.3)%1;drop.position.y=.50-phase*1.1;drop.scale.setScalar(phase<.82?1:Math.max(.06,(1-phase)/.18));pool.scale.set(.7+Math.sin(phase*Math.PI)*.2,.035,.5+Math.sin(phase*Math.PI)*.16);ripples.forEach((r,i)=>{const v=(phase+i*.3)%1;r.scale.setScalar(.7+v*.7);r.visible=v<.8;});};
  }else if(kind==='clockwork-path'){
   const a=gear(root,-.52,.15,.75),b=gear(root,.66,-.18,.48);root.rotation.x=.25;root.rotation.y=.35;
   animate=(t,p)=>{a.rotation.z=t*.45+p;b.rotation.z=-t*.7-p*1.55;};
  }else if(kind==='fossil-layer'){
   const strata=[];for(let i=0;i<3;i++){const m=solid(new THREE.BoxGeometry(2,.16,1.35),i%2?paper:light,root,[0,-.54+i*.2,0]);strata.push(m);}
   const fossil=new THREE.Group();root.add(fossil);const pts=[];for(let i=0;i<=90;i++){const a=i/90*Math.PI*4.5,r=.04+i/90*.45;pts.push([Math.cos(a)*r,.15,Math.sin(a)*r]);}curve(fossil,pts,0xa93f2a);
   root.rotation.set(.40,-.3,.05);
   animate=(t,p)=>{strata[2].position.x=.4+Math.sin(t*.7+p)*.4;strata[2].position.y=.12+Math.sin(t*.7)*.06;fossil.rotation.y=Math.sin(t*.4)*.10;};
  }else if(kind==='glass-resonance'){
   const bars=[];for(let i=0;i<19;i++){bars.push(solid(new THREE.CylinderGeometry(.035,.035,1,6),i%3===0?red:paper,root,[-1.25+i*.14,0,Math.sin(i*.4)*.2]));}root.rotation.y=-.28;
   animate=(t,p)=>bars.forEach((b,i)=>{b.scale.y=.2+Math.abs(Math.sin(i*.42-t*1.7+p))*1.15;});
  }else if(kind==='crystal'){
   const crystals=[];for(let i=0;i<5;i++){const m=solid(new THREE.CylinderGeometry(0,.23,.95+i%3*.25,5),i===2?red:paper,root,[(i-2)*.33,-.1+Math.sin(i)*.15,Math.cos(i)*.15]);m.rotation.z=(i-2)*-.12;crystals.push(m);}solid(new THREE.CylinderGeometry(.85,1,.15,7),dark,root,[0,-.68,0]);
   animate=(t,p)=>{root.rotation.y=Math.sin(t*.35)*.28+(p-.5)*.6;crystals.forEach((c,i)=>c.position.y=-.10+Math.sin(t*1.2+i)*.04);};
  }else if(kind==='buoy'){
   const buoy=new THREE.Group();root.add(buoy);
   solid(new THREE.CylinderGeometry(.36,.44,.20,12),dark,buoy,[0,-.4,0]);solid(new THREE.CylinderGeometry(.14,.26,.32,10),paper,buoy,[0,-.15,0]);solid(new THREE.CylinderGeometry(.21,.21,.62,10,true),red,buoy,[0,.32,0]);
   for(let i=0;i<4;i++){const a=i/4*Math.PI*2;solid(new THREE.CylinderGeometry(.025,.025,.85,5),dark,buoy,[Math.cos(a)*.22,.30,Math.sin(a)*.22]);}
   solid(new THREE.ConeGeometry(.30,.19,10),dark,buoy,[0,.82,0]);
   const waves=[];for(let j=0;j<4;j++){const pts=[];for(let i=0;i<=30;i++)pts.push([-1.5+i*.1,-.65, -.9+j*.52]);waves.push(curve(root,pts));}
   animate=(t,p)=>{buoy.rotation.z=Math.sin(t*1.5)*.15;buoy.position.y=Math.sin(t*1.5)*.09;waves.forEach((wave,j)=>{const pos=wave.geometry.attributes.position;for(let i=0;i<pos.count;i++)pos.setY(i,-.65+Math.sin(pos.getX(i)*3-t*1.5+j)*.07);pos.needsUpdate=true;});root.rotation.y=(p-.5)*.5;};
  }else if(kind==='earbuds'){
   const body=solid(roundedBox(1.7,.66,.72,.20),light,root,[0,-.3,0]);
   const lid=new THREE.Group();lid.position.set(0,.04,-.35);root.add(lid);solid(roundedBox(1.7,.27,.72,.12),paper,lid,[0,.11,.35]);
   const buds=[];for(let i=0;i<2;i++){const bud=new THREE.Group();root.add(bud);ball(bud,[.22,.16,.23],[0,.1,0],light);solid(new THREE.CylinderGeometry(.075,.085,.65,10),light,bud,[.07,-.25,0]);bud.position.set(i? .44:-.44,.30,0);buds.push(bud);}
   root.rotation.set(.2,-.35,0);
   animate=(t,p)=>{const open=.5+.5*Math.sin(t*.8+p);lid.rotation.x=-open*1.6;buds.forEach((b,i)=>{b.position.y=.28+open*.38+Math.sin(t*1.2+i)*.04;b.rotation.z=Math.sin(t*.8+i)*.1;});root.rotation.y=-.35+Math.sin(t*.3)*.14;};
  }
  return {root,animate};
 }
 const entries=regions.map(node=>{const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xfffaed,0x847460,2.4));const key=new THREE.DirectionalLight(0xffffff,2.5);key.position.set(-3,5,5);scene.add(key);const camera=new THREE.PerspectiveCamera(35,1,.1,30);camera.position.set(0,1.3,5.6);camera.lookAt(0,0,0);const content=create(node.dataset.miniSketch);scene.add(content.root);return {node,scene,camera,...content,visible:false};});
 let raf=0,last=0,time=0,paused=reduced.matches,failed=false;
 const pauses=[...document.querySelectorAll('[data-mini-pause]')];
 function request(){if(!failed&&!raf&&!document.hidden&&entries.some(e=>e.visible))raf=requestAnimationFrame(frame);}
 function frame(now){
  raf=0;if(document.hidden)return;
  const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!paused)time+=dt;
  renderer.setScissorTest(false);renderer.clear();renderer.setScissorTest(true);
  for(const entry of entries){
   if(!entry.visible)continue;const r=entry.node.getBoundingClientRect();if(r.bottom<=0||r.top>=innerHeight||!r.width||!r.height)continue;
   const p=reduced.matches?.5:Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
   entry.animate(reduced.matches?0:time,p);entry.camera.aspect=r.width/r.height;entry.camera.updateProjectionMatrix();
   renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);renderer.setScissor(Math.max(0,r.left),Math.max(0,innerHeight-r.bottom),Math.min(r.width,innerWidth-r.left),Math.min(r.bottom,innerHeight)-Math.max(r.top,0));renderer.clearDepth();renderer.render(entry.scene,entry.camera);entry.node.classList.add('mini-ready');entry.node.dataset.sketchTime=time.toFixed(2);
  }
  if(!paused)request();
 }
 function resize(){renderer.setSize(innerWidth,innerHeight,false);request();}
 const observer=new IntersectionObserver(changes=>{for(const change of changes){const e=entries.find(e=>e.node===change.target);e.visible=change.isIntersecting;}last=0;if(!entries.some(e=>e.visible)){if(raf)cancelAnimationFrame(raf);raf=0;renderer.setScissorTest(false);renderer.clear();}request();},{threshold:.01});
 entries.forEach(e=>observer.observe(e.node));
 function announce(){pauses.forEach(pause=>{pause.textContent=paused?'Play 3D sketches':'Pause 3D sketches';pause.setAttribute('aria-pressed',String(paused));});}
 pauses.forEach(pause=>pause.addEventListener('click',()=>{paused=!paused;last=0;announce();request();}));
 reduced.addEventListener('change',()=>{paused=reduced.matches;last=0;announce();request();});
 window.addEventListener('resize',resize);window.addEventListener('scroll',request,{passive:true});document.addEventListener('visibilitychange',()=>{last=0;if(document.hidden&&raf){cancelAnimationFrame(raf);raf=0;}request();});
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();failed=true;if(raf)cancelAnimationFrame(raf);raf=0;entries.forEach(e=>e.node.classList.remove('mini-ready'));renderer.domElement.hidden=true;});
 announce();resize();
}
