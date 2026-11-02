(()=>{
  function day(){
    try{
      const st=JSON.parse(localStorage.getItem('100days-state-v1')||'{}');
      const t=Number(st.testDay);
      if(Number.isInteger(t)&&t>=1&&t<=100)return t;
      if(typeof getCrabElapsedDay==='function')return getCrabElapsedDay();
      const start=(st.startDate||new Date().toLocaleDateString('sv-SE'))+'T00:00:00';
      const today=new Date().toLocaleDateString('sv-SE')+'T00:00:00';
      return Math.max(1,Math.floor((new Date(today)-new Date(start))/86400000)+1);
    }catch{return 1}
  }

  function ensureStyle(){
    if(document.getElementById('whaleSharkV3Style'))return;
    const s=document.createElement('style');
    s.id='whaleSharkV3Style';
    s.textContent=`
      #whaleSharkPasser{
        position:absolute;
        left:72%;
        top:68%;
        width:92px;
        height:44px;
        z-index:6;
        opacity:0;
        visibility:hidden;
        pointer-events:none;
        filter:drop-shadow(0 2px 4px rgba(45,70,100,.12));
        will-change:left,transform;
      }
      #whaleSharkPasser.show{opacity:.99;visibility:visible;}
      #whaleSharkPasser img{display:block;width:100%;height:100%;object-fit:contain;transform-origin:center;}
    `;
    document.head.appendChild(s);
  }

  function ensureWhale(){
    const orb=document.getElementById('waterOrb');
    if(!orb)return null;
    let el=document.getElementById('whaleSharkPasser');
    if(!el){
      el=document.createElement('div');
      el.id='whaleSharkPasser';
      el.setAttribute('aria-hidden','true');
      const img=document.createElement('img');
      img.alt='';
      img.src='whaleshark-fixed.png?v=20261103-fixed2';
      el.appendChild(img);
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);else orb.appendChild(el);
    }
    return el;
  }

  function update(){
    ensureStyle();
    const el=ensureWhale();
    if(!el)return;
    const visible=day()>=60;
    el.classList.toggle('show',visible);
    if(visible){
      el.style.opacity='.99';
      el.style.visibility='visible';
      if(!el.dataset.ready){el.style.left='72%';el.dataset.ready='1';}
    }
  }

  const boot=()=>{update();setInterval(update,500)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
