const { ObjectId } = require('mongodb');
const connection = require('./connection');

const createRecipe = async (name, ingredients, preparation, userId) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('recipes')
    .insertOne({ name, ingredients, preparation, userId });

  return insertedId;
};

const findAllRecipes = async () => {
  const connect = await connection();
  const query = await connect.collection('recipes').find({}).toArray();

  return query;
};

const findById = async (id) => {
  const connect = await connection();
  const query = await connect.collection('recipes').findOne({ _id: ObjectId(id) });

  return query;
};

module.exports = {
  createRecipe,
  findAllRecipes,
  findById,
};