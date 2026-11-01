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
    #clownfishPasser{left:-16%;width:38px;height:24px;filter:drop-shadow(0 2px 4px rgba(35,95,173,.12));}
    #clownfishPasser.show{opacity:.98;animation:clownfish-pass 17s linear infinite;}
    @keyframes clownfish-pass{
      0%{left:-16%;transform:translateY(-50%) rotate(1deg)}
      20%{transform:translateY(-54%) rotate(-1deg)}
      40%{transform:translateY(-48%) rotate(1deg)}
      60%{transform:translateY(-53%) rotate(-1deg)}
      80%{transform:translateY(-49%) rotate(1deg)}
      100%{left:106%;transform:translateY(-51%) rotate(0deg)}
    }
    #tangPasser{left:-18%;width:41px;height:25px;filter:drop-shadow(0 2px 4px rgba(35,95,173,.12));}
    #tangPasser.show{opacity:.98;animation:tang-pass 21s linear infinite;animation-delay:-7s;}
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
  <svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="cfOrange2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ff9825"/>
        <stop offset="1" stop-color="#ff6c0d"/>
      </linearGradient>
    </defs>
    <g stroke="#2e1a16" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
      <path d="M24 50 C24 27 43 14 74 14 C104 14 126 29 136 50 C126 71 104 86 74 86 C43 86 24 73 24 50 Z" fill="url(#cfOrange2)"/>
      <path d="M26 50 C17 43 10 34 7 23 C20 23 31 29 39 38 L39 62 C31 71 20 77 7 77 C10 66 17 57 26 50 Z" fill="#ff7d0f"/>
      <path d="M70 15 C63 6 54 4 47 7 C53 14 56 21 57 29" fill="#ff8616"/>
      <path d="M70 85 C63 94 54 96 47 93 C53 86 56 79 57 71" fill="#ff8616"/>
      <ellipse cx="84" cy="57" rx="16" ry="13" fill="#ff7b10"/>
      <path d="M50 18 C43 30 43 70 50 82" fill="#fffdf8"/>
      <path d="M84 15 C76 29 76 71 84 85" fill="#fffdf8"/>
      <path d="M116 26 C107 38 107 62 116 74" fill="#fffdf8"/>
    </g>
    <path d="M37 31 C41 25 46 21 51 19" fill="none" stroke="#ffb060" stroke-width="5" stroke-linecap="round" opacity=".7"/>
    <path d="M17 40 C20 36 24 34 29 33" fill="none" stroke="#ffab53" stroke-width="4" stroke-linecap="round" opacity=".55"/>
  </svg>`;
}

function tangSvg(){
  return `
  <svg viewBox="0 0 170 105" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="tbBlue2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2f74ff"/>
        <stop offset="1" stop-color="#2054e9"/>
      </linearGradient>
      <linearGradient id="tbYellow2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#ffd943"/>
        <stop offset="1" stop-color="#ffc61a"/>
      </linearGradient>
    </defs>
    <g stroke="#2e1a16" stroke-width="7" stroke-linejoin="round" stroke-linecap="round">
      <path d="M24 53 C24 28 47 13 82 13 C114 13 134 28 142 45 C145 51 145 57 142 63 C133 82 112 92 82 92 C48 92 24 77 24 53 Z" fill="url(#tbBlue2)"/>
      <path d="M142 45 L163 32 C166 43 166 63 163 74 L142 63 Z" fill="url(#tbYellow2)"/>
      <path d="M49 29 C68 14 103 16 125 31 C117 31 110 35 105 43 C99 36 90 32 81 32 C72 32 65 36 59 44 C56 37 53 33 49 29 Z" fill="#2e1a16"/>
      <path d="M59 44 C68 34 75 31 82 31 C89 31 97 35 105 43 C114 43 123 41 132 38 C126 51 126 61 132 69 C120 65 112 64 104 65 C95 73 87 76 78 76 C68 76 58 71 50 62 C57 58 61 52 59 44 Z" fill="#2e1a16"/>
      <ellipse cx="91" cy="41" rx="17" ry="10" fill="#2f74ff" stroke="none"/>
      <path d="M83 64 C92 70 102 72 112 70 C107 79 101 83 94 85 C89 79 85 72 83 64 Z" fill="url(#tbYellow2)"/>
    </g>
    <path d="M43 34 C48 27 54 23 61 21" fill="none" stroke="#70a2ff" stroke-width="5" stroke-linecap="round" opacity=".65"/>
    <path d="M40 76 C61 88 93 88 117 76" fill="none" stroke="#5fa5ff" stroke-width="5" stroke-linecap="round" opacity=".7"/>
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
