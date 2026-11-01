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

// 水中の横筋（caustics）は表示しない
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
      left:-22%;
      width:58px;
      height:48px;
      pointer-events:none;
      z-index:3;
      opacity:0;
      filter:drop-shadow(0 3px 8px rgba(1,77,156,.20));
      will-change:left,transform;
    }
    #crabPasser svg{display:block;width:100%;height:100%;overflow:visible}
    #crabPasser.show{
      opacity:.96;
      animation:crab-pass 8.4s linear infinite;
    }
    @keyframes crab-pass{
      0%{left:-22%;transform:translateY(-50%) rotate(-2deg)}
      20%{transform:translateY(-55%) rotate(1deg)}
      40%{transform:translateY(-48%) rotate(-1deg)}
      60%{transform:translateY(-54%) rotate(1deg)}
      80%{transform:translateY(-49%) rotate(-1deg)}
      100%{left:108%;transform:translateY(-52%) rotate(1deg)}
    }
  `;
  document.head.appendChild(style);
}

function crabSvg(){
  return `
    <svg viewBox="0 0 88 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="crabBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#ff5d36"/>
          <stop offset="1" stop-color="#e93d24"/>
        </linearGradient>
        <linearGradient id="crabClaw" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ff7048"/>
          <stop offset="1" stop-color="#e74629"/>
        </linearGradient>
      </defs>

      <!-- eye stalks -->
      <path d="M35 25c0-5 1.4-8 4-10" fill="none" stroke="#cf3522" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M53 25c0-5-1.4-8-4-10" fill="none" stroke="#cf3522" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="39" cy="14" r="3.2" fill="#1d2430"/>
      <circle cx="49" cy="14" r="3.2" fill="#1d2430"/>

      <!-- rear legs -->
      <g fill="none" stroke="#e5482c" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M28 42 17 46 8 43"/>
        <path d="M28 49 16 54 8 58"/>
        <path d="M29 55 20 62 16 67"/>
        <path d="M60 42 71 46 80 43"/>
        <path d="M60 49 72 54 80 58"/>
        <path d="M59 55 68 62 72 67"/>
      </g>
      <g fill="#7b331f">
        <path d="M5 40 12 43 8 46z"/>
        <path d="M5 57 12 56 8 61z"/>
        <path d="M14 66 21 62 17 69z"/>
        <path d="M83 40 76 43 80 46z"/>
        <path d="M83 57 76 56 80 61z"/>
        <path d="M74 66 67 62 71 69z"/>
      </g>

      <!-- claw arms -->
      <path d="M30 34c-7-2-10-7-10-13" fill="none" stroke="#d93a25" stroke-width="7" stroke-linecap="round"/>
      <path d="M58 34c7-2 10-7 10-13" fill="none" stroke="#d93a25" stroke-width="7" stroke-linecap="round"/>

      <!-- claws -->
      <g>
        <path d="M20 24c-9-1-15-8-15-17 0-3 1-6 3-8 5 1 9 4 12 8 2-5 6-8 11-9 1 2 2 5 2 8 0 9-6 17-13 18z" fill="url(#crabClaw)"/>
        <path d="M14 3c3 1 6 3 8 6 2-4 5-6 9-7-2-3-6-5-10-5-4 0-7 2-9 6z" fill="#78351f" opacity=".95"/>
        <path d="M68 24c9-1 15-8 15-17 0-3-1-6-3-8-5 1-9 4-12 8-2-5-6-8-11-9-1 2-2 5-2 8 0 9 6 17 13 18z" fill="url(#crabClaw)"/>
        <path d="M74 3c-3 1-6 3-8 6-2-4-5-6-9-7 2-3 6-5 10-5 4 0 7 2 9 6z" fill="#78351f" opacity=".95"/>
      </g>

      <!-- body -->
      <rect x="26" y="27" width="36" height="31" rx="13" fill="url(#crabBody)"/>
      <ellipse cx="38" cy="36" rx="4" ry="2" fill="rgba(255,255,255,.16)"/>
      <ellipse cx="52" cy="48" rx="3" ry="1.5" fill="rgba(132,38,23,.16)"/>
      <ellipse cx="44" cy="53" rx="2.2" ry="1.2" fill="rgba(132,38,23,.12)"/>
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
    // 10〜19%の水位でも、水の中ほどを通る位置に合わせる
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
