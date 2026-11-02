(()=>{
  const creatures={
    crabPasser:{duration:22000,normal:'rtl',normalScale:1},
    clownfishPasser:{duration:17000,normal:'ltr',normalScale:1},
    tangPasser:{duration:21000,normal:'ltr',normalScale:-1},
    turtlePasser:{duration:24000,normal:'ltr',normalScale:1},
    diverPasser:{duration:26000,normal:'rtl',normalScale:1},
    whaleSharkPasser:{duration:29000,normal:'rtl',normalScale:1}
  };
  const active=new Map();

  function mediaScale(el,cfg,dir){
    if(el.id==='crabPasser')return;
    const media=el.querySelector('img,svg,.diver-art,.whale-art');
    if(!media)return;
    const normalFacing=cfg.normalScale;
    const scale=(dir===cfg.normal)?normalFacing:-normalFacing;
    media.style.transform=`scaleX(${scale})`;
    media.style.transformOrigin='center';
  }

  function startPass(el,cfg){
    if(!el.classList.contains('show'))return;
    if(active.has(el))return;

    el.style.animation='none';
    const dir=Math.random()<0.5?'ltr':'rtl';
    mediaScale(el,cfg,dir);

    const whale=el.id==='whaleSharkPasser';
    const from=whale?(dir==='ltr'?'-5%':'72%'):(dir==='ltr'?'-24%':'110%');
    const to=whale?(dir==='ltr'?'104%':'-28%'):(dir==='ltr'?'110%':'-24%');
    el.style.left=from;

    const anim=el.animate([
      {left:from,transform:'translateY(-50%) rotate(-1deg)'},
      {offset:.2,transform:'translateY(-54%) rotate(1deg)'},
      {offset:.4,transform:'translateY(-48%) rotate(-1deg)'},
      {offset:.6,transform:'translateY(-53%) rotate(1deg)'},
      {offset:.8,transform:'translateY(-49%) rotate(-1deg)'},
      {left:to,transform:'translateY(-51%) rotate(0deg)'}
    ],{duration:cfg.duration,easing:'linear',iterations:1,fill:'none'});

    active.set(el,anim);
    anim.onfinish=()=>{
      active.delete(el);
      if(el.classList.contains('show'))startPass(el,cfg);
    };
    anim.oncancel=()=>active.delete(el);
  }

  function sync(){
    for(const [id,cfg] of Object.entries(creatures)){
      const el=document.getElementById(id);
      if(!el)continue;
      const anim=active.get(el);
      if(el.classList.contains('show')){
        if(!anim)startPass(el,cfg);
      }else if(anim){
        anim.cancel();
        active.delete(el);
      }
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{
    sync();setInterval(sync,500);
  });
  else{sync();setInterval(sync,500)}
})();