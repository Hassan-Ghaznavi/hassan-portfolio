import assert from 'node:assert/strict';
import handler from '../api/chat.mjs';
import {notes} from '../portfolio-notes.js';
import {makeIndex,retrieve} from '../lib/retrieval.mjs';
const index=makeIndex(notes);assert.match(retrieve('Sunken Greed contribution',index)[0].text,/asset integration/);assert.match(retrieve('Which game won twice?',index)[0].text,/GameCon/);assert.equal(retrieve('What is Hassan salary?',index).length,0);assert.equal(retrieve('Tell me about Mirror Maze',index)[0].href,'#mirror-maze');
async function request(method,body,headers={}){let status;let result;const res={setHeader(){},status(value){status=value;return this;},json(value){result=value;}};await handler({method,body,headers:{origin:'https://hassan-portfolio-two-rho.vercel.app','content-type':'application/json',...headers}},res);return {status,result};}
delete process.env.GEMINI_API_KEY;assert.equal((await request('GET')).result.ready,false);assert.equal((await request('POST',{question:'Which game won twice?'})).status,503);
process.env.GEMINI_API_KEY='test-key-not-a-real-key';assert.equal((await request('GET')).result.ready,false);process.env.GEMINI_FREE_TIER_CONFIRMED='true';let generationCalls=0,unsupported=false,unknown=false,conversation=false;
const originalFetch=globalThis.fetch;
globalThis.fetch=async(url,options)=>{const body=JSON.parse(options.body);assert.match(url,/^https:\/\/generativelanguage.googleapis.com/);assert.equal(options.headers['x-goog-api-key'],'test-key-not-a-real-key');if(url.endsWith(':batchEmbedContents')){return {ok:true,json:async()=>({embeddings:body.requests.map((item,i)=>{assert.equal(item.outputDimensionality,768);const vector=Array(768).fill(0);vector[unknown?767:0]=1;return {values:vector};})})};}generationCalls++;assert.match(body.systemInstruction.parts[0].text,/only questions about Hassan/);assert.equal(body.generationConfig.responseMimeType,'application/json');const context=JSON.parse(body.contents[0].parts[0].text);return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:JSON.stringify({responseType:conversation?'conversation':unknown?'unknown':'portfolio',answer:conversation?'Hey! I’m Doodle. What would you like to explore?':'Two Lights One Escape won twice.',sourceIds:conversation?[]:unsupported?['invented']: [context.sources[0].id]})}]}}]})};};

try{
 assert.equal((await request('POST',{question:'Which game won twice?'},{origin:'https://evil.example'})).status,403);
 assert.equal((await request('POST',{question:'x'})).status,400);
 const result=await request('POST',{question:'Which game won twice?'});assert.equal(result.status,200);assert.match(result.result.sources[0].href,/two-lights/);assert.equal(generationCalls,1);
 unsupported=true;const rejected=await request('POST',{question:'Which game won twice?'});assert.equal(rejected.result.sources.length,0);assert.match(rejected.result.answer,/not in my portfolio/);
 unknown=true;const missing=await request('POST',{question:'What is his salary?'});assert.equal(missing.result.sources.length,0);assert.equal(generationCalls,3);
 conversation=true;const social=await request('POST',{question:'yo'});assert.equal(social.status,200);assert.match(social.result.answer,/Hey!/);assert.equal(social.result.sources.length,0);conversation=false;
 globalThis.fetch=async()=>{throw Error('network unavailable');};assert.equal((await request('POST',{question:'Which game won twice?'})).status,502);
 globalThis.fetch=async()=>({ok:false,status:429});assert.equal((await request('POST',{question:'Which game won twice?'})).status,429);
 console.log('Doodle checks passed: retrieval, unknown facts, configuration, origin, validation, embedding index, cited generation, invalid citations and provider failure. No live AI calls.');
}finally{globalThis.fetch=originalFetch;delete process.env.GEMINI_API_KEY;delete process.env.GEMINI_FREE_TIER_CONFIRMED;}
