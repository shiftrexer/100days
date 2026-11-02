(()=>{
  const ID='whaleSharkPasser';
  const DURATION=29000;
  let active=null;

  function currentDay(){
    const text=document.getElementById('elapsedText')?.textContent||'';
    const m=text.match(/(\d+)日目/);
    return m?Number(m[1]):1;
  }

  function ensureStyle(){
    if(document.getElementById('whaleSharkStyle'))return;
    const style=document.createElement('style');
    style.id='whaleSharkStyle';
    style.textContent=`
      #${ID}{
        position:absolute;
        top:68%;
        left:-10%;
        width:92px;
        height:auto;
        z-index:3;
        pointer-events:none;
        display:none;
        transform:translateY(-50%);
        will-change:left,transform;
      }
      #${ID}.show{display:block;}
      #${ID} img{
        display:block;
        width:100%;
        height:auto;
        object-fit:contain;
        user-select:none;
        -webkit-user-drag:none;
      }
    `;
    document.head.appendChild(style);
  }

  function ensureWhaleShark(){
    const orb=document.getElementById('waterOrb');
    if(!orb)return null;
    let el=document.getElementById(ID);
    if(!el){
      el=document.createElement('div');
      el.id=ID;
      el.setAttribute('aria-hidden','true');
      const img=document.createElement('img');
      img.src='whaleshark.png?v=20261103-2';
      img.alt='';
      img.decoding='async';
      el.appendChild(img);
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);
      else orb.appendChild(el);
    }
    return el;
  }

  function stop(){
    if(active){
      active.cancel();
      active=null;
    }
  }

  function startPass(el){
    if(active || !el.classList.contains('show'))return;

    const dir=Math.random()<0.5?'ltr':'rtl';
    const img=el.querySelector('img');
    if(img){
      img.style.transform=`scaleX(${dir==='ltr'?1:-1})`;
      img.style.transformOrigin='center';
    }

    // 最初から端に少し見えている位置から開始する
    const from=dir==='ltr'?'-10%':'82%';
    const to=dir==='ltr'?'105%':'-27%';
    el.style.left=from;

    active=el.animate([
      {left:from,transform:'translateY(-50%) rotate(-1deg)'},
      {offset:.25,transform:'translateY(-53%) rotate(1deg)'},
      {offset:.5,transform:'translateY(-49%) rotate(-1deg)'},
      {offset:.75,transform:'translateY(-52%) rotate(1deg)'},
      {left:to,transform:'translateY(-50%) rotate(0deg)'}
    ],{duration:DURATION,easing:'linear',iterations:1,fill:'none'});

    active.onfinish=()=>{
      active=null;
      if(el.classList.contains('show'))startPass(el);
    };
    active.oncancel=()=>{active=null;};
  }

  function sync(){
    ensureStyle();
    const el=ensureWhaleShark();
    if(!el)return;
    const visible=currentDay()>=60;
    el.classList.toggle('show',visible);
    if(visible){
      startPass(el);
    }else{
      stop();
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{sync();setInterval(sync,400);});
  }else{
    sync();setInterval(sync,400);
  }
})();
