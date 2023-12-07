const today = new Date();
const day = today.toLocaleString('default', { weekday: 'long' });
const month = today.toLocaleString('default', { month: 'long' });
const date = today.getDate();
const year = today.getFullYear();
const dateElement = document.getElementById('date');
dateElement.innerHTML = `${day} ${month} ${date}, ${year}`;