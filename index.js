//Requires
var express = require("express");
var bodyParser = require("body-parser");

//Execute express
var app = express()

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Load route files
var web_route = require("./routes/webRoutes");

//Overwrite routes
app.use("/api", web_route);

//Server port
var HTTP_PORT = 8081

//Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

//Root endpoint
app.get("/", (req, res, next) => {
  res.json({ "message": "Ok" })
});

//Default response for any other request
app.use(function (req, res) {
  res.status(404);
});