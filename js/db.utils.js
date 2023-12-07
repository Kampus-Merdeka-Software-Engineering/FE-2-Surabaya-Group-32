const mysql = require("mysql");

var connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "deadlinews",
  });
  
  module.exports = connection;