const steps=[['Start with English text','Source words: cat · dog · sun','cat · dog · sun'],['Translate into Braille','Prepared uncontracted Braille examples.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠝'],['Review a potential error','The final word has an incorrect last character: ⠍ instead of ⠝.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠍'],['Proofread the result','A human proofreader reviews the flagged translation and corrects it.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠝']];
let step=0;
let transitioning=false;
const title=document.querySelector('#walk-title');
const copy=document.querySelector('#walk-copy');
const example=document.querySelector('#walk-example');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function animate(element,frames,options){
 return reducedMotion.matches?Promise.resolve():element.animate(frames,options).finished.catch(()=>{});
}
function renderCharacters(){
 const characters=Array.from(steps[step][2]);
 const previous=Array.from(example.children);
 const cells=characters.map((character,index)=>{
  const cell=previous[index]||document.createElement('span');
  const changed=cell.textContent!==character;
  cell.className=step===2&&index===characters.length-1?'braille-cell braille-error':'braille-cell';
  cell.textContent=character;
  cell.setAttribute('aria-hidden','true');
  if(changed) animate(cell,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:520,delay:index*28,easing:'cubic-bezier(.22,1,.36,1)'});
  return cell;
 });
 example.replaceChildren(...cells);
 example.setAttribute('aria-label',steps[step][2]);
}
async function advanceWalkthrough(){
 if(transitioning) return;
 transitioning=true;
 try{
  await Promise.all([title,copy].map(element=>animate(element,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-4px)'}],{duration:180,easing:'ease-in'})));
  step=(step+1)%steps.length;
  title.textContent=(step+1)+'. '+steps[step][0];
  copy.textContent=steps[step][1];
  renderCharacters();
  await Promise.all([title,copy].map((element,index)=>animate(element,[{opacity:0,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,delay:index*45,easing:'cubic-bezier(.22,1,.36,1)'})));
 }finally{transitioning=false;}
}
renderCharacters();
setInterval(()=>{
 const bounds=example.getBoundingClientRect();
 if(!document.hidden&&bounds.bottom>0&&bounds.top<window.innerHeight) advanceWalkthrough();
},5000);
