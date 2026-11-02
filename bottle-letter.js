(()=>{
  const STORAGE_KEY='100days-bottle-letters-v1';
  const LETTER_DAYS=[95,96,97,98,99,100];
  const HIT_PADDING=16;
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
    const st=load();
    return LETTER_DAYS.find(day=>day<=done&&!st.collectedDays.includes(day))||null;
  }

  function isAvailable(done=completedCount()){
    if(done<LETTER_DAYS[0])return false;
    const st=load();
    if(st.pickedDates.includes(todayKey()))return false;
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

  function pickup(){
    const done=completedCount();
    if(!isAvailable(done))return false;
    const day=nextLetterDay(done);
    if(!day)return false;

    const st=load();
    if(!st.collectedDays.includes(day))st.collectedDays.push(day);
    const today=todayKey();
    if(!st.pickedDates.includes(today))st.pickedDates.push(today);
    st.collectedDays.sort((a,b)=>a-b);
    save(st);

    const bottle=document.getElementById('bottlePasser');
    if(bottle){
      bottle.classList.remove('show');
      bottle.style.visibility='hidden';
      bottle.style.pointerEvents='none';
    }
    showLetter(day);
    window.dispatchEvent(new CustomEvent('bottle-letter-picked',{detail:{day,date:today}}));
    return true;
  }

  function isBottleHit(e){
    const bottle=document.getElementById('bottlePasser');
    if(!bottle||!isAvailable())return false;
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
    if(!isAvailable()){
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
