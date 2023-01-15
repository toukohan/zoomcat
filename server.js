const express = require("express");
const multer = require("multer");
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

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index", { msg: "Welcome", messages: [] });
});

app.post("/", upload.single("file"), (req, res) => {
  if (req.file) {
    res.render("index", { msg: "File uploaded", messages: [] });
  } else {
    res.render("index", { msg: "no file found", messages: [] });
  }
});

app.post("/search", (req, res) => {
  const query = req.body.query;
  const messages = search(query);
  res.render("index", { msg: "searched for: " + query, messages: messages });
});

let port = process.env.PORT || 3000;

app.listen(port, () => console.log("app listening at port", port));
