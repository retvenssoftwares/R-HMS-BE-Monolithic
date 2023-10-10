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
describe('SessionOut', () => {

    it('it will remove out the people from the dashboard of HMS (session out)', (done) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    
        rl.question('Please enter the user ID: ', async (userId) => {
            chai.request(server)
                .patch(`/sessionOut/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('your session Time out');
    
                    rl.close(); // Close the readline interface
                    done();
                });
        });
    }).timeout(10000);
});