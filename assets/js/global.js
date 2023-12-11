const today = new Date();
const day = today.toLocaleString('default', { weekday: 'long' });
const month = today.toLocaleString('default', { month: 'long' });
const date = today.getDate();
const year = today.getFullYear();
document.getElementById('date').innerHTML = `${day} ${month} ${date}, ${year}`;