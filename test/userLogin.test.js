const mongoose = require("mongoose");
const userModel = require('../models/Users/hotelOwnerRegister');

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../index');


chai.use(chaiHttp);

/*
  * Test the /POST route
  */
// describe('logout user', () => {
//     // it('it should logout the user with this request', (done) => {
//     //     let user = {
//     //         "userName": "vbbolpmn",
//     //         "password": "098765",
//     //         "genVariable": "vbbo2648"
//     //     }
//     //     let userId = 'svHSDPdoKc'
//     //     chai.request(server)
//     //         .post(`/userLogout/${userId}`)
//     //         .send(user)
//     //         .end((err, res) => {
//     //             res.should.have.status(200);
//     //             res.body.should.be.a('object');
//     //             done();
//     //         });
//     // }).timeout(10000);
//     it('it should not post when registrationid is empty ', (done) => {
//         let user = {
//             userName: "vbbolpmn",
//             password: "098765",
//             genVariable: "vbbo2648"
//         }
//         let userId = 'svHSDPdoKc'
//         chai.request(server)
//             .post(`/userLogout/${userId}`)
//             .send(user)
//             .end((err, res) => {
//                 res.should.have.status(400);
//                 res.body.should.be.a('object');
//                 res.body.should.have.property('message').eql('Please login again');
//                 // req.body.user.should.have.property('userName');
//                 // res.body.book.should.have.property('author');
//                 // res.body.book.should.have.property('pages');
//                 // res.body.book.should.have.property('year');
//                 done();
//             });
//     }).timeout(10000);
// });

describe('login user', () => {
    // it('should login successsfully', (done) => {
    //     let user = {
    //         userName: "vbbolpmn",
    //         password: "098765",
    //         genVariable: "vbbo2648"
    //     }
    //     let userId = 'svHSDPdoKc'
    //     chai.request(server)
    //         .post(`/userLogin/${userId}`)
    //         .send(user)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('message').eql('Login successful');
    //             // req.body.user.should.have.property('userName');
    //             // res.body.book.should.have.property('author');
    //             // res.body.book.should.have.property('pages');
    //             // res.body.book.should.have.property('year');
    //             done();
    //         });
    // }).timeout(10000);
    // it('should not login  with wrong credentials', (done) => {
    //     let user = {
    //         userName: "vbbolpmn",
    //         password: "09876",
    //         genVariable: "vbbo2648"
    //     }
    //     let userId = 'svHSDPdoKc'
    //     chai.request(server)
    //         .post(`/userLogin/${userId}`)
    //         .send(user)
    //         .end((err, res) => {
    //             res.should.have.status(400);
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('message').eql('Invalid credentials');
    //             // req.body.user.should.have.property('userName');
    //             // res.body.book.should.have.property('author');
    //             // res.body.book.should.have.property('pages');
    //             // res.body.book.should.have.property('year');
    //             done();
    //         });

    // }).timeout(10000);
    it('should give 429 code after 5 wrong attempts', (done) => {
        let user = {
            userName: "vbbolpmn",
            password: "09876",
            genVariable: "vbbo2648"
        }
        let userId = 'svHSDPdoKc'
        const currentHours = 13; // Set the currentHours to simulate the condition

        // Simulate the condition where count is greater than or equal to 4
        const count = 4;
        // Perform the update using your user model
         userModel.updateOne(
            { userId: userId },
            { $set: { blockedUntil: (currentHours + 3) % 24, loginAttempts: 0 } }
        );
         chai.request(server)
            .post(`/userLogin/${userId}`) // Replace with the actual login endpoint
            .send(user) // Replace with valid login credentials
            .end((err, res) => {
                res.should.have.status(429);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Too many login attempts, please try again after 3 hours');
                // req.body.user.should.have.property('userName');
                // res.body.book.should.have.property('author');
                // res.body.book.should.have.property('pages');
                // res.body.book.should.have.property('year');
                done();
            })

        }).timeout(10000)
    })
