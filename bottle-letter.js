(()=>{
  const STORAGE_KEY='100days-bottle-letters-v1';
  const LETTER_DAYS=[95,96,97,98,99,100];
  const HIT_PADDING=16;
  let pickupInProgress=false;

  const letters={
    95:{title:'ここまで来たあなたへ',body:'95日間、積み重ねてきたものは数字だけではありません。続ける力そのものが、もうあなたの中に残っています。あと少しです。'},
    96:{title:'残り5日',body:'ゴールが近いほど、特別なことをしたくなります。でも最後まで大切なのは、いつも通りを続けること。今日も淡々と進めば大丈夫です。'},
    97:{title:'変化はもう起きている',body:'最初の日と比べてみてください。見た目だけでなく、考え方や習慣もきっと変わっています。ここまで来た自分を、少し誇ってください。'},
    98:{title:'あと3日',body:'100日はゴールであり、次のスタートでもあります。この先も続けたいことを、ひとつだけ決めておくと100日後がもっと意味のある日に変わります。'},
    99:{title:'明日で100日',body:'ここまで来られたのは、完璧だったからではなく、やめなかったからです。明日は最後の1日。いつも通り、あなたらしく終えましょう。'},
    100:{title:'100日目の手紙',body:'100日間、本当にお疲れさまでした。積み重ねた100日は消えません。今日まで続けた自分を認めて、ここから先は「続けられる人」として次の一歩を進んでください。'}
  };

  function todayKey(){
    try{
      return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    }catch{
      const d=new Date();
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
  }

  function completedCount(){
    try{
      const st=JSON.parse(localStorage.getItem('100days-state-v1')||'{}');
      const dates=Array.isArray(st.completedDates)?st.completedDates:[];
      return Math.min(100,new Set(dates).size);
    }catch{return 0}
  }

  function load(){
    try{
      const st=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      return {
        collectedDays:Array.isArray(st.collectedDays)?st.collectedDays.filter(n=>LETTER_DAYS.includes(n)):[],
        pickedDates:Array.isArray(st.pickedDates)?st.pickedDates:[]
      };
    }catch{return {collectedDays:[],pickedDates:[]}}
  }

  function save(st){localStorage.setItem(STORAGE_KEY,JSON.stringify(st));}

  function nextLetterDay(done=completedCount()){
    if(!LETTER_DAYS.includes(done))return null;
    const st=load();
    return st.collectedDays.includes(done)?null:done;
  }

  function isAvailable(done=completedCount()){
    return nextLetterDay(done)!==null;
  }

  function ensureStyle(){
    if(document.getElementById('bottleLetterStyle'))return;
    const s=document.createElement('style');
    s.id='bottleLetterStyle';
    s.textContent=`
      #bottlePasser{pointer-events:auto !important;cursor:pointer;touch-action:manipulation;}
      #bottlePasser:focus-visible{outline:2px solid rgba(255,255,255,.95);outline-offset:3px;border-radius:8px;}
      #bottleLetterDialog{border:0;padding:0;background:transparent;width:min(88vw,420px);max-width:420px;}
      #bottleLetterDialog::backdrop{background:rgba(17,30,48,.38);backdrop-filter:blur(4px);}
      .bottle-letter-card{position:relative;background:#fffdf7;border-radius:24px;padding:30px 24px 26px;box-shadow:0 22px 60px rgba(32,50,76,.22);color:#283446;}
      .bottle-letter-close{position:absolute;right:14px;top:12px;width:36px;height:36px;border:0;border-radius:50%;background:rgba(40,52,70,.07);font-size:22px;line-height:1;color:#526071;}
      .bottle-letter-meta{font-size:11px;font-weight:800;letter-spacing:.14em;color:#8a98a8;margin-bottom:10px;}
      .bottle-letter-card h2{font-size:21px;line-height:1.35;margin:0 34px 16px 0;color:#263547;}
      .bottle-letter-card p{font-size:15px;line-height:1.9;margin:0;white-space:pre-wrap;}
      .bottle-letter-seal{margin-top:22px;font-size:12px;color:#9aa6b3;text-align:right;}

      .bottle-open-overlay{position:fixed;inset:0;z-index:9998;pointer-events:none;background:rgba(17,30,48,0);overflow:hidden;}
      .bottle-open-bottle{position:fixed;display:block;object-fit:contain;z-index:2;filter:drop-shadow(0 12px 20px rgba(22,39,59,.22));transform-origin:center;will-change:transform,opacity,left,top;}
      .bottle-open-paper{position:fixed;z-index:1;width:18px;height:42px;border-radius:3px;background:linear-gradient(90deg,#efe5c8 0%,#fffaf0 45%,#f1e7ca 100%);box-shadow:0 5px 15px rgba(41,52,69,.16);opacity:0;transform-origin:center bottom;will-change:transform,opacity,width,height,left,top;border-radius;}
      .bottle-open-paper::before,.bottle-open-paper::after{content:'';position:absolute;left:4px;right:4px;height:1px;background:rgba(120,103,70,.18);}
      .bottle-open-paper::before{top:13px;}.bottle-open-paper::after{top:21px;}
      @media (prefers-reduced-motion:reduce){.bottle-open-overlay{display:none !important;}}
    `;
    document.head.appendChild(s);
  }

  function ensureDialog(){
    let dialog=document.getElementById('bottleLetterDialog');
    if(dialog)return dialog;
    dialog=document.createElement('dialog');
    dialog.id='bottleLetterDialog';
    dialog.innerHTML=`
      <article class="bottle-letter-card">
        <button class="bottle-letter-close" type="button" aria-label="閉じる">×</button>
        <div class="bottle-letter-meta" id="bottleLetterMeta"></div>
        <h2 id="bottleLetterTitle"></h2>
        <p id="bottleLetterBody"></p>
        <div class="bottle-letter-seal">Message in a bottle</div>
      </article>`;
    document.body.appendChild(dialog);
    dialog.querySelector('.bottle-letter-close').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
    return dialog;
  }

  function showLetter(day){
    const letter=letters[day];
    if(!letter)return;
    const dialog=ensureDialog();
    const index=LETTER_DAYS.indexOf(day)+1;
    dialog.querySelector('#bottleLetterMeta').textContent=`LETTER ${index} / 6  ·  DAY ${day}`;
    dialog.querySelector('#bottleLetterTitle').textContent=letter.title;
    dialog.querySelector('#bottleLetterBody').textContent=letter.body;
    if(typeof dialog.showModal==='function')dialog.showModal();
    else dialog.setAttribute('open','');
  }

  function animateElement(el,keyframes,options){
    return new Promise(resolve=>{
      const anim=el.animate(keyframes,options);
      anim.onfinish=resolve;
      anim.oncancel=resolve;
    });
  }

  async function playPickupAnimation(day,bottleRect,bottleSrc){
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      showLetter(day);
      return;
    }

    const overlay=document.createElement('div');
    overlay.className='bottle-open-overlay';

    const bottle=document.createElement('img');
    bottle.className='bottle-open-bottle';
    bottle.alt='';
    bottle.src=bottleSrc||'';
    bottle.style.left=`${bottleRect.left}px`;
    bottle.style.top=`${bottleRect.top}px`;
    bottle.style.width=`${Math.max(1,bottleRect.width)}px`;
    bottle.style.height=`${Math.max(1,bottleRect.height)}px`;

    const paper=document.createElement('div');
    paper.className='bottle-open-paper';

    overlay.appendChild(paper);
    overlay.appendChild(bottle);
    document.body.appendChild(overlay);

    const vw=window.innerWidth;
    const vh=window.innerHeight;
    const startCx=bottleRect.left+bottleRect.width/2;
    const startCy=bottleRect.top+bottleRect.height/2;
    const targetCx=vw/2;
    const targetCy=Math.min(vh*0.58,vh-150);
    const dx=targetCx-startCx;
    const dy=targetCy-startCy;
    const scale=10;

    await Promise.all([
      animateElement(overlay,[{background:'rgba(17,30,48,0)'},{background:'rgba(17,30,48,.28)'}],{duration:380,easing:'ease-out',fill:'forwards'}),
      animateElement(bottle,[
        {transform:'translate(0,0) scale(1) rotate(0deg)'},
        {offset:.72,transform:`translate(${dx}px,${dy}px) scale(${scale*.94}) rotate(-7deg)`},
        {transform:`translate(${dx}px,${dy}px) scale(${scale}) rotate(-4deg)`}
      ],{duration:520,easing:'cubic-bezier(.2,.8,.2,1)',fill:'forwards'})
    ]);

    const bottleDisplayH=Math.max(1,bottleRect.height)*scale;
    const paperStartX=targetCx-9;
    const paperStartY=targetCy-bottleDisplayH*.30;
    paper.style.left=`${paperStartX}px`;
    paper.style.top=`${paperStartY}px`;

    await Promise.all([
      animateElement(bottle,[
        {transform:`translate(${dx}px,${dy}px) scale(${scale}) rotate(-4deg)`},
        {transform:`translate(${dx}px,${dy+5}px) scale(${scale}) rotate(5deg)`},
        {transform:`translate(${dx}px,${dy}px) scale(${scale}) rotate(-2deg)`}
      ],{duration:360,easing:'ease-in-out',fill:'forwards'}),
      animateElement(paper,[
        {opacity:0,transform:'translateY(20px) scaleY(.45) rotate(3deg)'},
        {offset:.25,opacity:1,transform:'translateY(4px) scaleY(.7) rotate(1deg)'},
        {opacity:1,transform:'translateY(-74px) scaleY(1) rotate(-2deg)'}
      ],{duration:520,easing:'cubic-bezier(.2,.85,.25,1)',fill:'forwards'})
    ]);

    await animateElement(bottle,[
      {opacity:1,transform:`translate(${dx}px,${dy}px) scale(${scale}) rotate(-2deg)`},
      {opacity:.55,transform:`translate(${dx}px,${dy+28}px) scale(${scale*.88}) rotate(8deg)`},
      {opacity:0,transform:`translate(${dx}px,${dy+50}px) scale(${scale*.72}) rotate(12deg)`}
    ],{duration:330,easing:'ease-in',fill:'forwards'});

    const finalW=Math.min(vw*0.78,330);
    const finalH=Math.min(vh*0.56,430);
    const currentPaperTop=paperStartY-74;
    const finalLeft=(vw-finalW)/2;
    const finalTop=Math.max(70,(vh-finalH)/2);

    await animateElement(paper,[
      {left:`${paperStartX}px`,top:`${currentPaperTop}px`,width:'18px',height:'42px',borderRadius:'3px',opacity:1,transform:'rotate(-2deg)'},
      {offset:.45,left:`${targetCx-45}px`,top:`${currentPaperTop-8}px`,width:'90px',height:'126px',borderRadius:'8px',opacity:1,transform:'rotate(1deg)'},
      {left:`${finalLeft}px`,top:`${finalTop}px`,width:`${finalW}px`,height:`${finalH}px`,borderRadius:'20px',opacity:1,transform:'rotate(0deg)'}
    ],{duration:560,easing:'cubic-bezier(.2,.75,.2,1)',fill:'forwards'});

    await animateElement(paper,[{opacity:1},{opacity:0}],{duration:160,easing:'ease-out',fill:'forwards'});
    overlay.remove();
    showLetter(day);
  }

  function pickup(){
    if(pickupInProgress)return false;
    const done=completedCount();
    if(!isAvailable(done))return false;
    const day=nextLetterDay(done);
    if(!day)return false;

    pickupInProgress=true;
    const bottle=document.getElementById('bottlePasser');
    const bottleRect=bottle?bottle.getBoundingClientRect():new DOMRect(window.innerWidth/2-11,window.innerHeight/2-16,22,31);
    const bottleImg=bottle?bottle.querySelector('img'):null;
    const bottleSrc=bottleImg?bottleImg.currentSrc||bottleImg.src:'';

    const st=load();
    if(!st.collectedDays.includes(day))st.collectedDays.push(day);
    const today=todayKey();
    if(!st.pickedDates.includes(today))st.pickedDates.push(today);
    st.collectedDays.sort((a,b)=>a-b);
    save(st);

    if(bottle){
      bottle.classList.remove('show');
      bottle.style.visibility='hidden';
      bottle.style.pointerEvents='none';
    }

    window.dispatchEvent(new CustomEvent('bottle-letter-picked',{detail:{day,date:today}}));
    playPickupAnimation(day,bottleRect,bottleSrc).finally(()=>{pickupInProgress=false;});
    return true;
  }

  function isBottleHit(e){
    const bottle=document.getElementById('bottlePasser');
    if(!bottle||!isAvailable()||pickupInProgress)return false;
    if(!bottle.classList.contains('show')||bottle.style.visibility==='hidden')return false;
    const r=bottle.getBoundingClientRect();
    return e.clientX>=r.left-HIT_PADDING&&e.clientX<=r.right+HIT_PADDING&&e.clientY>=r.top-HIT_PADDING&&e.clientY<=r.bottom+HIT_PADDING;
  }

  function wireBottle(){
    const bottle=document.getElementById('bottlePasser');
    if(!bottle||bottle.dataset.letterWired==='1')return;
    bottle.dataset.letterWired='1';
    bottle.setAttribute('role','button');
    bottle.setAttribute('tabindex','0');
    bottle.setAttribute('aria-label','瓶を拾って手紙を読む');
    bottle.removeAttribute('aria-hidden');

    bottle.addEventListener('pointerdown',e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      pickup();
    });
    bottle.addEventListener('click',e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
    });
    bottle.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        e.stopImmediatePropagation();
        pickup();
      }
    });
  }

  function wireOrbCapture(){
    const orb=document.getElementById('waterOrb');
    if(!orb||orb.dataset.bottleCaptureWired==='1')return;
    orb.dataset.bottleCaptureWired='1';
    orb.addEventListener('pointerdown',e=>{
      if(!isBottleHit(e))return;
      e.preventDefault();
      e.stopImmediatePropagation();
      pickup();
    },true);
  }

  function syncBottleInteractivity(){
    const bottle=document.getElementById('bottlePasser');
    if(!bottle)return;
    wireBottle();
    wireOrbCapture();
    if(!isAvailable()||pickupInProgress){
      bottle.classList.remove('show');
      bottle.style.visibility='hidden';
      bottle.style.pointerEvents='none';
    }else{
      bottle.style.pointerEvents='auto';
    }
  }

  function init(){
    ensureStyle();
    ensureDialog();
    syncBottleInteractivity();
    setInterval(syncBottleInteractivity,500);
  }

  window.BottleLetters={isAvailable,pickup,nextLetterDay};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();