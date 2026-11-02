(()=>{
  const clipStyle=document.createElement('style');
  clipStyle.id='waterOrbClipFix';
  clipStyle.textContent=`
    #waterOrb{
      overflow:hidden !important;
      border-radius:50% !important;
      contain:paint;
      isolation:isolate;
    }
    #waterOrb:active{
      transform:none !important;
    }
  `;
  if(!document.getElementById(clipStyle.id))document.head.appendChild(clipStyle);

  const creatures={
    crabPasser:{duration:40000,normal:'rtl',normalScale:1},
    clownfishPasser:{duration:15000,normal:'ltr',normalScale:1},
    tangPasser:{duration:14000,normal:'ltr',normalScale:-1},
    turtlePasser:{duration:23000,normal:'ltr',normalScale:1},
    diverPasser:{duration:48000,normal:'rtl',normalScale:1},
    whaleSharkPasser:{duration:45000,normal:'rtl',normalScale:1},
    penguinPasser:{duration:16000,normal:'rtl',normalScale:1},
    octopusPasser:{duration:34000,normal:'rtl',normalScale:1},
    pufferPasser:{duration:21000,normal:'rtl',normalScale:1},
    pinkFishPasser:{duration:20000,normal:'ltr',normalScale:1},
    bottlePasser:{duration:60000,normal:'rtl',normalScale:1}
  };
  const BOTTLE_ID='bottlePasser';
  const reactiveIds=new Set(Object.keys(creatures).filter(id=>id!==BOTTLE_ID));
  const active=new Map();
  const pendingStarts=new Map();
  const initialized=new WeakSet();
  const forcedVisible=new WeakSet();
  const RARE_CREATURE_ID='pinkFishPasser';
  const RARE_APPEARANCE_CHANCE=0.10;
  const CLOWNFISH_ID='clownfishPasser';
  const SECRET_FLEE_COUNT=5;
  let clownfishFleeCount=0;
  let clownfishSecretTriggered=false;
  let suppressOrbClickUntil=0;

  function randomBetween(min,max){
    return min+Math.random()*(max-min);
  }

  function mediaScale(el,cfg,dir){
    if(el.id==='crabPasser')return;
    const media=el.querySelector('img,svg,.diver-art,.whale-art');
    if(!media)return;
    const normalFacing=cfg.normalScale;
    const scale=(dir===cfg.normal)?normalFacing:-normalFacing;
    media.style.transform=`scaleX(${scale})`;
    media.style.transformOrigin='center';
  }

  function clearPending(el){
    const timer=pendingStarts.get(el);
    if(timer){
      clearTimeout(timer);
      pendingStarts.delete(el);
    }
  }

  function schedulePass(el,cfg,initial=false){
    if(!el.classList.contains('show'))return;
    if(active.has(el)||pendingStarts.has(el))return;

    el.style.animation='none';
    el.style.visibility='hidden';

    const delay=initial?randomBetween(200,15000):randomBetween(1000,7000);
    const timer=setTimeout(()=>{
      pendingStarts.delete(el);
      if(!el.classList.contains('show')||active.has(el))return;

      if(el.id===RARE_CREATURE_ID&&Math.random()>=RARE_APPEARANCE_CHANCE){
        schedulePass(el,cfg,false);
        return;
      }

      startPass(el,cfg,false);
    },delay);
    pendingStarts.set(el,timer);
  }

  function registerAnimation(el,cfg,anim,dir,escaping=false,forced=false){
    const entry={anim,dir,escaping,forced};
    active.set(el,entry);
    anim.onfinish=()=>{
      if(active.get(el)!==entry)return;
      active.delete(el);

      if(el.id===CLOWNFISH_ID){
        clownfishFleeCount=0;
        clownfishSecretTriggered=false;
      }

      if(forced){
        forcedVisible.delete(el);
        if(!el.classList.contains('show')){
          el.style.visibility='hidden';
          return;
        }
      }

      if(el.classList.contains('show'))schedulePass(el,cfg,false);
    };
    anim.oncancel=()=>{
      if(active.get(el)===entry)active.delete(el);
    };
  }

  function startPass(el,cfg,forced=false){
    if(!forced&&!el.classList.contains('show'))return;
    if(active.has(el))return;

    if(forced)forcedVisible.add(el);
    el.style.animation='none';
    el.style.visibility='visible';
    initialized.add(el);

    if(el.id===CLOWNFISH_ID){
      clownfishFleeCount=0;
      clownfishSecretTriggered=false;
    }

    const dir=Math.random()<0.5?'ltr':'rtl';
    mediaScale(el,cfg,dir);

    const from=dir==='ltr'?'-24%':'110%';
    const to=dir==='ltr'?'110%':'-24%';
    el.style.left=from;

    const anim=el.animate([
      {left:from,transform:'translateY(-50%) rotate(-1deg)'},
      {offset:.2,transform:'translateY(-54%) rotate(1deg)'},
      {offset:.4,transform:'translateY(-48%) rotate(-1deg)'},
      {offset:.6,transform:'translateY(-53%) rotate(1deg)'},
      {offset:.8,transform:'translateY(-49%) rotate(-1deg)'},
      {left:to,transform:'translateY(-51%) rotate(0deg)'}
    ],{duration:cfg.duration,easing:'linear',iterations:1,fill:'none'});

    registerAnimation(el,cfg,anim,dir,false,forced);
  }

  function triggerRareAppearance(){
    const el=document.getElementById(RARE_CREATURE_ID);
    const cfg=creatures[RARE_CREATURE_ID];
    if(!el||!cfg)return;

    clearPending(el);
    if(active.has(el))return;

    startPass(el,cfg,true);
  }

  function flee(el,cfg){
    const entry=active.get(el);
    if(!entry||(!el.classList.contains('show')&&!forcedVisible.has(el)))return false;

    const parent=el.offsetParent||el.parentElement;
    if(!parent)return false;

    const elRect=el.getBoundingClientRect();
    const parentRect=parent.getBoundingClientRect();
    if(!parentRect.width)return false;

    const currentLeft=elRect.left-parentRect.left;
    const dir=entry.dir==='ltr'?'rtl':'ltr';
    const targetLeft=dir==='ltr'?parentRect.width*1.10:-parentRect.width*0.24;
    const fullDistance=parentRect.width*1.34;
    const remaining=Math.abs(targetLeft-currentLeft);
    const duration=Math.max(140,(cfg.duration*(remaining/fullDistance))/5);
    const forced=entry.forced===true;

    el.style.left=`${currentLeft}px`;
    entry.anim.cancel();
    mediaScale(el,cfg,dir);

    const anim=el.animate([
      {left:`${currentLeft}px`,transform:'translateY(-50%) rotate(-2deg)'},
      {offset:.22,transform:'translateY(-55%) rotate(2deg)'},
      {offset:.48,transform:'translateY(-47%) rotate(-2deg)'},
      {offset:.74,transform:'translateY(-54%) rotate(1deg)'},
      {left:`${targetLeft}px`,transform:'translateY(-50%) rotate(0deg)'}
    ],{duration,easing:'linear',iterations:1,fill:'none'});

    registerAnimation(el,cfg,anim,dir,true,forced);

    if(el.id===CLOWNFISH_ID&&!clownfishSecretTriggered){
      clownfishFleeCount++;
      if(clownfishFleeCount>=SECRET_FLEE_COUNT){
        clownfishSecretTriggered=true;
        triggerRareAppearance();
      }
    }

    return true;
  }

  function handleAquariumTap(e){
    if(e.isPrimary===false)return;
    const orb=document.getElementById('waterOrb');
    if(!orb)return;
    const orbRect=orb.getBoundingClientRect();
    const radius=Math.min(orbRect.width,orbRect.height)*0.10;
    let affected=0;

    for(const id of reactiveIds){
      const el=document.getElementById(id);
      const cfg=creatures[id];
      if(!el||!cfg||(!el.classList.contains('show')&&!forcedVisible.has(el))||!active.has(el))continue;
      const r=el.getBoundingClientRect();
      const cx=r.left+r.width/2;
      const cy=r.top+r.height/2;
      if(Math.hypot(cx-e.clientX,cy-e.clientY)<=radius){
        if(flee(el,cfg))affected++;
      }
    }

    if(affected>0)suppressOrbClickUntil=performance.now()+800;
  }

  function sync(){
    for(const [id,cfg] of Object.entries(creatures)){
      const el=document.getElementById(id);
      if(!el)continue;
      const entry=active.get(el);
      const shouldShow=el.classList.contains('show')||forcedVisible.has(el);

      if(shouldShow){
        if(!entry&&!pendingStarts.has(el)&&!forcedVisible.has(el))schedulePass(el,cfg,!initialized.has(el));
      }else{
        clearPending(el);
        if(entry){
          entry.anim.cancel();
          active.delete(el);
        }
        if(id===CLOWNFISH_ID){
          clownfishFleeCount=0;
          clownfishSecretTriggered=false;
        }
        initialized.delete(el);
        el.style.visibility='hidden';
      }
    }
  }

  function init(){
    sync();
    setInterval(sync,500);
    const orb=document.getElementById('waterOrb');
    if(!orb)return;
    orb.addEventListener('pointerdown',handleAquariumTap,{passive:true});
    orb.addEventListener('click',e=>{
      if(performance.now()<suppressOrbClickUntil){
        e.preventDefault();
        e.stopImmediatePropagation();
        suppressOrbClickUntil=0;
      }
    },true);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();