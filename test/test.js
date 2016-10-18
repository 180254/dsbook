//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Notification = require('../model/notification.js');
let routes = require('../routes.js');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Notification', () => {

	describe('/POST Notifications', () => {
		it('with parameters is should return 200 status', (done) => {
			chai
				.request(server)
				.post('/notifications')
				.send({"username": "daa", "body": "asd"})
				.end((err, res) => {
					res
						.should
						.have
						.status(200);
					done();
				});
		});
    it('without parameters is should return 404 status', (done) => {
      chai
        .request(server)
        .post('/notifications')
        .send({})
        .end((err, res) => {
          res
            .should
            .have
            .status(200);
          done();
        });
    });

	});

	describe('/GET Notifications', () => {
		it('wihout set active parameter it should GET 404 status', (done) => {
			chai
				.request(server)
				.get('/notifications')
				.end((err, res) => {
					res
						.should
						.have
						.status(404);
					done();
				});
		});
	});

});
