(()=>{
  function diverSvg(){
    return `
      <svg viewBox="0 0 180 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <g stroke="#171717" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M54 24c5-11 18-15 29-8 7 4 10 11 8 19-3 11-15 17-26 13-11-4-16-14-11-24Z" fill="#A86D43"/>
          <path d="M59 19c8-8 21-8 29-1" fill="none"/>
          <path d="M59 18c-6 6-8 13-7 21M64 15c-3 8-3 15 0 22M73 15c2 8 2 14 0 22" fill="none"/>

          <path d="M45 33c-12 0-21 8-21 19s9 19 21 19h23c12 0 20-8 20-19s-8-19-20-19H45Z" fill="#F5F7FA"/>
          <path d="M36 39h39c5 0 9 4 9 10v4c0 7-5 12-12 12H43c-8 0-14-6-14-14 0-7 3-12 7-12Z" fill="#D9DEE8"/>
          <path d="M39 42h35" stroke="#FFFFFF" stroke-width="4"/>
          <circle cx="42" cy="69" r="10" fill="#F7F7F7"/>
          <circle cx="42" cy="69" r="5" fill="#3A3D45"/>

          <path d="M69 67c9 2 16 5 23 11l18 15c5 4 13 5 20 1l15-10 7 8-16 13c-11 8-26 7-37-1L77 88c-5-4-9-10-8-21Z" fill="#343841"/>
          <path d="M73 69c-5 12-10 24-19 31-7 6-17 9-27 9" fill="none"/>
          <path d="M26 109c-6 0-11-4-11-9 0-5 5-9 12-9 8 0 14 4 14 9 0 5-7 9-15 9Z" fill="#343841"/>
          <path d="M74 73c-11 8-21 12-34 14-7 1-13-1-18-4" fill="none"/>
          <path d="M23 83c-6-2-10-6-10-11 0-4 4-7 9-7 6 0 12 4 14 10" fill="#343841"/>

          <path d="M84 53c8 0 15 3 21 8l15 12-9 18-17-12c-6-4-10-10-10-18Z" fill="#FFD928"/>
          <path d="M99 58l11 8" fill="none"/>
          <path d="M94 71l17 12" fill="none"/>

          <path d="M122 90l24-18 9 10-23 19" fill="#343841"/>
          <path d="M145 72c10-8 20-12 29-11l-2 15c-10 0-18 3-25 10Z" fill="#FFD928"/>
          <path d="M131 102l25 4-2 12-28-3" fill="#343841"/>
          <path d="M156 106c9 0 17 3 24 8l-9 8c-7-4-13-6-20-6Z" fill="#FFD928"/>

          <path d="M82 58c-5 1-10 0-14-3" fill="none"/>
          <path d="M66 56c4 9 4 15 0 22" fill="none"/>
          <rect x="74" y="79" width="13" height="10" rx="2" fill="#F7F7F7"/>
          <rect x="80" y="91" width="11" height="9" rx="2" fill="#F7F7F7"/>

          <circle cx="55" cy="10" r="4" fill="none"/>
          <circle cx="65" cy="5" r="6" fill="none"/>
          <circle cx="77" cy="8" r="4" fill="none"/>
        </g>
      </svg>`;
  }

  function ensureDiverStyle(){
    if(document.getElementById('diverOverlayStyle'))return;
    const style=document.createElement('style');
    style.id='diverOverlayStyle';
    style.textContent=`
      #diverPasser{
        position:absolute;
        left:108%;
        top:62%;
        width:68px;
        height:auto;
        pointer-events:none;
        z-index:3;
        opacity:0;
        filter:drop-shadow(0 2px 5px rgba(35,73,120,.14));
        will-change:left,transform;
      }
      #diverPasser svg{display:block;width:100%;height:auto;overflow:visible;}
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
      el.innerHTML=diverSvg();
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);
      else orb.appendChild(el);
    }else if(!el.querySelector('svg')){
      el.innerHTML=diverSvg();
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
