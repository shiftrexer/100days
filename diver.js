(()=>{
  const DIVER_ASSET='diver-hd.png?v=20261102-diver-hd1';

  function ensureDiverStyle(){
    if(document.getElementById('diverOverlayStyle'))return;
    const style=document.createElement('style');
    style.id='diverOverlayStyle';
    style.textContent=`
      #diverPasser{
        position:absolute;
        left:108%;
        top:62%;
        width:72px;
        height:48px;
        pointer-events:none;
        z-index:3;
        opacity:0;
        filter:drop-shadow(0 2px 5px rgba(35,73,120,.14));
        will-change:left,transform;
      }
      #diverPasser.show{opacity:.98;}
      #diverPasser .diver-art{
        display:block;
        width:100%;
        height:100%;
        object-fit:contain;
        object-position:center;
        transform-origin:center;
        image-rendering:auto;
      }
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
      img.className='diver-art';
      img.alt='';
      img.draggable=false;
      img.src=DIVER_ASSET;
      el.appendChild(img);

      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);
      else orb.appendChild(el);
    }else{
      let img=el.querySelector('img.diver-art');
      if(!img){
        el.replaceChildren();
        img=document.createElement('img');
        img.className='diver-art';
        img.alt='';
        img.draggable=false;
        el.appendChild(img);
      }
      if(!img.src.includes('diver-hd.png')) img.src=DIVER_ASSET;
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
