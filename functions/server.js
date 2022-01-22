const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");

require('dotenv').config()
const router = express.Router();


app.use("/static", express.static('src/public/static'))
app.set('trust proxy', 1)
app.enable('trust proxy')
app.use(express.json())


const whitelist = ["http://localhost:4000", "https://rasel-code-dev.github.io"]
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
  // call this func when local server read ts file...
  // const routes = require("../src/routes")
  // routes(app)
} else {


  
  // call this lambda function
  const postRoutes = require("../dist/routes")
  postRoutes(router) 
}


router.get('/', (req, res) => {
  res.send("hi")
});



app.use(bodyParser.json());
app.use('/.netlify/functions/server', router);  // path must route to lambda



module.exports = app;
module.exports.handler = serverless(app);
