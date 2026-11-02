(()=>{
  const DIVER_PNG="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAADV...";
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
      #diverPasser img{display:block;width:100%;height:auto;object-fit:contain;}
      #diverPasser.show{
        opacity:.98;
        animation:diver-pass 26s linear infinite;
        animation-delay:-5s;
      }
      @keyframes diver-pass{
        0%{left:108%;transform:translateY(-50%) rotate(-1deg)}
        20%{transform:translateY(-53%) rotate(1deg)}
        42%{transform:translateY(-48%) rotate(-1deg)}
        64%{transform:translateY(-52%) rotate(1deg)}
        84%{transform:translateY(-49%) rotate(0deg)}
        100%{left:-28%;transform:translateY(-51%) rotate(-1deg)}
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
      img.src=DIVER_PNG;
      img.alt='';
      el.appendChild(img);
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);
      else orb.appendChild(el);
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