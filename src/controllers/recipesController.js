const { 
  validateRecipe, 
  insertRecipe, 
  getAllRecipes, 
  getById,
  updateRecipe,
  eraseRecipe,
  insertImageById, 
} = require('../services/recipesService');

const newRecipe = async (req, res, next) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const { authorization } = req.headers;

    validateRecipe(req.body);
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

const updateById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorization } = req.headers;
    
    validateRecipe(req.body);
    const recipe = await updateRecipe(id, authorization, req.body);

    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const eraseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorization } = req.headers;
    
    await eraseRecipe(authorization, id);

    return res.status(204).json({});
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const newImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { authorization } = req.headers;

    const image = await insertImageById(authorization, id);

    return res.status(200).json(image);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

module.exports = {
  newRecipe,
  listRecipes,
  listById,
  updateById,
  eraseById,
  newImage,
};