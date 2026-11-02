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
  const reactiveIds=new Set(Object.keys(creatures));
  const active=new Map();
  let suppressOrbClickUntil=0;

  function mediaScale(el,cfg,dir){
    if(el.id==='crabPasser')return;
    const media=el.querySelector('img,svg,.diver-art,.whale-art');
    if(!media)return;
    const normalFacing=cfg.normalScale;
    const scale=(dir===cfg.normal)?normalFacing:-normalFacing;
    media.style.transform=`scaleX(${scale})`;
    media.style.transformOrigin='center';
  }

  function registerAnimation(el,cfg,anim,dir,escaping=false){
    const entry={anim,dir,escaping};
    active.set(el,entry);
    anim.onfinish=()=>{
      if(active.get(el)!==entry)return;
      active.delete(el);
      if(el.classList.contains('show'))startPass(el,cfg);
    };
    anim.oncancel=()=>{
      if(active.get(el)===entry)active.delete(el);
    };
  }

  function startPass(el,cfg){
    if(!el.classList.contains('show'))return;
    if(active.has(el))return;

    el.style.animation='none';
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

    registerAnimation(el,cfg,anim,dir,false);
  }

  function flee(el,cfg){
    const entry=active.get(el);
    if(!entry||!el.classList.contains('show'))return false;

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

    registerAnimation(el,cfg,anim,dir,true);
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
      if(!el||!cfg||!el.classList.contains('show')||!active.has(el))continue;
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
      if(el.classList.contains('show')){
        if(!entry)startPass(el,cfg);
      }else if(entry){
        entry.anim.cancel();
        active.delete(el);
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