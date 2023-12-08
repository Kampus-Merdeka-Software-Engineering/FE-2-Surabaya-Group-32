const model = require("../models/user.models.js");
const { cookieCheck } = require("../global.utils.js");

// User model
exports.findFirstUser = (req, res) => {
  model.getFirstUser((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving users.",
      });
    }

    res.send(data);
  });
};

exports.loginUser = async (req, res) => {
  if (await cookieCheck(req.headers.cookie)) {
    res.redirect("http://localhost:5500/app/home");
    return;
  }

  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "Username or password cannot be empty.",
    });
  }
  model.login(username, password, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          message: `Not found user with email ${username}.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving user with email ${username}.`,
        });
      }
      return;
    }
    const hashedToken = Math.random().toString(36);
    model.setToken(data[0].id, hashedToken, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(400).send({
            message: `Not found user with email ${username}.`,
          });
        } else {
          res.status(500).send({
            message: `Error retrieving user with email ${username}.`,
          });
        }
        return;
      }
      res.cookie("login-token", hashedToken, {
        maxAge: 90000000,
        httpOnly: false,
        path: "/",
        secure: false,
      });
      res.redirect("http://localhost:5500/app/home");
    });
  });
};

exports.logoutUser = async (req, res) => {
  if (!(await cookieCheck(req.headers.cookie))) {
    res.redirect("http://localhost:5500/app/login");
    return;
  }

  const token = req.headers.cookie["login-token"];
  model.logout(token, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          message: `Not found user with token ${token}.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving user with token ${token}.`,
        });
      }
      return;
    }
    res.clearCookie("login-token");
    res.redirect("http://localhost:5500/app/login");
  });
};

exports.validateUser = async (req, res) => {
  if (!(await cookieCheck(req.headers.cookie))) {
    res.status(200).send({ message: "Token Invalid" });
    return;
  }

  res.status(200).send({ message: "Token Valid" });
};
