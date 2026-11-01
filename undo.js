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
if(undoBtn) undoBtn.onclick=undoCurrentDay;

if(typeof drawCaustics==='function'){
  drawCaustics=()=>{};
}

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
      left:-16%;
      width:42px;
      height:31px;
      pointer-events:none;
      z-index:3;
      opacity:0;
      filter:drop-shadow(0 2px 5px rgba(39,73,121,.16));
      will-change:left,transform;
    }
    #crabPasser svg{display:block;width:100%;height:100%;overflow:visible}
    #crabPasser.show{
      opacity:.96;
      animation:crab-pass 8.2s linear infinite;
    }
    @keyframes crab-pass{
      0%{left:-16%;transform:translateY(-50%) rotate(-2deg)}
      20%{transform:translateY(-54%) rotate(1deg)}
      40%{transform:translateY(-48%) rotate(-1deg)}
      60%{transform:translateY(-53%) rotate(1deg)}
      80%{transform:translateY(-49%) rotate(-1deg)}
      100%{left:106%;transform:translateY(-52%) rotate(1deg)}
    }
  `;
  document.head.appendChild(style);
}

function crabSvg(){
  return `
    <svg viewBox="0 0 86 58" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="crabBodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FF6A38"/>
          <stop offset="58%" stop-color="#F34A1C"/>
          <stop offset="100%" stop-color="#D63816"/>
        </linearGradient>
        <linearGradient id="crabClawGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FF7346"/>
          <stop offset="70%" stop-color="#E24318"/>
          <stop offset="100%" stop-color="#C93415"/>
        </linearGradient>
      </defs>

      <g fill="none" stroke="#DE471D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M29 36 19 42 13 50"/>
        <path d="M32 41 24 50"/>
        <path d="M27 30 16 27 10 21"/>
        <path d="M57 36 67 42 73 50"/>
        <path d="M54 41 62 50"/>
        <path d="M59 30 70 27 76 21"/>
      </g>

      <ellipse cx="43" cy="31" rx="24" ry="16" fill="url(#crabBodyGrad)"/>
      <ellipse cx="43" cy="28" rx="18" ry="8" fill="rgba(255,132,93,.26)"/>
      <ellipse cx="43" cy="31" rx="24" ry="16" fill="none" stroke="rgba(182,43,17,.28)" stroke-width="1.2"/>

      <path d="M18 29c-7.3 0-12.2-4-12.2-9.6 0-3.1 1.8-6 5-7.8.2 4.1 2.9 7 8.1 8.2"
        fill="url(#crabClawGrad)" stroke="rgba(185,48,21,.24)" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="M68 29c7.3 0 12.2-4 12.2-9.6 0-3.1-1.8-6-5-7.8-.2 4.1-2.9 7-8.1 8.2"
        fill="url(#crabClawGrad)" stroke="rgba(185,48,21,.24)" stroke-width="1.1" stroke-linejoin="round"/>

      <path d="M12 12.5c4.3.6 7 2.5 8.7 5.9" fill="none" stroke="#70331F" stroke-width="4.2" stroke-linecap="round"/>
      <path d="M74 12.5c-4.3.6-7 2.5-8.7 5.9" fill="none" stroke="#70331F" stroke-width="4.2" stroke-linecap="round"/>

      <g fill="#70331F">
        <path d="M10 21c3.1.4 5.9 1.7 8 3.7-2.8.1-5.7-1.2-8-3.7Z"/>
        <path d="M76 21c-3.1.4-5.9 1.7-8 3.7 2.8.1 5.7-1.2 8-3.7Z"/>
        <path d="M13 50c1.6-2.8 4.1-4.9 7.1-6.3-.8 3-3.1 5.5-7.1 6.3Z"/>
        <path d="M73 50c-1.6-2.8-4.1-4.9-7.1-6.3.8 3 3.1 5.5 7.1 6.3Z"/>
      </g>

      <ellipse cx="37.5" cy="17.6" rx="2.6" ry="3.5" fill="#161616"/>
      <ellipse cx="48.5" cy="17.6" rx="2.6" ry="3.5" fill="#161616"/>
      <ellipse cx="36.8" cy="16.8" rx=".65" ry=".9" fill="rgba(255,255,255,.7)"/>
      <ellipse cx="47.8" cy="16.8" rx=".65" ry=".9" fill="rgba(255,255,255,.7)"/>
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
  if(visible){
    crab.style.top=`${100-day/2}%`;
  }
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
