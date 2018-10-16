//Require mongoose package
const mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

// Define schemas for comunication

const UserSchema = Schema({
    username:{ type: String, required: true, unique: true}, // username
    name: String,
    surname: String,
    email: String,
    password: String,
    type: {
        type:String,
        required: true,
        enum: ['admin', 'user']}
});

const UserList = module.exports = mongoose.model('Users', UserSchema);

module.exports.getAll = (callback) =>{
    UserList.find(callback);
}

module.exports.getAllUsername = (callback) =>{
    UserList.find({}, {username:1, _id:0}, callback);
}

module.exports.add = (newUser, callback) => {
    newUser.save(callback);
}

module.exports.del = (u, callback) => {
    let query = {username: u};
    
    UserList.remove( query, callback );
}

module.exports.upd = (u, nw, callback) => {
    let query = {username: u};
    
    UserList.update( query, {$set: nw}, callback);
}

module.exports.getWithId = (id, callback) => {
    let query = {_id: id};
    
    UserList.find( query, callback);
}

module.exports.getWithUsername = (u) => {
    return UserList.find( {username:u} );
}
