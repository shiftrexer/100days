(()=>{
  const DIVER_ASSET='diver-asset.svg?v=20261102-original-diver1';
  let diverObjectUrl='';
  let loading=null;

  function ensureDiverStyle(){
    if(document.getElementById('diverOverlayStyle'))return;
    const style=document.createElement('style');
    style.id='diverOverlayStyle';
    style.textContent=`
      #diverPasser{
        position:absolute;
        left:108%;
        top:62%;
        width:64px;
        aspect-ratio:180 / 119;
        pointer-events:none;
        z-index:3;
        opacity:0;
        background-repeat:no-repeat;
        background-position:center;
        background-size:contain;
        filter:drop-shadow(0 2px 5px rgba(35,73,120,.14));
        will-change:left,transform;
      }
      #diverPasser.show[data-ready="1"]{opacity:.98;}
    `;
    document.head.appendChild(style);
  }

  function exactPngFromSvg(){
    if(diverObjectUrl)return Promise.resolve(diverObjectUrl);
    if(loading)return loading;
    loading=fetch(DIVER_ASSET,{cache:'no-store'})
      .then(r=>{
        if(!r.ok)throw new Error('diver asset load failed');
        return r.text();
      })
      .then(text=>{
        const m=text.match(/href=["'](data:image\/png;base64,[^"']+)["']/i);
        if(!m)throw new Error('embedded diver png not found');
        const base64=m[1].split(',')[1];
        const raw=atob(base64);
        const bytes=new Uint8Array(raw.length);
        for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
        diverObjectUrl=URL.createObjectURL(new Blob([bytes],{type:'image/png'}));
        return diverObjectUrl;
      });
    return loading;
  }

  function ensureDiver(){
    const orb=document.querySelector('#waterOrb');
    if(!orb)return null;
    let el=document.getElementById('diverPasser');
    if(!el){
      el=document.createElement('div');
      el.id='diverPasser';
      el.setAttribute('aria-hidden','true');
      el.dataset.ready='0';
      const label=orb.querySelector('.orb-label');
      if(label)orb.insertBefore(el,label);
      else orb.appendChild(el);
    }
    // 壊れ画像アイコンを出さないため img は一切使わない。
    el.replaceChildren();
    if(el.dataset.ready!=='1'){
      exactPngFromSvg().then(url=>{
        el.style.backgroundImage=`url("${url}")`;
        el.dataset.ready='1';
        updateDiver();
      }).catch(()=>{
        el.dataset.ready='0';
      });
    }
    return el;
  }

  function updateDiver(){
    ensureDiverStyle();
    const el=ensureDiver();
    if(!el)return;
    const day=(typeof getCrabElapsedDay==='function')?getCrabElapsedDay():1;
    el.classList.toggle('show',day>=50);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>{
      updateDiver();
      setInterval(updateDiver,700);
    });
  }else{
    updateDiver();
    setInterval(updateDiver,700);
  }
})();
