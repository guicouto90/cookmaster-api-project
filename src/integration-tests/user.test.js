const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const { expect } = chai;
const server = require('../api/app') ;

const { getConnection } = require('./connectionMock');
const { MongoClient } = require('mongodb');

const jwt = require('jsonwebtoken');

let connectionMock;

before(async() => {
  connectionMock = await getConnection();
  sinon.stub(MongoClient, 'connect').resolves(connectionMock);
});

after( () => {
  MongoClient.connect.restore();
});

/*
  1 - Quando algum dos campos não sao informados:
  name, email, password; Retorna o erro 400 com a mensagem: "Invalid entries. Try again"
  2 - Se o campo email for invalido: retorna o erro 400 com a mensagem: "Invalid entries. Try again";
  3 - Se algum dos campos forem diferentes de string, retorna o "Invalid entries. Try again." erro 400.
  4 - Se o email ja foi cadastrado, retorna a mensagem: "Email already registered", erro 409;
  5 - Se estiver tudo certo, retorna um objeto: 
    user: {
      name,
      email,
      role
      id
    };
    com o codigo: 201

*/ 
describe('Quando o campo name, email ou password nao sao informados', async () => {
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
});
