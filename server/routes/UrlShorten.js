const mongoose = require("mongoose");
const validUrl = require("valid-url");
const UrlShorten = mongoose.model("UrlShorten");
const constants = require("../config/constants");
const shortCode = require("../middlewares/uniqueUrlCode");
const path = require("path");

module.exports = app => {

  // This was just to test if the server is running properly. Next I'll test if the APIs are working properly for GET and POST requests.
  app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../client/public', 'index.html'));
  });

  app.get("/api/item/:code", async (req, res) => {
    const urlCode = req.params.code;
    const item = await UrlShorten.findOne({ urlCode: urlCode });
    if (item) {
      return res.redirect(item.originalUrl);
    } else {
      return res.redirect(constants.errorUrl);
    }
  });

  app.post("/api/item", async (req, res) => {
    const { shortBaseUrl, originalUrl } = req.body;
    if (validUrl.isUri(shortBaseUrl)) {
    } else {
      return res.status(404).json("Please enter this in the correct URL format");
    }
    const urlCode = shortCode.generate();
    const updatedAt = new Date();
    if (validUrl.isUri(originalUrl)) {
      try {
        const item = await UrlShorten.findOne({ originalUrl: originalUrl });
        if (item) {
          res.status(200).json(item);
        } else {
          shortUrl = shortBaseUrl + "/" + urlCode;
          const item = new UrlShorten({
            originalUrl,
            shortUrl,
            urlCode,
            updatedAt
          });
          await item.save();
          res.status(200).json({
            originalUrl,
            shortUrl,
            urlCode,
            updatedAt
          });
        }
      } catch (err) {
        res.status(401).json("This is not a valid ID");
      }
    } else {
      return res.status(401).json("Please enter a valid URL");
    }
  });
};