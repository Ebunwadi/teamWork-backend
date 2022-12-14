import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import pool from '../database/connect.js';
import server from '../server.js';

dotenv.config();

// ASSERTION STYLE
chai.should();

chai.use(chaiHttp);

const email = 'hellyebus@gmail.com';
const token = jwt.sign({ userId: 101, isAdmin: true, email: 'my@gmail.com' }, process.env.JWT_SECRET);

describe('Admin can create an employee user account and both admin/employee can login', () => {
  // create-user test
  it('should create a new employee when registered by an Admin', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-user')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          firstName: 'Ebbe',
          lastName: 'Peace',
          email,
          password: 'password',
          gender: 'Male',
          jobRole: 'DEngin',
          department: 'Admin',
          address: 'street',
          isAdmin: false,
        },
      )
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        done();
      });
  });

  after(async () => {
    await pool.query('DELETE FROM users WHERE email =$1', [email]);
  });

  it('should return 403 if user is not an admin/doesnt have a token', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-user')
      .send(
        {
          firstName: 'Ebbe',
          lastName: 'Peace',
          email: 'hey@gmail.com',
          password: 'password',
          gender: 'Male',
          jobRole: 'DEngin',
          department: 'Admin',
          address: 'street',
          isAdmin: false,
        },
      )
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('It should not create a new user with same email as another', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-user')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          firstName: 'Ebus',
          lastName: 'Nwa',
          email: 'mall@gmail.com',
          password: 'passwjbjord',
          gender: 'M',
          jobRole: ' Engineer',
          department: 'pro',
          address: 'street',
          isAdmin: false,
        },
      )
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('User already registered');
        done();
      });
  });

  it('it should not create employee with an invalid email', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-user')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          firstName: 'Ebus',
          lastName: 'Nwa',
          email: 'mailcom',
          password: 'pasjbjsword',
          gender: 'M',
          jobRole: ' Engineer',
          department: 'Admin',
          address: 'street',
          isAdmin: false,
        },
      )
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('it should not create an employee with one or more blank textfields', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-user')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          firstName: '',
          lastName: 'Nwa',
          email: 'mails@email.com',
          password: 'pahhhvssword',
          gender: 'M',
          jobRole: ' Engineer',
          department: 'Admin',
          address: 'street',
          isAdmin: false,
        },
      )
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  // login-user test
  it('It should login a user with a valid email and password', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login-user')
      .send(
        {
          email: 'hellodosa@gmail.com',
          password: 'password',
        },
      )
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        done();
      });
  });

  it('It should not login a user with an invalid email and password', (done) => {
    chai.request(server)
      .post('/api/v1/auth/login-user')
      .send(
        {
          email: 'dpll@gmail.com',
          password: 'passwhhhh',
        },
      )
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('error').eq('invalid email');
        done();
      });
  });
});
