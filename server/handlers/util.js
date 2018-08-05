var config = require("../config");
var bcrypt = require('bcrypt-nodejs');
var moment = require("moment");
moment().format();

module.exports = {
	hashPassword: function(password, cb) {
		bcrypt.genSalt(10, function (err, salt) {
            if (err) return cb("Something went wrong. Please try again later");
            bcrypt.hash(password, salt, null, function (err, hash) {
                if (err) return cb("Something went wrong. Please try again later");
                cb(null, hash);
            });
        });
	},

	comparePassword: function(password, passwordDB, cb){
		bcrypt.compare(password, passwordDB, function (err, isMatch) {
        	if (err) cb(err);
        	cb(null, isMatch);
    	});
	},

	getCurrentDate: function() {
		return moment().toDate().getTime();
	},
	

	validateName: function(name) {
		if(name && name.length >= 4 && name.length <= 20 && (/^[a-zA-Z \-]+$/.test(name))) {
			return true;
		} else {
			console.log("UTIL :: Invalid Name");
			return false;
		}
	},

	validatePassword: function(password) {
		if(password && password.length >= 8 && password.length <= 20 && (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_])[A-Za-z\d!@#$%^&*()_]{8,20}$/.test(password))) {
			return true;
		} else {
			console.log("UTIL :: Invalid Password");
			return false;
		}
	},

	validateRole: function(role) {
		if(role && role.toLowerCase() === 'admin' || role.toLowerCase() === 'manager' || role.toLowerCase() === 'member') {
			return true;
		} else {
			console.log("UTIL :: Invalid Role");
			return false;
		}
	},

	validateCountryCode: function(code) {
		if(code === "1" || code === "91") {
			return true;
		} else {
			console.log("UTIL :: Invalid Country Code");
			return false;
		}
	},

	validatePhoneNumber: function(phone) {
		if(phone && phone.length === 10 && (/^[0-9]+$/.test(phone))) {
			return true;
		} else {
			console.log("UTIL :: Invalid Phone number");
			return false;
		}
	},

	validateEmail: function(email) {
		if(/^\w+([.-]\w+)*@\w+([.-]\w+)*\.\w{2,6}$/.test(email)) {
			return true;
		} else {
			console.log("UTIL :: Invalid Email");
			return false;
		}
	},

	setAlertType: function() {
		return ['SMS', 'EMAIL'];
	},

	setPreferencePage: function(role) {
		if(role == 'admin') {
			return 'dashboard';
		} else if(role == 'manager') {
			return 'transaction/addTransaction';
		} else {
			return 'data-entry';
		}
	},

	setInitialPassword: function(name, role) {
		return name.substring(0,3).toLowerCase() + '123@' + role;
	},

	validateString: function(data) {
		if(data && data.length <= 100 && (/^[a-zA-Z \-,.]+$/.test(data))) {
			return true;
		} else {
			console.log("UTIL :: Invalid STRING");
			return false;
		}
	},

	validateInvestmentType: function(type) {
		if(type === "Own Investment" || type === "Bank Loan" || type === "Loan From individual") {
			return true;
		} else {
			console.log("UTIL :: Invalid Investment Type");
			return false;
		}
	},

	validateDefaultNumber: function(number) {
		if(number && parseInt(number) != 0 && (/^[0-9.]+$/.test(number.toString()))) {
			return true;
		} else {
			console.log("UTIL :: Default Number not changed");
			return false;
		}
	},

	validateDate: function(event) {
		if(event.date && event.date.length === 2 && event.month && event.month.length === 2 && event.year && event.year.length === 4) {
			return moment([parseInt(event.year),parseInt(event.month)-1, parseInt(event.date)]).isValid();
		} else {
			return false;
		}
	},

	momentFullDate: function(event) {
		return moment([parseInt(event.year),parseInt(event.month)-1, parseInt(event.date)]).toDate().getTime();
	}
}