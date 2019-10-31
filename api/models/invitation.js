'use strict';
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var invitationSchema = new Schema({
    email:  {type: String, required:  false },
    password:  {type: String, required:  false },
    // permissionLevel:  {type: Number, required:  false },
    quickCode:  {type: String, required:  false },
    rsvp:  {type: Number, required:  false },
    rsvpAllowed:  {type: Number, required:  false },
    address: {
        line1: {type: String, required:  false },
        line2: {type: String, required:  false },
        city: {type: String, required:  false },
        state: {type: String, required:  false },
        zip: {type: String, required:  false }
    },
    people: [
        {
            "name" : {type: String, required:  false }
        }
    ],
    songs: [
        {
            "name": {type:String, required: false}
        }
    ],
    color1: {type: Number, required: false},
    color2: {type: Number, required: false},
    animal: {type: Number, required: false},
    accessory: {type: Number, required: false}

})

invitationSchema.pre("save", function(next) {
    if(!this.isModified("password")) {
        return next();
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

invitationSchema.methods.comparePassword = function(candidatePassword, cb) {
    console.log('comparePassword')
    console.log(candidatePassword)
    console.log(this.password)
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { 
            console.log('is err')
            console.log(err)
            return cb(err); 
        } else {
            console.log(isMatch)
            cb(null, isMatch);
        }
    });
};


module.exports = mongoose.model('Invitation', invitationSchema)