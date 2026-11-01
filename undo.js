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
    .sea-creature svg,.sea-creature img{display:block;width:100%;height:100%;object-fit:contain;overflow:visible}
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
    #clownfishPasser{left:-16%;width:38px;height:26px;filter:drop-shadow(0 2px 4px rgba(35,95,173,.12));}
    #clownfishPasser.show{opacity:.99;animation:clownfish-pass 17s linear infinite;}
    @keyframes clownfish-pass{
      0%{left:-16%;transform:translateY(-50%) rotate(1deg)}
      20%{transform:translateY(-54%) rotate(-1deg)}
      40%{transform:translateY(-48%) rotate(1deg)}
      60%{transform:translateY(-53%) rotate(-1deg)}
      80%{transform:translateY(-49%) rotate(1deg)}
      100%{left:106%;transform:translateY(-51%) rotate(0deg)}
    }
    #tangPasser{left:-18%;width:41px;height:27px;filter:drop-shadow(0 2px 4px rgba(35,95,173,.12));}
    #tangPasser img{transform:scaleX(-1);}
    #tangPasser.show{opacity:.99;animation:tang-pass 21s linear infinite;animation-delay:-7s;}
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
  return `<img src="data:image/webp;base64,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" alt="" draggable="false">`;
}

function tangSvg(){
  return `<img src="data:image/webp;base64,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" alt="" draggable="false">`;
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
