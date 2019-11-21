'use strict';
let utils = require('./util')
let mongoose = require('mongoose');
let Invitation = mongoose.model('Invitation');
let winston = require('../config/winston')


exports.list_all_invitations = function (req, res) {
  if (req.decoded.admin) {
    Invitation.find({}, function (error, invitation) {
      if (error) {
        winston.error(error)
        res.send(error);
      } else {
        res.send(invitation)
      }
    });
  } else {
    res.sendStatus(401)
  }
};
// function generatePassword() {
//   return "sercret";
// }
exports.test = function (req, res) {
  res.send('successful')
}

exports.printCodes = function (req, res) {
  let result = []
  Invitation.find({
    '_id': {
      $in: req.body
    }
  }, function (error, invitations) {
    if (error) {
      res.sendStatus(401)
    } else {
      invitations.forEach((inv) => {
        console.log(inv)
        let algo = {
          color: inv.color,
          size: inv.size,
          animal: inv.animal
        }
        let temp = {
          people: inv.people,
          rsvpAllowed: inv.rsvpAllowed,
          quickCode: inv.quickCode,
          password: generatePassword(algo)
        }
        result.push(temp)
      })
      res.send(result)
    }
  }
  )
}

exports.create_a_invitation = function (req, res) {
  let passwordAlgo = generatePasswordArray()
  var new_invitation = new Invitation({
    email: req.body.email,
    password: generatePassword(passwordAlgo),
    permissionLevel: req.body.permissionLevel,
    quickCode: generateQuickCode(8),
    rsvp: req.body.rsvp,
    rsvpAllowed: req.body.rsvpAllowed,
    address: req.body.address,
    line1: req.body.line1,
    line2: req.body.line2,
    city: req.body.city,
    state: req.body.state,
    zip: req.body.zip,
    people: req.body.people,
    name: req.body.name,
    songs: req.body.songs,
    color: passwordAlgo.color,
    size: passwordAlgo.size,
    animal: passwordAlgo.animal
  });
  if (req.decoded.admin) {
    new_invitation.save(function (error, invitation) {
      if (error) {
        winston.error(error)
        res.send(error)
      }
      else {
        res.send(invitation)
      }
    });
  } else {
    res.sendStatus(401)
  }
};

exports.get_a_invitation = function (req, res) {
  Invitation.findById(req.params.invitationId, function (err, invitation) {
    if (err) {
      winston.error(err)
      res.send(err);
    } else {
      res.json(invitation);
    }
  });
};

exports.delete_all = function (req, res) {
  if (true) {
    winston.error('dont do that')
  } else {
    Invitation.deleteMany(function (err, invitation) {
      if (err) {
        winston.error(err)
      } else {
        winston.info(invitation)
      }
    })
  }
}


exports.update_a_invitation = function (req, res) {
  Invitation.findById(req.params.invitationId, function (error, invitation) {
    if (error) {
      res.send(error)
    } else {
      if (req.decoded.admin || req.decoded.email == invitation.quickCode) {
        if (req.body.hasOwnProperty('email')){ 
          console.log(req.body.email)
          invitation.email = req.body.email
         }
        if (req.body.songs) { invitation.songs = req.body.songs }
        if (typeof req.body.rsvp != 'undefined') { 
          invitation.rsvp = req.body.rsvp
         }
        if (req.body.rsvpAllowed) { invitation.rsvpAllowed = req.body.rsvpAllowed }
        if (req.body.address) { invitation.address = req.body.address }
        if (req.body.people) { invitation.people = req.body.people }
        invitation.save(function (err, inv) {
          if (err) {
            winston.error(err)
            res.sendStatus(404)
          } else {
            res.json(inv)
          }
        })
      } else {
        res.sendStatus(401)
      }
    }
  })
};


exports.delete_a_invitation = function (req, res) {
  if (req.decoded.admin) {
    Invitation.deleteOne({
      _id: req.params.invitationId
    }, function (err, invitation) {
      if (err) {
        res.send(err);
      } else {
        res.json({ message: 'invitation successfully deleted' });
      }
    });
  } else {
    res.sendStatus(401)
  }
};


exports.rsvp_page = function (req, res) {
  Invitation.find({ quickCode: req.params.code }, function (error, invitation) {
    if (error) {
      res.send(error);
    } else {
      res.send(invitation)
    }
  });

}



exports.invitation_sign_in = function (req, res) {
  Invitation.findOne({ quickCode: req.body.code }).exec(function (error, invitation) {
    if (error) {
      winston.error('password was null in invitation sign in')
      res.status(500).send({ "result": false })
    } else if (invitation != null) {
      invitation.comparePassword(req.body.password, function (error, isMatch) {
        if (error) {
          res.send(error)
        } else if (isMatch) {
          res.send({
            "result": isMatch,
            "token": utils.create_web_token({ "email": invitation.quickCode, "admin": false }),
            "id": invitation._id
          })
        } else {
          res.status(500).send({ "result": isMatch })
        }
      })
    } else {
      res.status(500).send({ "result": "invitation not found" })
    }
  })

}


function generateQuickCode(length) {
  var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}
function generatePasswordArray() {
  return {
    "size": Math.floor(Math.random() * 2),
    "color": Math.floor(Math.random() * 8),
    "animal": Math.floor(Math.random() * 8)
  }
}

function generatePassword(algo) {
  let sizes = [
    "small",
    "large"
  ]
  let animals = [
    "bird",
    "cat",
    "dog",
    "bear",
    "squirrel",
    "rabbit",
    "turtle",
    "racoon",
    "horse",
    "bat",
    "monkey",
    "sloth"
  ]
  let colors = [
    "black",
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "brown"
  ]
  return "a" + sizes[algo.size] + colors[algo.color] + animals[algo.animal]
}