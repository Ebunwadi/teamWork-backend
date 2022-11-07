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

const token = jwt.sign({ userId: 101, isAdmin: true, email: 'my@gmail.com' }, process.env.JWT_SECRET);

describe('gif CRUD api', () => {
// post gifs
  it('should upload a gif successfully', () => {
    chai.request(server)
      .post('/api/v1/auth/create-gifs')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          title: 'first image',
          image: 'image/unilag passport.jpg',
        },
      )
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        done();
      });
  });

  it('should not upload a gif if title/image field is empty', () => {
    chai.request(server)
      .post('/api/v1/auth/create-gifs')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          title: '',
          image: 'image/unilag passport.jpg',
        },
      )
      .end((err, response) => {
        response.should.have.status(400);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should return a status of 403 if user doesnt have a token/not logged in', () => {
    chai.request(server)
      .post('/api/v1/auth/create-gifs')
      .send(
        {
          title: 'first image',
          image: 'image/unilag passport.jpg',
        },
      )
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        // done();
      });
  });
});
