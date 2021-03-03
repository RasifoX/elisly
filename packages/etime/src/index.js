module.exports.toTurkish = ((timestamp) => {
  const formatNumber = ((number) => {
    if(number < 10) return (`0${number}`);
    else return number.toString();
  });

  const date = new Date(timestamp);
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]

  return (`${formatNumber(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()} ${days[date.getDay()]} ${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}:${formatNumber(date.getSeconds())}`);
});

module.exports.duration = ((timestamp) => {
  timestamp = Date.now() - timestamp;

  let seconds = (timestamp - (timestamp % 1000)) / 1000;
  let minutes = (seconds - (seconds % 60)) / 60;
  let hours = (minutes - (minutes % 60)) / 60;
  let days = (hours - (hours % 24)) / 24;
  let months = (days - (days % 30)) / 30;
  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  days = days % 30;

  const str = [];

  if(months) str.push(`${months} ay`);
  if(days) str.push(`${days} gün`);
  if(hours) str.push(`${hours} saat`);
  if(minutes) str.push(`${minutes} dakika`);
  if(seconds) str.push(`${seconds} saniye`);

  return str.join(" ");
});