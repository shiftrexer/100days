function undoCurrentDay(){
  const today=iso();
  if(!state.completedDates.includes(today)){
    toast('この日は実施済みではありません');
    return;
  }
  state.completedDates=state.completedDates.filter(d=>d!==today);
  save();
  render();
  toast('この日の実施を取り消しました');
}
const undoBtn=document.querySelector('#undoTodayBtn');
if(undoBtn)undoBtn.onclick=undoCurrentDay;

if(typeof drawCaustics==='function')drawCaustics=()=>{};

const CRAB_STATE_KEY='100days-state-v1';
function getCrabState(){
  try{return JSON.parse(localStorage.getItem(CRAB_STATE_KEY)||'{}')}catch{return {}}
}
function getCrabElapsedDay(){
  const st=getCrabState();
  const test=Number(st.testDay);
  if(Number.isInteger(test)&&test>=1&&test<=100)return test;
  const start=(st.startDate||new Date().toLocaleDateString('sv-SE'))+'T00:00:00';
  const today=new Date().toLocaleDateString('sv-SE')+'T00:00:00';
  return Math.max(1,Math.floor((new Date(today)-new Date(start))/86400000)+1);
}

function ensureSeaStyle(){
  if(document.getElementById('seaOverlayStyle'))return;
  const style=document.createElement('style');
  style.id='seaOverlayStyle';
  style.textContent=`
    .sea-creature{position:absolute;pointer-events:none;z-index:3;opacity:0;will-change:left,transform;}
    .sea-creature svg{display:block;width:100%;height:100%;overflow:visible}
    #crabPasser{left:106%;width:38px;height:25px;filter:drop-shadow(0 2px 4px rgba(39,73,121,.14));}
    #crabPasser.show{opacity:.97;animation:crab-pass 22s linear infinite;}
    @keyframes crab-pass{
      0%{left:106%;transform:translateY(-50%) rotate(2deg)}
      20%{transform:translateY(-54%) rotate(-1deg)}
      40%{transform:translateY(-48%) rotate(1deg)}
      60%{transform:translateY(-53%) rotate(-1deg)}
      80%{transform:translateY(-49%) rotate(1deg)}
      100%{left:-16%;transform:translateY(-52%) rotate(-1deg)}
    }
    #clownfishPasser{left:-16%;width:34px;height:20px;filter:drop-shadow(0 2px 4px rgba(35,95,173,.12));}
    #clownfishPasser.show{opacity:.96;animation:clownfish-pass 17s linear infinite;}
    @keyframes clownfish-pass{
      0%{left:-16%;transform:translateY(-50%) rotate(1deg)}
      20%{transform:translateY(-54%) rotate(-1deg)}
      40%{transform:translateY(-48%) rotate(1deg)}
      60%{transform:translateY(-53%) rotate(-1deg)}
      80%{transform:translateY(-49%) rotate(1deg)}
      100%{left:106%;transform:translateY(-51%) rotate(0deg)}
    }
    #tangPasser{left:-18%;width:38px;height:22px;filter:drop-shadow(0 2px 4px rgba(35,95,173,.12));}
    #tangPasser.show{opacity:.95;animation:tang-pass 21s linear infinite;animation-delay:-7s;}
    @keyframes tang-pass{
      0%{left:-18%;transform:translateY(-50%) rotate(-1deg)}
      18%{transform:translateY(-53%) rotate(1deg)}
      42%{transform:translateY(-47%) rotate(-1deg)}
      64%{transform:translateY(-52%) rotate(1deg)}
      84%{transform:translateY(-48%) rotate(0deg)}
      100%{left:108%;transform:translateY(-51%) rotate(-1deg)}
    }
  `;
  document.head.appendChild(style);
}

function crabSvg(){
  return `
  <svg viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="bodyG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ff4a19"/>
        <stop offset=".58" stop-color="#f53a12"/>
        <stop offset="1" stop-color="#e32e0b"/>
      </linearGradient>
      <linearGradient id="clawG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ff5b24"/>
        <stop offset="1" stop-color="#ee3510"/>
      </linearGradient>
    </defs>
    <g fill="none" stroke="#ef3a12" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
      <path d="M48 57 31 55 17 62 10 72"/>
      <path d="M48 66 29 67 17 76 12 86"/>
      <path d="M51 75 35 80 28 91"/>
      <path d="M102 57 119 55 133 62 140 72"/>
      <path d="M102 66 121 67 133 76 138 86"/>
      <path d="M99 75 115 80 122 91"/>
    </g>
    <path d="M45 42 C50 34 58 31 68 31 C72 28 78 28 82 31 C92 31 100 34 105 42 L108 69 C103 81 92 86 75 86 C58 86 47 81 42 69 Z" fill="url(#bodyG)"/>
    <path d="M53 46 C65 40 85 40 97 46" fill="none" stroke="#ff8b69" stroke-width="4" stroke-linecap="round" opacity=".62"/>
    <path d="M52 73 C60 80 67 82 75 82" fill="none" stroke="#ff7d5b" stroke-width="3" stroke-linecap="round" opacity=".42"/>
    <path d="M98 73 C90 80 83 82 75 82" fill="none" stroke="#ff7d5b" stroke-width="3" stroke-linecap="round" opacity=".42"/>
    <path d="M48 48 37 39 31 30" fill="none" stroke="#ef3a12" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M102 48 113 39 119 30" fill="none" stroke="#ef3a12" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
    <g>
      <path d="M31 31 C18 30 10 22 10 12 C10 6 14 3 21 3 C30 3 37 8 40 16 C43 9 50 5 58 5 C61 14 58 22 51 27 C45 31 38 32 31 31 Z" fill="url(#clawG)"/>
      <path d="M22 6 C27 4 33 6 37 11" fill="none" stroke="#ff9b7e" stroke-width="4" stroke-linecap="round" opacity=".7"/>
      <path d="M39 17 C43 14 47 12 52 12" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".9"/>
      <path d="M31 31 36 36 31 43 24 39 22 34 Z" fill="#ef3a12"/>
    </g>
    <g>
      <path d="M119 31 C132 30 140 22 140 12 C140 6 136 3 129 3 C120 3 113 8 110 16 C107 9 100 5 92 5 C89 14 92 22 99 27 C105 31 112 32 119 31 Z" fill="url(#clawG)"/>
      <path d="M128 6 C123 4 117 6 113 11" fill="none" stroke="#ff9b7e" stroke-width="4" stroke-linecap="round" opacity=".7"/>
      <path d="M111 17 C107 14 103 12 98 12" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity=".9"/>
      <path d="M119 31 114 36 119 43 126 39 128 34 Z" fill="#ef3a12"/>
    </g>
  </svg>`;
}

function clownfishSvg(){
  return `
  <svg viewBox="0 0 140 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="cfOrange" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ff8a30"/>
        <stop offset="1" stop-color="#ff5b1c"/>
      </linearGradient>
    </defs>
    <path d="M18 40 C18 24 32 14 56 14 C72 14 88 20 98 30 C106 31 114 25 122 18 C121 28 119 36 112 42 C120 49 122 57 122 66 C114 58 107 52 98 52 C88 61 72 66 56 66 C32 66 18 56 18 40 Z" fill="url(#cfOrange)"/>
    <path d="M52 15 C46 9 40 8 35 9 C40 15 41 21 40 28" fill="#ff6f27" opacity=".95"/>
    <path d="M52 65 C46 71 40 72 35 71 C40 65 41 59 40 52" fill="#ff6f27" opacity=".95"/>
    <path d="M37 18 C34 25 34 55 37 62" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    <path d="M63 16 C60 24 60 56 63 64" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    <path d="M89 23 C86 30 86 50 89 57" fill="none" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    <path d="M37 18 C34 25 34 55 37 62" fill="none" stroke="#1a1a1a" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>
    <path d="M63 16 C60 24 60 56 63 64" fill="none" stroke="#1a1a1a" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>
    <path d="M89 23 C86 30 86 50 89 57" fill="none" stroke="#1a1a1a" stroke-width="2.4" stroke-linecap="round" opacity=".6"/>
    <ellipse cx="31" cy="35" rx="4.6" ry="4.8" fill="#141414"/>
    <ellipse cx="29.8" cy="33.6" rx="1" ry="1.1" fill="#ffffff" opacity=".8"/>
  </svg>`;
}

function tangSvg(){
  return `
  <svg viewBox="0 0 150 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="tbBlue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#4bc2ff"/>
        <stop offset="1" stop-color="#1b73ff"/>
      </linearGradient>
    </defs>
    <path d="M22 45 C22 25 42 13 72 13 C93 13 110 23 118 36 C126 38 133 32 140 24 C138 36 134 45 128 51 C134 58 138 67 140 80 C133 72 126 66 118 64 C109 76 93 84 72 84 C42 84 22 66 22 45 Z" fill="url(#tbBlue)"/>
    <path d="M88 20 C100 24 109 34 112 47 C110 60 100 69 88 73 C90 63 92 52 92 46 C92 38 90 28 88 20 Z" fill="#ffe24d"/>
    <path d="M42 14 C38 21 37 28 37 36 C30 34 26 30 23 24 C28 18 34 15 42 14 Z" fill="#ffe24d"/>
    <path d="M42 76 C38 69 37 62 37 54 C30 56 26 60 23 66 C28 72 34 75 42 76 Z" fill="#ffe24d"/>
    <path d="M116 36 C121 34 126 30 131 24 C130 34 127 40 122 45" fill="#ffe24d"/>
    <path d="M116 54 C121 56 126 60 131 66 C130 56 127 50 122 45" fill="#ffe24d"/>
    <path d="M48 30 C62 24 84 24 98 32" fill="none" stroke="#89deff" stroke-width="4" stroke-linecap="round" opacity=".55"/>
    <ellipse cx="36" cy="39" rx="4.6" ry="4.8" fill="#141414"/>
    <ellipse cx="34.7" cy="37.6" rx="1" ry="1.1" fill="#ffffff" opacity=".8"/>
  </svg>`;
}

function ensureSeaElement(id, svgMarkup){
  const orb=document.querySelector('#waterOrb');
  if(!orb)return null;
  let el=document.getElementById(id);
  if(!el){
    el=document.createElement('div');
    el.id=id;
    el.className='sea-creature';
    el.setAttribute('aria-hidden','true');
    el.innerHTML=svgMarkup;
    const label=orb.querySelector('.orb-label');
    if(label)orb.insertBefore(el,label);
    else orb.appendChild(el);
  }
  return el;
}

function updateSeaCreatures(){
  ensureSeaStyle();
  const day=getCrabElapsedDay();
  const crab=ensureSeaElement('crabPasser',crabSvg());
  const clown=ensureSeaElement('clownfishPasser',clownfishSvg());
  const tang=ensureSeaElement('tangPasser',tangSvg());
  if(crab){
    const showCrab=day>=10;
    crab.classList.toggle('show',showCrab);
    crab.style.top='96%';
  }
  if(clown){
    const showFish=day>=20;
    clown.classList.toggle('show',showFish);
    clown.style.top='86%';
  }
  if(tang){
    const showFish=day>=20;
    tang.classList.toggle('show',showFish);
    tang.style.top='91%';
  }
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{
    updateSeaCreatures();
    setInterval(updateSeaCreatures,700);
  });
}else{
  updateSeaCreatures();
  setInterval(updateSeaCreatures,700);
}
