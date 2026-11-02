(()=>{
  const ID='whaleSharkPasser';
  const DURATION=29000;
  let running=false;

  function currentDay(){
    const text=document.getElementById('elapsedText')?.textContent||'';
    const m=text.match(/(\d+)日目/);
    return m?Number(m[1]):1;
  }

  function ensureStyle(){
    if(document.getElementById('whaleSharkStyle'))return;
    const style=document.createElement('style');
    style.id='whaleSharkStyle';
    style.textContent=`
      #${ID}{
        position:absolute;
        top:68%;
        left:-8%;
        width:96px;
        z-index:3;
        pointer-events:none;
        display:none;
        transform:translateY(-50%);
      }
      #${ID}.show{display:block;}
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
        0%{left:-8%;transform:translateY(-50%) rotate(-1deg)}
        25%{transform:translateY(-53%) rotate(1deg)}
        50%{transform:translateY(-49%) rotate(-1deg)}
        75%{transform:translateY(-52%) rotate(1deg)}
        100%{left:103%;transform:translateY(-50%) rotate(0deg)}
      }
      @keyframes whaleSharkRTL{
        0%{left:80%;transform:translateY(-50%) rotate(1deg)}
        25%{transform:translateY(-53%) rotate(-1deg)}
        50%{transform:translateY(-49%) rotate(1deg)}
        75%{transform:translateY(-52%) rotate(-1deg)}
        100%{left:-29%;transform:translateY(-50%) rotate(0deg)}
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
      img.src='./whaleshark.png?v=20261103-3';
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
        if(el.classList.contains('show'))requestAnimationFrame(()=>startPass(el));
      });
    }
    return el;
  }

  function startPass(el){
    if(running || !el.classList.contains('show'))return;
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
    el.classList.toggle('show',visible);
    if(visible){
      startPass(el);
    }else{
      running=false;
      el.classList.remove('swim-ltr','swim-rtl');
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{sync();setInterval(sync,400);});
  }else{
    sync();setInterval(sync,400);
  }
})();
