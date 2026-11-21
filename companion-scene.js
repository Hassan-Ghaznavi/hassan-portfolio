import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
export async function mountCompanion(canvas){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(280,130,false);renderer.outputColorSpace=THREE.SRGBColorSpace;
 const camera=new THREE.PerspectiveCamera(35,280/130,.1,30);camera.position.set(0,0,7);
 const scene=new THREE.Scene(),group=new THREE.Group();scene.add(group);
 const gltf=await new GLTFLoader().loadAsync('./assets/mascot/pencil-web.glb');
 const model=gltf.scene,box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
 model.position.sub(center);const normalizer=new THREE.Group();normalizer.scale.setScalar(3.4/size.y);normalizer.add(model);group.add(normalizer);
 model.traverse(o=>{if(o.isMesh)o.material=new THREE.MeshBasicMaterial({color:o.material.color.clone()});});
 const mixer=new THREE.AnimationMixer(model);gltf.animations.forEach(clip=>mixer.clipAction(clip).play());
 let active=false,raf=0,last=0;
 function request(){if(active&&!document.hidden&&!raf)raf=requestAnimationFrame(frame);}
 function frame(now){raf=0;const dt=last?Math.min((now-last)/1000,.05):0;last=now;if(!reduced.matches)mixer.update(dt);renderer.render(scene,camera);if(!reduced.matches)request();}
 function setActive(value){active=value;last=0;if(!active&&raf){cancelAnimationFrame(raf);raf=0;}if(active)request();}
 document.addEventListener('visibilitychange',()=>{last=0;if(!document.hidden)request();else if(raf){cancelAnimationFrame(raf);raf=0;}});
 reduced.addEventListener('change',()=>{if(raf){cancelAnimationFrame(raf);raf=0;}request();});
 return {setActive};
}
