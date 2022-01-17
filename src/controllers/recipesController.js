const { 
  validateRecipe, 
  insertRecipe, 
  getAllRecipes, 
  getById, 
} = require('../services/recipesService');

const newRecipe = async (req, res, next) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const { authorization } = req.headers;

    validateRecipe(name, ingredients, preparation);
    const recipe = await insertRecipe(name, ingredients, preparation, authorization);

    return res.status(201).json(recipe);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const listRecipes = async (req, res, next) => {
  try {
    const recipes = await getAllRecipes();

    return res.status(200).json(recipes);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const listById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipe = await getById(id);

    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  newRecipe,
  listRecipes,
  listById,
};