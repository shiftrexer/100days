(()=>{
  const creatureIds=[
    'crabPasser','clownfishPasser','tangPasser','turtlePasser','diverPasser',
    'whaleSharkPasser','penguinPasser','octopusPasser','pufferPasser',
    'pinkFishPasser','bottlePasser'
  ];

  function install(){
    const orb=document.getElementById('waterOrb');
    if(!orb)return;

    let layer=document.getElementById('orbCreatureClip');
    if(!layer){
      layer=document.createElement('div');
      layer.id='orbCreatureClip';
      layer.setAttribute('aria-hidden','true');
      const label=orb.querySelector('.orb-label');
      if(label&&label.parentElement===orb)orb.insertBefore(layer,label);
      else orb.appendChild(layer);
    }

    const moveCreatures=()=>{
      for(const id of creatureIds){
        const el=document.getElementById(id);
        if(el&&el.parentElement!==layer)layer.appendChild(el);
      }
    };

    moveCreatures();

    const observer=new MutationObserver(()=>moveCreatures());
    observer.observe(orb,{childList:true});
  }

  const style=document.createElement('style');
  style.id='orbCreatureClipStyle';
  style.textContent=`
    #orbCreatureClip{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      border-radius:50%;
      overflow:hidden;
      -webkit-clip-path:circle(50% at 50% 50%);
      clip-path:circle(50% at 50% 50%);
      -webkit-mask-image:-webkit-radial-gradient(white,black);
      contain:paint;
      isolation:isolate;
      pointer-events:none;
      z-index:3;
      transform:translateZ(0);
    }
    #orbCreatureClip > *{
      pointer-events:none !important;
    }
    #waterOrb:active{
      transform:none !important;
    }
  `;
  if(!document.getElementById(style.id))document.head.appendChild(style);

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);
  else install();
})();
