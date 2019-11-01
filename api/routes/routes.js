'use strict';
var express = require('express');
var router = express.Router();
var bearerToken = require('express-bearer-token');
let jwt = require('jsonwebtoken');
let winston = require('../config/winston')

var checkForUserBearerToken = function(req, res, next) {
    if (req.token) {
      jwt.verify(req.token, process.env.WEDDING_BACKEND_SECRET_KEY, function(error, decoded) {
        if (error) {
          return res.json({ success: false, message: 'Failed to authenticate.' })
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      winston.error('no token')
      return res.status(403).send({
        success: false,
        message: 'No token'
      });
    }
  
  };

var invitationController = require('../controllers/invitationController');
var userController = require('../controllers/userController');


router.get('/test', invitationController.test);


router.post('/user/signIn', userController.sign_in_user)
    .get('/quickCode/:code', invitationController.rsvp_page)
    .post('/invitation/quickCode/',  invitationController.invitation_sign_in);

router.use(bearerToken())
router.use(checkForUserBearerToken) 

router.put('/print/codes', invitationController.printCodes)

router.get('/nuke/invitations', invitationController.delete_all);

router.post('/user/create', userController.create_user);
router.get('/user', userController.find_all_users);


router.get('/invitation', invitationController.list_all_invitations)
    .post('/invitation', invitationController.create_a_invitation);

router.get('/invitation/:invitationId', invitationController.get_a_invitation)
    .put('/invitation/:invitationId', invitationController.update_a_invitation)
    .delete('/invitation/:invitationId', invitationController.delete_a_invitation)

router.get('*', (req, res) => {
  return res.status(501)
})

module.exports = router;
