(()=>{
  const ID='whaleSharkPasser';
  const DURATION=29000;
  let imageReady=false;
  let imageLoading=false;
  let timer=null;

  function currentDay(){
    const values=[];
    try{
      const st=JSON.parse(localStorage.getItem('100days-state-v1')||'{}');
      const t=Number(st.testDay);
      if(Number.isInteger(t)&&t>=1&&t<=100) values.push(t);
      if(Array.isArray(st.completedDates)) values.push(st.completedDates.length);
      if(st.startDate){
        const start=new Date(st.startDate+'T00:00:00');
        const today=new Date(new Date().toLocaleDateString('sv-SE')+'T00:00:00');
        const n=Math.max(1,Math.floor((today-start)/86400000)+1);
        if(Number.isFinite(n)) values.push(n);
      }
    }catch{}
    const count=Number(document.getElementById('completedCount')?.textContent||0);
    if(Number.isFinite(count)) values.push(count);
    const m=(document.getElementById('elapsedText')?.textContent||'').match(/(\d+)日目/);
    if(m) values.push(Number(m[1]));
    return Math.max(1,...values.filter(Number.isFinite));
  }

  function ensureStyle(){
    if(document.getElementById('whaleSharkV6Style')) return;
    const s=document.createElement('style');
    s.id='whaleSharkV6Style';
    s.textContent=`
      #${ID}{position:absolute;left:18%;top:68%;width:96px;height:46px;z-index:8;opacity:0;visibility:hidden;pointer-events:none;filter:drop-shadow(0 2px 4px rgba(45,70,100,.12));will-change:left,transform;}
      #${ID}.show{opacity:1;visibility:visible;}
      #${ID} img{display:block;width:100%;height:100%;object-fit:contain;transform-origin:center;}
      #${ID}.ltr img{transform:scaleX(1);}
      #${ID}.rtl img{transform:scaleX(-1);}
      @keyframes whaleV6LTR{0%{left:18%;transform:translateY(-50%)}100%{left:104%;transform:translateY(-50%)}}
      @keyframes whaleV6RTL{0%{left:72%;transform:translateY(-50%)}100%{left:-28%;transform:translateY(-50%)}}
      #${ID}.swim-ltr{animation:whaleV6LTR ${DURATION}ms linear 1;}
      #${ID}.swim-rtl{animation:whaleV6RTL ${DURATION}ms linear 1;}
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
    img.id='whaleSharkImage';
    el.appendChild(img);
    const label=orb.querySelector('.orb-label');
    if(label) orb.insertBefore(el,label); else orb.appendChild(el);
    el.addEventListener('animationend',()=>{
      el.classList.remove('swim-ltr','swim-rtl');
      if(el.classList.contains('show')){
        clearTimeout(timer);
        timer=setTimeout(startPass,600);
      }
    });
    return el;
  }

  async function loadImage(){
    if(imageReady||imageLoading) return;
    imageLoading=true;
    try{
      const res=await fetch('whaleshark-fixed.png?v=20261103-base64text',{cache:'no-store'});
      if(!res.ok) throw new Error('asset fetch failed');
      const raw=await res.text();
      const b64=raw.replace(/\s+/g,'');
      if(!b64.startsWith('iVBOR')) throw new Error('asset is not PNG base64 text');
      const img=document.getElementById('whaleSharkImage');
      if(!img) throw new Error('image element missing');
      await new Promise((resolve,reject)=>{
        img.onload=resolve;
        img.onerror=reject;
        img.src='data:image/png;base64,'+b64;
      });
      imageReady=true;
    }catch(e){
      imageReady=false;
    }finally{
      imageLoading=false;
    }
  }

  function startPass(){
    const el=document.getElementById(ID);
    if(!el||!imageReady||!el.classList.contains('show')||el.classList.contains('swim-ltr')||el.classList.contains('swim-rtl')) return;
    const ltr=Math.random()<0.5;
    el.classList.toggle('ltr',ltr);
    el.classList.toggle('rtl',!ltr);
    el.style.left=ltr?'18%':'72%';
    void el.offsetWidth;
    el.classList.add(ltr?'swim-ltr':'swim-rtl');
  }

  async function update(){
    ensureStyle();
    const el=ensureWhale();
    if(!el) return;
    const visible=currentDay()>=60;
    el.classList.toggle('show',visible);
    if(!visible){
      el.classList.remove('swim-ltr','swim-rtl','ltr','rtl');
      el.style.left='18%';
      clearTimeout(timer);
      return;
    }
    await loadImage();
    if(imageReady&&!el.dataset.booted){
      el.dataset.booted='1';
      el.style.left='18%';
      timer=setTimeout(startPass,1200);
    }
  }

  const boot=()=>{update();setInterval(update,500)};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
})();