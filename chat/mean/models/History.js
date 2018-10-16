//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const HistorySchema = Schema({
    username:{ type:String, required:true},
    token:{ type:String, unique:true},
    timeIn: Date,
    timeOut: Date,
    });
    

const HistoryList = module.exports = mongoose.model('History', HistorySchema);

module.exports.getAll = (callback) =>{
    return HistoryList.find({}, callback);
}

module.exports.getSpec = (q, callback) =>{
    return HistoryList.find(q, callback);
}

module.exports.add = (newHistory, callback) => {
    newHistory.save(callback);
}

module.exports.upd = (q, nw, callback) => {
    HistoryList.update( q, {$set: nw}, callback);
}

