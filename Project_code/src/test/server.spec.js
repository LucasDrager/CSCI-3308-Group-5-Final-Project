// Imports the index.js file to be tested.
const server = require('../index'); //TO-DO Make sure the path to your index.js is correctly added
// Importing libraries

// Chai HTTP provides an interface for live integration testing of the API's.
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.should();
chai.use(chaiHttp);
const {assert, expect} = chai;

describe('Server!', () => {
  // Sample test case given to test / endpoint.
  it('Returns the default welcome message', done => {
    chai
      .request(server)
      .get('/welcome')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equals('success');
        assert.strictEqual(res.body.message, 'Welcome!');
        done();
      });
  });

  // ===========================================================================
  // TO-DO: Part A Login unit test case
  // We are checking POST /add_user API by passing the user info in the correct order. This test case should pass and return a status 200 along with a "Success" message.
  // Positive cases
  it('Positive : /login', function (done) {
    chai
      .request(server)
      .post("/login")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({username: "Testerson", password: "password"})
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Negative : /login', function (done) {
    chai
      .request(server)
      .post("/login")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({username: "", password: ""})
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  it('Negative : /register. Checking invalid user', function (done) {
    chai
      .request(server)
      .post("/login")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send()
      .end(function (err, res) {
        expect(res).to.have.status(200);
        done();
      });
  });

  // TO-DO: Part B Other test cases
  it('positive : /register', done => {
    chai
      .request(server)
      .post("/register")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({username:"Admin",password:"Admin"})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });

  // //We are checking POST /add_user API by passing the user info in in incorrect manner (name cannot be an integer). This test case should pass and return a status 200 along with a "Invalid input" message.
  it('Negative : /register. Checking invalid name', done => {
    chai
      .request(server)
      .post("/register")
      .set('content-type', 'application/x-www-form-urlencoded')
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});