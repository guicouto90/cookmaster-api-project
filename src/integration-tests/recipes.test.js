const chai = require('chai');
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../middlewares/auth')

chai.use(chaiHttp);

const { expect } = chai;
const server = require('../api/app') ;

const { getConnection } = require('./connectionMock');
const { MongoClient } = require('mongodb');

describe('POST /recipes', () => {
  let connectionMock;
  const token = generateToken('user@ok.com');

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
        .set('authorization', token)
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

  describe('Quando o token JWT é inválido', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAb2suY29tIiwiaWF0IjoxNjQzMDYyNTc2LCJleHAiOjE2NDMwNjYxNzZ9.Ow0XFQRhboKhurOVtPZgO1dKXI17-zvfydWD7f6FI')
        .send({
          name: "Banana com arroz",
          ingredients: "Banana e arroz",
          preparation: "Misture o arroz junto com a banana"
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
  
    it('A propriedade "message" tenha o valor: jwt malformed.', () => {
      expect(response.body.message).to.be.equals('jwt malformed');
    })
  });

  describe('Quando não se tem o token JWT', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', '')
        .send({
          name: "Banana com arroz",
          ingredients: "Banana e arroz",
          preparation: "Misture o arroz junto com a banana"
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
  
    it('A propriedade "message" tenha o valor: missing auth token.', () => {
      expect(response.body.message).to.be.equals('missing auth token');
    })
  });

  describe('Quando está tudo ok e a receita é cadastrada com sucesso', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .post('/recipes')
        .set('authorization', token)
        .send({
          name: "Banana com arroz",
          ingredients: "Banana e arroz",
          preparation: "Misture o arroz junto com a banana"
        });
    });
    
    it('Retorna o status 201', () => {
      expect(response).to.have.status(201);
    });
  
    it('Retorna um objeto no body', () => {
      expect(response.body).to.be.an('object');
    });
  
    it('A resposta possuia a propriedade "recipe"', () => {
      expect(response.body).to.have.property('recipe');
    })
    it('A resposta possuia a propriedade "name"', () => {
      expect(response.body.recipe).to.have.property('name');
    })
    it('A resposta possuia a propriedade "ingredients"', () => {
      expect(response.body.recipe).to.have.property('ingredients');
    })
    it('A resposta possuia a propriedade "preparation"', () => {
      expect(response.body.recipe).to.have.property('preparation');
    })
    it('A resposta possuia a propriedade "userId"', () => {
      expect(response.body.recipe).to.have.property('userId');
    })
    it('A resposta possuia a propriedade "_id"', () => {
      expect(response.body.recipe).to.have.property('_id');
    })
  });
});

describe('GET /recipes', () => {
  let connectionMock;
  const token = generateToken('user@ok.com');

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      const recipesCollection = connectionMock.db('Cookmaster').collection('recipes');
  
      await recipesCollection.insertOne({
        name: 'Frango',
        ingredients: 'Frango, sazon',
        preparation: '10 minutos no forno',
      });
    });

  after( () => {
    MongoClient.connect.restore();
  });

  describe('Quando é listado as receitas cadastradas sem estar logado', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .get('/recipes')
        .set('authorization', '')
    });

    it('Retorna o status 200', () => {
      expect(response).to.have.status(200);
    });
  
    it('Retorna um array no body', () => {
      expect(response.body).to.be.an('array');
    });
  });

  describe('Quando é listado as receitas cadastradas estando logado', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .get('/recipes')
        .set('authorization', token)
    });

    it('Retorna o status 200', () => {
      expect(response).to.have.status(200);
    });
  
    it('Retorna um array no body', () => {
      expect(response.body).to.be.an('array');
    });
  });
});

describe('GET /recipes/:id', () => {
  let connectionMock;
  const token = generateToken('user@ok.com');
  const EXAMPLE_ID = '605de6ded1ff223100cd6aa1'

    before(async () => {
      connectionMock = await getConnection();
      sinon.stub(MongoClient, 'connect').resolves(connectionMock);
      
      const recipesCollection = connectionMock.db('Cookmaster').collection('recipes');

      await recipesCollection.insertOne({
        _id: EXAMPLE_ID,
        name: 'Frango',
        ingredients: 'Frango, sazon',
        preparation: '10 minutos no forno',
      });
    });

  after( () => {
    MongoClient.connect.restore();
  });

  describe('Quando é listado as receitas cadastradas sem estar logado', () => {
    let response;
    before(async () => {
      response = await chai.request(server)
        .get(`/recipes/${EXAMPLE_ID}`)
        .set('authorization', '')
    });
    

    it('Retorna o status 200', () => {
      expect(response).to.have.status(200);
    });
  
    it('Retorna um object no body', () => {
      expect(response.body).to.be.an('object');
    });

    it('Retorna a propriedade "_id"', () => {
      expect(response.body).to.have.property('_id');
    });

    it('Retorna a propriedade "name"', () => {
      expect(response.body).to.have.property('name');
    });

    it('Retorna a propriedade "ingredients"', () => {
      expect(response.body).to.have.property('ingredients');
    });

    it('Retorna a propriedade "preparation"', () => {
      expect(response.body).to.have.property('preparation');
    });

    it('Retorna a propriedade "userId"', () => {
      expect(response.body).to.have.property('userId');
    });
  });
});