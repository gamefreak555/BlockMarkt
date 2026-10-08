// Lädt die Item-Bilder einmalig aus dem deutschen Minecraft Wiki nach public/img-wiki/
// Start:  npm run bilder      (Test mit nur 5 Bildern: node fetch-wiki-images.js 5)
const fs=require('fs'),path=require('path');
const cat=JSON.parse(fs.readFileSync(path.join(__dirname,'catalog.json')));
const dir=path.join(__dirname,'public','img-wiki');fs.mkdirSync(dir,{recursive:true});
const UA='BlockMarkt-private-shop/1.0 (einmaliger Bilder-Download)';
const url=n=>'https://de.minecraft.wiki/images/'+encodeURIComponent(n.replace(/ /g,'_'))+'.png';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const list=cat.slice(0,+process.argv[2]||cat.length);let ok=0,have=0,i=0;const miss=[];
async function one(c){const f=path.join(dir,c.k+'.png');if(fs.existsSync(f)){have++;return}
 for(let t=0;t<3;t++){try{const r=await fetch(url(c.de),{headers:{'User-Agent':UA}});
  if(r.status===429){await sleep(3000);continue}
  if(r.ok&&(r.headers.get('content-type')||'').startsWith('image/')){fs.writeFileSync(f,Buffer.from(await r.arrayBuffer()));ok++;await sleep(80);return}
  break}catch{await sleep(1000)}}
 miss.push(c.k+' ('+c.de+')')}
(async()=>{await Promise.all(Array.from({length:5},async()=>{while(i<list.length)await one(list[i++])}));
 fs.writeFileSync(path.join(dir,'_nicht-gefunden.txt'),miss.join('\n'));
 console.log(`Fertig: ${ok} neu geladen, ${have} schon vorhanden, ${miss.length} nicht gefunden (siehe public/img-wiki/_nicht-gefunden.txt).`);
 console.log('Für nicht gefundene Items wird automatisch das mitgelieferte Bild aus public/img verwendet. Danach: Server neu starten.')})();
