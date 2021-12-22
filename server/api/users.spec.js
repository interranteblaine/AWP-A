/* global describe beforeEach it */

const {expect} = require('chai')
const request = require('supertest')
const { db, models: { User } } = require('../db')
const seed = require('../../script/seed');
const app = require('../app')
const jwt = require('jsonwebtoken')

describe('User routes', () => {
  beforeEach(async() => {
    await seed();
  })

  describe('/api/users/', () => {

    it('GET /api/users', async () => {
      // because a token is required, we acquire a token for the get request
      const user = await User.findByPk(1);
      const token = await user.generateToken();
      
      // request is provided by SuperTest - simulates http get request
      const res = await request(app)
        .get('/api/users')
        .set({ "Authorization": `${token}`})
        .expect(200)

      // expect is from chai - allows us to compare the output to what we expect
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(2);
    })
  }) // end describe('/api/users')
}) // end describe('User routes')
