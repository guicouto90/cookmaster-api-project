const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

const { expect } = chai;
const server = require('../api/app') ;

const { getConnection } = require('./connectionMock');
const { MongoClient } = require('mongodb');

describe('POST /recipes', () => {
  let connectionMock;

  before(async() => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after( () => {
    MongoClient.connect.restore();
  });
  
  describe('Quando o campo name, ingredients ou preparation não é informado ', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAb2suY29tIiwiaWF0IjoxNjQzMDYyNTc2LCJleHAiOjE2NDMwNjYxNzZ9.Ow0XFQRhboKhurOVtPZgO1dKXI17-zvfydWD7f6FIVc')
        .send({
          name: "Banana com arroz",
          ingredients: "Banana e arroz",
        });
    });
    
    it('Retorna o status 400', () => {
      expect(response).to.have.status(400);
    });
  
    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });
  
    it('A resposta possuia a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    })
  
    it('A propriedade "message" tenha o valor: Invalid entries. Try again.', () => {
      expect(response.body.message).to.be.equals('Invalid entries. Try again.');
    })
  });
  
  
  /*describe('Quando login é feito com sucesso', () => {
    let response;
    before(async () => {
      const usersCollection = connectionMock.db('Cookmaster').collection('users');
  
      await usersCollection.insertOne({
        email: 'user@ok.com',
        password: 'passwordok'
      });
  
      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'user@ok.com',
          password: 'passwordok'
        });
    });
    
    it('Retorna o status 200', () => {
      expect(response).to.have.status(200);
    });
  
    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });
  
    it('A resposta possuia a propriedade "token"', () => {
      expect(response.body).to.have.property('token');
    })
  
    it('A propriedade "token" deve conter um token JWT, com email usado no login', () => {
      const token = response.body.token;
      const payload = jwt.decode(token)
      console.log(payload);
      expect(payload.email).to.be.equals('user@ok.com');
    })
  });*/
})