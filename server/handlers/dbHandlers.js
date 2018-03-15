var MongoClient =require("mongodb").MongoClient;
var config = require("../config");
var dbHook = {};

console.log("DB handler Initialised , Loaded dependencies");

MongoClient.connect('mongodb://' + config.mongodbHost + ':' + config.mongodbConnectionPort, function(err, client) {
    if(err) {
        console.log("Couldnt connect to Mongodb server, please check themongo server connection. StackTrace -- " + err)
        return;
    }
    var db = client.db(config.mongodbName);
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
        console.log("DbHandler :: Inside Add User")
        db.collection('users').insertOne(userData, function(err, res) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, res);
        })
    };

    dbHook.addTransaction = function(investmentData, cb) {
        console.log("DbHandler :: Inside Investment User")
        db.collection('transactions').insertOne(investmentData, function(err, res) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, res);
        })
    };

    dbHook.addProduct = function(productData, cb) {
        console.log("DbHandler :: Inside product entry User")
        db.collection('dataentry').insertOne(productData, function(err, res) {
            if(err) {
                cb(err);
                return;
            }
            cb(null, res);
        })
    };

    dbHook.updateUser = function(query, updateInfo, cb) {

    };
});

module.exports = dbHook;