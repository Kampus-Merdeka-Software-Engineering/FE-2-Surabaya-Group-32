//cek reveal password
const cekPassword = document.getElementById('cek-password');
const passwordForm = document.getElementById('passwordForm');
let va = true;
cekPassword.addEventListener('click', () => {
    if (va) {
        passwordForm.type = 'text';
        cekPassword.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        va = false;
    } else {
        passwordForm.type = 'password';
        cekPassword.innerHTML = '<i class="fa-solid fa-eye"></i>';
        va = true;
    }
});

// show today datetime
const today = new Date();
const day = today.toLocaleString('default', { weekday: 'long' });
const month = today.toLocaleString('default', { month: 'long' });
const date = today.getDate();
const year = today.getFullYear();
const dateElement = document.getElementById('date');
dateElement.innerHTML = `${day} ${month} ${date}, ${year}`;

// get cookie
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        } 
    }
    return "";
  }


// validate login
const checkLogin = async () => {
    try {
        const response = await fetch('http://localhost:3000/validator', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'login-token': getCookie('login-token'),
            },
            credentials: 'include',
        });
        const data = await response.json();
        if (data.message === 'Token Valid') {
            return window.location.replace("/app/home");
        }
        return;
    } catch (error) {
        console.error("Error:", error);
    }
}
checkLogin();