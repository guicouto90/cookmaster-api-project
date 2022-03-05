const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

chai.use(chaiHttp);

const { expect } = chai;
const server = require('../api/app') ;

const { getConnection } = require('./connectionMock');
const { MongoClient } = require('mongodb');

describe('POST /login', () => {
  let connectionMock;

  before(async() => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after( () => {
    MongoClient.connect.restore();
  });

  describe('Quando o campo email ou password nao sao informados', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'robervaldo@teste.com',
        });
    });
    
    it('Retorna o status 401', () => {
      expect(response).to.have.status(401);
    });
  
    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });
  
    it('A resposta possuia a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    })
  
    it('A propriedade "message" tenha o valor: All fields must be filled', () => {
      expect(response.body.message).to.be.equals('All fields must be filled');
    })
  });
  
  describe('Quando pessoa usuária não existe ou senha é invalida', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/login')
        .send({
          email: 'fake@fake.com',
          password: 'fakepassword'
        });
    });
    
    it('Retorna o status 401', () => {
      expect(response).to.have.status(401);
    });
  
    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });
  
    it('A resposta possuia a propriedade "message"', () => {
      expect(response.body).to.have.property('message');
    })
  
    it('A propriedade "message" tenha o valor: Incorrect username or password', () => {
      expect(response.body.message).to.be.equals('Incorrect username or password');
    })
  });
  
  describe('Quando login é feito com sucesso', () => {
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
      expect(payload.email).to.be.equals('user@ok.com');
    })
  });
})

