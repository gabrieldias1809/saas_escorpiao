const QUIZ_URL   = "escorpiao.html";
const KIWIFY_URL = "https://pay.kiwify.com.br/SEU-CHECKOUT";
document.querySelectorAll('.js-buy').forEach(a=>a.setAttribute('href', QUIZ_URL));
document.getElementById('yr').textContent = new Date().getFullYear();

/* ===== house map demo ===== */
const HMAP={
  1:{t:"Quintal e terreno",r:"Risco alto",c:"hi",x:"Roce o mato e remova entulho, lenha e folhas secas. Mantenha o terreno limpo e os materiais afastados das paredes — é o abrigo nº 1 do escorpião."},
  2:{t:"Muro e fundos",r:"Risco médio",c:"md",x:"Vede buracos, tijolos vazados e frestas no muro e nas pilastras. São passagens diretas pra dentro do lote."},
  3:{t:"Ralos e área de serviço",r:"Risco alto",c:"hi",x:"Instale grelhas e ralos com sistema abre-fecha em pias, tanque e banheiros. O escorpião sobe pela tubulação."},
  4:{t:"Cozinha e despensa",r:"Risco alto",c:"hi",x:"Controle as baratas — o alimento nº 1 do escorpião. Lixo sempre fechado, ração guardada e sem migalhas pela casa."},
  5:{t:"Portas e soleiras",r:"Risco médio",c:"md",x:"Coloque veda-portas de borracha nos vãos de portas e janelas, principalmente as que dão pro quintal."},
  6:{t:"Quartos e camas",r:"Risco médio",c:"md",x:"Afaste a cama da parede e não deixe lençol e cobertor encostando no chão. Cuidado redobrado no quarto das crianças."},
  7:{t:"Sapatos e roupas",r:"Risco médio",c:"md",x:"Crie o hábito de sacudir sempre sapatos, roupas e toalhas antes de usar. É onde mais acontece picada em mão e pé."},
  8:{t:"Garagem e depósito",r:"Risco baixo",c:"lo",x:"Organize caixas e materiais e use luvas ao mexer em entulho, depósitos e cantos parados há muito tempo."}
};
const tagColors={hi:['var(--alert)','#fff'],md:['var(--hazard)','#14110C'],lo:['var(--green)','#fff']};
function selHot(n){
  const d=HMAP[n]; if(!d) return;
  document.querySelectorAll('.hot').forEach(h=>h.classList.toggle('sel', h.getAttribute('data-n')==String(n)));
  const tag=document.getElementById('hmtag');
  tag.textContent='Ponto '+n+' · '+d.r;
  tag.style.background=tagColors[d.c][0]; tag.style.color=tagColors[d.c][1];
  document.getElementById('hmttl').textContent=d.t;
  document.getElementById('hmtxt').textContent=d.x;
}
selHot(1);

document.querySelectorAll('.qa button').forEach(b=>{
  b.addEventListener('click',()=>{
    const qa=b.parentElement, ans=qa.querySelector('.ans');
    const open=qa.classList.toggle('open');
    ans.style.maxHeight = open ? ans.scrollHeight+'px' : 0;
  });
});

const sticky=document.getElementById('sticky');
const obsTarget=document.querySelector('.statband');
if('IntersectionObserver' in window && obsTarget){
  new IntersectionObserver((es)=>{es.forEach(e=>sticky.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top<0));},{threshold:0}).observe(obsTarget);
}
if('IntersectionObserver' in window){
  const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
}else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'));}