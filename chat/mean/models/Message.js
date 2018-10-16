//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const MessageSchema = Schema({
    from: String,
    to: String,
    message: String,
    time: Date
    });

const MessageList = module.exports = mongoose.model('Messages', MessageSchema);

module.exports.getAll = (callback) =>{
    MessageList.find(callback);
}

module.exports.getFrom = (id, callback) => {
    MessageList.find({from: id}, callback);
}

module.exports.getTo = (id, callback) => {
    MessageList.find({to: id}, callback);
}

module.exports.add = (msg, callback) => {
    msg.save(callback);
}

