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

function ensureCrabStyle(){
  if(document.getElementById('crabOverlayStyle'))return;
  const style=document.createElement('style');
  style.id='crabOverlayStyle';
  style.textContent=`
    #crabPasser{
      position:absolute;
      left:106%;
      width:38px;
      height:25px;
      pointer-events:none;
      z-index:3;
      opacity:0;
      filter:drop-shadow(0 2px 4px rgba(39,73,121,.14));
      will-change:left,transform;
    }
    #crabPasser svg{display:block;width:100%;height:100%;overflow:visible}
    #crabPasser.show{
      opacity:.97;
      animation:crab-pass 22s linear infinite;
    }
    @keyframes crab-pass{
      0%{left:106%;transform:translateY(-50%) rotate(2deg)}
      20%{transform:translateY(-54%) rotate(-1deg)}
      40%{transform:translateY(-48%) rotate(1deg)}
      60%{transform:translateY(-53%) rotate(-1deg)}
      80%{transform:translateY(-49%) rotate(1deg)}
      100%{left:-16%;transform:translateY(-52%) rotate(-1deg)}
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

function ensureCrabElement(){
  const orb=document.querySelector('#waterOrb');
  if(!orb)return null;
  let crab=document.getElementById('crabPasser');
  if(!crab){
    crab=document.createElement('div');
    crab.id='crabPasser';
    crab.setAttribute('aria-hidden','true');
    crab.innerHTML=crabSvg();
    const label=orb.querySelector('.orb-label');
    if(label)orb.insertBefore(crab,label);
    else orb.appendChild(crab);
  }
  return crab;
}

function updateCrabPasser(){
  ensureCrabStyle();
  const crab=ensureCrabElement();
  if(!crab)return;
  const day=getCrabElapsedDay();
  const visible=day>=10&&day<=19;
  crab.classList.toggle('show',visible);
  if(visible)crab.style.top=`${100-day/2}%`;
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>{
    updateCrabPasser();
    setInterval(updateCrabPasser,700);
  });
}else{
  updateCrabPasser();
  setInterval(updateCrabPasser,700);
}
