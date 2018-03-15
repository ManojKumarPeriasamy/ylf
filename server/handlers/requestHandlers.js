var jwt = require('jsonwebtoken');

var dbHandlers = require("./dbHandlers");
var config = require("../config");
var util = require("./util");
var dataModel = require("./dataModel");

console.log("Request Handler Initialised , Loaded dependencies");

module.exports = {
	addUser: function(req, res) {
		console.log("ReqHan :: Inside Add User call");
		dataModel.userDataModel(req.body.userData, function(modelErr, userData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}

			dbHandlers.addUser(userData, function(dberr, users) {
				if(dberr) {
					res.json(dataModel.errorResponse(dberr));
					return;
				}

				res.json(dataModel.successResponse(users));
			});
		})
	},

	signin: function(req, res) {
		if(req.body.username) {
			console.log("ReqHan :: signin call initiated for user " + req.body.username);
			dbHandlers.findUser({"_id" : req.body.username.toLowerCase()}, function(dberr, userInfo) {
				if(dberr) {
					res.json(dataModel.errorResponse("Something went wrong, Please try again later"));
					return;
				} else if(!userInfo) {
					res.json(dataModel.errorResponse("Authentication failed. please check username and password"));
					return;
				}
				util.comparePassword(req.body.password, userInfo.password, function(err, isMatch) {
					console.log(userInfo);
					if (isMatch && !err) {
						delete userInfo.password;
          				// if user is found and password is right create a token
          				var token = jwt.sign(userInfo, config.secret);
          				// return the information including token as JSON
          				var response = {
          					token: 'JWT ' + token
          				}
          				res.json(dataModel.successResponse(response));
        			} else {
          				res.json(dataModel.errorResponse("Authentication failed. please check username and password"));
        			}
						
				});
			});
		} else {
			res.json(dataModel.errorResponse("Authentication failed. please check username and passowrd"));
		}
	},

	addInvestment: function(req, res) {
		console.log("ReqHan :: Inside Add Investment call");
		dataModel.investmentDataModel(req.body.investmentData, function(modelErr, investmentData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}

			dbHandlers.addTransaction(investmentData, function(dberr, response) {
				if(dberr) {
					res.json(dataModel.errorResponse(dberr));
					return;
				}

				res.json(dataModel.successResponse(response));
			});
		})
	},

	addTransaction: function(req, res) {
		console.log("ReqHan :: Inside Add Transaction call");
		dataModel.transactionDataModel(req.body.transactionData, function(modelErr, transactionData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}

			dbHandlers.addTransaction(transactionData, function(dberr, response) {
				if(dberr) {
					res.json(dataModel.errorResponse(dberr));
					return;
				}

				res.json(dataModel.successResponse(response));
			});
		})
	},

	addProduct: function(req, res) {
		console.log("ReqHan :: Inside Add product entry call");
		dataModel.productDataModel(req.body.productEntry, function(modelErr, productEntry) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}

			dbHandlers.addProduct(productEntry, function(dberr, response) {
				if(dberr) {
					res.json(dataModel.errorResponse(dberr));
					return;
				}

				res.json(dataModel.successResponse(response));
			});
		})
	}

}