'use strict';
let mongoose = require('mongoose');
let User = mongoose.model('User');
let utils = require('./util')

exports.sign_in_user = async (req, res) => {
    User.findOne({ email: req.body.email}, function (error, user) {
        if (error) {
            res.send(error)
        } else if (user != null) {
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
        } else {
            res.status(500).send({"result":"User not found"})
        }
    })
}

exports.create_user = function (req, res) {
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
