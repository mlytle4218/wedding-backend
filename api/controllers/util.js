'use strict';
let jwt = require('jsonwebtoken');
let jwt_key = process.env.WEDDING_BACKEND_SECRET_KEY;

exports.create_web_token = function(user) {
    let token = jwt.sign(user, jwt_key, {
        algorithm: 'HS256',
        expiresIn: process.env.EXPIRATION
    })
    return token;
}
