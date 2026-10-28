document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{
 document.querySelectorAll('[data-mode]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
 document.querySelectorAll('[data-panel]').forEach(panel=>panel.hidden=panel.dataset.panel!==button.dataset.mode);
}));
document.querySelectorAll('[data-shot]').forEach(button=>button.addEventListener('click',()=>{
 const image=document.querySelector('#demo-shot');image.src='assets/pocketsmart/'+button.dataset.shot+'.png';image.alt='PocketSmart '+button.textContent;
 document.querySelectorAll('[data-shot]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
}));
const steps=[['Start with English text','Source words: cat · dog · sun','cat · dog · sun'],['Translate into Braille','Prepared uncontracted Braille examples.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠝'],['Review a potential error','The final word has an incorrect last character: ⠍ instead of ⠝.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠍'],['Proofread the result','A human proofreader reviews the flagged translation and corrects it.','⠉⠁⠞ · ⠙⠕⠛ · ⠎⠥⠝']];
let step=0;
document.querySelector('#walk-next').addEventListener('click',event=>{
 step=(step+1)%steps.length;
 document.querySelector('#walk-title').textContent=(step+1)+'. '+steps[step][0];
 document.querySelector('#walk-copy').textContent=steps[step][1];
 document.querySelector('#walk-example').textContent=steps[step][2];
 event.target.textContent=step===steps.length-1?'Replay ↻':'Next step →';
});
