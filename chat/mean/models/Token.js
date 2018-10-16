//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

// Define schemas for comunication

const TokenSchema = Schema({
    val: String
});

const TokenList = module.exports = mongoose.model('Tokens', TokenSchema);

module.exports.get = (val) =>{
    return TokenList.find({val:val});
}

module.exports.add = (newToken, callback) => {
    newToken.save(callback);
}
