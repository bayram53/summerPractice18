//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
var dateFormat = require('dateformat');
var omit = require('object.omit');


const User = require('../models/User');
const Message = require('../models/Message');
const History = require('../models/History');
const Token = require('../models/Token');
var ObjectId = require('mongoose').Types.ObjectId;
var kkk;
var Login = [];

function IsLoggedIn(u){
    var tmp = Login.find(function (x) {
        return x.username === u;
    });

    return tmp !== undefined;
}

function checkToken(u, val){
    var tmp = Login.find(function (x) {
        //console.log("check gelen: " + u);
        return x.username === u;
    });

    if(tmp === undefined)
        return false;

    return tmp.token === val;
}

router.post('/:username/exit',async (req,res) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );



    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username) ){
        usr.token = "-";
        User.upd( usr.username, usr, (err,res1) => {

            if( err )
                res.json({success: false, message: `There is error: ${err}`});
            else {
                res.json({success: true, message: `Exit has been successful`});

                var now = Login.find(function (u) {
                    return (u.username === usr.username);
                });

                var i = Login.indexOf(now);
                Login.splice(i, 1);

                //console.log(Login, Login[i]);

                var tmp = now.token;

                if(tmp !== undefined){
                    tmp = {username:usr.username,token:tmp};

                    History.getSpec(tmp, (err,res2)=>{
                        if(err){
                            res.json({success: false, message: `There is error on History part: ${err}`});
                        }
                        else if(res2.length === 1){

                            res2[0].timeOut = (new Date).toISOString();
                            History.upd(tmp, res2[0], (err,p) => {
                               if(err){
                                   console.log("error while updating history");
                               }
                               else {

                               }
                            });
                        }
                    });
                }
            }
            });
        
        // do History part
            
    }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
});

router.post('/login',async (req,res) => {
    var usr = new User();

    await getWithUsername(req.body.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );

    //console.log(req.body.username + ":" + req.body.password);

    if( usr === undefined  ||  usr.password !== req.body.password )
        res.json({success: false, message: `Username or password is incorrect`});
    else if( IsLoggedIn(usr.username) )
        res.json({success: false, message: `There is other user logged in with this username`});
    else{
        var token = "alma";
        await getToken().then(function(doc){token=doc;}).catch(function(err){console.log(err)});
        
        User.upd( req.body.username, usr, (err,res1) => {
            if(err)
                res.json({success:false, message: `Failed to login due to unknown reason`});
            else{
                // add logged in infromation
                res.write(JSON.stringify({success: true, token:token, type:(usr.type==="admin")},null,3));
                res.end();

                var hist = new History({
                    username: req.body.username,
                    token: token,
                    timeIn: (new Date).toISOString(),
                    timeOut: null
                });

                History.add(hist, (err,res2)=>{
                    if(err)
                        console.log("there is error while inserting to history table");
                });

                Login.push( {username:usr.username, token:token} );
            }
            });
    }
});
// get all users info #admin

router.post('/:username/getAllInfo',async (req,res) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    
    else if( usr.type === "admin"  &&  checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username) ){
        User.getAll((err, res1)=> {
            if(err) {
                res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
            }
            else {
                res.write(JSON.stringify({success: true, users:filter(res1)},null,2));
                res.end();

        }
        });
    }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
});

// get all usernames
router.post('/:username/getUsername',async (req,res) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username) ){
        User.getAllUsername((err, res1)=> {
            if(err) {
                res.json({success:false, message: `Failed to load all usernames. Error: ${err}`});
            }
            else {
                res.write(JSON.stringify({success: true, usernames:filter(res1)},null,2));
                res.end();

        }
        });
    }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
});

// add user #admin
router.post('/:username/addUser',async (req,res,next) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username)  &&  usr.type == "admin"){
            let user = new User({
                username: req.body.username,
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                password: req.body.password,
                type: req.body.type
            });
            
            if( req.body.username == undefined  ||  req.body.username == null ) {
                res.json({success: false, message: `Please enter username field`});
                return;
            }

            var tmp = new User();
            await getWithUsername(req.body.username, tmp).then(function(x) {x===1?kkk=1:tmp=undefined}).catch( function(err){console.log(err)} );

            if( tmp === undefined )
            User.add(user,(err, res1) => {
                if(err) {
                    res.json({success: false, message: `Failed to create a new user. Error: ${err}`});

                }
                else
                    res.json({success: true, message: `Added successfully.`});

            });
            
            else
                res.json({success:false, message: `There is username already with specified username`});
        }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
    
});

// send message
router.post('/:username/sendMessage',async (req,res,next) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username) ){
        let msg = new Message({
            from: usr.username,
            to: req.body.to,
            message: req.body.message,
            time: (new Date).toISOString()});

        var to_user = new User();
        await getWithUsername(req.body.to, to_user).then(function(x) {x===1?kkk=1:to_user=undefined}).catch( function(err){console.log(err)} );
        
        if( req.body.to  &&  to_user !== undefined ){
            Message.add( msg, (err, res1) => {
            if(err){
                res.json({success:false, message: `Failed to send message. Error: ${err}`});
            }
            else{
                res.write(JSON.stringify({success: true, message:"send was successfull"},null,2));
                res.end();
            }
            });
        }
                    
        else{
            res.json({success:false, message: `Failed to send message. Please enter valid username`});
        }
    }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
    
});

// getting all messages [optional] #admin
router.post('/:username/log', async (req, res) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username)  &&  usr.type == "admin"){
        History.getAll( (err, res1) => {
        if(err){
            res.json({success:false, message: `Failed to load all messages. Error: ${err}`});
        }
        else{
            res.write(JSON.stringify({success: true, message:filter(res1)},null,2));
            res.end();
        }
        });
    }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
});

// get outbox
router.post('/:username/from', async (req, res) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username) ){
        Message.getFrom(usr.username, (err, res1) => {
        if(err){
            res.json({success:false, message: `Failed to load all received messages. Error: ${err}`});
        }
        else{
            res.write(JSON.stringify({success: true, message:filter(res1)},null,2));
            res.end();
        }
        });
    }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
});

// get inbox
router.post('/:username/to', async (req, res) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username) ){
        Message.getTo(usr.username, (err, res1) => {
        if(err){
            res.json({success:false, message: `Failed to load all sent messages. Error: ${err}`});
        }
        else{
            res.write(JSON.stringify({success: true, message:filter(res1)},null,2));
            res.end();
        }
        });
    }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
});

// delete user #admin
router.delete('/:username/deleteUser', async (req,res,next) => {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username)  &&  usr.type === "admin"){
        if( req.body.username ){
            User.del( req.body.username, (err,res1) => {
            if(err){
                res.json({success: false, message: `Failed to delete a user. Error: ${err}`});}
            else{
                res.json({success: true, message: `Deleted successfully`}); }
            });
        }
        else
            res.json({success:false, message: `Please enter usrname`});
    }
    else {
        res.json({success: false, message: `Failed: Please login to perform operations`});
        console.log("info: " + checkToken(usr.username, req.body.token));
        console.log("info: " + IsLoggedIn(usr.username));
        console.log("info: " + req.body.token);
    }
});

// update user info #admin
router.put('/:username/updateUser', async (req,res,next)=> {
    var usr = new User();
    await getWithUsername(req.params.username, usr).then(function(x) {x===1?kkk=1:usr=undefined}).catch( function(err){console.log(err)} );
    
    if(usr === undefined)
        res.json({success:false, message: `Failed: You are not user`});
    else if( checkToken(usr.username, req.body.token)  &&  IsLoggedIn(usr.username)  &&  usr.type === "admin"){
            User.upd( req.body.username, req.body, (err,res1) => {
                if(err)
                    res.json( {success: false, message: `Failed to update user, Make sure that your do not enter extra field or do not change username` } );
                else {
                    res.json({success: true, message: `Updated Succsessfully`});
                    console.log(res1);
                }
            });
    }
    else
        res.json({success:false, message: `Failed: Please login to perform operations`});
    
});

async function getWithUsername(u, ans){
    this._ans = undefined;
    ans._id = -1;

    await User.getWithUsername(u)
        .then( function(doc){
            if( doc.length === 1 )
                this._ans = doc[0];
            else
                this._ans = undefined;
        })
        .catch( function(err){
            this._ans = undefined;
        } );

    if(this._ans !== undefined) {
        for (var i in this._ans)
            if (ans.hasOwnProperty(i))
                ans[i] = this._ans[i];

        return 1;
    }

    return 0;
}

function rand(a,b){ // random number between [a,b] 
    b++;
    return Math.floor(Math.random() * (b-a)) + a;
}

async function getToken(){
    var ret = "";
    var same;
    
    do{
        var len = rand(15,20);
        ret = "";
        
        for(var i=0; i<len; i++){
            let tmp = rand(1,5);
            
            if( tmp <= 2 )
                ret += String.fromCharCode(97 + rand(0,25) );
            else if( tmp <= 4 )
                ret += String.fromCharCode(65 + rand(0,25) );
            else
                ret += String.fromCharCode(48 + rand(0,9) );
        }

        this.same = false;

        await Token.get(ret)
            .then(function(doc){
                if(doc.length != 0)
                    this.same = true;
            })
            .catch(function (err) {
                console.log(err);
            });

    }while( same );

    let tmp = new Token({val:ret});
    Token.add(tmp);

    return ret;
}

function filter(res){
    console.log(res);

    if(res.hasOwnProperty("_id")) {
        res._id = null;
        res.__v = null;

        delete res._id;
        delete res.__v;
    }

    if(res instanceof Array)
        for(var i in res) {
            res[i]._id = null;
            res[i].__v = null;

            delete res[i]._id;
            delete res[i].__v;
        }

    return res;
}

module.exports = router;
