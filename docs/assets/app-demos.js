const steps=[['Start with English text','Source words: cat · dog · sun','cat · dog · sun'],['Translate into Braille','Prepared uncontracted Braille examples.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠝'],['Review a potential error','The final word has an incorrect last character: ⠍ instead of ⠝.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠍'],['Proofread the result','A human proofreader reviews the flagged translation and corrects it.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠝']];
let step=0;
document.querySelector('#walk-next').addEventListener('click',event=>{
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
 event.target.textContent=step===steps.length-1?'Replay ↻':'Next step →';
});
