(()=>{
  function day(){
    if(typeof getCrabElapsedDay==='function') return getCrabElapsedDay();
    try{
      const st=JSON.parse(localStorage.getItem('100days-state-v1')||'{}');
      const t=Number(st.testDay); if(Number.isInteger(t)&&t>=1&&t<=100)return t;
      const start=(st.startDate||new Date().toLocaleDateString('sv-SE'))+'T00:00:00';
      const today=new Date().toLocaleDateString('sv-SE')+'T00:00:00';
      return Math.max(1,Math.floor((new Date(today)-new Date(start))/86400000)+1);
    }catch{return 1}
  }
  function ensureStyle(){
    if(document.getElementById('penguinOverlayStyle'))return;
    const s=document.createElement('style');
    s.id='penguinOverlayStyle';
    s.textContent=`#penguinPasser{position:absolute;left:-18%;top:82%;width:66px;height:42px;z-index:3;opacity:0;pointer-events:none;filter:drop-shadow(0 2px 4px rgba(45,70,100,.12));will-change:left,transform}#penguinPasser img{display:block;width:100%;height:100%;object-fit:contain;transform-origin:center}#penguinPasser.show{opacity:.98}`;
    document.head.appendChild(s);
  }
  function ensurePenguin(){
    const orb=document.querySelector('#waterOrb'); if(!orb)return null;
    let el=document.getElementById('penguinPasser');
    if(!el){
      el=document.createElement('div');
      el.id='penguinPasser';
      el.setAttribute('aria-hidden','true');
      el.innerHTML='<img alt="" src="penguin.webp?v=20261103-penguin1">';
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);else orb.appendChild(el);
    }
    return el;
  }
  function update(){ensureStyle();const el=ensurePenguin();if(!el)return;el.classList.toggle('show',day()>=70)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{update();setInterval(update,700)});else{update();setInterval(update,700)}
})();