import assert from 'node:assert/strict';
import {attachVideoClose} from '../video-controls.js';
globalThis.window={};globalThis.document={createElement:()=>({setAttribute(){},addEventListener(n,f){this[n]=f;},remove(){this.removed=true;}})};
for(const tag of ['VIDEO','IFRAME']){let restored=false,focused=false;const host={append(e){this.control=e;}};const player={tagName:tag,parentElement:host,title:'Test',pause(){},remove(){this.removed=true;}};const trigger={hidden:true,setAttribute(n,v){this[n]=v;},focus(){focused=true;}};attachVideoClose(player,trigger,()=>restored=true);assert.equal(trigger['aria-expanded'],'true');host.control.click();assert.ok(player.removed&&host.control.removed&&restored&&focused);assert.equal(trigger.hidden,false);assert.equal(trigger['aria-expanded'],'false');}
console.log('Passed: video/iframe collapse removes player and control, restores artwork, trigger and focus.');
