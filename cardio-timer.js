(()=>{
  'use strict';

  // DAYごとのメニュー確定後は、この設定を日別のデータ参照に置き換えます。
  const DURATION_MS = 20 * 60 * 1000;
  const STATE_KEY = '100days-state-v1';
  const TIMER_KEY = '100days-cardio-timer-v1';
  const CIRCUMFERENCE = 2 * Math.PI * 102;
  let dialog = null;
  let selectedDate = null;
  let successVisible = false;

  function todayIso(){
    return new Date().toLocaleDateString('sv-SE');
  }

  function readAppState(){
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || '{}'); }
    catch { return {}; }
  }

  function appDate(st){
    const n = Number(st.testDay);
    if(Number.isInteger(n) && n >= 1 && n <= 100){
      const date = new Date((st.startDate || todayIso()) + 'T00:00:00');
      date.setDate(date.getDate() + n - 1);
      return date.toLocaleDateString('sv-SE');
    }
    return todayIso();
  }

  function readTimer(){
    try{
      const s = JSON.parse(localStorage.getItem(TIMER_KEY) || 'null');
      if(!s || !/^\d{4}-\d{2}-\d{2}$/.test(String(s.date || ''))) return null;
      if(s.status !== 'running' && s.status !== 'paused') return null;
      if(!Number.isFinite(s.remainingMs) || !Number.isFinite(s.durationMs) || s.durationMs <= 0) return null;
      if(s.status === 'running' && !Number.isFinite(s.endAt)) return null;
      return s;
    }catch{return null;}
  }

  function storeTimer(s){
    localStorage.setItem(TIMER_KEY, JSON.stringify(s));
  }

  function clearTimer(){
    localStorage.removeItem(TIMER_KEY);
  }

  function remaining(s){
    return Math.max(0, s.status === 'running' ? s.endAt - Date.now() : s.remainingMs);
  }

  function displayTime(ms){
    const seconds = Math.ceil(Math.max(0, ms) / 1000);
    return String(Math.floor(seconds / 60)).padStart(2, '0') + ':' + String(seconds % 60).padStart(2, '0');
  }

  function ensureUi(){
    if(dialog) return;
    const style = document.createElement('style');
    style.id = 'cardioTimerStyle';
    style.textContent = [
      '.cardio-dialog{border:0;padding:0;background:transparent;width:min(calc(100% - 28px),430px);max-width:430px;max-height:calc(100dvh - 36px);overflow:visible;margin:auto;color:#101521;}',
      '.cardio-dialog::backdrop{background:rgba(12,25,43,.56);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);}',
      '.cardio-panel{position:relative;background:#fff;border-radius:28px;padding:25px 21px 27px;box-shadow:0 26px 90px rgba(11,30,54,.24);text-align:center;max-height:calc(100dvh - 36px);overflow-y:auto;}',
      '.cardio-dialog [hidden]{display:none!important;}',
      '.cardio-kicker{font-size:10px;font-weight:850;letter-spacing:.16em;color:#1687ff;margin:0 30px 9px;}',
      '.cardio-message{font-size:21px;font-weight:780;line-height:1.55;letter-spacing:-.6px;margin:0 16px 13px;}',
      '.cardio-close{position:absolute;top:13px;right:14px;width:32px;height:32px;background:#f1f4f8;border:0;border-radius:50%;font-size:20px;color:#697586;display:grid;place-items:center;}',
      '.cardio-helper{font-size:12px;line-height:1.6;color:#8a96a6;margin:8px 0 0;}',
      '.cardio-intro-time{font-variant-numeric:tabular-nums;font-size:54px;font-weight:820;line-height:1.1;letter-spacing:-2px;margin:26px auto 26px;}',
      '.cardio-primary{display:block;width:100%;border:0;border-radius:17px;background:#151d28;color:#fff;font-size:15px;font-weight:800;padding:16px;margin-top:16px;}',
      '.cardio-ring{position:relative;width:min(68vw,250px);height:min(68vw,250px);max-width:250px;max-height:250px;margin:14px auto 20px;}',
      '.cardio-ring svg{display:block;width:100%;height:100%;transform:rotate(-90deg);}',
      '.cardio-ring-track{fill:none;stroke:#e9eff6;stroke-width:13;}',
      '.cardio-ring-progress{fill:none;stroke:#1687ff;stroke-width:13;stroke-linecap:round;transition:stroke-dashoffset .16s linear;}',
      '.cardio-ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}',
      '.cardio-time{font-variant-numeric:tabular-nums;font-size:44px;font-weight:820;letter-spacing:-1.7px;line-height:1.1;}',
      '.cardio-state{font-size:11px;font-weight:700;color:#8995a5;margin-top:10px;}',
      '.cardio-controls{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:5px;}',
      '.cardio-controls button{border:0;border-radius:16px;padding:15px 8px;font-size:13px;font-weight:830;letter-spacing:.05em;}',
      '.cardio-stop{background:#151d28;color:#fff;}',
      '.cardio-giveup{background:#f1f4f8;color:#7a8797;}',
      '.cardio-success-icon{font-size:45px;display:grid;place-items:center;width:78px;height:78px;border-radius:50%;background:#ebf7f1;color:#24865a;margin:21px auto 18px;}',
      '.cardio-success h3{font-size:23px;margin:0;}',
      '.cardio-success p{font-size:12px;line-height:1.65;color:#7f8998;margin:12px 0 24px;}',
      '@media(prefers-reduced-motion:reduce){.cardio-ring-progress{transition:none;}}'
    ].join('');
    document.head.appendChild(style);

    dialog = document.createElement('dialog');
    dialog.className = 'cardio-dialog';
    dialog.id = 'cardioTimerDialog';
    dialog.setAttribute('aria-label', '有酸素タイマー');
    dialog.innerHTML = [
      '<div class="cardio-panel">',
        '<button type="button" class="cardio-close" id="cardioClose" aria-label="閉じる">×</button>',
        '<p class="cardio-kicker" id="cardioDay">DAILY CARDIO</p>',
        '<h2 class="cardio-message">今日は20分間ウォーキングしてみよう！</h2>',
        '<section id="cardioIntro">',
          '<div class="cardio-intro-time">20:00</div>',
          '<p class="cardio-helper">開始を押すと20分のカウントダウンが始まります。</p>',
          '<button type="button" class="cardio-primary" id="cardioStart">開始</button>',
        '</section>',
        '<section id="cardioActive" hidden>',
          '<div class="cardio-ring">',
            '<svg viewBox="0 0 240 240" aria-hidden="true">',
              '<circle class="cardio-ring-track" cx="120" cy="120" r="102"></circle>',
              '<circle class="cardio-ring-progress" id="cardioProgress" cx="120" cy="120" r="102"></circle>',
            '</svg>',
            '<div class="cardio-ring-center">',
              '<div class="cardio-time" id="cardioRemaining" role="timer" aria-label="残り時間">20:00</div>',
              '<div class="cardio-state" id="cardioState">カウントダウン中</div>',
            '</div>',
          '</div>',
          '<div class="cardio-controls">',
            '<button type="button" class="cardio-stop" id="cardioStop">STOP</button>',
            '<button type="button" class="cardio-giveup" id="cardioGiveUp">GIVE UP</button>',
          '</div>',
          '<p class="cardio-helper">STOPは一時停止、GIVE UPは中断です。</p>',
        '</section>',
        '<section class="cardio-success" id="cardioSuccess" hidden>',
          '<div class="cardio-success-icon">✓</div>',
          '<h3>有酸素 完了！</h3>',
          '<p>20分間のウォーキング、お疲れさまでした。<br>有酸素の記録を実施済みにしました。</p>',
          '<button type="button" class="cardio-primary" id="cardioSuccessClose">閉じる</button>',
        '</section>',
      '</div>'
    ].join('');
    // DOMへの表示文にはユーザー入力を埋め込まず、固定した文言だけを使用します。
    document.body.appendChild(dialog);
    dialog.querySelector('#cardioProgress').setAttribute('stroke-dasharray', String(CIRCUMFERENCE));
    dialog.querySelector('#cardioClose').addEventListener('click', ()=>dialog.close());
    dialog.querySelector('#cardioSuccessClose').addEventListener('click', ()=>dialog.close());
    dialog.querySelector('#cardioStart').addEventListener('click', start);
    dialog.querySelector('#cardioStop').addEventListener('click', pauseOrResume);
    dialog.querySelector('#cardioGiveUp').addEventListener('click', giveUp);
    dialog.addEventListener('close', ()=>{selectedDate=null;successVisible=false;});
  }

  function switchPanel(which){
    if(!dialog)return;
    dialog.querySelector('#cardioIntro').hidden = which !== 'intro';
    dialog.querySelector('#cardioActive').hidden = which !== 'active';
    dialog.querySelector('#cardioSuccess').hidden = which !== 'success';
  }

  function showSession(s){
    if(!dialog || !dialog.open || successVisible) return;
    switchPanel('active');
    const ms = remaining(s);
    const fraction = Math.max(0, Math.min(1, ms / s.durationMs));
    const circle = dialog.querySelector('#cardioProgress');
    circle.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - fraction));
    dialog.querySelector('#cardioRemaining').textContent = displayTime(ms);
    dialog.querySelector('#cardioState').textContent = s.status === 'paused' ? '一時停止中' : 'カウントダウン中';
    dialog.querySelector('#cardioStop').textContent = s.status === 'paused' ? 'RESUME' : 'STOP';
  }

  function finish(s){
    if(!s || !readTimer() || s.date !== readTimer().date) return;
    clearTimer();
    const st = readAppState();
    if(appDate(st) !== s.date) return;
    const alreadyCompleted = Array.isArray(st.completedDates) && st.completedDates.includes(s.date);
    if(!alreadyCompleted){
      window.dispatchEvent(new CustomEvent('cardio-timer-complete', {detail:{date:s.date}}));
    }
    if(dialog && dialog.open && selectedDate === s.date){
      successVisible = true;
      switchPanel('success');
    }
  }

  function tick(){
    const s = readTimer();
    if(!s)return;
    const st = readAppState();
    if(appDate(st) !== s.date || (Array.isArray(st.completedDates) && st.completedDates.includes(s.date))){
      clearTimer();
      if(dialog && dialog.open && selectedDate !== appDate(st)) dialog.close();
      return;
    }
    if(s.status === 'running' && remaining(s) <= 0){
      finish(s);
      return;
    }
    if(dialog && dialog.open && selectedDate === s.date) showSession(s);
  }

  function open(date, day){
    ensureUi();
    tick();
    const st = readAppState();
    if(appDate(st) !== date) return;
    selectedDate = date;
    successVisible = false;
    dialog.querySelector('#cardioDay').textContent = 'DAY ' + Math.max(1, Math.min(100, Number(day) || 1)) + '  ·  有酸素';
    const s = readTimer();
    if(s && s.date !== date) clearTimer();
    if(!dialog.open) dialog.showModal();
    const current = readTimer();
    if(current && current.date === date) showSession(current);
    else switchPanel('intro');
  }

  function start(){
    if(!selectedDate || appDate(readAppState()) !== selectedDate) return;
    const old = readTimer();
    if(old && old.date === selectedDate) {showSession(old);return;}
    const s = {
      date:selectedDate,
      durationMs:DURATION_MS,
      remainingMs:DURATION_MS,
      status:'running',
      endAt:Date.now()+DURATION_MS
    };
    storeTimer(s);
    showSession(s);
  }

  function pauseOrResume(){
    const s = readTimer();
    if(!s || !selectedDate || s.date !== selectedDate) return;
    if(s.status === 'running'){
      const ms = remaining(s);
      if(ms <= 0){finish(s);return;}
      s.status = 'paused';
      s.remainingMs = ms;
      s.endAt = null;
    }else{
      s.status = 'running';
      s.endAt = Date.now() + s.remainingMs;
    }
    storeTimer(s);
    showSession(s);
  }

  function giveUp(){
    if(!selectedDate) return;
    if(!window.confirm('有酸素を中断しますか？ 経過時間はリセットされ、実施済みにはなりません。')) return;
    clearTimer();
    dialog.close();
  }

  function dayChanged(date){
    const s = readTimer();
    if(s && s.date !== date) clearTimer();
    if(dialog && dialog.open && selectedDate !== date) dialog.close();
  }

  function init(){
    ensureUi();
    tick();
    setInterval(tick, 250);
    document.addEventListener('visibilitychange', ()=>{if(!document.hidden)tick();});
    window.addEventListener('focus', tick);
    window.addEventListener('storage', e=>{
      if(e.key === TIMER_KEY || e.key === STATE_KEY) tick();
    });
  }

  window.CardioTimer = {open, dayChanged};

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, {once:true});
  }else{
    init();
  }
})();
