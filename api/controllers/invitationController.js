'use strict';
let utils = require('./util')
let mongoose = require('mongoose');
let Invitation = mongoose.model('Invitation');


exports.list_all_invitations = function (req, res) {
  if (req.decoded.admin) {
    Invitation.find({}, function (error, invitation) {
      if (error) {
        console.log(error)
        res.send(error);
      } else {
        // console.log('invitation')
        res.send(invitation)
      }
    });
  } else {
    res.sendStatus(401)
  }
};
function generatePassword(){
  return "sercret";
}
exports.test = function(req, res) {
  res.send('successful')
}

exports.printCodes = function( req, res) {
  let result = []
  Invitation.find({
    '_id': {
      $in: req.body
    }
  }, function(error, invitations) {
    if (error) {
      res.sendStatus(401)
    } else  {
      invitations.forEach((inv) => {
        let algo = {
          color1: inv.color1,
          color2: inv.color2,
          animal: inv.animal,
          accessory: inv.accessory
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
  console.log('req.body')
  console.log(req.body)
  let passwordAlgo = generatePasswordArray()
  var new_invitation = new Invitation({
    email: req.body.email,
    password: generatePassword(passwordAlgo),
    permissionLevel: req.body.permissionLevel,
    quickCode: generateQuickCode(12),
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
    color1: passwordAlgo.color1,
    color2:passwordAlgo.color2,
    animal: passwordAlgo.animal,
    accessory: passwordAlgo.accessory
  });
  if (req.decoded.admin) {
    new_invitation.save(function (error, invitation) {
      if (error) {
        console.log('in create errro')
        console.log(error)
        res.send(error)
      }
      else {
        console.log(invitation)
        res.send(invitation)
      }
    });
  } else {
    res.sendStatus(401)
  }
};

exports.get_a_invitation = function (req, res) {
  console.log(req.params)
  Invitation.findById(req.params.invitationId, function (err, invitation) {
    if (err) {
      console.log(err)
      res.send(err);
    } else {
      res.json(invitation);
    }
  });
};

exports.delete_all = function (req, res) {
  if (true) {
    console.log('dont do that')
  } else {
    Invitation.deleteMany(function (err, invitation) {
      if (err) {
        console.log(err)
      } else {
        console.log(invitation)
      }
    })
  }
}


exports.update_a_invitation = function (req, res) {
  console.log(req.body.songs)
  Invitation.findById(req.params.invitationId, function (error, invitation) {
    if (error) {
      res.send(error)
    } else {
      if (req.decoded.admin || req.decoded.email == invitation.quickCode) {
        invitation.email = req.body.email
        invitation.songs = req.body.songs
        invitation.rsvp = req.body.rsvp
        invitation.rsvpAllowed = req.body.rsvpAllowed
        invitation.address = req.body.address
        invitation.people = req.body.people
        invitation.save(function (err, inv) {
          if (err) {
            console.log(err)
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
      if (err)
        res.send(err);
      res.json({ message: 'invitation successfully deleted' });
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
  console.log(req.body)
  Invitation.findOne({ quickCode: req.body.code }).exec(function (error, invitation) {
    if (invitation) {
      invitation.comparePassword(req.body.password, function (error, isMatch) {
        if (error) {
          res.send(error)
        }
        if (isMatch) {
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
      console.log('password was null in invitation sign in')
      res.status(500).send({ "result": false })
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
function generatePasswordArray(){
  return {
    "color1": Math.floor(Math.random() * 8),
    "color2": Math.floor(Math.random() * 8),
    "animal": Math.floor(Math.random() * 8),
    "accessory": Math.floor(Math.random() * 8)
  }
}

function generatePassword(algo){
  let animals = [
    "Bird",
    "Cat",
    "Dog",
    "Bear",
    "Squirrel",
    "Rabbit",
    "Turtle",
    "Racoon"
  ]
  let accessories = [
    "BowTie",
    "TopHat",
    "Cane",
    "Necklace",
    "Bag",
    "Shoes",
    "Monicle",
    "Scarf"
  ]
  let colors =[
    "Black",
    "Red",
    "Green",
    "Blue",
    "Yellow",
    "Purple",
    "Orange",
    "Brown"
  ]
  return "A" + colors[algo.color1]+animals[algo.animal]+"WithA"+colors[algo.color2]+accessories[algo.accessory]

}