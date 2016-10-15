//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Notyfication = require('../models/notyfication.js');
let routes = require('../routes.js');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);
//Our parent block
describe('Notyfication', () => {

	describe('/POST Notyfications', () => {
		it('with parameters is should return 200 status', (done) => {
			chai
				.request(server)
				.post('/notyfications')
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
        .post('/notyfications')
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

	describe('/GET Notyfications', () => {
		it('wihout set active parameter it should GET 404 status', (done) => {
			chai
				.request(server)
				.get('/notyfications')
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
