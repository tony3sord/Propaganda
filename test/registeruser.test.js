import { expect } from 'chai';
import request from 'supertest';
import app from '../app.js';

describe('POST /user/login', () => {
  it('Se logueo', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        user: 'testuser',
        password: 'testpassword'
      });

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.property('user');
  });
});