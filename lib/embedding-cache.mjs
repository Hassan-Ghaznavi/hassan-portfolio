// Only approved public corpus embeddings are stored; never visitor questions or API keys.
async function redis(command){
 const url=process.env.UPSTASH_REDIS_REST_URL,token=process.env.UPSTASH_REDIS_REST_TOKEN;if(!url||!token)return null;
 const response=await fetch(url,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(command),signal:AbortSignal.timeout(2000)});
 if(!response.ok)throw Error('Cache unavailable');const data=await response.json();if(data.error)throw Error('Cache unavailable');return data.result;
}
export async function readEmbeddings(key){try{const value=await redis(['GET',key]);return value?JSON.parse(value):null;}catch{return null;}}
export async function saveEmbeddings(key,vectors){try{await redis(['SET',key,JSON.stringify(vectors),'EX','86400']);}catch{/* Cache failure must not weaken the separate request limiter. */}}
