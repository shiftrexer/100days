(()=>{
  const ID='whaleSharkPasser';
  const DURATION=29000;

  function currentDay(){
    let values=[];
    try{
      const st=JSON.parse(localStorage.getItem('100days-state-v1')||'{}');
      const t=Number(st.testDay);
      if(Number.isInteger(t)&&t>=1&&t<=100) values.push(t);
      if(st.startDate){
        const start=new Date(st.startDate+'T00:00:00');
        const today=new Date(new Date().toLocaleDateString('sv-SE')+'T00:00:00');
        const n=Math.max(1,Math.floor((today-start)/86400000)+1);
        if(Number.isFinite(n)) values.push(n);
      }
    }catch{}
    const count=Number(document.getElementById('completedCount')?.textContent||0);
    if(Number.isFinite(count)) values.push(count);
    const elapsedText=document.getElementById('elapsedText')?.textContent||'';
    const m=elapsedText.match(/(\d+)日目/);
    if(m) values.push(Number(m[1]));
    return Math.max(1,...values.filter(Number.isFinite));
  }

  function ensureStyle(){
    if(document.getElementById('whaleSharkV4Style')) return;
    const s=document.createElement('style');
    s.id='whaleSharkV4Style';
    s.textContent=`
      #${ID}{position:absolute;left:18%;top:68%;width:92px;height:44px;z-index:5;opacity:0;pointer-events:none;will-change:left,transform;filter:drop-shadow(0 2px 4px rgba(45,70,100,.12));}
      #${ID}.show{opacity:.99;}
      #${ID} img{display:block;width:100%;height:100%;object-fit:contain;transform-origin:center;}
      #${ID}.ltr{animation:whaleSharkLTR ${DURATION}ms linear 1;}
      #${ID}.rtl{animation:whaleSharkRTL ${DURATION}ms linear 1;}
      #${ID}.ltr img{transform:scaleX(1);}
      #${ID}.rtl img{transform:scaleX(-1);}
      @keyframes whaleSharkLTR{
        0%{left:-5%;transform:translateY(-50%) rotate(-1deg)}
        20%{transform:translateY(-54%) rotate(1deg)}
        40%{transform:translateY(-48%) rotate(-1deg)}
        60%{transform:translateY(-53%) rotate(1deg)}
        80%{transform:translateY(-49%) rotate(-1deg)}
        100%{left:104%;transform:translateY(-51%) rotate(0deg)}
      }
      @keyframes whaleSharkRTL{
        0%{left:72%;transform:translateY(-50%) rotate(1deg)}
        20%{transform:translateY(-54%) rotate(-1deg)}
        40%{transform:translateY(-48%) rotate(1deg)}
        60%{transform:translateY(-53%) rotate(-1deg)}
        80%{transform:translateY(-49%) rotate(1deg)}
        100%{left:-28%;transform:translateY(-51%) rotate(0deg)}
      }
    `;
    document.head.appendChild(s);
  }

  function ensureWhale(){
    const orb=document.getElementById('waterOrb');
    if(!orb) return null;
    let el=document.getElementById(ID);
    if(el) return el;
    el=document.createElement('div');
    el.id=ID;
    el.setAttribute('aria-hidden','true');
    const img=document.createElement('img');
    img.alt='';
    img.src='/whaleshark-fixed.png?v=20261103-whale12';
    el.appendChild(img);
    const label=orb.querySelector('.orb-label');
    if(label) orb.insertBefore(el,label); else orb.appendChild(el);
    el.addEventListener('animationend',()=>{
      el.classList.remove('ltr','rtl');
      if(el.classList.contains('show')) requestAnimationFrame(startPass);
    });
    return el;
  }

  function startPass(){
    const el=document.getElementById(ID);
    if(!el||!el.classList.contains('show')||el.classList.contains('ltr')||el.classList.contains('rtl')) return;
    const dir=Math.random()<0.5?'ltr':'rtl';
    el.classList.add(dir);
  }

  function update(){
    ensureStyle();
    const el=ensureWhale();
    if(!el) return;
    const visible=currentDay()>=60;
    el.classList.toggle('show',visible);
    if(visible) startPass();
    else el.classList.remove('ltr','rtl');
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{update();setInterval(update,500)});
  }else{
    update();setInterval(update,500);
  }
})();