(()=>{
  const thresholds={
    crabPasser:10,
    octopusPasser:20,
    tangPasser:30,
    clownfishPasser:40,
    pufferPasser:50,
    pinkFishPasser:50,
    whaleSharkPasser:60,
    diverPasser:70,
    turtlePasser:80,
    penguinPasser:90,
    bottlePasser:95
  };

  function completedCount(){
    try{
      const st=JSON.parse(localStorage.getItem('100days-state-v1')||'{}');
      const dates=Array.isArray(st.completedDates)?st.completedDates:[];
      return Math.min(100,new Set(dates).size);
    }catch{return 0}
  }

  function apply(){
    const done=completedCount();
    for(const [id,threshold] of Object.entries(thresholds)){
      const el=document.getElementById(id);
      if(!el)continue;
      let shouldShow=done>=threshold;
      if(id==='bottlePasser'&&window.BottleLetters){
        shouldShow=shouldShow&&window.BottleLetters.isAvailable(done);
      }
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
