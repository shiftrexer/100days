function undoCurrentDay(){
  const today=iso();
  if(!state.completedDates.includes(today)){
    toast('この日は実施済みではありません');
    return;
  }
  state.completedDates=state.completedDates.filter(d=>d!==today);
  save();
  render();
  toast('この日の実施を取り消しました');
}
$('#undoTodayBtn').onclick=undoCurrentDay;

if(typeof drawCaustics==='function'){
  drawCaustics=()=>{};
}
