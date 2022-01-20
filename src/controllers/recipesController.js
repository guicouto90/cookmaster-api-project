const { 
  validateRecipe, 
  insertRecipe, 
  getAllRecipes, 
  getById,
  updateRecipe,
  eraseRecipe,
  insertImageById,
  getImage, 
} = require('../services/recipesService');

const newRecipe = async (req, res, next) => {
  try {
    const { name, ingredients, preparation } = req.body;
    const { email } = req;

    validateRecipe(req.body);
    const recipe = await insertRecipe(name, ingredients, preparation, email);

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
    // const { authorization } = req.headers;
    const { email } = req;
    console.log(email);
    validateRecipe(req.body);
    const recipe = await updateRecipe(id, email, req.body);

    return res.status(200).json(recipe);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const eraseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await eraseRecipe(id);

    return res.status(204).json({});
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const newImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const image = await insertImageById(id);

    return res.status(200).json(image);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const listImageById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recipeImage = await getImage(id);
    return res.status(200).json(recipeImage);
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
  listImageById,
};