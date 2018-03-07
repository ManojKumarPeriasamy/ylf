var config = require("../config");
var bcrypt = require('bcrypt-nodejs');
var moment = require("moment");
moment().format();

module.exports = {
	hashPassword: function(password, cb) {
		bcrypt.genSalt(10, function (err, salt) {
            if (err) return cb("Password Hash - Error generating Salt");
            bcrypt.hash(password, salt, null, function (err, hash) {
                if (err) return cb("Password Hash - Error on hash");
                cb(null, hash)
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
	}
}
