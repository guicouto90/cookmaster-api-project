const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const server = require('../api/app') ;

const { getConnection } = require('./connectionMock');
const { MongoClient } = require('mongodb');

describe('POST /users', () => {
  let connectionMock;

  before(async() => {
    connectionMock = await getConnection();
    sinon.stub(MongoClient, 'connect').resolves(connectionMock);
  });

  after( () => {
    MongoClient.connect.restore();
  });


  describe('Quando o campo name, email ou password nao sao informados', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users/')
        .send({
          name: 'Robervaldo da Silva',
          email: 'robervaldo@teste.com'
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

  describe('Quando o campo email for invalido', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users/')
        .send({
          name: 'Robervaldo da Silva',
          email: 'robervaldo@tcom',
          password:'451278',
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
    });
  })

  describe('Quando algum campo seja diferente do tipo "string"', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users/')
        .send({
          name: 'Robervaldo da Silva',
          email: 'robervaldo@teste.com',
          password: 451278
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
    });
  });

  describe('Quando o campo de email já foi cadastrado', () => {
    let response;
    let response2;
    before(async () => {
      response = await chai.request(server)
        .post('/users/')
        .send({
          name: 'Robervaldo da Silva',
          email: 'robervaldo@teste.com',
          password: '451278'
        })
      response2 = await chai.request(server)
        .post('/users/')
        .send({
          name: 'Robervaldo da Costa',
          email: 'robervaldo@teste.com',
          password: '4556899'
        });
    });

    it('Retorna o status 409', () => {
      expect(response2).to.have.status(409);
    });

    it('Retorna um objeto no body', () => {
      expect(response2.body).to.be.an('object');
    });

    it('A resposta possuia a propriedade "message"', () => {
      expect(response2.body).to.have.property('message');
    })

    it('A propriedade "message" tenha o valor: Email already registered', () => {
      expect(response2.body.message).to.be.equals('Email already registered');
    });
  });

  describe('Quando o cadastrado do usuario e feito com sucesso', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/users/')
        .send({
          name: 'Robervaldo da Silva',
          email: 'robervaldodasilva@teste.com',
          password: '45127879898'
        })
    });

    it('Retorna o status 201', () => {
      expect(response).to.have.status(201);
    });

    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('Retorna um objeto no body que tenha a propriedade "user"', () => {
      expect(response.body).to.have.property('user');
    });

    it('Retorna um objeto no body que tenha a propriedade "name"', () => {
      expect(response.body.user).to.have.property('name');
    });

    it('Retorna um objeto no body que tenha a propriedade "email"', () => {
      expect(response.body.user).to.have.property('email');
    });

    it('Retorna um objeto no body que tenha a propriedade "role"', () => {
      expect(response.body.user).to.have.property('role');
    });

    it('Retorna um objeto no body que tenha a propriedade "_id"', () => {
      expect(response.body.user).to.have.property('_id');
    });
  });
});

