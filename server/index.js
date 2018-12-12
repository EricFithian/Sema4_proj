const express = require("express");
const mongoURI = "mongodb://localhost/semaProjDatabase";
const mongoose = require("mongoose");
const connectOptions = {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
};
const bodyParser = require("body-parser");
const constants = require("./config/constants");

mongoose.Promise = global.Promise;
mongoose.set("debug", true);
mongoose.connect(constants.mongoURI, {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE
});

require("./models/UrlShorten");

const app = express();

app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,x-access-token,X-Key"
  );
  if (req.method == "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
});

require("./routes/UrlShorten")(app);

const PORT = 8000;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started on port`, PORT);
});