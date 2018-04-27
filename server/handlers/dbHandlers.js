var MongoClient = require("mongodb").MongoClient;
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
var util = require("./util");

var config = require("../config");
var dbHook = {};

console.log("DB handler Initialised , Loaded dependencies");

MongoClient.connect('mongodb://' + config.mongodbHost + ':' + config.mongodbConnectionPort, function(err, client) {
    if(err) {
        console.log("Couldnt connect to Mongodb server, please check themongo server connection. StackTrace -- " + err)
        return;
    }
    var db = client.db(config.mongodbName);
    var gfs = Grid(db, require("mongodb"));
    console.log("Successfully connected to MongoDB server - HOST: " + config.mongodbHost + ', Port: ' + config.mongodbConnectionPort + ', DB : ' + config.mongodbName);
    
    dbHook.findUser = function(query, cb) {
        console.log("DbHandler :: Inside Find User");
        db.collection('users').findOne(query, function(err, user){
            if(err) {
                cb(err);
                return;
            }
            cb(null, user);
        })
    };

    dbHook.addUser = function(userData, cb) {
        console.log("DbHandler :: Inside Add User");
        db.collection('users').insertOne(userData, function(err, res) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, res.ops[0]);
        })
    };

    dbHook.addTransaction = function(investmentData, cb) {
        console.log("DbHandler :: Inside Investment User");
        db.collection('transactions').insertOne(investmentData, function(err, res) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, res.ops[0]);
        })
    };

    dbHook.addProduct = function(productData, cb) {
        console.log("DbHandler :: Inside product entry User");
        db.collection('dataentry').insertOne(productData, function(err, res) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, res.ops[0]);
        })
    };

    dbHook.getProductDetails = function(query, sortValue, limitValue, skipValue, cb) {
        console.log("DbHandler :: Inside Get Product Details");
        db.collection('dataentry').find(query).skip(skipValue).sort(sortValue).limit(limitValue).toArray(function(err, productData) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, productData);
        })
    };

    dbHook.getTransactionDetails = function(query, sortValue, limitValue, skipValue, cb) {
        console.log("DbHandler :: Inside Get Transaction Details");
        db.collection('transactions').find(query).skip(skipValue).sort(sortValue).limit(limitValue).toArray(function(err, transactionData) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, transactionData);
        })
    };

    dbHook.getInvestmentDetails = function(query, sortValue, limitValue, skipValue, cb) {
        console.log("DbHandler :: Inside Get Investment Details");
        db.collection('transactions').find(query).skip(skipValue).sort(sortValue).limit(limitValue).toArray(function(err, investmentData) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, investmentData);
        })
    };

    dbHook.getProductById = function(query, cb) {
        console.log("DbHandler :: Inside Get Product By ID");
        db.collection('dataentry').findOne(query, function(err, product) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, product);
        })
    };

    dbHook.getTransactionById = function(query, cb) {
        console.log("DbHandler :: Inside Get Transaction By ID");
        db.collection('transactions').findOne(query, function(err, transaction) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, transaction);
        })
    };

    dbHook.deleteProductById = function(query, cb) {
        console.log("DbHandler :: Inside Delete Product By ID");
        db.collection('dataentry').deleteOne(query, function(err, result) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, result);
        })
    };

    dbHook.deleteTransactionById = function(query, cb) {
        console.log("DbHandler :: Inside Delete Transaction By ID");
        db.collection('transactions').deleteOne(query, function(err, result) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, result);
        })
    };

    dbHook.updateProductData = function(query, updateData,  cb) {
        console.log("DbHandler :: Inside Update Product Data By ID");
        db.collection('dataentry').findOneAndUpdate(query, {$set: updateData}, {returnOriginal: false}, function(err, result) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, result);
        })
    };

    dbHook.storage = new GridFsStorage({
      db: db,
      file: (req, file) => {
        console.log("DbHandler :: Inside Upload Bill Grid Storage");
        return {
            filename: 'Expense_bill_' + util.getCurrentDate(),
            bucketName: 'UploadedBills'
        };
      }
    });

    dbHook.getBillImage = function(filename, cb) {
        console.log("DbHandler :: Inside get Bill image");
        gfs.collection('UploadedBills'); //set collection name to lookup into
        /** First check if file exists */
        gfs.files.find({filename: filename}).toArray(function(err, files){
            if(!files || files.length === 0){
                cb(true);
                return;
            }
            /** create read stream */
            var readstream = gfs.createReadStream({
                filename: files[0].filename,
                root: "UploadedBills"
            });
            cb(null, files, readstream);
        });
    };

    dbHook.deleteBillImage = function(filename, cb) {
        console.log("DbHandler :: Inside delete Bill image");
        gfs.remove({filename: filename, root: 'UploadedBills'}, function (err, deleteResponse) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, deleteResponse);
        });
    };

    dbHook.addCustomer = function(customerData, cb) {
        console.log("DbHandler :: Inside Add customer Data");
        db.collection('customer').insertOne(customerData, function(err, res) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, res.ops[0]);
        })
    };

    dbHook.getCustomers = function(query, sortValue, cb) {
        console.log("DbHandler :: Inside Get Customer Details");
        db.collection('customer').find(query).sort(sortValue).toArray(function(err, customerData) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, customerData);
        })
    };

    dbHook.addInvestor = function(investorData, cb) {
        console.log("DbHandler :: Inside Add Investor Data");
        db.collection('investor').insertOne(investorData, function(err, res) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, res.ops[0]);
        })
    };

    dbHook.getInvestors = function(query, sortValue, cb) {
        console.log("DbHandler :: Inside Get Investor Details");
        db.collection('investor').find(query).sort(sortValue).toArray(function(err, investorData) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, investorData);
        })
    };

    dbHook.getNextCustomerSequenceValue = function(query, update, cb) {
        db.collection('customer').findOneAndUpdate(query, update, {'new':true}, function(err, customer){
            if(err) {
                cb(err);
                return;
            }
            cb(null, customer);
        });
    };

    dbHook.getNextInvestorSequenceValue = function(query, update, cb) {
        db.collection('investor').findOneAndUpdate(query, update, {'new':true}, function(err, investor){
            if(err) {
                cb(err);
                return;
            }
            cb(null, investor);
        });
    };
});

module.exports = dbHook;