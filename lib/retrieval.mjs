const stop=new Set('a an the is are was were be been being to of for in on at and or with about what how when where why tell me his her he she it its do does did can could would should i you your my has have had this that those these please hassan ghaznavi portfolio'.split(' '));
export function tokens(text){return (text.toLowerCase().match(/[a-z0-9]+/g)||[]).filter(t=>!stop.has(t));}
export function makeIndex(documents){
 const chunks=[];
 documents.forEach((doc,index)=>{const words=doc.text.split(/\s+/);for(let at=0;at<words.length;at+=100)chunks.push({...doc,id:'note-'+index+'-'+at,text:words.slice(at,at+140).join(' ')});});
 const df={};for(const chunk of chunks)for(const token of new Set(tokens(chunk.text+' '+chunk.source+' '+chunk.terms.join(' '))))df[token]=(df[token]||0)+1;
 const idf=Object.fromEntries(Object.entries(df).map(([token,count])=>[token,Math.log(1+(chunks.length/count))]));
 const vector=text=>{const counts={};for(const token of tokens(text))if(idf[token])counts[token]=(counts[token]||0)+1;const values=Object.fromEntries(Object.entries(counts).map(([t,c])=>[t,(1+Math.log(c))*idf[t]]));const norm=Math.hypot(...Object.values(values))||1;return Object.fromEntries(Object.entries(values).map(([t,v])=>[t,v/norm]));};
 for(const chunk of chunks)chunk.vector=vector(chunk.text+' '+chunk.source+' '+chunk.terms.join(' '));
 return {chunks,idf,vector};
}
export function retrieve(question,index){
 const query=index.vector(question);if(!Object.keys(query).length)return [];
 return index.chunks.map(chunk=>({...chunk,score:Object.entries(query).reduce((sum,[t,v])=>sum+v*(chunk.vector[t]||0),0)})).filter(c=>c.score>.16).sort((a,b)=>b.score-a.score).slice(0,3);
}
export function cosine(a,b){const length=Math.min(a.length,b.length);let dot=0,aa=0,bb=0;for(let i=0;i<length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}return dot/(Math.sqrt(aa*bb)||1);}
