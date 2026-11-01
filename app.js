const KEY='100days-state-v1',DAY=86400000;
const realIso=()=>new Date().toLocaleDateString('sv-SE');
const themes=['減量は「続けられる設計」が9割','体重は1日単位で判断しない','カロリー収支を味方につける','タンパク質を毎食に入れる','炭水化物は敵ではない','脂質をゼロにしない','水分をしっかり取る','睡眠と食欲の関係','外食でも減量は続けられる','間食との付き合い方','筋肉を残して脂肪を落とす','有酸素運動の使い方','歩数を増やすメリット','休養もトレーニングの一部','停滞期は失敗ではない','食べ過ぎた翌日の正解','空腹を感じた時の対処法','モチベーションに頼らない','記録するだけで変わる理由','1日休んでも戻ればいい'];
const titles=Array.from({length:100},(_,i)=>themes[i%themes.length]);
const base=()=>({startDate:realIso(),startWeight:'',currentWeight:'',completedDates:[],records:{},articleRead:[],testDay:null});
let state;try{state={...base(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{state=base()}
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const save=()=>localStorage.setItem(KEY,JSON.stringify(state));
const testDay=()=>{const n=Number(state.testDay);return Number.isInteger(n)&&n>=1&&n<=100?n:null};
const dateForDay=n=>{const d=new Date((state.startDate||realIso())+'T00:00:00');d.setDate(d.getDate()+n-1);return d.toLocaleDateString('sv-SE')};
const iso=()=>testDay()?dateForDay(testDay()):realIso();
const done=()=>Math.min(100,new Set(state.completedDates).size);
const elapsed=()=>testDay()||Math.max(1,Math.floor((new Date(realIso()+'T00:00:00')-new Date((state.startDate||realIso())+'T00:00:00'))/DAY)+1);
const streak=()=>{const set=new Set(state.completedDates);let n=0,d=new Date(iso()+'T00:00:00');if(!set.has(iso()))d=new Date(d-DAY);while(set.has(d.toLocaleDateString('sv-SE'))){n++;d=new Date(d-DAY)}return n};
function delta(){const a=+state.startWeight,b=+state.currentWeight;if(!a||!b)return'--';const d=b-a;return`${d>0?'+':''}${d.toFixed(1)} kg`}
let target=done()/100,display=target,splash=0;
function render(){const d=done(),e=elapsed(),today=iso(),td=state.completedDates.includes(today);$('#elapsedText').textContent=`開始から${e}日目`;$('#completedCount').textContent=d;$('#currentWeight').textContent=state.currentWeight||'--';$('#weightDelta').textContent=delta();$('#streakCount').textContent=`${streak()}日`;$('#remainingCount').textContent=`${100-d}日`;const orb=$('#waterOrb');const disabled=td||d>=100;orb.setAttribute('aria-disabled',String(disabled));orb.setAttribute('aria-label',td?'今日は実施済み':d>=100?'100日達成済み':'今日を実施済みにする');orb.classList.toggle('done',disabled);$('#todayStatus').textContent=d>=100?'100日達成しました。満水です。':td?'今日は実施済みです。':'丸をタップすると、今日を実施済みにできます。';const ci=Math.max(0,Math.min(99,e-1));$('#todayColumnTitle').textContent=`DAY ${ci+1}｜${titles[ci]}`;document.querySelector('[data-open-column]').dataset.openColumn=ci;renderColumns(e);renderProgress(d,e);renderTestStatus();target=d/100}
function renderColumns(e){$('#columnList').innerHTML=titles.map((t,i)=>{const u=i<Math.min(100,e),r=state.articleRead.includes(i);return`<button class="column-item ${u?'':'locked'}" data-column="${i}" ${u?'':'disabled'}><span class="column-day">DAY ${i+1}</span><span class="column-title">${t}</span><span class="column-lock">${u?(r?'✓':'›'):'🔒'}</span></button>`}).join('')}
function renderProgress(d,e){let m=0,set=new Set(state.completedDates);for(let i=0;i<Math.min(100,e);i++){const day=dateForDay(i+1);if(!set.has(day))m++}$('#progressDone').textContent=d;$('#progressMissed').textContent=m;$('#progressRemaining').textContent=100-d;$('#dayGrid').innerHTML=Array.from({length:100},(_,i)=>{const day=dateForDay(i+1),past=i<Math.min(100,e),isDone=set.has(day);return`<div class="day-dot ${isDone?'done':past?'missed':''}">${i+1}</div>`}).join('')}
function renderTestStatus(){const el=$('#testCodeStatus');if(!el)return;const n=testDay();el.textContent=n?`テスト日付：${n}日目（1〜${n}日目を連続実施）`:'テスト用コードを入力'}
function toast(msg){let t=$('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.append(t)}t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),1600)}
function completeToday(){const today=iso();if(state.completedDates.includes(today)||done()>=100)return;state.completedDates.push(today);state.completedDates=[...new Set(state.completedDates)].sort();save();splash=1;render();toast('今日の1%を積み上げました')}
$('#waterOrb').onclick=completeToday;
$('#waterOrb').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();completeToday()}});
$('#recordForm').onsubmit=e=>{e.preventDefault();const w=$('#weightInput').value,f=$('#fatInput').value,s=$('#stepsInput').value,m=$('#memoInput').value.trim(),today=iso();state.records[today]={weight:w,fat:f,steps:s,memo:m};if(w)state.currentWeight=w;if(!state.startWeight&&w)state.startWeight=w;save();render();toast('記録を保存しました')};
$('#settingsBtn').onclick=()=>{$('#startDateInput').value=state.startDate;$('#startWeightInput').value=state.startWeight;$('#settingsDialog').showModal()};
$('#saveSettingsBtn').onclick=e=>{e.preventDefault();state.startDate=$('#startDateInput').value||realIso();state.startWeight=$('#startWeightInput').value;save();$('#settingsDialog').close();render();toast('設定を保存しました')};
$('#resetBtn').onclick=()=>{if(confirm('すべての記録をリセットしますか？')){state=base();save();$('#settingsDialog').close();render();toast('リセットしました')}};
function applyTestCode(){const raw=$('#testCodeInput').value.trim().toLowerCase(),match=/^code-(\d{3})$/.exec(raw),n=match?Number(match[1]):0;if(n<1||n>100){toast('コードが正しくありません');return}state.testDay=n;state.completedDates=Array.from({length:n},(_,i)=>dateForDay(i+1));save();$('#testCodeInput').value='';splash=1;render();toast(`${n}日目まで連続実施した状態に変更しました`)}
$('#applyTestCodeBtn').onclick=applyTestCode;
$('#testCodeInput').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();applyTestCode()}});
$$('.nav-item').forEach(b=>b.onclick=()=>{$$('.nav-item').forEach(x=>x.classList.remove('active'));b.classList.add('active');$$('.screen').forEach(x=>x.classList.remove('active'));$('#'+b.dataset.screen).classList.add('active');scrollTo(0,0)});
document.addEventListener('click',e=>{const c=e.target.closest('[data-column],[data-open-column]');if(!c)return;const i=Number(c.dataset.column??c.dataset.openColumn);if(i>=Math.min(100,elapsed()))return;$('#articleDay').textContent=`DAY ${i+1}`;$('#articleTitle').textContent=titles[i];$('#articleBody').innerHTML=`<p>DAY ${i+1}のテーマは「${titles[i]}」です。減量は、一度の完璧な行動より、無理なく繰り返せる行動を積み重ねる方が結果につながります。</p><p>今日できることを一つ決めて実行してください。できた日だけ水を1%積み上げます。</p>`;if(!state.articleRead.includes(i)){state.articleRead.push(i);save();renderColumns(elapsed())}$('#columnDialog').showModal()});
$('#closeColumnBtn').onclick=()=>$('#columnDialog').close();

const canvas=$('#waterCanvas'),ctx=canvas.getContext('2d');
function fit(){const dpr=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',fit);fit();

const bubbles=Array.from({length:34},()=>({x:Math.random(),y:Math.random(),r:.8+Math.random()*4.2,s:.00006+Math.random()*.00018,drift:(Math.random()-.5)*.0018,p:Math.random()*6.28,alpha:.08+Math.random()*.18}));
const particles=Array.from({length:30},()=>({x:Math.random(),y:Math.random(),s:.15+Math.random()*.5,a:.03+Math.random()*.06,p:Math.random()*6.28}));

function surfaceY(x,w,baseY,t,amp){
  return baseY+Math.sin((x/w)*Math.PI*2*1.08+t*.00105)*amp;
}

function fillWater(w,h,waterTop,t,amp,fill){
  ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(0,surfaceY(0,w,waterTop,t,amp));
  for(let x=0;x<=w;x+=3)ctx.lineTo(x,surfaceY(x,w,waterTop,t,amp));
  ctx.lineTo(w,h);ctx.closePath();ctx.fillStyle=fill;ctx.fill();
}

function strokeSurface(w,waterTop,t,amp){
  ctx.save();ctx.beginPath();
  for(let x=0;x<=w;x+=2){const y=surfaceY(x,w,waterTop,t,amp);x?ctx.lineTo(x,y):ctx.moveTo(x,y)}
  ctx.strokeStyle='rgba(255,255,255,.72)';ctx.lineWidth=1.6;ctx.stroke();ctx.restore();
}

function drawCaustics(w,h,waterTop,t){
  ctx.save();ctx.globalCompositeOperation='screen';
  for(let i=0;i<6;i++){
    const yy=waterTop+18+i*22+Math.sin(t*.00055+i)*5;
    const grad=ctx.createLinearGradient(0,yy,w,yy+8);
    grad.addColorStop(0,'rgba(255,255,255,0)');grad.addColorStop(.18,'rgba(255,255,255,.04)');grad.addColorStop(.5,'rgba(255,255,255,.11)');grad.addColorStop(.82,'rgba(255,255,255,.04)');grad.addColorStop(1,'rgba(255,255,255,0)');
    ctx.strokeStyle=grad;ctx.lineWidth=7+i*.6;ctx.beginPath();
    for(let x=0;x<=w;x+=6){const y=yy+Math.sin(x/w*Math.PI*2*(1.2+i*.08)+t*.0012+i)*5+Math.cos(x/w*Math.PI*2*(2.4+i*.15)-t*.001+i)*2;x?ctx.lineTo(x,y):ctx.moveTo(x,y)}
    ctx.stroke();
  }
  ctx.restore();
}

function drawWaterBody(w,h,l,t){
  if(l<=0)return;
  const waterTop=h-h*l,amp=(3.2+5.5*splash)*(l>0&&l<1?1:0);
  const deepGrad=ctx.createLinearGradient(0,waterTop-10,0,h);
  deepGrad.addColorStop(0,'rgba(118,214,255,.95)');deepGrad.addColorStop(.12,'rgba(74,185,255,.96)');deepGrad.addColorStop(.42,'rgba(30,142,248,.97)');deepGrad.addColorStop(.75,'rgba(8,100,206,.98)');deepGrad.addColorStop(1,'rgba(4,67,146,.99)');
  fillWater(w,h,waterTop,t,amp,deepGrad);

  const haze=ctx.createLinearGradient(0,waterTop,0,waterTop+h*.22);
  haze.addColorStop(0,'rgba(255,255,255,.14)');haze.addColorStop(.45,'rgba(255,255,255,.04)');haze.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=haze;ctx.fillRect(0,waterTop,w,h-waterTop);
  strokeSurface(w,waterTop,t,amp);
  drawCaustics(w,h,waterTop,t);

  const sideShade=ctx.createRadialGradient(w*.18,h*.38,10,w*.5,h*.55,w*.72);
  sideShade.addColorStop(0,'rgba(255,255,255,0)');sideShade.addColorStop(.72,'rgba(0,0,0,0)');sideShade.addColorStop(1,'rgba(4,31,78,.14)');ctx.fillStyle=sideShade;ctx.fillRect(0,0,w,h);

  ctx.save();ctx.globalCompositeOperation='screen';
  particles.forEach(p=>{const px=(p.x+Math.sin(t*.00018+p.p)*.01)*w,py=waterTop+(h-waterTop)*p.y;if(py<waterTop+4)return;ctx.beginPath();ctx.arc(px,py,p.s,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${p.a})`;ctx.fill()});
  ctx.restore();

  bubbles.forEach(b=>{b.y-=b.s*(1+.8*l)*18;b.x+=Math.sin(t*.0008+b.p)*b.drift;if(b.y<-.03){b.y=1.05;b.x=Math.random();b.r=.8+Math.random()*4.2;b.alpha=.08+Math.random()*.18}if(b.x<-.05)b.x=1.02;if(b.x>1.05)b.x=-.02;const by=waterTop+(h-waterTop)*b.y;if(by<waterTop+10||by>h-8)return;ctx.save();ctx.globalAlpha=.8;ctx.beginPath();ctx.arc(b.x*w+Math.sin(t*.0006+b.p)*2.4,by,b.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${b.alpha})`;ctx.fill();ctx.beginPath();ctx.arc(b.x*w+Math.sin(t*.0006+b.p)*2.4-b.r*.25,by-b.r*.25,b.r*.35,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,.18)';ctx.fill();ctx.restore()});
}

function draw(tms){
  const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return requestAnimationFrame(draw);const t=Number(tms)||0;display+=(target-display)*.028;splash*=.958;ctx.clearRect(0,0,w,h);
  ctx.save();ctx.beginPath();ctx.arc(w/2,h/2,w/2-2,0,Math.PI*2);ctx.clip();
  const back=ctx.createRadialGradient(w*.33,h*.2,6,w*.54,h*.56,w*.7);back.addColorStop(0,'rgba(255,255,255,.76)');back.addColorStop(.22,'rgba(248,251,255,.48)');back.addColorStop(.5,'rgba(234,241,249,.42)');back.addColorStop(1,'rgba(215,227,239,.72)');ctx.fillStyle=back;ctx.fillRect(0,0,w,h);
  const l=Math.max(0,Math.min(1,display));drawWaterBody(w,h,l,t);
  const topGloss=ctx.createLinearGradient(0,0,0,h*.34);topGloss.addColorStop(0,'rgba(255,255,255,.62)');topGloss.addColorStop(.42,'rgba(255,255,255,.18)');topGloss.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=topGloss;ctx.fillRect(0,0,w,h*.34);
  const lowerGlass=ctx.createLinearGradient(0,h*.55,0,h);lowerGlass.addColorStop(0,'rgba(255,255,255,0)');lowerGlass.addColorStop(.55,'rgba(255,255,255,.05)');lowerGlass.addColorStop(1,'rgba(255,255,255,.13)');ctx.fillStyle=lowerGlass;ctx.fillRect(0,h*.55,w,h*.45);
  ctx.save();ctx.globalCompositeOperation='screen';ctx.fillStyle='rgba(255,255,255,.10)';ctx.beginPath();ctx.ellipse(w*.29,h*.22,w*.14,h*.08,-.55,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.ellipse(w*.68,h*.78,w*.16,h*.06,.25,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.restore();requestAnimationFrame(draw);
}
requestAnimationFrame(draw);render();
