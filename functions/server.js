const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require("path");
const ejs = require('ejs');
const {readdir} = require("fs/promises");
// const {readdir} = require("fs/promises");

require('dotenv').config()
const router = express.Router();


app.set('trust proxy', 1)
app.enable('trust proxy')
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))

app.set('view engine', 'ejs');
app.set('views', path.resolve("src/views"));


const whitelist = process.env.FRONTEND.split("+")
// const whitelist = ["http://localhost:5500", "http://localhost:5500/my-blog/", "https://rasel-code-dev.github.io"]

const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      // callback(null, true)
      // console.log(origin)
      callback(null, false)
      // callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(cors(corsOptions))


if(process.env.NODE_ENV === "development"){
  /// static file serve dist/static directory
  // app.use("/static", express.static( path.resolve("src/static")))
  // call this func when local server read ts file...
  // const routes = require("../src/routers")
  // routes(app)
  
} else {
  // when use lambda function
  app.use("/.netlify/functions/server/static", express.static( path.resolve("src/static")))
  app.use("/static", express.static( path.resolve("src/static")))
  
  // const routers = require("../dist/routers")
  
  // app object not gonna work when use server less function
  // routers(router)
}

app.get("/", async (req, res)=>{
  try {
    let d = await readdir(path.join(__dirname, "..", "functions"))
    console.log(d)
    res.send({d: d})

  } catch (ex){
    res.send(ex.message)
  }
})

app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda


module.exports = app;
module.exports.handler = serverless(app);
