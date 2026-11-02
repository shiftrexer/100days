(()=>{
  let observed=null;
  const apply=()=>{
    const el=document.getElementById('clownfishPasser');
    if(!el)return;
    if(el.style.getPropertyValue('top')!=='72%' || el.style.getPropertyPriority('top')!=='important'){
      el.style.setProperty('top','72%','important');
    }
    if(observed!==el){
      observed=el;
      new MutationObserver(()=>{
        if(el.style.getPropertyValue('top')!=='72%' || el.style.getPropertyPriority('top')!=='important'){
          el.style.setProperty('top','72%','important');
        }
      }).observe(el,{attributes:true,attributeFilter:['style']});
    }
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',apply,{once:true}); else apply();
  setInterval(apply,500);
})();
