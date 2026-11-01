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
      left:-18%;
      width:48px;
      height:36px;
      pointer-events:none;
      z-index:3;
      opacity:0;
      filter:drop-shadow(0 3px 8px rgba(3,83,170,.16));
      will-change:left,transform;
    }
    #crabPasser svg{display:block;width:100%;height:100%;overflow:visible}
    #crabPasser.show{
      opacity:.88;
      animation:crab-pass 8.4s linear infinite;
    }
    @keyframes crab-pass{
      0%{left:-18%;transform:translateY(-50%) rotate(-2deg)}
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
    <svg viewBox="0 0 56 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="none" stroke="rgba(239,249,255,.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M16 27 10 31 6 35"/>
        <path d="M17 30 13 35"/>
        <path d="M40 27 46 31 50 35"/>
        <path d="M39 30 43 35"/>
        <path d="M15 20 9 18 5 14"/>
        <path d="M41 20 47 18 51 14"/>
      </g>
      <path d="M15 15c0-5 4.8-8 13-8s13 3 13 8v8c0 5.2-4.8 8-13 8s-13-2.8-13-8z"
        fill="rgba(225,244,255,.82)" stroke="rgba(255,255,255,.94)" stroke-width="1.5"/>
      <path d="M17.5 13.2c3.4-3 17.7-3 21 0" fill="none" stroke="rgba(255,255,255,.42)" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M12 18c-4.4 0-7.5-2.5-7.5-6.2 0-2.1 1.3-4 3.5-5.1-.1 2.6 1.4 4.5 4.2 5.4" fill="rgba(231,247,255,.82)" stroke="rgba(255,255,255,.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M44 18c4.4 0 7.5-2.5 7.5-6.2 0-2.1-1.3-4-3.5-5.1.1 2.6-1.4 4.5-4.2 5.4" fill="rgba(231,247,255,.82)" stroke="rgba(255,255,255,.9)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
