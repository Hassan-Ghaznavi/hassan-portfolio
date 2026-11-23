import {createHash} from 'node:crypto';
// Optional Redis REST service. Atomic increment and expiry across function instances.
export async function sharedLimited(req,scope,maximum){
 const url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN;
 if(!url||!token)return false;
 const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
 const id=createHash('sha256').update(ip).digest('hex');
 const script="local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],600) end; return n";
 const response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(['EVAL',script,'1','portfolio:'+scope+':'+id]),signal:AbortSignal.timeout(4000)});
 if(!response.ok)throw Error('Limiter unavailable');const data=await response.json();if(!Number.isFinite(data.result))throw Error('Limiter unavailable');return data.result>maximum;
}
