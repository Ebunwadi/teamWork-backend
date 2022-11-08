import * as dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';
import pool from '../database/connect.js';

dotenv.config();

// ASSERTION STYLE
chai.should();

chai.use(chaiHttp);

const token = jwt.sign({ userid: 90, isAdmin: true, email: 'hea@gmail.com' }, process.env.JWT_SECRET);
const tokens = jwt.sign({ userid: 4, isAdmin: true, email: 'hellodosa@gmail.com' }, process.env.JWT_SECRET);

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
      });
  });

  //   delete gifs
  it('should return a 404 if no gif with the requested id is found', () => {
    chai.request(server)
      .delete('/api/v1/auth/delete-gifs/50')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
      });
  });

  it('should return a 403 if an employee wants to delete another employees gif', () => {
    chai.request(server)
      .delete('/api/v1/auth/delete-gifs/2')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
      });
  });
  // get all gifs
  it('should get all gifs', () => {
    chai.request(server)
      .get('/api/v1/auth/get-gifs')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
      });
  });

  // get single gif
  it('should get a gif with the requested params', () => {
    chai.request(server)
      .get('/api/v1/auth/get-single-gif/2')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
      });
  });

  it('should return a 404 if no gif with the requested id is found', () => {
    chai.request(server)
      .get('/api/v1/auth/get-single-gif/50')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
      });
  });

  // test gif comments
  it('should post a comment successfully', (done) => {
    chai.request(server)
      .post('/api/v1/auth/gif-comment/2/comment')
      .set('authorization', `Bearer ${tokens}`)
      .send(
        {
          comment: 'a comment',
        },
      )
      .end((err, response) => {
        console.log(err);
        response.body.should.have.status('success');
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        done();
      });
  });

  it('should return a 404 if the specified gifId is not found', (done) => {
    chai.request(server)
      .post('/api/v1/auth/gif-comment/20/comment')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          comment: 'a comment',
        },
      )
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should not post a comment if the field is empty or more than 100', (done) => {
    chai.request(server)
      .post('/api/v1/auth/gif-comment/2/comment')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          comment: '',
        },
      )
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });
});
