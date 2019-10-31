let mongoose = require('mongoose');
let invitation = require('../../api/models/invitation');

let chai = require('chai'); let chaiHttp = require('chai-http');
let should = chai.should()
let index = require('../../index');
let jwt = require('jsonwebtoken');
let config = require('../../config');

let testInvitation = {
    "email": "marcos.henrique@toptal.com",
    "password": "secret",
    "permissionLevel": 0,
    "quickCode": "8888",
    "rsvp": 0,
    "rsvpAllowed": 2,
    "address": {
        "line1": "213 Argold St",
        "line2": "apt 20",
        "city": "Brookston",
        "state": "IN",
        "zip": "47922"
    },
    "people": [
        { "name": "Rita Wilson" },
        { "name": "Toony Wilson" }
    ], 
    "songs" : [
        { "name" : "Thunder Struck"},
        { "name" : "She Sells Sanctuary"}
    ]
}

chai.use(chaiHttp);


let userToken = null;

describe('Invitations Users setup', () => {

    describe('/POST user/signIn', () => {
        it('it should sign the user in and get a token', (done) => {
            chai.request(index).post('/api/user/signIn').send({
                "email": "example",
                "password": "123456789"
            }).end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('result').eql(true);
                userToken = response.body.token;
                // console.log(response.body)
                done();
            });
        });
    });
    describe('/POST invitations', () => {
        it('it should create a invitation by user auth', (done) => {
            chai.request(index)
                .post('/api/invitation')
                .set('Authorization', 'Bearer ' + userToken)
                .send(testInvitation)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    // response.body.should.have.property('password');
                    done()
                })
        })
    });  
});



describe('Invitations', () => {
    let invToken = null;
    // beforeEach((done) => {
    //     invitation.deleteMany({}, (error) => {
    //         done();
    //     });
    // });
    describe('/POST/invitation/quickCode/:quickCode', () => {
        it('it should log an invitation in and get a token' , (done) => {
            chai.request(index).post('/api/invitation/quickCode/').send({
                password: 'secret',
                code: "8888"
            }).end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('result').eql(true);
                invToken = response.body.token;
                done();
            }) 
        })
    })
    describe('/GET invitations', () => {
        it('it should try to get all the invitations but return an unauthorized 401', (done) => {
            chai.request(index)
                .get('/api/invitation')
                .set('Authorization', 'Bearer ' + invToken)
                .end((error, response) => {
                    response.should.have.status(401);
                    // response.body.should.be.a('array');
                    // response.body.length.should.be.eql(0)
                    done();
                });
        });
    });
    describe('/GET/:id invitations', () => {
        it('it should get a invitation by id', (done) => {
            let invitationNew = new invitation(testInvitation)
            invitationNew.save((error, invitation) => {
                chai.request(index)
                    .get('/api/invitation/' + invitation._id)
                    .set('Authorization', 'Bearer ' + invToken)
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('email');
                        response.body.should.have.property('password');
                        response.body.should.have.property('permissionLevel');
                        done();
                    });

            })
        });
    });
    describe('/PUT/:id invitations', () => {
        it('it should update a invitation by id', (done) => {
            let invitationNew = new invitation(testInvitation)
            invitationNew.save((error, invitation) => {
                chai.request(index)
                    .put('/api/invitation/' + invitation._id)
                    .set('Authorization', 'Bearer ' + invToken)
                    .send({
                        "email": "marcos.henrique@toptal.com",
                        "password": "secret",
                        "permissionLevel": 0,
                        "rsvp":2
                    })
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('permissionLevel').eql(0);
                        done();
                    });

            })
        });
    });

    describe('/POST invitations', () => {
        it('it should create a invitation', (done) => {
            chai.request(index)
                .post('/api/invitation')
                .set('Authorization', 'Bearer ' + invToken)
                .send(testInvitation)
                .end((error, response) => {
                    response.should.have.status(401);
                    // response.body.should.be.a('object');
                    // response.body.should.have.property('password');
                    done()
                })
        })
    });

    describe('/DELETE/:id invitations', () => {
        it('it should be denied to delete a invitation by id', (done) => {
            let invitationNew = new invitation(testInvitation);
            invitationNew.save((error, invitation) => {
                chai.request(index)
                    .delete('/api/invitation/' + invitation._id)
                    .set('Authorization', 'Bearer ' + invToken)
                    .end((error, response) => {
                        response.should.have.status(401);
                        // response.body.should.be.a('object');
                        // response.body.should.have.property('message').eql('invitation successfully deleted');
                        done();
                    });

            })
        });
    });

    describe('/DELETE/:id invitations', () => {
        it('it should delete a invitation by id and by user auth', (done) => {
            let invitationNew = new invitation(testInvitation);
            invitationNew.save((error, invitation) => {
                chai.request(index)
                    .delete('/api/invitation/' + invitation._id)
                    .set('Authorization', 'Bearer ' + userToken)
                    .end((error, response) => {
                        response.should.have.status(200);
                        response.body.should.be.a('object');
                        response.body.should.have.property('message').eql('invitation successfully deleted');
                        done();
                    });

            })
        });
    });
    // describe('/GET authentication', () => {
    //     it('it should quthenticate a invitation and return the correct jwt', (done) => {
    //         let invitationNew = new invitation(testInvitation);
    //         invitationNew.save((error, invitation) => {
    //             let payload = { invitation: invitation._id };
    //             var token = jwt.sign(payload, config.secret, {
    //                 expiresIn: config.expiration 
    //               });
    //             chai.request(index)
    //               .get('/api/invitation/authenticate')
    //               .send(testInvitation)
    //               .end((error, response) => {
    //                   response.should.have.status(200);
    //                   response.body.should.be.a('object');
    //                   response.body.should.have.property("token").eql(token)
    //               })
    //         });
    //     });
    // });

});
