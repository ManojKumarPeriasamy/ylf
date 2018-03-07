var requestHandlers = require("./handlers/requestHandlers");
var config = require("./config");

var passport = require('passport');
require('./handlers/passportAuth')(passport);
var jwt = require('jsonwebtoken');

var express = require("express");
var routes = express.Router();

console.log("App started initializing Routes");

routes.post("/createUser", requestHandlers.addUser); // passport.authenticate('jwt', { session: false}),
routes.post("/signin", requestHandlers.signin);

console.log("App Finished registering Routes");

module.exports = routes;
