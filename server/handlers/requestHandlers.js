var jwt = require('jsonwebtoken');

var dbHandlers = require("./dbHandlers");
var config = require("../config");
var util = require("./util");
var dataModel = require("./dataModel");

console.log("Request Handler Initialised , Loaded dependencies");

module.exports = {
	addUser: function(req, res) {
		console.log("REqHan :: Inside Add User call");
		dataModel.userDataModel(req.body.userData, function(modelErr, userData) {
			if(modelErr) return res.json(dataModel.errorResponse(modelErr));

			dbHandlers.addUser(userData, function(dberr, users) {
				if(dberr) return res.json(dataModel.errorResponse(dberr));

				res.json(dataModel.successResponse(users));
			});
		})
	},

	signin: function(req, res) {
		if(req.body.username) {
			dbHandlers.findUser({"username" : req.body.username}, function(dberr, userInfo) {
				if(dberr) return res.json(dataModel.errorResponse(dberr));
				if(!userInfo) return res.json(dataModel.errorResponse("UserNotFound"));
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
          				res.json({success: false, msg: 'Authentication failed. Validate username and passowrd'});
        			}
						
				});
			});
		} else {
			res.json(dataModel.errorResponse("Authentication failed. Validate username and passowrd"));
		}
	}

}