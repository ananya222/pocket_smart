import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('docs');
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.ttf':'font/ttf','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.pdf':'application/pdf'};
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=path.resolve(root,'.'+pathname+(pathname.endsWith('/')?'index.html':''));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');res.end(data);});
});
await new Promise(resolve=>server.listen(8081,'127.0.0.1',resolve));
process.env.BASE_URL='http://127.0.0.1:8081';
try{await import('./demo-state-audit.mjs');await import('./ui-audit.mjs');}finally{server.close();}
