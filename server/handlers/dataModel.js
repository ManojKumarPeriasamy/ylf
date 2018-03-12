var util = require("./util");

module.exports = {
	userDataModel: function(data, cb) {
		var userData = {};
		var errCount = 0;

		if(util.validateName(data.username)) {
			userData._id = data.username.toLowerCase();
			userData.username = data.username;
		} else {
			errCount++;
		}
		//util.validatePassword(data.password) ? userData.password = data.password : errCount++;
		util.validateRole(data.role) ? userData.role = data.role.toLowerCase() : errCount++;
		util.validateCountryCode(data.countryCode) ? userData.countryCode = data.countryCode : errCount++;
		util.validatePhoneNumber(data.phoneNumber) ? userData.phoneNumber = data.phoneNumber : errCount++;
		util.validateEmail(data.emailID) ? userData.emailID = data.emailID : errCount++;

		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		}

		userData.password = util.setInitialPassword(userData.username, userData.role);
		userData.alertType = util.setAlertType();
		userData.preferencePage = util.setPreferencePage(userData.role);
		userData.dateCreated = util.getCurrentDate();
		userData.password = util.hashPassword(userData.password, function(err, password){
			if(err) cb(err);
			userData.password = password;
			cb(null, userData);
		});
	},
	investmentDataModel: function(data, cb) {
		var investmentData = {
			majorType: "Investment",
			remarks: data.remarks.toString()
		}
		var errCount = 0, dateErrorCount = 0;

		util.validateString(data.name) ? investmentData.name = data.name : errCount++;
		util.validateString(data.purpose) ? investmentData.purpose = data.purpose : errCount++;
		util.validateInvestmentType(data.type) ? investmentData.type = data.type : errCount++;
		util.validateDefaultNumber(data.amount) ? investmentData.amount = data.amount : errCount++;
		util.validateDate(data.eventOn) ? investmentData.eventOn = data.eventOn : dateErrorCount++;

		if(data.type != "Own Investment") {
			var loanDetails = {
				loanStatus: 'Active',
				emiDetails : {
					isInterestOnly: data.loanDetail.emiDetails.isInterestOnly,
					user: data.loanDetail.emiDetails.userToRemind,
					remindBefore: data.loanDetail.emiDetails.remindBefore
				}
			}
			util.validateDefaultNumber(data.loanDetail.amountBalance) ? loanDetails.amountBalance = data.loanDetail.amountBalance : errCount++;
			util.validateDefaultNumber(data.loanDetail.emiDetails.term) ? loanDetails.emiDetails.term = data.loanDetail.emiDetails.term : errCount++;
			util.validateDefaultNumber(data.loanDetail.emiDetails.amount) ? loanDetails.emiDetails.amount = data.loanDetail.emiDetails.amount : errCount++;
			util.validateDate(data.loanDetail.emiDetails.eventOn) ? loanDetails.emiDetails.eventOn = data.loanDetail.emiDetails.eventOn : dateErrorCount++;
		}

		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}
		investmentData.dateCreated = util.getCurrentDate();
		if(loanDetails) investmentData.loanDetails = loanDetails;

		cb(null, investmentData);
	},
	transactionDataModel: function(data, cb) {
		var transactionData = {
			majorType: data.transactionType,
			remarks: data.remarks
		}
		var errCount = 0, dateErrorCount = 0;

		transactionData.type = (data.transactionType === 'Income' ? data.incomeType : data.expenseType);

		util.validateDefaultNumber(data.amount) ? transactionData.amount = data.amount : errCount++;
		util.validateString(data.name) ? transactionData.name = data.name : errCount++;
		util.validateDate(data.eventOn) ? transactionData.eventOn = data.eventOn : dateErrorCount++;
		
		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}

		cb(null, transactionData);
	},
	milkDataModel: function(data) {
		var milkData = {
			entryType: "milk",
			type: "<incoming/outgoing>",
			name: "",
			eventOn: {
				date:"",
				month:"",
				year:"",
				day: "",
				session: "<Morning/Evening>"
			},
			noOfLitres: 0,
			pricePerLitre: 20,
			totalAmount: 0,
			fatContent: "",
			remarks: ""
		}
		return milkData;
	},
	tractorDataModel: function(data) {
		var tractorData = {
			entryType: "tractor",
			type: "<incoming/outgoing>",
			name: "",
			phoneNumber: "",
			address: {
				streetName: "",
				place: "",
				city: "",
				state: "",
				zip: ""
			},
			jobUnits: "",
			costPerUnit: "",
			noOfRolls: "",
			costPerRoll: "",
			totalCost: "",
			driverExpense: ""
		}
		return tractorData;
	},
	errorResponse: function(error) {
		console.log("Data Model :: Error on request -- " + error);
		return {
			success: false,
			status: "failure",
			reason: error
		}
	},
	successResponse: function(data) {
		console.log("Data Model :: Data fetched for request");
		return {
			success: true,
			status: "success",
			data: data
		}
	}
}