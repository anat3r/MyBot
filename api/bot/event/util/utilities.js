/**
 * Get current day and month
 *
 * @returns {Array<Number, String>} Array with current day and month, in format [Day, Month].
 */

export function getToday(){
  return new Date().toUTCString().toLowerCase().slice(5, -18).split(' ');
}

export function readDate(message){
  message = message.trim();
  let month, day;
  try {
    month = Number.parseInt(message.split('.')[1]) - 1;
    day = Number.parseInt(message.split('.')[0]);
  } catch (e) {
    console.log(e);
  }
  return (month & day) ? new Date(2015, month, day).toUTCString().slice(5, -18) : null;

}
