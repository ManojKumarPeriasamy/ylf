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
			category: data.category,
			remarks: data.remarks ? data.remarks.toString() : ''
		}
		var errCount = 0, dateErrorCount = 0;

		util.validateString(data.name) ? investmentData.name = data.name : errCount++;
		util.validateString(data.purpose) ? investmentData.purpose = data.purpose : errCount++;
		util.validateInvestmentType(data.type) ? investmentData.type = data.type : errCount++;
		util.validateDefaultNumber(data.amount) ? investmentData.amount = parseFloat(data.amount) : errCount++;
		util.validateDate(data.eventOn) ? investmentData.eventOn = data.eventOn : dateErrorCount++;

		if(data.type != "Own Investment") {
			var loanDetails = {
				loanStatus: 'Active',
				totalLoanAmountPaid: 0,
				emiDetails : {
					isInterestOnly: data.loanDetail.emiDetails.isInterestOnly,
					userToRemind: data.loanDetail.emiDetails.userToRemind,
					remindBefore: data.loanDetail.emiDetails.remindBefore,
					termsEMIPaid: 0
				}
			}
			util.validateDefaultNumber(data.loanDetail.totalRepayAmount) ? loanDetails.totalRepayAmount = data.loanDetail.totalRepayAmount : errCount++;
			util.validateDefaultNumber(data.loanDetail.emiDetails.term) ? loanDetails.emiDetails.term = data.loanDetail.emiDetails.term : errCount++;
			util.validateDefaultNumber(data.loanDetail.emiDetails.amount) ? loanDetails.emiDetails.amount = data.loanDetail.emiDetails.amount : errCount++;
			util.validateDate(data.loanDetail.emiDetails.eventOn) ? loanDetails.emiDetails.eventOn = data.loanDetail.emiDetails.eventOn : dateErrorCount++;

			loanDetails.emiDetails.nextEMIDueDate = loanDetails.emiDetails.eventOn;
		}

		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}

		investmentData.eventOn.fullDate = util.momentFullDate(investmentData.eventOn);
		investmentData.dateCreated = util.getCurrentDate();
		if(loanDetails) {
			loanDetails.emiDetails.eventOn.fullDate = util.momentFullDate(loanDetails.emiDetails.eventOn);
			investmentData.loanDetails = loanDetails;
		}

		cb(null, investmentData);
	},
	transactionDataModel: function(data, cb) {
		var transactionData = {
			majorType: data.transactionType,
			remarks: data.remarks ? data.remarks.toString() : ''
		}
		var errCount = 0, dateErrorCount = 0;

		if(data.transactionType === 'Income') {
			transactionData.type = data.incomeType;
			transactionData.category = data.incomeCategory;
		} else {
			transactionData.type = data.expenseType;
			transactionData.category = data.expenseCategory;
			transactionData.totalExpense = data.totalExpense;
			transactionData.billAttachment = data.billAttachment;
		}

		util.validateDefaultNumber(data.amount) ? transactionData.amount = parseFloat(data.amount) : errCount++;
		
		util.validateString(data.name) ? transactionData.name = data.name : errCount++;
		util.validateDate(data.eventOn) ? transactionData.eventOn = data.eventOn : dateErrorCount++;
		
		transactionData.dateCreated = util.getCurrentDate();

		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}
		transactionData.eventOn.fullDate = util.momentFullDate(transactionData.eventOn);
		cb(null, transactionData);
	},
	productDataModel: function(data, cb) {
		var productData = {
			product: data.product,
			fatContent: data.fatContent,
			remarks: data.remarks ? data.remarks.toString() : ''
		}
		var errCount = 0, dateErrorCount = 0;

		util.validateString(data.name) ? productData.name = data.name : errCount++;
		util.validateDate(data.eventOn) ? productData.eventOn = data.eventOn : dateErrorCount++;

		if(productData.product === 'Milk') {
			productData.entryType = data.entryType;
			productData.time = data.time;
			util.validateDefaultNumber(data.litres) ? productData.litres = data.litres : errCount++;
			util.validateDefaultNumber(data.pricePerLitre) ? productData.pricePerLitre = data.pricePerLitre : errCount++;
			util.validateDefaultNumber(data.amount) ? productData.amount = parseFloat(data.amount) : errCount++;
			//util.validateDefaultNumber(data.fatContent) ? productData.fatContent = data.fatContent : errCount++;
		} else if (productData.product === 'Tractor') {
			productData.jobType = data.jobType;
			productData.address = data.address;
			productData.driverName = data.driverName;
			util.validateDefaultNumber(data.driverExpense) ? productData.driverExpense = data.driverExpense : errCount++;
			util.validateDefaultNumber(data.startingUnit) ? productData.startingUnit = data.startingUnit : errCount++;
			util.validateDefaultNumber(data.endingUnit) ? productData.endingUnit = data.endingUnit : errCount++;
			util.validateDefaultNumber(data.totalUnits) ? productData.totalUnits = data.totalUnits : errCount++;
			util.validatePhoneNumber(data.phone) ? productData.phone = data.phone : errCount++;
			if(productData.jobType == 'Plough') {
				util.validateDefaultNumber(data.chargeableUnits) ? productData.chargeableUnits = data.chargeableUnits : errCount++;
				util.validateDefaultNumber(data.costPerUnit) ? productData.costPerUnit = data.costPerUnit : errCount++;
			} else if (productData.jobType == 'Grass Baler') {
				util.validateDefaultNumber(data.noOfRolls) ? productData.noOfRolls = data.noOfRolls : errCount++;
				util.validateDefaultNumber(data.costPerRoll) ? productData.costPerRoll = data.costPerRoll : errCount++;
			}
			util.validateDefaultNumber(data.amount) ? productData.amount = parseFloat(data.amount) : errCount++;
		}
		productData.dateCreated = util.getCurrentDate();
		
		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}
		productData.eventOn.fullDate = util.momentFullDate(productData.eventOn);

		cb(null, productData);
	},
	verifyUpdateMilkData: function(data, cb) {
		var errCount = 0, dateErrorCount = 0;

		var editMilkData = {
			fatContent: data.fatContent,
			remarks: data.remarks ? data.remarks.toString() : ''
		}

		util.validateDefaultNumber(data.litres) ? editMilkData.litres = data.litres : errCount++;
		util.validateDefaultNumber(data.pricePerLitre) ? editMilkData.pricePerLitre = data.pricePerLitre : errCount++;
		util.validateDefaultNumber(data.amount) ? editMilkData.amount = parseFloat(data.amount) : errCount++;
		//util.validateDefaultNumber(data.fatContent) ? editMilkData.fatContent = data.fatContent : errCount++;
		util.validateDate(data.eventOn) ? editMilkData.eventOn = data.eventOn : dateErrorCount++;

		editMilkData.updatedOn = util.getCurrentDate();

		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}
		editMilkData.eventOn.fullDate = util.momentFullDate(editMilkData.eventOn);

		cb(null, editMilkData);
	},
	verifyUpdateTractorData: function(data, cb) {
		var errCount = 0, dateErrorCount = 0;

		var editTractorData = {
			address: data.address,
			remarks: data.remarks ? data.remarks.toString() : ''
		}

		util.validateDefaultNumber(data.startingUnit) ? editTractorData.startingUnit = data.startingUnit : errCount++;
		util.validateDefaultNumber(data.endingUnit) ? editTractorData.endingUnit = data.endingUnit : errCount++;
		util.validateDefaultNumber(data.totalUnits) ? editTractorData.totalUnits = data.totalUnits : errCount++;
		util.validateDate(data.eventOn) ? editTractorData.eventOn = data.eventOn : dateErrorCount++;
		util.validateDefaultNumber(data.driverExpense) ? editTractorData.driverExpense = data.driverExpense : errCount++;
		editTractorData.driverName = data.driverName;

		if(data.jobType == 'Plough') {
			util.validateDefaultNumber(data.chargeableUnits) ? editTractorData.chargeableUnits = data.chargeableUnits : errCount++;
			util.validateDefaultNumber(data.costPerUnit) ? editTractorData.costPerUnit = data.costPerUnit : errCount++;
		} else if (data.jobType == 'Grass Baler') {
			util.validateDefaultNumber(data.noOfRolls) ? editTractorData.noOfRolls = data.noOfRolls : errCount++;
			util.validateDefaultNumber(data.costPerRoll) ? editTractorData.costPerRoll = data.costPerRoll : errCount++;
		}
		util.validateDefaultNumber(data.amount) ? editTractorData.amount = parseFloat(data.amount) : errCount++;
		editTractorData.updatedOn = util.getCurrentDate();

		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}
		editTractorData.eventOn.fullDate = util.momentFullDate(editTractorData.eventOn);
		cb(null, editTractorData);
	},
	verifyUpdateTransactionData: function(data, cb) {
		var errCount = 0, dateErrorCount = 0;

		var editTransactionData = {
			remarks: data.remarks ? data.remarks.toString() : ''
		}

		util.validateDate(data.eventOn) ? editTransactionData.eventOn = data.eventOn : dateErrorCount++;
		util.validateDefaultNumber(data.amount) ? editTransactionData.amount = parseFloat(data.amount) : errCount++;
		
		if (data.majorType == 'Expense') {
			editTransactionData.totalExpense = data.totalExpense;
			editTransactionData.billAttachment = data.billAttachment;
		}
		
		editTransactionData.updatedOn = util.getCurrentDate();

		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}
		editTransactionData.eventOn.fullDate = util.momentFullDate(editTransactionData.eventOn);
		cb(null, editTransactionData);
	},
	verifyUpdateInvestmentData: function(data, cb) {
		var errCount = 0, dateErrorCount = 0;

		var editInvestmentData = {
			remarks: data.remarks ? data.remarks.toString() : ''
		}

		util.validateDate(data.eventOn) ? editInvestmentData.eventOn = data.eventOn : dateErrorCount++;
		util.validateDefaultNumber(data.amount) ? editInvestmentData.amount = parseFloat(data.amount) : errCount++;
		util.validateString(data.purpose) ? editInvestmentData.purpose = data.purpose : errCount++;
		
		editInvestmentData.updatedOn = util.getCurrentDate();

		if(data.type != "Own Investment") {
			var loanDetails = {
				loanStatus: data.loanDetails.loanStatus,
				totalLoanAmountPaid: data.loanDetails.totalLoanAmountPaid,
				emiDetails : {
					isInterestOnly: data.loanDetails.emiDetails.isInterestOnly,
					userToRemind: data.loanDetails.emiDetails.userToRemind,
					remindBefore: data.loanDetails.emiDetails.remindBefore,
					termsEMIPaid: data.loanDetails.emiDetails.termsEMIPaid
				}
			}
			util.validateDefaultNumber(data.loanDetails.totalRepayAmount) ? loanDetails.totalRepayAmount = data.loanDetails.totalRepayAmount : errCount++;
			util.validateDefaultNumber(data.loanDetails.emiDetails.term) ? loanDetails.emiDetails.term = data.loanDetails.emiDetails.term : errCount++;
			util.validateDefaultNumber(data.loanDetails.emiDetails.amount) ? loanDetails.emiDetails.amount = data.loanDetails.emiDetails.amount : errCount++;
			util.validateDate(data.loanDetails.emiDetails.eventOn) ? loanDetails.emiDetails.eventOn = data.loanDetails.emiDetails.eventOn : dateErrorCount++;
			loanDetails.emiDetails.nextEMIDueDate = loanDetails.emiDetails.eventOn;
		}

		if(errCount) {
			cb("Invalid Data !!! Kindly check the info");
			return;
		} else if(dateErrorCount) {
			cb("Date entered seems to be invalid !!! Kindly check");
			return;
		}

		editInvestmentData.eventOn.fullDate = util.momentFullDate(editInvestmentData.eventOn);
		if(loanDetails) {
			loanDetails.emiDetails.eventOn.fullDate = util.momentFullDate(loanDetails.emiDetails.eventOn);
			editInvestmentData.loanDetails = loanDetails;
		}

		cb(null, editInvestmentData);
	},
	customerDataModel: function(data, cb) {
		var customerData = {
			address: data.address || '',
			type: data.userType,
			pricePerLitre: data.pricePerLitre,
			costPerUnit: data.costPerUnit,
			costPerRoll: data.costPerRoll,
			countryCode: data.countryCode,
			phone: data.phone,
			dateCreated: util.getCurrentDate(),
			productInvoice: 1,
			transactionInvoice: 1,
			investmentInvoice: 1
		};
		var errCount = 0;

		if(util.validateName(data.name)) {
			customerData._id = data.name.toLowerCase();
			customerData.name = data.name;
		} else {
			errCount++;
		}

		if(errCount) {
			cb("Invalid Data !!! Please enter a valid name");
			return;
		}

		cb(null, customerData);
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