module.exports = ((timestamp) => {
  const formatNumber = ((number) => {
    if(number < 10) return (`0${number}`);
    else return number.toString();
  });

  const date = new Date(timestamp);
  const months = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
  const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"]

  return (`${formatNumber(date.getDate())} ${months[date.getMonth()]} ${date.getFullYear()} ${days[date.getDay()]} ${formatNumber(date.getHours())}:${formatNumber(date.getMinutes())}:${formatNumber(date.getSeconds())}`);
});
