import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';

// ASSERTION STYLE
chai.should();

chai.use(chaiHttp);

describe('Admin can create an employee user account', () => {
  describe('POST /api/v1/auth/create-user', () => {
    it('it should create a new employee', (done) => {
      chai.request(server)
        .post('/api/v1/auth/create-user')
        .send(
          {
            firstName: 'Ebbe',
            lastName: 'Peace',
            email: 'dyppll@gmail.com',
            password: 'password',
            gender: 'Male',
            jobRole: 'DEngin',
            department: 'Admin',
            address: 'street',
            isAdmin: true,
          },
        )
        .end((err, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.data.payload.should.have.property('isAdmin').eq(true);
          response.body.should.have.property('status').eq('success');
          done();
        });
    });

    it('It should not create a new user with same email as another', (done) => {
      chai.request(server)
        .post('/api/v1/auth/create-user')
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
            isAdmin: true,
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
            isAdmin: true,
          },
        )
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eq('invalid email');
          done();
        });
    });

    it('it should not create an employee with one or more blank textfields', (done) => {
      chai.request(server)
        .post('/api/v1/auth/create-user')
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
            isAdmin: true,
          },
        )
        .end((err, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object');
          response.body.should.have.property('error').eq('missing credentials');
          done();
        });
    });
  });
});
