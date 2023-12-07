const sql = require("./db.utils.js");

const getCookie = (cname, cookies) => {
    let name = cname + "=";
    let ca = cookies.toString().split(';');
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


const cookieCheck = async (cookies) => {
    const token = await getCookie("login-token", cookies);
    if (!token) {
        return false;
    }

    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM users WHERE session = ?`, [token], (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            }

            if (res.length) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
};

module.exports = { cookieCheck, getCookie };