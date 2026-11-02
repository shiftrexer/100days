(()=>{
  const DIVER_IMG='diver-asset.svg?v=20261102-diver-asset2';

  function ensureDiverStyle(){
    if(document.getElementById('diverOverlayStyle'))return;
    const style=document.createElement('style');
    style.id='diverOverlayStyle';
    style.textContent=`
      #diverPasser{
        position:absolute;
        left:108%;
        top:62%;
        width:64px;
        height:auto;
        pointer-events:none;
        z-index:3;
        opacity:0;
        filter:drop-shadow(0 2px 5px rgba(35,73,120,.14));
        will-change:left,transform;
      }
      #diverPasser img{
        display:block;
        width:100%;
        height:auto;
        object-fit:contain;
      }
      #diverPasser.show{opacity:.98;}
    `;
    document.head.appendChild(style);
  }

  function ensureDiver(){
    const orb=document.querySelector('#waterOrb');
    if(!orb)return null;
    let el=document.getElementById('diverPasser');
    if(!el){
      el=document.createElement('div');
      el.id='diverPasser';
      el.setAttribute('aria-hidden','true');
      const img=document.createElement('img');
      img.src=DIVER_IMG;
      img.alt='';
      img.decoding='async';
      el.appendChild(img);
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);
      else orb.appendChild(el);
    }else{
      const img=el.querySelector('img');
      if(img&&img.getAttribute('src')!==DIVER_IMG)img.src=DIVER_IMG;
    }
    return el;
  }

  function updateDiver(){
    ensureDiverStyle();
    const el=ensureDiver();
    if(!el)return;
    const day=(typeof getCrabElapsedDay==='function')?getCrabElapsedDay():1;
    el.classList.toggle('show',day>=50);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      updateDiver();
      setInterval(updateDiver,700);
    });
  }else{
    updateDiver();
    setInterval(updateDiver,700);
  }
})();
