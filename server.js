var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var passport = require('passport');

var routes = require("./server/route");

// config
var config = require("./server/config");

var app = express();

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

// Dist Folder Reference
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use("/api/json", routes);

app.get("*", function(req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(config.port, function(){
	console.log("YLaitFarm Application server started and running on port -- " + config.port);
});


