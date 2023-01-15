const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3");
const bcrypt = require("bcryptjs");

const db = require("./db");
const search = require("./search");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const time = Date.now();
    cb(null, file.fieldname + time + ".txt");
  },
});
const upload = multer({ storage: storage });

const app = express();

//setting up ejs
app.set("view engine", "ejs");
// public folder
app.use(express.static("public"));
// url encoding to deal with the form data
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index", { msg: "", messages: [] });
});

app.get("/register", (req, res) => {
  res.render("register", { msg: "" });
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  db.get("SELECT * FROM users WHERE username=?", [username], (err, row) => {
    if (err) {
      console.error(err);
      res.render("register", { msg: "There was an error." });
    }
    if (row) {
      res.render("register", { msg: "Username already exists" });
    } else {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(req.body.password, salt);
      db.run(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hash],
        (err) => {
          if (err) {
            console.error(err);
            res.render("register", { msg: "There was an error saving data" });
          } else {
            res.render("login", {
              msg: "Registered successfully. Login please.",
            });
          }
        }
      );
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login", { msg: "" });
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err) {
      console.error(err);
      res.render("login", { msg: "There was an error retrieving user" });
    }
    if (!row) {
      res.render("login", { msg: "No such user found." });
    } else {
      if (bcrypt.compareSync(req.body.password, row.password)) {
        res.render("index", { msg: "Login succesful", messages: [] });
      } else {
        res.render("login", { msg: "Password doesn't match" });
      }
    }
  });
});

app.post("/", upload.array("files"), (req, res) => {
  if (req.files) {
    res.render("index", { msg: "File uploaded", messages: [] });
  } else {
    res.render("index", { msg: "", messages: [] });
  }
});

app.post("/search", (req, res) => {
  const query = req.body.query;
  const messages = search(query);
  res.render("index", {
    msg: "searched for: " + query,
    messages: messages,
  });
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log("app listening at port", port));
