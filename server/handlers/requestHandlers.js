var jwt = require('jsonwebtoken');
var multer  = require('multer');

var dbHandlers = require("./dbHandlers");
var config = require("../config");
var util = require("./util");
var dataModel = require("./dataModel");
var ObjectId = require('mongodb').ObjectID;

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
		console.log("ReqHan :: Inside Add Investment call -- " + JSON.stringify(req.body));
		dataModel.investmentDataModel(req.body.investmentData, function(modelErr, investmentData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}
			var query = {'name' : investmentData.name};
			var update = { '$inc' : {'investmentInvoice' : 1}};
			dbHandlers.getNextInvestorSequenceValue(query, update, function(seqErr, sequenceDocument){
				if(seqErr) {
					res.json(dataModel.errorResponse(seqErr));
					return;
				}
				investmentData.investmentId = investmentData.name.toUpperCase() + '-' + investmentData.majorType.toUpperCase().substring(0, 3) + '-' + sequenceDocument.value.investmentInvoice;
				dbHandlers.addTransaction(investmentData, function(dberr, response) {
					if(dberr) {
						res.json(dataModel.errorResponse(dberr));
						return;
					}

					res.json(dataModel.successResponse(response));
				});
			});
		})
	},

	addTransaction: function(req, res) {
		console.log("ReqHan :: Inside Add Transaction call -- " + JSON.stringify(req.body));
		dataModel.transactionDataModel(req.body.transactionData, function(modelErr, transactionData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}
			var query = {'name' : transactionData.name};
			var update = { '$inc' : {'transactionInvoice' : 1}};
			dbHandlers.getNextCustomerSequenceValue(query, update, function(seqErr, sequenceDocument){
				if(seqErr) {
					res.json(dataModel.errorResponse(seqErr));
					return;
				}
				console.log(sequenceDocument);
				transactionData.transactionId = transactionData.name.toUpperCase() + '-' + transactionData.majorType.toUpperCase().substring(0, 3) + '-' + sequenceDocument.value.transactionInvoice;
				dbHandlers.addTransaction(transactionData, function(dberr, response) {
					if(dberr) {
						res.json(dataModel.errorResponse(dberr));
						return;
					}

					res.json(dataModel.successResponse(response));
				});
			});
		})
	},

	addProduct: function(req, res) {
		console.log("ReqHan :: Inside Add product entry call -- " + JSON.stringify(req.body));
		dataModel.productDataModel(req.body.productEntry, function(modelErr, productEntry) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}
			var query = {'name' : productEntry.name};
			var update = { '$inc' : {'productInvoice' : 1}};
			dbHandlers.getNextCustomerSequenceValue(query, update, function(seqErr, sequenceDocument){
				if(seqErr) {
					res.json(dataModel.errorResponse(seqErr));
					return;
				}
				productEntry.productId = productEntry.name.toUpperCase() + '-' + productEntry.product.toUpperCase().substring(0, 3) + '-' + sequenceDocument.value.productInvoice;
				dbHandlers.addProduct(productEntry, function(dberr, response) {
					if(dberr) {
						res.json(dataModel.errorResponse(dberr));
						return;
					}
					res.json(dataModel.successResponse(response));
				});
			})
		})
	},

	getMilkDetails: function(req, res) {
		console.log("ReqHan :: Inside Get Milk Details call -- " + JSON.stringify(req.query));
		var query = {'product' : 'Milk'};
		var sortBy = {'dateCreated' : -1};
		var limitValue = parseInt(req.query.limit);
		var skipValue = req.query.start ? parseInt(req.query.start) : 0;
		dbHandlers.getProductDetails(query, sortBy, limitValue, skipValue, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	getTractorDetails: function(req, res) {
		console.log("ReqHan :: Inside Get Tractor Details call -- " + JSON.stringify(req.query));
		var query = {'product' : 'Tractor'};
		var sortBy = {'dateCreated' : -1};
		var limitValue = parseInt(req.query.limit);
		var skipValue = req.query.start ? parseInt(req.query.start) : 0;
		dbHandlers.getProductDetails(query, sortBy, limitValue, skipValue, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	getTransactionDetails: function(req, res) {
		console.log("ReqHan :: Inside Get Transaction Details call -- " + JSON.stringify(req.query));
		var query = { $or:[
		    {majorType:"Income"},
		    {majorType:"Expense"}
		  ]};
		var sortBy = {'dateCreated' : -1};
		var limitValue = parseInt(req.query.limit);
		var skipValue = req.query.start ? parseInt(req.query.start) : 0;
		dbHandlers.getTransactionDetails(query, sortBy, limitValue, skipValue, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	getInvestmentDetails: function(req, res) {
		console.log("ReqHan :: Inside Get Investment Details call -- " + JSON.stringify(req.query));
		var query = {majorType:"Investment"};
		var sortBy = {'dateCreated' : -1};
		var limitValue = parseInt(req.query.limit);
		var skipValue = req.query.start ? parseInt(req.query.start) : 0;
		dbHandlers.getInvestmentDetails(query, sortBy, limitValue, skipValue, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	getProductById: function(req, res) {
		console.log("ReqHan :: Inside Get Product Details by id -- " + JSON.stringify(req.query));
		var query = {'productId': req.query.id};
		dbHandlers.getProductById(query, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	getTransactionById: function(req, res) {
		console.log("ReqHan :: Inside Get Transaction Details by id -- " + JSON.stringify(req.query));
		var query = {'trasactionId': req.query.id};
		dbHandlers.getTransactionById(query, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	deleteProductById: function(req, res) {
		console.log("ReqHan :: Inside Delete Product Details by id -- " + JSON.stringify(req.query));
		var query = {productId: req.query.id};
		dbHandlers.deleteProductById(query, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	deleteTransactionById: function(req, res) {
		console.log("ReqHan :: Inside Delete Transaction Details by id -- " + JSON.stringify(req.query));
		var query = {transactionId: req.query.id};
		dbHandlers.deleteTransactionById(query, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	updateMilkProduct: function(req, res) {
		console.log("ReqHan :: Inside Update Milk Product by id -- " + JSON.stringify(req.body));
		dataModel.verifyUpdateMilkData(req.body.editData, function(modelErr, editData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}

			var query = {productId: req.body.id};
			dbHandlers.updateProductData(query, editData, function(dberr, response) {
				if(dberr) {
					res.json(dataModel.errorResponse(dberr));
					return;
				}

				res.json(dataModel.successResponse(response));
			});
		});
	},

	updateTractorData: function(req, res) {
		console.log("ReqHan :: Inside Update Tractor Data by id -- " + JSON.stringify(req.body));
		dataModel.verifyUpdateTractorData(req.body.editData, function(modelErr, editData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}

			var query = {productId: req.body.id};
			dbHandlers.updateProductData(query, editData, function(dberr, response) {
				if(dberr) {
					res.json(dataModel.errorResponse(dberr));
					return;
				}

				res.json(dataModel.successResponse(response));
			});
		});
	},

	uploadBill: function(req, res) {
		console.log("ReqHan :: Inside Upload Bill");
		var upload = multer({ storage: dbHandlers.storage });
		upload.single('bill')(req, res, function(err, file) {
	        if(err) {
	            res.json(dataModel.successResponse(err));
	        }
	        res.json(dataModel.successResponse(req.file));
	    });
	},

	getBillImage: function(req, res) {
		console.log("ReqHan :: Inside getBillImage -- " + JSON.stringify(req.params));
		dbHandlers.getBillImage(req.params.billName, function(dberr, files, readstream) {
			if(dberr) {
				res.status(404).json({
                    responseCode: 1,
                    responseMessage: "error"
                });
				return;
			}
			/** set the proper content type */
            res.set('Content-Type', files[0].contentType)
            /** return response */
			return readstream.pipe(res);
		});
	},

	deleteBillImage: function(req, res) {
		console.log("ReqHan :: Inside deleteBillImage -- " + JSON.stringify(req.params));
		dbHandlers.deleteBillImage(req.params.billName, function(dberr, deleteResponse) {
			if(dberr) {
	            res.json(dataModel.successResponse(err));
	        }
	        res.json(dataModel.successResponse(deleteResponse));
		});
	},

	addCustomer: function(req, res) {
		console.log("ReqHan :: Inside Add Customer call -- " + JSON.stringify(req.body));
		dataModel.customerDataModel(req.body.customerEntry, function(modelErr, customerData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}

			dbHandlers.addCustomer(customerData, function(dberr, response) {
				if(dberr) {
					res.json(dataModel.errorResponse(dberr));
					return;
				}

				res.json(dataModel.successResponse(response));
			});
		})
	},

	getCustomers: function(req, res) {
		console.log("ReqHan :: Inside Get Cutomers call -- " + JSON.stringify(req.query));
		var query = {};
		var sortBy = {'dateCreated' : -1};
		dbHandlers.getCustomers(query, sortBy, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	},

	addInvestor: function(req, res) {
		console.log("ReqHan :: Inside Add Investor call -- " + JSON.stringify(req.body));
		dataModel.investorDataModel(req.body.investorEntry, function(modelErr, investorData) {
			if(modelErr) {
				res.json(dataModel.errorResponse(modelErr));
				return;
			}

			dbHandlers.addInvestor(investorData, function(dberr, response) {
				if(dberr) {
					res.json(dataModel.errorResponse(dberr));
					return;
				}

				res.json(dataModel.successResponse(response));
			});
		})
	},

	getInvestors: function(req, res) {
		console.log("ReqHan :: Inside Get investor call -- " + JSON.stringify(req.query));
		var query = {};
		var sortBy = {'dateCreated' : -1};
		dbHandlers.getInvestors(query, sortBy, function(dberr, response) {
			if(dberr) {
				res.json(dataModel.errorResponse(dberr));
				return;
			}

			res.json(dataModel.successResponse(response));
		});
	}
}