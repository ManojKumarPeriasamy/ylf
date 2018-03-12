var requestHandlers = require("./handlers/requestHandlers");
var config = require("./config");

var passport = require('passport');
require('./handlers/passportAuth')(passport);
var jwt = require('jsonwebtoken');

var express = require("express");
var routes = express.Router();

console.log("App started initializing Routes");

routes.post("/createUser", passport.authenticate('jwt', { session: false}), requestHandlers.addUser); // passport.authenticate('jwt', { session: false}),
routes.post("/signin", requestHandlers.signin);
routes.post("/addInvestment", passport.authenticate('jwt', { session: false}), requestHandlers.addInvestment);
routes.post("/addIncome", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.addTransaction);
routes.post("/addExpense", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.addTransaction);

console.log("App Finished registering Routes");

module.exports = routes;
