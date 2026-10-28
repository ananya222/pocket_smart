const button=document.querySelector('.menu-toggle');
const nav=document.querySelector('#site-nav');
if(button&&nav){
 const close=()=>{button.setAttribute('aria-expanded','false');document.body.classList.remove('nav-open')};
 button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));document.body.classList.toggle('nav-open',open)});
 nav.addEventListener('click',close);
 document.addEventListener('keydown',event=>{if(event.key==='Escape'){close();button.focus()}});
}
document.querySelector('[data-print]')?.addEventListener('click',()=>window.print());
