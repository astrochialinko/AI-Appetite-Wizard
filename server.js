/*
 * Description: Server for AI Apetite Wizard/CookMe. This server will
 *              handle all requests from the client and respond with the
 *              appropriate data.
 *
 * Authors: Justin Adams, Chia-Lin Ko, and Creed Leichtle
 *
 * Course: CSC 337 Web Development
 */

const mongoose = require("mongoose");
const express = require("express");
const parser = require("body-parser");
const app = express();
// const port = 3000;
const port = 80;

// Connect to the database
const db = mongoose.connection;
// const mongoDBURL = "mongodb://127.0.0.1/aiapetite";
const mongoDBURL = "mongodb://127.0.0.1:27017/aiapetite";
mongoose.connect(mongoDBURL, { useNewUrlParser: true });
db.on("error", () => {
  console.log("MongoDB connection error");
});

// Set up the schema for the recpies
var recipeSchema = new mongoose.Schema({
  name: String,
  images: [String],
  shortDesc: String,
  longDesc: String,
  ingredients: [String],
  cookTime: Number,
  category: [String],
  difficulty: Number,
});

var Recipes = mongoose.model("Recipes", recipeSchema);

// Set up the schema for the users
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  favorites: [String],
  pantry: [String],
});

var Users = mongoose.model("Users", userSchema);

// Middleware
app.use(express.static("public_html"));
app.use(parser.json());

/**
 * The following requests involve ingredient management
 *
 * A POST request to add an ingredient to the user's pantry
 * A GET request to get the user's pantry
 */

// POST request to add a new ingredient to the user's pantry
app.post("/pantry/addingredient", (req, res) => {
  const username = req.body.username;
  const ingredient = req.body.ingredient;

  // Find the user in the database
  let p = Users.find({username: {$regex: new RegExp("^" + username, "i")}}).exec();

  // Add the ingredient to the user's pantry
  p.then((user) => {
    user.pantry.push(ingredient);
    user.save();
  }).catch((err) => {
    console.log(err);
    console.log("There was an issue adding the ingredient to the pantry");
  });
});

// GET request to get the user's pantry
app.get("/pantry/:username", (req, res) => {
  const username = req.params.username;

  // Find the user in the database
  let p = Users.find({username: {$regex: new RegExp("^" + username, "i")}}).exec();

  // Send the user's pantry
  p.then((user) => {
    res.send(user.pantry);
  }).catch((err) => {
    console.log(err);
    console.log("There was an issue getting the user's pantry");
  });
});

/**
 * The following requests involve searching
 *
 * A GET request for recipes based on ingredients
 * A GET request for recipes that exactly match the user's pantry
 * A GET request for recpies with one or two missing ingredients
 * A GET request to browse all recipes
 * A GET request to get a specific recipe
 */

// GET request for recipes based on ingredients
app.get("/get/recipes/:ingredients", (req, res) => {
  const ingredients = req.params.ingredients.split(",");

  // Find the recipes in the database
  let p = Recipes.find({ ingredients: { $in: ingredients } }).exec();

  // Send the recipes
  p.then((recipes) => {
    res.send(recipes);
  }).catch((err) => {
    console.log(err);
    console.log("There was an issue getting the recipes");
  });
});

// GET request for recipes that exactly match the user's pantry
app.get("/get/recipes/match-strict/:username", req, res => {
  const username = req.params.username;

  // Find the user in the database
  let p = Users.findOne({username: {$regex: new RegExp("^" + username, "i")}}).exec();

  // Send the recipes
  p.then((user) => {
    
    // Find the recipes in the database, $all is used to match all ingredients, $size is used to ensure array lengths are the same size
    let p1 = Recipes.find({ingredients: {$all: user.pantry, $size: user.pantry.length}}).exec();
    p1.then((recipes) => {
      res.send(recipes);
    }).catch((err) => {
      console.log(err);
      console.log("There was an issue getting the recipes");
    });
  }).catch((err) => {
    console.log(err);
    console.log("There was an issue getting the user");
  });
});

// GET request for recipes with one or two missing ingredients
app.get("/get/recipes/match-relaxed/:username", req, res => {
  const username = req.params.username;

  // Find the user in the database
  let p = Users.findOne({username: {$regex: new RegExp("^" + username, "i")}}).exec();

  /*
    Send the recipes
    This is a bit more complex than the other requests, and I'm not sure if this is the most effecient way to do it
    The idea is to fetch all recipes from the database, then filter out the recipes with one or two missing ingredients.
  */
  p.then((user) => {
    let p1 = Recipes.find({}).exec();
    p1.then((recipes) => {
      
      // Create an array to hold the recipes that match the criteria
      let filteredRecipes = [];

      // Iterate through all the recipes
      recipes.forEach((recipe) => {
        let missingIngredients = 0;

        // Iterate through all the ingredients in the recipe
        recipe.ingredients.forEach((ingredient) => {
          if (!user.pantry.includes(ingredient)) {
            missingIngredients++;
          }
        });

        // If the recipe only has one or two missing ingredients, add it to the array
        if (missingIngredients <= 2) {
          filteredRecipes.push(recipe);
        }
      });
      res.send(filteredRecipes);
    }).catch((err) => {
      console.log(err);
      console.log("There was an issue getting the recipes");
    });
  }).catch((err) => {
    console.log(err);
    console.log("There was an issue getting the user");
  });
});

// GET request to browse all recipes
app.get("/get/recipes/browse", req, res => {
  // Fetch all recipes
  let p = Recipes.find({}).exec();

  // Send the recipes
  p.then((recipes) => {
    res.send(recipes);
  }).catch((err) => {
    console.log(err);
    console.log("There was an issue getting the recipes");
  });
});

// GET request to get a specific recipe
app.get("/get/recipes/:term", req, res => {
  const term = req.params.term;

  // Find the recipe in the database
  let p = Recipes.find({name: {$regex: new RegExp("^" + term, "i")}}).exec();

  // Send the recipe
  p.then((recipe) => {
    res.send(recipe);
  }).catch((err) => {
    console.log(err);
    console.log("There was an issue getting the recipe");
  });
});

/**
 * Starts the server on a specified port.
 */
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
