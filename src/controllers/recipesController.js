const { validateRecipe, insertRecipe } = require('../services/recipesService');

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

module.exports = {
  newRecipe,
};