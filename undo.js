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
      width:38px;
      height:25px;
      pointer-events:none;
      z-index:3;
      opacity:0;
      filter:drop-shadow(0 2px 5px rgba(39,73,121,.16));
      will-change:left,transform;
    }
    #crabPasser img{display:block;width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply;}
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

function crabImage(){
  return `<img src="data:image/jpeg;base64,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" alt="" aria-hidden="true">`;
}

function ensureCrabElement(){
  const orb=document.querySelector('#waterOrb');
  if(!orb)return null;
  let crab=document.getElementById('crabPasser');
  if(!crab){
    crab=document.createElement('div');
    crab.id='crabPasser';
    crab.setAttribute('aria-hidden','true');
    crab.innerHTML=crabImage();
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
