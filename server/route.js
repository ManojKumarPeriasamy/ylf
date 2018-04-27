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
routes.post("/addIncome", passport.authenticate('jwt', { session: false}), requestHandlers.addTransaction);
routes.post("/addExpense", passport.authenticate('jwt', { session: false}), requestHandlers.addTransaction);
routes.post("/addProduct", passport.authenticate('jwt', { session: false}), requestHandlers.addProduct);

routes.get("/getMilkDetails", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.getMilkDetails);
routes.get("/getTractorDetails", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.getTractorDetails);
routes.get("/getTransactionDetails", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.getTransactionDetails);
routes.get("/getInvestmentDetails", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.getInvestmentDetails);

routes.get("/getProductById", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.getProductById);
routes.get("/getTransactionById", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.getTransactionById);

routes.post("/updateMilkProduct", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.updateMilkProduct);
routes.post("/updateTractorData", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.updateTractorData);
//routes.post("/updateTrasactionDetail", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.updateTrasactionDetail);
//routes.post("/updateInvestmentDetail", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.updateInvestmentDetail);

routes.get("/deleteProductById", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.deleteProductById);
routes.get("/deleteTransactionById", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.deleteTransactionById);

/** Image Upload **/
routes.post("/uploadBill",  requestHandlers.uploadBill);
routes.get("/getBillImage/:billName", requestHandlers.getBillImage);
routes.get("/deleteBillImage/:billName", requestHandlers.deleteBillImage);

/** CustomerData **/
routes.post("/addCustomerData", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.addCustomer);
routes.get("/getCustomers", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.getCustomers);

/** Investor Data **/
routes.post("/addInvestorData", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.addInvestor);
routes.get("/getInvestors", /*passport.authenticate('jwt', { session: false}),*/ requestHandlers.getInvestors)

console.log("App Finished registering Routes");

module.exports = routes;
