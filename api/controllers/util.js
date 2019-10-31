'use strict';
let jwt = require('jsonwebtoken');
let config = require('../../config');
let jwt_key = process.env.WEDDING_BACKEND_SECRET_KEY;
// let jwt_key = config.secret;
let jwt_expiry = config.expiration;


exports.create_web_token = function(user) {
    let token = jwt.sign(user, jwt_key, {
        algorithm: 'HS256',
        expiresIn: jwt_expiry
    })
    return token;
}
