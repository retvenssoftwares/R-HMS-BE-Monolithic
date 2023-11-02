const mongoose = require("mongoose");
const hotelAndEmployee = require('../models/Users/hotelOwnerRegister');
const readline = require('readline')
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');



chai.use(chaiHttp);

/*
  * Test the /POST route
  */
describe('SessionIn', () => {
    it('it will continue the session of user in HMS (session out)', (done) => {

        let data = {
            password : "98598649864"
        }

        let userId = "C2dJ6hsXXV"
       
            chai.request(server)
                .patch(`/sessionIn/${userId}`)
                .send(data)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('you log in again');
    
                    done();
                });
        
    }).timeout(10000);

});