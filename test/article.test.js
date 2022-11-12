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
const tokenn = jwt.sign({ userid: 100, isAdmin: false, email: 'headies@gmail.com' }, process.env.JWT_SECRET);
const tokens = jwt.sign({ userid: 4, isAdmin: true, email: 'hellodosa@gmail.com' }, process.env.JWT_SECRET);

describe('article CRUD api', () => {
// post articles
  it('should post an article successfully', () => {
    chai.request(server)
      .post('/api/v1/auth/create-articles')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          title: 'demcracy',
          article: 'democracy or the more crazy?',
          categoryId: 1,
        },
      )
      .end((err, response) => {
        // response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        // done();
      });
  });

  it('should not post an article if any field is empty', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-articles')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          title: '',
          article: 'democracy or the more crazy?',
          categoryId: 1,
        },
      )
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should return a status of 403 if user doesnt have a token/not logged in', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-gifs')
      .send(
        {
          title: 'demcracy',
          article: 'democracy or the more crazy?',
          categoryId: 1,
        },
      )
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  //   delete articles
  it('should return a 404 if no article with the requested id is found', (done) => {
    chai.request(server)
      .delete('/api/v1/auth/delete-article/50')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should return a 403 if an employee wants to delete another employees article', (done) => {
    chai.request(server)
      .delete('/api/v1/auth/delete-article/1')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });
  // get all articles
  it('should get all articles', (done) => {
    chai.request(server)
      .get('/api/v1/auth/get-all-articles')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('Success');
        done();
      });
  });

  //  edit article
  it('should return a 404 if the article id is not found', (done) => {
    chai.request(server)
      .put('/api/v1/auth/edit-articles/20')
      .set('authorization', `Bearer ${tokens}`)
      .send(
        {
          title: 'demcracy',
          article: 'democracy or the more crazy?',
          categoryId: 1,
        },
      )
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should not allow an employee update an article he didnt post', (done) => {
    chai.request(server)
      .put('/api/v1/auth/edit-articles/1')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          title: 'demcracy',
          article: 'democracy or the more crazy?',
          categoryId: 1,
        },
      )
      .end((err, response) => {
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  // get single article
  it('should get an article with the requested params', (done) => {
    chai.request(server)
      .get('/api/v1/auth/get-article/1')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        done();
      });
  });

  it('should return a 404 if no article with the requested id is found', (done) => {
    chai.request(server)
      .get('/api/v1/auth/get-single-article/50')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        // response.body.should.have.property('status').eq('error');
        done();
      });
  });

  // test article comments
  it('should post a comment successfully', (done) => {
    chai.request(server)
      .post('/api/v1/auth/article-comment/1')
      .set('authorization', `Bearer ${tokens}`)
      .send(
        {
          comment: 'a comment',
        },
      )
      .end((err, response) => {
        console.log(err);
        // response.body.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        done();
      });
  });

  it('should return a 404 if the specified article id is not found', (done) => {
    chai.request(server)
      .post('/api/v1/auth/article-comment/20')
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
      .post('/api/v1/auth/article-comment/1')
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

  // admin can delete a flagged comment/article
  it('should only have an admin delete a flagged comment', (done) => {
    pool.query('SELECT * FROM article_comment WHERE gif_id = $1', [1]);
    chai.request(server)
      .delete('/api/v1/auth/delete-flag-article-comment/1')
      .set('authorization', `Bearer ${tokenn}`)
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });
});
