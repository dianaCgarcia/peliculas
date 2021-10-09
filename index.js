//Requires
var express = require("express");
var bodyParser = require("body-parser");
var db = require("./database.js");

//Execute express
var app = express()

//Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Load route files
var user_route = require('./routes/userRoutes');

//Overwrite routes
app.use('/api', user_route);

/* ---------------------------------------------------------------- */
/* -------------------Begin Server Configuration------------------- */
/* ---------------------------------------------------------------- */

//Server port
var HTTP_PORT = 8080
//Start server
app.listen(HTTP_PORT, () => {
  console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

/* -------------------------------------------------------------- */
/* -------------------End Server Configuration------------------- */
/* -------------------------------------------------------------- */


/* ----------------------------------------------------- */
/* -------------------Begin Endpoints------------------- */
/* ----------------------------------------------------- */

//Root endpoint
app.get("/", (req, res, next) => {
  res.json({ "message": "Ok" })
});

/* --------------------------------------------------- */
/* -------------------End Endpoints------------------- */
/* --------------------------------------------------- */

//Default response for any other request
app.use(function (req, res) {
  res.status(404);
});
