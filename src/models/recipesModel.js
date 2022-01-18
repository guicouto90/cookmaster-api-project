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

const editRecipe = async (id, body, userId) => {
  const { name, ingredients, preparation } = body;
  const connect = await connection();
  await connect.collection('recipes').updateOne(
    { _id: ObjectId(id) },
    { $set: { name, ingredients, preparation, userId } },
  );
};

const deleteRecipe = async (id) => {
  const connect = await connection();
  await connect.collection('recipes').deleteOne({ _id: ObjectId(id) });
};

module.exports = {
  createRecipe,
  findAllRecipes,
  findById,
  editRecipe,
  deleteRecipe,
};