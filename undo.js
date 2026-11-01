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
      left:-14%;
      font-size:30px;
      line-height:1;
      pointer-events:none;
      z-index:3;
      opacity:0;
      filter:drop-shadow(0 2px 6px rgba(4,67,146,.22));
      will-change:left,transform;
    }
    #crabPasser.show{
      opacity:.92;
      animation:crab-pass 7.8s linear infinite;
    }
    @keyframes crab-pass{
      0%{left:-14%;transform:translateY(-50%) rotate(-3deg)}
      20%{transform:translateY(-57%) rotate(2deg)}
      40%{transform:translateY(-48%) rotate(-2deg)}
      60%{transform:translateY(-56%) rotate(2deg)}
      80%{transform:translateY(-49%) rotate(-2deg)}
      100%{left:108%;transform:translateY(-53%) rotate(2deg)}
    }
  `;
  document.head.appendChild(style);
}

function ensureCrabElement(){
  const orb=document.querySelector('#waterOrb');
  if(!orb)return null;
  let crab=document.getElementById('crabPasser');
  if(!crab){
    crab=document.createElement('div');
    crab.id='crabPasser';
    crab.setAttribute('aria-hidden','true');
    crab.textContent='🦀';
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
    // 10〜19%の水位でも、カニが水の中ほどを通る位置に合わせる
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
