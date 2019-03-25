// server.js
const path = require('path');
const express = require('express');

const app = express();
// Run the app by serving the static files
// in the dist directory
const staticPath = path.join(__dirname, '/dist');

app.use(express.static(staticPath), function (req, res, next) {
  // this will redirect a user if url is input manually so that angular's routing can take over
  if (/\/.*$/.test(req.url)) {
    res.sendFile(staticPath + '/index.html');
  } else {
    next();
  }
});

// Start the app by listening on the default
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", function(){
  console.log("Lising port: " + port);
});
