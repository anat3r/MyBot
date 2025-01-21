function getToday(){
  return new Date().toUTCString().slice(5, -18);
}

function getDate(promt){
/*   let day, month = 0;
  try{
    month = Number.parseInt(promt.split('.')[1]) - 1;
    day = Number.parseInt(promt.split('.')[0]);
  } catch(e){
    console.log(e);
  }
  return new Date(2015, month, day).toUTCString().slice(5, -18); */
}

function readDate(message){
/*   let arg = ctx.match.trim();
  if (arg && arg.length == 5 && Number.parseInt(arg.split('.')[0]) && Number.parseInt(arg.split('.')[1])){
    return getDate(arg);
  } else{
    return null;
  } */
  let month, day;
  try {
    month = Number.parseInt(message.split('.')[1]) - 1;
    day = Number.parseInt(message.split('.')[0]);
  } catch (e) {
    console.log(e);
  }
  return (month & day) ? new Date(2015, month, day).toUTCString().slice(5, -18) : null;

}
