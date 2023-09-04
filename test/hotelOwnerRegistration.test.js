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
describe('Register', () => {
    it('it will register the hotel owner and employee', (done) => {
        let user = {
            // enter unique name otherwise it will give 500 error code
            userName: "preet8mm90",
            password: "preet@@",
            fullName:"preet patil",
            mobile : "9594896789",
            email:"preet.patil@retvensservices.com",
            genVariable: "pree6789",
            //role:"hotelOwner"
        }
        
        chai.request(server)
            .post(`/postHotelAndEmployee`)
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('User Register Successfully');

                done();
            });
    }).timeout(10000);
});