const steps=[['Start with English text','Source words: cat · dog · sun','cat · dog · sun'],['Translate into Braille','Prepared uncontracted Braille examples.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠝'],['Review a potential error','The final word has an incorrect last character: ⠍ instead of ⠝.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠍'],['Proofread the result','A human proofreader reviews the flagged translation and corrects it.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠝']];
let step=0;
function advanceWalkthrough(){
 step=(step+1)%steps.length;
 document.querySelector('#walk-title').textContent=(step+1)+'. '+steps[step][0];
 document.querySelector('#walk-copy').textContent=steps[step][1];
 const example=document.querySelector('#walk-example');
 example.textContent=steps[step][2];
 if(step===2){
  const error=document.createElement('span');
  error.className='braille-error';
  error.textContent=steps[step][2].slice(-1);
  error.setAttribute('aria-label','Incorrect Braille character: m instead of n');
  error.title='Incorrect character: m instead of n';
  example.replaceChildren(document.createTextNode(steps[step][2].slice(0,-1)),error);
 }
 }
setInterval(()=>{
 const bounds=document.querySelector('#walk-example').getBoundingClientRect();
 if(!document.hidden&&bounds.bottom>0&&bounds.top<window.innerHeight) advanceWalkthrough();
},5000);
