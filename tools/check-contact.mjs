import assert from 'node:assert/strict';
import handler from '../api/contact.mjs';
let ip=0,calls=[];
async function invoke(method,body,url='/api/contact',origin='https://hassan-portfolio-two-rho.vercel.app'){
 const response={headers:{},setHeader(k,v){this.headers[k]=v;},status(code){this.code=code;return this;},json(data){this.data=data;return this;}};
 await handler({method,url,body,headers:{origin,'content-type':'application/json','x-forwarded-for':'test-'+(++ip)}},response);return response;
}
const saved={...process.env},originalFetch=globalThis.fetch;
try{
 delete process.env.RESEND_API_KEY;delete process.env.CONTACT_TO_EMAIL;delete process.env.CONTACT_FROM_EMAIL;
 assert.equal((await invoke('GET')).data.ready,false);assert.equal((await invoke('POST',{})).code,503);
 process.env.RESEND_API_KEY='local-test-only';process.env.CONTACT_TO_EMAIL='owner@example.test';process.env.CONTACT_FROM_EMAIL='Portfolio <sender@example.test>';
 assert.equal((await invoke('GET')).data.ready,true);
 const valid={name:'Test Visitor',email:'visitor@example.test',subject:'A test project',message:'This message exists only in a local test.',website:'',startedAt:Date.now()-4000,requestId:'11111111-2222-3333-4444-555555555555'};
 assert.equal((await invoke('POST',valid,undefined,'https://untrusted.example')).code,403);
 assert.equal((await invoke('POST',{...valid,email:'wrong'})).code,400);
 assert.equal((await invoke('POST',{...valid,website:'spam'})).code,400);
 assert.equal((await invoke('POST',{...valid,subject:'Injected\r\nheader'})).code,400);
 let delivery='sent';
 globalThis.fetch=async(url,options)=>{calls.push({url,options});return new Response(JSON.stringify(options.method==='POST'?{id:'11111111-aaaa-bbbb-cccc-555555555555'}:{last_event:delivery}),{status:200,headers:{'Content-Type':'application/json'}});};
 const accepted=await invoke('POST',valid);assert.equal(accepted.code,202);assert.equal(accepted.data.status,'pending');
 const again=await invoke('POST',valid);assert.equal(calls[0].options.headers['Idempotency-Key'],calls[1].options.headers['Idempotency-Key']);
 const receipt=accepted.data.receipt;
 assert.equal((await invoke('GET',null,'/api/contact?receipt='+receipt)).data.status,'pending');
 delivery='delivered';assert.equal((await invoke('GET',null,'/api/contact?receipt='+receipt)).data.status,'delivered');
 assert.equal((await invoke('GET',null,'/api/contact?receipt='+receipt+'x')).code,400);
 globalThis.fetch=async()=>new Response('{}',{status:503});assert.equal((await invoke('POST',valid)).code,502);
 console.log('Contact checks passed: configuration, validation, origin, spam trap, idempotency, delivery receipt, tampering and provider failure. No email was sent.');
}finally{globalThis.fetch=originalFetch;for(const name of ['RESEND_API_KEY','CONTACT_TO_EMAIL','CONTACT_FROM_EMAIL'])if(saved[name]===undefined)delete process.env[name];else process.env[name]=saved[name];}
