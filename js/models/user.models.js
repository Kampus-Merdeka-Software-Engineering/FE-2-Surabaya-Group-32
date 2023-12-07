const sql = require('../db.utils.js');

const User = function (user) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.session = user.session;
    this.admin = user.admin;
    this.created_at = user.created_at;
}

User.getFirstUser = result => {
    sql.query("SELECT * FROM users LIMIT 1", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("users: ", res);
        result(null, res);
    });
}

User.login = (email, password, result) => {
    if (!email || !password) {
        result({ kind: "not_found" }, null);
        return;
    }
    sql.query(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("users: ", res);
        result(null, res);
    });
}

User.logout = (id, result) => {
    sql.query(`UPDATE users SET session = NULL WHERE id = ?`, [id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("users: ", res);
        result(null, res);
    });
}

User.setToken = (id, token, result) => {
    sql.query(`UPDATE users SET session = ? WHERE id = ?`, [token, id], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("users: ", res);
        result(null, res);
    });
}

module.exports = User;