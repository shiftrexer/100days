(()=>{
  const STATE_KEY='100days-state-v1';
  const EXEC_KEY='100days-daily-execution-v1';
  const DAY=86400000;

  // 仮タスク。内容はここだけ差し替えれば毎日の表示内容を変更できます。
  const DAILY_TASKS=[
    {id:'move',title:'今日の運動をする',detail:'今日予定している運動を完了する'},
    {id:'meal',title:'食事を整える',detail:'今日の食事を意識して過ごす'},
    {id:'review',title:'今日を振り返る',detail:'1日の実施内容を確認する'}
  ];

  function readState(){
    try{return JSON.parse(localStorage.getItem(STATE_KEY)||'{}')}catch{return {}}
  }
  function writeState(st){localStorage.setItem(STATE_KEY,JSON.stringify(st));}
  function readExec(){
    try{
      const st=JSON.parse(localStorage.getItem(EXEC_KEY)||'{}');
      return st&&typeof st==='object'?st:{};
    }catch{return {}}
  }
  function writeExec(st){localStorage.setItem(EXEC_KEY,JSON.stringify(st));}
  function realIso(){return new Date().toLocaleDateString('sv-SE');}
  function validTestDay(st){
    const n=Number(st.testDay);
    return Number.isInteger(n)&&n>=1&&n<=100?n:null;
  }
  function dateForDay(st,n){
    const d=new Date((st.startDate||realIso())+'T00:00:00');
    d.setDate(d.getDate()+n-1);
    return d.toLocaleDateString('sv-SE');
  }
  function currentDate(st){
    const td=validTestDay(st);
    return td?dateForDay(st,td):realIso();
  }
  function currentDayNumber(st){
    const td=validTestDay(st);
    if(td)return td;
    const start=new Date((st.startDate||realIso())+'T00:00:00');
    const now=new Date(realIso()+'T00:00:00');
    return Math.max(1,Math.floor((now-start)/DAY)+1);
  }
  function isCompleted(st,date){
    const dates=Array.isArray(st.completedDates)?st.completedDates:[];
    return dates.includes(date);
  }
  function checksFor(date){
    const ex=readExec();
    const raw=ex[date]&&typeof ex[date]==='object'?ex[date]:{};
    const result={};
    for(const task of DAILY_TASKS)result[task.id]=Boolean(raw[task.id]);
    return result;
  }
  function saveCheck(date,id,value){
    const ex=readExec();
    const day=ex[date]&&typeof ex[date]==='object'?ex[date]:{};
    day[id]=Boolean(value);
    ex[date]=day;
    writeExec(ex);
  }
  function clearChecks(date){
    const ex=readExec();
    if(Object.prototype.hasOwnProperty.call(ex,date)){
      delete ex[date];
      writeExec(ex);
    }
  }
  function allDone(checks){return DAILY_TASKS.every(t=>checks[t.id]);}

  function ensureStyle(){
    if(document.getElementById('dailyExecutionStyle'))return;
    const s=document.createElement('style');
    s.id='dailyExecutionStyle';
    s.textContent=`
      .execution-wrap{padding:20px 0 8px;}
      .execution-head{padding:2px 4px 18px;}
      .execution-head .eyebrow{margin-bottom:7px;}
      .execution-head h1{margin:0;font-size:30px;letter-spacing:-.8px;}
      .execution-head p{margin:8px 0 0;font-size:12px;line-height:1.6;color:#7f8998;}
      .execution-summary{display:flex;align-items:center;justify-content:space-between;gap:14px;background:rgba(255,255,255,.86);border:1px solid rgba(255,255,255,.92);border-radius:22px;padding:16px 17px;margin-bottom:12px;box-shadow:0 14px 38px rgba(30,54,82,.08);}
      .execution-day{font-size:11px;font-weight:800;letter-spacing:.12em;color:#1687ff;}
      .execution-count{font-size:22px;font-weight:800;letter-spacing:-.7px;}
      .execution-count small{font-size:11px;color:#8c96a4;font-weight:700;margin-left:3px;}
      .execution-list{display:grid;gap:10px;}
      .execution-task{width:100%;border:1px solid rgba(255,255,255,.94);background:rgba(255,255,255,.88);border-radius:20px;padding:16px;display:grid;grid-template-columns:38px 1fr;gap:12px;align-items:center;text-align:left;box-shadow:0 10px 28px rgba(30,54,82,.07);color:#101521;transition:transform .14s ease,opacity .18s ease,background .18s ease;}
      .execution-task:active{transform:scale(.99);}
      .execution-task[disabled]{cursor:default;}
      .execution-check{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;border:1.5px solid #d9e0e8;background:#fff;color:transparent;font-size:18px;font-weight:900;transition:.18s;}
      .execution-task.is-done{background:rgba(244,248,252,.92);}
      .execution-task.is-done .execution-check{background:#151d28;border-color:#151d28;color:#fff;}
      .execution-task.is-done .execution-title{color:#66717f;text-decoration:line-through;text-decoration-thickness:1px;}
      .execution-title{font-size:14px;font-weight:760;line-height:1.4;}
      .execution-detail{font-size:11px;color:#8c96a4;line-height:1.45;margin-top:3px;}
      .execution-complete{margin-top:14px;border-radius:20px;padding:15px 16px;text-align:center;font-size:12px;font-weight:750;background:#151d28;color:#fff;box-shadow:0 12px 28px rgba(16,24,35,.14);}
      .execution-complete[hidden]{display:none;}
      .execution-note{margin:13px 3px 0;text-align:center;color:#929ca9;font-size:10px;line-height:1.55;}
      #legacyRecordForm{display:none !important;}
    `;
    document.head.appendChild(s);
  }

  function completeDay(date){
    const st=readState();
    const dates=Array.isArray(st.completedDates)?st.completedDates:[];
    if(dates.includes(date))return false;
    dates.push(date);
    st.completedDates=[...new Set(dates)].sort();
    writeState(st);
    return true;
  }

  function render(){
    const root=document.getElementById('dailyExecutionApp');
    if(!root)return;
    const st=readState();
    const date=currentDate(st);
    const dayNumber=currentDayNumber(st);
    const completed=isCompleted(st,date);
    const checks=checksFor(date);
    if(completed){
      for(const task of DAILY_TASKS)checks[task.id]=true;
    }
    const checked=DAILY_TASKS.filter(t=>checks[t.id]).length;

    root.innerHTML=`
      <div class="execution-wrap">
        <header class="execution-head">
          <div class="eyebrow">DAILY ACTION</div>
          <h1>今日の実施</h1>
          <p>今日やることをすべて完了すると、ホームの水が1日分増えます。</p>
        </header>
        <div class="execution-summary">
          <div>
            <div class="execution-day">DAY ${Math.min(dayNumber,100)}</div>
            <div class="execution-detail">${date}</div>
          </div>
          <div class="execution-count">${checked}<small>/ ${DAILY_TASKS.length}</small></div>
        </div>
        <div class="execution-list">
          ${DAILY_TASKS.map(task=>`
            <button class="execution-task ${checks[task.id]?'is-done':''}" type="button" data-execution-task="${task.id}" ${completed?'disabled':''}>
              <span class="execution-check">✓</span>
              <span>
                <span class="execution-title">${task.title}</span>
                <span class="execution-detail">${task.detail}</span>
              </span>
            </button>`).join('')}
        </div>
        <div class="execution-complete" ${completed?'':'hidden'}>本日の実施は完了しています ✓</div>
        <p class="execution-note">すべて完了した日だけ、実施日数として1日カウントされます。</p>
      </div>`;

    root.querySelectorAll('[data-execution-task]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        if(isCompleted(readState(),date))return;
        const id=btn.dataset.executionTask;
        const latest=checksFor(date);
        saveCheck(date,id,!latest[id]);
        const after=checksFor(date);
        if(allDone(after)){
          const added=completeDay(date);
          render();
          if(added){
            setTimeout(()=>location.reload(),520);
          }
          return;
        }
        render();
      });
    });
  }

  function init(){
    ensureStyle();
    render();
    const apply=document.getElementById('applyTestCodeBtn');
    if(apply)apply.addEventListener('click',()=>setTimeout(render,60));
    const input=document.getElementById('testCodeInput');
    if(input)input.addEventListener('keydown',e=>{if(e.key==='Enter')setTimeout(render,60)});
    const undo=document.getElementById('undoTodayBtn');
    if(undo)undo.addEventListener('click',()=>{
      const before=readState();
      const date=currentDate(before);
      setTimeout(()=>{clearChecks(date);render();},80);
    });
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
