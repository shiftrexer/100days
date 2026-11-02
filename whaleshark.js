(()=>{
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
      #whaleSharkPasser{
        position:absolute;
        top:68%;
        left:-24%;
        width:92px;
        height:auto;
        z-index:3;
        pointer-events:none;
        display:none;
        transform:translateY(-50%);
        will-change:left,transform;
      }
      #whaleSharkPasser.show{display:block;}
      #whaleSharkPasser img{
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
    let el=document.getElementById('whaleSharkPasser');
    if(!el){
      el=document.createElement('div');
      el.id='whaleSharkPasser';
      el.setAttribute('aria-hidden','true');
      const img=document.createElement('img');
      img.src='whaleshark.png?v=20261103-1';
      img.alt='';
      img.decoding='async';
      el.appendChild(img);
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);
      else orb.appendChild(el);
    }
    return el;
  }

  function sync(){
    ensureStyle();
    const el=ensureWhaleShark();
    if(!el)return;
    el.classList.toggle('show',currentDay()>=60);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{sync();setInterval(sync,500);});
  }else{
    sync();setInterval(sync,500);
  }
})();
