'use strict';
let mongoose = require('mongoose');
let User = mongoose.model('User');
let utils = require('./util')

exports.sign_in_user = async (req, res) => {
    User.findOne({ email: req.body.email}, function (error, user) {
        // console.log(req.body.email)
        if (error) {
            res.send(error)
        } else{
            // console.log(req.body)
            user.comparePassword(req.body.password, function(error, isMatch) {
                if (error) {
                    res.send(error)
                }
                if (isMatch) {
                    res.send({
                        "result":isMatch,
                        "token": utils.create_web_token( {"email":user._doc.email, "admin":true})
                    })
                } else {
                    res.status(500).send({"result":isMatch})
                }
            })
        }
    })
}

exports.create_user = function (req, res) {
    console.log('in user_create')
    var user = new User({
        email: req.body.email,
        password: req.body.password,
    })
    user.save(function (error, user) {
        if (error) {
            res.send(error)
        }
        res.send(user)
    })
}

exports.find_all_users = function (req, res) {
    User.find({}, function (error, users) {
        if (error) {
            res.send(error)
        }
        res.send(users)
    })
}
