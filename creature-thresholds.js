(()=>{
  const thresholds={
    crabPasser:10,
    octopusPasser:20,
    tangPasser:30,
    clownfishPasser:40,
    pufferPasser:50,
    whaleSharkPasser:60,
    diverPasser:70,
    turtlePasser:80,
    penguinPasser:90,
    bottlePasser:95
  };

  function currentDay(){
    if(typeof getCrabElapsedDay==='function') return getCrabElapsedDay();
    try{
      const st=JSON.parse(localStorage.getItem('100days-state-v1')||'{}');
      const t=Number(st.testDay);
      if(Number.isInteger(t)&&t>=1&&t<=100)return t;
      const start=(st.startDate||new Date().toLocaleDateString('sv-SE'))+'T00:00:00';
      const today=new Date().toLocaleDateString('sv-SE')+'T00:00:00';
      return Math.max(1,Math.floor((new Date(today)-new Date(start))/86400000)+1);
    }catch{return 1}
  }

  function apply(){
    const day=currentDay();
    for(const [id,threshold] of Object.entries(thresholds)){
      const el=document.getElementById(id);
      if(!el)continue;
      const shouldShow=day>=threshold;
      if(el.classList.contains('show')!==shouldShow){
        el.classList.toggle('show',shouldShow);
      }
    }
  }

  const boot=()=>{
    apply();
    const observer=new MutationObserver(()=>queueMicrotask(apply));
    observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    setInterval(apply,200);
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
