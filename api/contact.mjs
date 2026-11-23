import {sharedLimited} from '../lib/shared-limit.mjs';
import {createHmac,createHash,timingSafeEqual} from 'node:crypto';
const attempts=new Map();
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const key=()=>process.env.RESEND_API_KEY;
const ready=()=>Boolean(key()&&process.env.CONTACT_TO_EMAIL&&process.env.CONTACT_FROM_EMAIL);
function sign(payload){const body=Buffer.from(JSON.stringify(payload)).toString('base64url');return body+'.'+createHmac('sha256',key()).update(body).digest('base64url');}
function verify(token){
 if(typeof token!=='string'||token.length>700)return null;
 const [body,sig]=token.split('.');if(!body||!sig)return null;const expected=createHmac('sha256',key()).update(body).digest();const actual=Buffer.from(sig,'base64url');if(actual.length!==expected.length||!timingSafeEqual(actual,expected))return null;
 try{const data=JSON.parse(Buffer.from(body,'base64url'));if(!/^[a-z0-9-]{20,80}$/i.test(data.id)||Date.now()-data.at>600000||data.at>Date.now()+5000)return null;return data;}catch{return null;}
}
function limited(req){
 const now=Date.now(),ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();const id=createHash('sha256').update(ip).digest('hex');
 for(const [name,value] of attempts)if(now-value.start>600000)attempts.delete(name);
 const entry=attempts.get(id)||{start:now,count:0};entry.count++;attempts.set(id,entry);if(attempts.size>1000)attempts.delete(attempts.keys().next().value);return entry.count>4;
}
export default async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json');
 const reply=(status,data)=>res.status(status).json(data);
 if(!['GET','POST'].includes(req.method)){res.setHeader('Allow','GET, POST');return reply(405,{error:'Method not allowed.'});}
 if(!ready())return reply(req.method==='GET'?200:503,{ready:false,error:'Email delivery is not connected yet. Your note has not been sent.'});
 if(req.method==='GET'){
  const token=new URL(req.url,'https://portfolio.local').searchParams.get('receipt');if(!token)return reply(200,{ready:true});
  const receipt=verify(token);if(!receipt)return reply(400,{error:'Invalid or expired receipt.'});
  try{const response=await fetch('https://api.resend.com/emails/'+encodeURIComponent(receipt.id),{headers:{Authorization:'Bearer '+key()},signal:AbortSignal.timeout(7000)});if(!response.ok)return reply(502,{error:'Delivery status is temporarily unavailable.'});const data=await response.json();const event=data.last_event;return reply(200,{status:['delivered','opened','clicked'].includes(event)?'delivered':['bounced','complained','failed','canceled','suppressed'].includes(event)?'failed':'pending'});}catch{return reply(502,{error:'Delivery status is temporarily unavailable.'});}
 }
 const origins=new Set(['https://hassan-portfolio-two-rho.vercel.app',process.env.SITE_URL,process.env.VERCEL_URL?'https://'+process.env.VERCEL_URL:undefined].filter(Boolean));
 if(!origins.has(req.headers.origin))return reply(403,{error:'Please use the contact form on the portfolio.'});
 if(!String(req.headers['content-type']||'').includes('application/json'))return reply(415,{error:'JSON input is required.'});
 if(Number(req.headers['content-length']||0)>12000)return reply(413,{error:'The note is too long.'});
 let body;try{body=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!body||typeof body!=='object'||JSON.stringify(body).length>12000)throw Error();}catch{return reply(400,{error:'The note could not be read.'});}
 if(body.website)return reply(400,{error:'The note could not be accepted.'});
 const clean=field=>typeof body[field]==='string'?body[field].trim():'';
 const name=clean('name'),email=clean('email'),subject=clean('subject'),message=clean('message'),requestId=clean('requestId');
 if(name.length<2||name.length>80||!EMAIL.test(email)||email.length>254||subject.length<3||subject.length>120||message.length<10||message.length>4000||/[\r\n]/.test(name+email+subject)||!/^[-a-z0-9]{20,80}$/i.test(requestId))return reply(400,{error:'Check your name, email, subject and message.'});
 if(!Number.isFinite(body.startedAt)||Date.now()-body.startedAt<2000||Date.now()-body.startedAt>86400000)return reply(400,{error:'Please take a moment to review the note, then try again.'});
 try{if(await sharedLimited(req,'contact',4))return reply(429,{error:'Too many requests. Please try again later.'});}catch{return reply(503,{error:'Please try again shortly.'});}
 if(limited(req))return reply(429,{error:'Too many notes. Please try again in ten minutes.'});
 try{
  const idempotency=createHash('sha256').update(JSON.stringify({requestId,name,email,subject,message})).digest('hex');
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+key(),'Content-Type':'application/json','Idempotency-Key':'portfolio-'+idempotency},body:JSON.stringify({from:process.env.CONTACT_FROM_EMAIL,to:[process.env.CONTACT_TO_EMAIL],reply_to:email,subject:'Portfolio: '+subject,text:`From: ${name}\nReply to: ${email}\n\n${message}`}),signal:AbortSignal.timeout(10000)});
  if(!response.ok)return reply(502,{error:'The email service could not accept the note. Please try again later.'});
  const data=await response.json();if(!data.id)return reply(502,{error:'No email receipt was returned.'});
  return reply(202,{status:'pending',receipt:sign({id:data.id,at:Date.now()})});
 }catch{return reply(502,{error:'The email connection timed out. Your note is still here; retrying will not duplicate an accepted message.'});}
}
