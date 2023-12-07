const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require('cors');

const app = express();
const port = 3000;

const allowedOrigins = ['http://localhost:5500'];
app.use(cors(
  {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })); // Enable CORS for all routes

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "deadlinews",
});

db.connect((err) => {
  if (err) throw err;
  console.log("Database is connected successfully!");
});

const cookieCheck = async (req) => {
  const token = req["login-token"];
  if (!token) return false;

  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE session = ?", [token], (err, results) => {
      if (err) {
        return resolve(false);
      }

      if (results.length === 0) {
        return resolve(false);
      }

      resolve(true);
    });
  });
};

// list all articles
app.get("/articles", (req, res) => {
  db.query("SELECT * FROM articles", (err, results) => {
    if (err) res.status(500).json({message: err.message});
    res.status(200).json({message: "List of data", data: results});
  });
});

// get article by id
app.get("/articles/id", (req, res) => {
  try{
    let data = [];
    const id = req.query.params;
  
    if (!id) res.status(400).json({ message: "Missing id parameter" });
  
    db.query("SELECT * FROM articles WHERE id = ?", [id], (err, results) => {
      if (err || results.length < 1) return res.status(500).json({ message: err.message });
      data = results[0];
  
      db.query("SELECT username FROM users WHERE id = ?", [data.publisher_id], (err, results) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(200).json({ message: "Data by id", data: { ...data, publisher: results[0].username } });
      });
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});


//get first user to show connection
app.get("/", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) res.status(500).json({message: err.message});
    res.status(200).json({message: req.headers, data: results[0]});
  });
});

// login user
app.post("/login", (req, res) => {
  try{
    // Check if user is already logged in
    if (cookieCheck(req.headers.cookie)) {
      return res.redirect("http://localhost:5500/app/home");
    }

    // Check if request body is empty
    if (!req.body) {
      return res.status(400).send('Request body is undefined');
    }

    // Check if username or email is empty or invalid from database
    const { username, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [username],
    (err, results) => {
      // if invalid username or email return error
      if (err) return res.status(500).json({ message: err.message });

      // if username or email not found or password is wrong return error
      if (results.length < 1 || results[0].password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // create hashed token and save it to database
      const hashedToken = Math.random().toString(36);
      db.query("UPDATE users SET session = ? WHERE email = ?", [hashedToken, username], 
      (err) => {
        if (err) return res.status(500).json({ message: err.message });
      });

      // set cookie and redirect to home page
      res.cookie("login-token", hashedToken, { maxAge: 90000000, httpOnly: false, path: "/", secure: false });
      res.redirect("http://localhost:5500/app/home");
    });
  } catch (err) {
    return res.status(500).json(  { message: err.message });
  }
});

app.get("/validator", async (req, res) => {
  try {
    const token = req.headers["login-token"];
    // Check if user is already logged in
    const cookie = await cookieCheck({ "login-token": token });

    if (cookie) {
      return res.status(200).json({ message: "Token valid" });
    }

    return res.status(401).json({ message: "Token invalid" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
