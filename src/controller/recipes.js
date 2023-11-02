const {
  getAllRecipes,
  postRecipe,
  getRecipeById,
  putRecipe,
  deleteRecipeById,
  getCategory,
} = require("../model/recipes");

const RecipesController = {
  getRecipes: async (req, res, next) => {
    let recipes = await getAllRecipes();
    let data = recipes.rows;

    if (!data) {
      return res.status(404).json({ message: "failed to get data" });
    }

    data.forEach((item,index)=>{
      let ingredients = item.ingredients.split(",")
      data[index].ingredients=ingredients
      console.log(item.ingredients);
    })

    res.status(200).json({ message: "success get data", data });
  },

  categoryAll: async (req, res, next) => { 
    let category = await getCategory()

    res.status(200).json({ message: "success get data", data: category.rows });
  },

  getRecipesDetail: async (req, res, next) => {
    let recipes = await getAllRecipes();
    let data = recipes.rows;

    if (!data) {
      return res.status(404).json({ message: "failed to get data" });
    }

    data.forEach((item,index)=>{
      let ingredients = item.ingredients.split(",")
      data[index].ingredients=ingredients
      console.log(item.ingredients);
    })

    res.status(200).json({ message: "success get data", data });
  },

  getRecipeId: async (req, res, next) => {
    let id = req.params.id;
    console.log("param id = ", id);
    let recipes = await getRecipeById(id);
    let data = recipes.rows[0];
    data.ingredients=data.ingredients.split(",")

    if (!data) {
      return res.status(404).json({ message: "failed to get data" });
    }

    res.status(200).json({ message: "success get data", data });
  },

  deleteRecipeId: async (req, res, next) => {
    let id = req.params.id;
    console.log("param id = ", id);
    let recipes = await deleteRecipeById(id);
    console.log("recipes ", recipes)

    if (recipes.rowCount == 0) {
      return res.status(404).json({ message: "failed delete data" });
    }

    res.status(200).json({ message: "success delete data", data });
  },

  inputRecipe: async (req, res, next) => {
    let { title, ingredients, photo, category_id } = req.body;

    console.log( title, ingredients, photo, category_id);

    if (!title || !ingredients || !photo || !category_id) {
      return res
        .status(404)
        .json({ message: "failed input data, title, ingredients, photo, category_id is required" });
    }

    let category = await getCategory()
    let is_category = false 
    category.rows.forEach(item => {
        if (item.id == category_id) {
          is_category=true
        }
    });

    if (!is_category) {
      return res.status(404).json({ message: "category invalid" });
    }


    let data = { title, ingredients,photo,category_id: parseInt(category_id) };
    let result = await postRecipe(data);

    if (!result) {
      return res.status(404).json({ message: "failed input data" });
    }
    res.status(200).json({ message: "success input data" });
  },
  updateRecipe: async (req, res, next) => {
    let id = req.params.id;
    let {title, ingredients,photo,category_id } = req.body;
    console.log( title, ingredients,photo,category_id);

    let recipe_Data = await getRecipeById(id);

    if (recipe_Data.rowCount == 0) {
      return res.status(404).json({ message: "failed data not found" });
    }

    // check category
    let category = await getCategory()
    let is_category = false 
    category.rows.forEach(item => {
        if (item.id == category_id) {
          is_category=true
        }
    });

    if (!is_category) {
      return res.status(404).json({ message: "category invalid" });
    }

    let data = recipe_Data.rows[0];
    let newData ={
      id:data.id,
      title:title || data.title,
      ingredients:ingredients || data.ingredients,
      photo:photo || data.photo,
      category_id: parseInt(category_id) || data.category_id,
    }

    console.log(data);

    let result = await putRecipe(newData);
    console.log(result);

    if (!result) {
      return res.status(404).json({ message: "failed update data" });
    }
    res.status(200).json({ message: "success update data" });
  },
};

module.exports = RecipesController;
