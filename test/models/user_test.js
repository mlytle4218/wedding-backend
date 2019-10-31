let mongoose = require('mongoose');
let invitation = require('../../api/models/invitation');

let chai = require('chai'); let chaiHttp = require('chai-http');
let should = chai.should()
let index = require('../../index');
let jwt = require('jsonwebtoken');
let config = require('../../config');


chai.use(chaiHttp);

let token = null;

describe('Users', () => {

    describe('/POST user/signIn', () => {
        it('In it should sign the user in and get a token', (done) => {
            chai.request(index).post('/api/user/signIn').send({
                "email": "example",
                "password": "123456789"
            }).end((error, response) => {
                response.should.have.status(200);
                response.body.should.have.property('result').eql(true);
                token = response.body.token;
                done();
            });
        });
    });    
    describe('/GET invitations', () => {
        it('it get all the invitations', (done) => {
            chai.request(index)
                .get('/api/invitation')
                .set('Authorization', 'Bearer ' + token)
                .end((error, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    // response.body.length.should.be.eql(0)
                    done();
                });
        });
    });
});


