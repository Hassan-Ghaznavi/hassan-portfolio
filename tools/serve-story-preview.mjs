import http from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {resolve,sep,extname} from 'node:path';
import contactHandler from '../api/contact.mjs';
import chatHandler from '../api/chat.mjs';
const root=resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.mjs':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.glb':'model/gltf-binary','.mp4':'video/mp4'};
http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(['/api/contact','/api/chat'].includes(url.pathname)){
   const handler=url.pathname==='/api/chat'?chatHandler:contactHandler;
   res.status=code=>{res.statusCode=code;return res;};res.json=data=>res.end(JSON.stringify(data));let body='';for await(const chunk of req){body+=chunk;if(body.length>16000){res.status(413).json({error:'Note too long.'});return;}}req.body=body;await handler(req,res);return;
  }
  const file=resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  if(!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
  const info=await stat(file);if(!info.isFile())throw Error();
  const mime=types[extname(file)]||'application/octet-stream';const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),info.size-1):info.size-1;if(start>end){res.writeHead(416);res.end();return;}res.writeHead(206,{'Content-Type':mime,'Content-Range':`bytes ${start}-${end}/${info.size}`,'Content-Length':end-start+1,'Accept-Ranges':'bytes'});createReadStream(file,{start,end}).pipe(res);}
  else{res.writeHead(200,{'Content-Type':mime,'Content-Length':info.size,'Accept-Ranges':'bytes','Cache-Control':'no-store'});createReadStream(file).pipe(res);}
 }catch{if(!res.headersSent)res.writeHead(404);res.end('Not found');}
}).listen(4175,'127.0.0.1',()=>process.stdout.write('Portfolio and contact API preview: http://127.0.0.1:4175/\n'));
