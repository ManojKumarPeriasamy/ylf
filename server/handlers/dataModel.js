var util = require("./util");

module.exports = {
	userDataModel: function(data, cb) {
		var userData = {
			username: data.username,
			password: data.password,
			role: data.role,
			countrycode: data.countrycode,
			phoneNumber: data.phoneNumber,
			emailID : data.emailID,
			preferenceFirstLoad : data.firstLoad,
			alertType: data.alertType,
			dateCreated: util.getCurrentDate()
		}

		userData.password = util.hashPassword(data.password, function(err, password){
			if(err) cb(err);
			userData.password = password;
			cb(null, userData);
		});
	},
	investmentDataModel: function(data) {
		var investmentData = {

		}
		return investmentData;
	},
	expenditureDataModel: function(data) {
		var expenditureData = {

		}
		return expenditureData;
	},
	incomeDataModel: function(data) {
		var incomeData = {

		}
		return incomeData;
	},
	milkDataModel: function(data) {
		var milkData = {

		}
		return milkData;
	},
	errorResponse: function(error) {
		console.log("Error on request -- " + error);
		return {
			success: false,
			status: "failure",
			reason: error
		}
	},
	successResponse: function(data) {
		console.log("Data fetched on request -- " + data);
		return {
			success: true,
			status: "success",
			data: data
		}
	}
}