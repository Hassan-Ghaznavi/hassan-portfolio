import assert from 'node:assert/strict';
import handler from '../api/chat.mjs';
import {notes} from '../portfolio-notes.js';
import {makeIndex,retrieve} from '../lib/retrieval.mjs';
const index=makeIndex(notes);assert.match(retrieve('Which game won twice?',index)[0].text,/GameCon/);assert.equal(retrieve('What is Hassan salary?',index).length,0);assert.equal(retrieve('Tell me about Mirror Maze',index)[0].href,'#mirror-maze');
async function request(method,body,headers={}){let status;let result;const res={setHeader(){},status(value){status=value;return this;},json(value){result=value;}};await handler({method,body,headers:{origin:'https://hassan-portfolio-two-rho.vercel.app','content-type':'application/json',...headers}},res);return {status,result};}
delete process.env.OPENAI_API_KEY;assert.equal((await request('GET')).result.ready,false);assert.equal((await request('POST',{question:'Which game won twice?'})).status,503);
process.env.OPENAI_API_KEY='test-key-not-a-real-key';let generationCalls=0,unsupported=false,unknown=false;
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options)=>{const body=JSON.parse(options.body);if(url.endsWith('/embeddings')){return {ok:true,json:async()=>({data:body.input.map((text,i)=>{const vector=Array(512).fill(0);vector[unknown?510:0]=1;return {index:i,embedding:vector};})})};}generationCalls++;assert.equal(body.store,false);assert.match(body.instructions,/only questions about Hassan/);assert.equal(body.text.format.strict,true);const context=JSON.parse(body.input);return {ok:true,json:async()=>({output:[{type:'message',content:[{type:'output_text',text:JSON.stringify({answer:'Two Lights One Escape won twice.',sourceIds:unsupported?['invented']: [context.sources[0].id]})}]}]})};};
try{
 assert.equal((await request('POST',{question:'Which game won twice?'},{origin:'https://evil.example'})).status,403);
 assert.equal((await request('POST',{question:'x'})).status,400);
 const result=await request('POST',{question:'Which game won twice?'});assert.equal(result.status,200);assert.match(result.result.sources[0].href,/two-lights/);assert.equal(generationCalls,1);
 unsupported=true;const rejected=await request('POST',{question:'Which game won twice?'});assert.equal(rejected.result.sources.length,0);assert.match(rejected.result.answer,/not in my portfolio/);
 unknown=true;const missing=await request('POST',{question:'What is his salary?'});assert.equal(missing.result.sources.length,0);assert.equal(generationCalls,2);
 globalThis.fetch=async()=>{throw Error('network unavailable');};assert.equal((await request('POST',{question:'Which game won twice?'})).status,502);
 console.log('Doodle checks passed: retrieval, unknown facts, configuration, origin, validation, embedding index, cited generation, invalid citations and provider failure. No live AI calls.');
}finally{globalThis.fetch=originalFetch;delete process.env.OPENAI_API_KEY;}
