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
    if(document.getElementById('whaleSharkOverlayStyle'))return;
    const s=document.createElement('style');
    s.id='whaleSharkOverlayStyle';
    s.textContent=`#whaleSharkPasser{position:absolute;left:-24%;top:68%;width:92px;height:44px;z-index:3;opacity:0;pointer-events:none;filter:drop-shadow(0 2px 4px rgba(45,70,100,.12));will-change:left,transform}#whaleSharkPasser img{display:block;width:100%;height:100%;object-fit:contain}#whaleSharkPasser.show{opacity:.98;animation:whale-shark-pass 29s linear infinite}@keyframes whale-shark-pass{0%{left:-24%;transform:translateY(-50%) rotate(-2deg)}20%{transform:translateY(-54%) rotate(1deg)}40%{transform:translateY(-48%) rotate(-1deg)}60%{transform:translateY(-53%) rotate(1deg)}80%{transform:translateY(-49%) rotate(-1deg)}100%{left:110%;transform:translateY(-51%) rotate(0deg)}}`;
    document.head.appendChild(s);
  }
  function ensureWhaleShark(){
    const orb=document.querySelector('#waterOrb'); if(!orb)return null;
    let el=document.getElementById('whaleSharkPasser');
    if(!el){el=document.createElement('div');el.id='whaleSharkPasser';el.setAttribute('aria-hidden','true');el.innerHTML=`<img alt="" src="whaleshark.png?v=20261103-turtle-style">`;const label=orb.querySelector('.orb-label');if(label)orb.insertBefore(el,label);else orb.appendChild(el)}
    return el;
  }
  function update(){ensureStyle();const el=ensureWhaleShark();if(!el)return;el.classList.toggle('show',day()>=60)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{update();setInterval(update,700)});else{update();setInterval(update,700)}
})();