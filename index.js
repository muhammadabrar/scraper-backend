const express = require("express");
const bodyParser = require("body-parser");
var multer = require("multer");
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();;
let SCRAP = require("./models/SCRAP");

const router = express.Router();


//initial app
const app = express();
const PORT = 8000;

// use cors
var cors = require("cors");
app.use(cors());

// inside public directory.
app.use("/public", express.static("public"));
app.use(express.static(process.cwd() + '/views'));
// use body-parser middleware
app.use(bodyParser.json());
router.get('/', (req, res) => {
  res.render('static/index');
});
//database=============================================================
const uri = process.env.mongodburi;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
//database=============================================================

// app.get("/", async (req, res) => {
//   SCRAP.find()
//     .then((SCRAP) => res.json(SCRAP))
//     .catch((err) => res.status(400).json("Error: " + err));
// });

app.get("/records", async (req, res) => {
  SCRAP.find()
    .then((SCRAP) => res.json(SCRAP))
    .catch((err) => res.status(400).json("Error: " + err));
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/", upload.array("files"), async function (req, res) {
  let data = req.body

  let files = []

  for (let i = 0; i < req.files.length; i++) {
 
 files.push(req.files[i].originalname)
    
  }
  data.Files = files

  // res.json({ msg: true, data: data })
  const postSCRAP = new SCRAP(data);
  await postSCRAP
    .save()
    .then(() => res.json({ msg: true, data: postSCRAP }))
    .catch((err) => res.status(400).json("Error: " + err));
});

app.put('/:id', (req, res) => {
  let data = req.body
  // console.log(data);
  console.log(req.params.id);
  SCRAP.findByIdAndUpdate(req.params.id, data)
    .then((item) => res.json(item))
    .catch((err) => res.status(500).json(err));
});

app.delete('/:id', (req, res) => {
  SCRAP.findByIdAndDelete(req.params.id)
    .then(() => res.json({ success: true }))
    .catch((err) => res.status(500).json(err));
});



// set port, listen for requests
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
