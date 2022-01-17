const connection = require('./connection');

const createRecipe = async (name, ingredients, preparation) => {
  const connect = await connection();
  const { insertedId } = await connect.collection('recipes')
    .insertOne({ name, ingredients, preparation });

  return insertedId;
};

module.exports = {
  createRecipe,
};