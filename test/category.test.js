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

const categoryName = 'Electionss';
const token = jwt.sign({ userid: 90, isAdmin: true, email: 'hea@gmail.com' }, process.env.JWT_SECRET);
const tokenn = jwt.sign({ userid: 100, isAdmin: false, email: 'headies@gmail.com' }, process.env.JWT_SECRET);

describe('category CRUD api', () => {
  // post category
  it('should only allow an admin create a category', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-category')
      .set('authorization', `Bearer ${tokenn}`)
      .send(
        {
          category: 'politics',
        },
      )
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should not create a category if it already exists', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-category')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          category: 'Economy',
        },
      )
      .end((err, response) => {
        console.log(err);
        response.should.have.status(401);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should allow an admin create a category', (done) => {
    chai.request(server)
      .post('/api/v1/auth/create-category')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          categoryName,
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
    await pool.query('DELETE FROM category WHERE category_name =$1', [categoryName]);
  });

  //   admin can delete a category
  it('should allow only an admin delete a category', (done) => {
    chai.request(server)
      .delete('/api/v1/auth/delete-category/1')
      .set('authorization', `Bearer ${tokenn}`)
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should return a 404 if the category id is not found', (done) => {
    chai.request(server)
      .delete('/api/v1/auth/delete-category/10')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        console.log();
        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  //   admin can update category
  it('should return a 404 if the category id is not found', (done) => {
    chai.request(server)
      .put('/api/v1/auth/update-category/20')
      .set('authorization', `Bearer ${token}`)
      .send(
        {
          categoryName,
        },
      )
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should not allow an employee update a category', (done) => {
    chai.request(server)
      .put('/api/v1/auth/update-category/1')
      .set('authorization', `Bearer ${tokenn}`)
      .send(
        {
          categoryName,
        },
      )
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  // get a single category
  it('should return a 404 if the category id is not found', (done) => {
    chai.request(server)
      .get('/api/v1/auth/get-category/20')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(404);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('error');
        done();
      });
  });

  it('should get a single category', (done) => {
    chai.request(server)
      .get('/api/v1/auth/get-category/1')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        done();
      });
  });

  // get all categories
  it('should get all categories', (done) => {
    chai.request(server)
      .get('/api/v1/auth/get-all-categories')
      .set('authorization', `Bearer ${token}`)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('status').eq('success');
        done();
      });
  });
});
