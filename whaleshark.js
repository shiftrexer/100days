(()=>{
  const ID='whaleSharkPasser';
  const DURATION=29000;
  let running=false;

  function currentDay(){
    try{
      if(typeof elapsed==='function'){
        const n=Number(elapsed());
        if(Number.isFinite(n))return n;
      }
    }catch{}
    try{
      const s=JSON.parse(localStorage.getItem('100days-state-v1')||'{}');
      const t=Number(s.testDay);
      if(Number.isInteger(t)&&t>=1&&t<=100)return t;
      if(s.startDate){
        const DAY=86400000;
        const today=new Date(new Date().toLocaleDateString('sv-SE')+'T00:00:00');
        const start=new Date(s.startDate+'T00:00:00');
        return Math.max(1,Math.floor((today-start)/DAY)+1);
      }
      if(Array.isArray(s.completedDates))return Math.max(1,new Set(s.completedDates).size);
    }catch{}
    const n=Number(document.getElementById('completedCount')?.textContent||0);
    return Number.isFinite(n)?Math.max(1,n):1;
  }

  function ensureStyle(){
    if(document.getElementById('whaleSharkStyle'))return;
    const style=document.createElement('style');
    style.id='whaleSharkStyle';
    style.textContent=`
      #${ID}{
        position:absolute;
        top:68%;
        left:8%;
        width:96px;
        height:auto;
        z-index:6;
        pointer-events:none;
        display:none;
        transform:translateY(-50%);
        opacity:1;
      }
      #${ID} img{
        display:block;
        width:100%;
        height:auto;
        object-fit:contain;
        user-select:none;
        -webkit-user-drag:none;
      }
      #${ID}.swim-ltr{animation:whaleSharkLTR ${DURATION}ms linear 1;}
      #${ID}.swim-rtl{animation:whaleSharkRTL ${DURATION}ms linear 1;}
      @keyframes whaleSharkLTR{
        0%{left:8%;transform:translateY(-50%) rotate(-1deg)}
        25%{transform:translateY(-53%) rotate(1deg)}
        50%{transform:translateY(-49%) rotate(-1deg)}
        75%{transform:translateY(-52%) rotate(1deg)}
        100%{left:102%;transform:translateY(-50%) rotate(0deg)}
      }
      @keyframes whaleSharkRTL{
        0%{left:64%;transform:translateY(-50%) rotate(1deg)}
        25%{transform:translateY(-53%) rotate(-1deg)}
        50%{transform:translateY(-49%) rotate(1deg)}
        75%{transform:translateY(-52%) rotate(-1deg)}
        100%{left:-28%;transform:translateY(-50%) rotate(0deg)}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureWhaleShark(){
    const orb=document.getElementById('waterOrb');
    if(!orb)return null;
    let el=document.getElementById(ID);
    if(!el){
      el=document.createElement('div');
      el.id=ID;
      el.setAttribute('aria-hidden','true');
      const img=document.createElement('img');
      img.src='whaleshark.png?v=20261103-4';
      img.alt='';
      img.decoding='sync';
      img.loading='eager';
      el.appendChild(img);
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);
      else orb.appendChild(el);
      el.addEventListener('animationend',()=>{
        running=false;
        el.classList.remove('swim-ltr','swim-rtl');
        if(el.style.display!=='none')requestAnimationFrame(()=>startPass(el));
      });
    }
    return el;
  }

  function startPass(el){
    if(running||el.style.display==='none')return;
    const dir=Math.random()<0.5?'ltr':'rtl';
    const img=el.querySelector('img');
    if(img){
      img.style.transform=`scaleX(${dir==='ltr'?1:-1})`;
      img.style.transformOrigin='center';
    }
    el.classList.remove('swim-ltr','swim-rtl');
    void el.offsetWidth;
    el.classList.add(dir==='ltr'?'swim-ltr':'swim-rtl');
    running=true;
  }

  function sync(){
    ensureStyle();
    const el=ensureWhaleShark();
    if(!el)return;
    const visible=currentDay()>=60;
    if(visible){
      el.style.display='block';
      el.style.opacity='1';
      startPass(el);
    }else{
      el.style.display='none';
      running=false;
      el.classList.remove('swim-ltr','swim-rtl');
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{sync();setInterval(sync,300);});
  }else{
    sync();setInterval(sync,300);
  }
})();
