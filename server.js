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
const cookieParser = require("cookie-parser");
const crypto = require("crypto");

const app = express();
// const port = 3000;
const port = 80;

// Connect to the database
const db = mongoose.connection;
// const mongoDBURL = "mongodb://127.0.0.1/aiapetite";
const mongoDBURL = "mongodb://127.0.0.1:27017/aiapetite";
mongoose.connect(mongoDBURL);
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
  // password: String,
  salt: String,
  hash: String,
  favorites: [String],
  pantry: [String],
});

var Users = mongoose.model("Users", userSchema);

let sessions = {};

function addSession(username) {
  let sessionID = Math.floor(Math.random() * 1000000000);
  let now = Date.now();
  sessions[username] = { id: sessionID, timestamp: now };
  return sessionID;
}

function removeSession() {
  let now = Date.now();
  let usernames = Object.keys(sessions);
  for (let i = 0; i < usernames.length; i++) {
    let last = sessions[usernames[i]].timestamp;
    if (last + 600000 < now) {
      delete sessions[usernames[i]];
    }
  }
}

/*
  This is currently set to remove sessions every ten minutes. 
  We can change this at any point! Ten minutes seems good for now.
*/

setInterval(removeSession, 600000); // 81

// Middleware
app.use(parser.json());
app.use(cookieParser());

function authenticate(req, res, next) {
  let cookie = req.cookies;
  if (cookie != undefined && cookie.login != undefined) {
    if (
      sessions[cookie.login] != undefined &&
      sessions[cookie.login].id == cookie.sessionID
    ) {
      next();
    } else {
      res.redirect("/index.html");
    }
  } else {
    res.redirect("/index.html");
  }
}

app.use("/users/*", authenticate);

app.use(express.static("public_html"));

/**
 * The following requests involve ingredient management
 *
 * A POST request to add an ingredient to the user's pantry
 * A POST request to remove an ingredient from the user's pantry
 * A GET request to get the user's pantry
 */

// POST request to add a new ingredient to the user's pantry
app.post("/pantry/addingredient", (req, res) => {
  const username = req.body.username;
  const ingredient = req.body.ingredient;

  // Find the user in the database
  let p = Users.findOne({
    username: { $regex: new RegExp("^" + username, "i") },
  }).exec();

  // Add the ingredient to the user's pantry
  p.then((user) => {

    // Filter out ingredients that are already in the pantry
    const newIngredient = ingredient.filter((item) => !user.pantry.includes(item));

    if (newIngredient.length > 0) {
      user.pantry.push(ingredient);
      user.save();
      res.status(201).send("Ingredient added to pantry!");  // 201 is created status
    } else {
      res.status(403).send("Ingredient already in pantry!");
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("Error adding ingredient to pantry."); // 500 is internal server error
  });
});

// POST request to remove an ingredient from the user's pantry
app.post("/pantry/removeingredient", (req, res) => {
  const username = req.body.username;
  const ingredient = req.body.ingredient;

  let p = Users.findOne({
    username: { $regex: new RegExp("^" + username, "i") },
  }).exec();

  p.then((user) => {
    // Filter out the ingredient from the user's pantry
    user.pantry = user.pantry.filter((item) => !ingredient.includes(item));
    user.save();
    res.status(200).send("Ingredient successfully removed from pantry!");
  }).catch((err) => {
    console.log(err);
    res.status(500).send("There was an issue removing the ingredient from the pantry");
  });
});

// GET request to get the user's pantry
app.get("/pantry/:username", (req, res) => {
  const username = req.params.username;

  // Find the user in the database
  let p = Users.find({
    username: { $regex: new RegExp("^" + username, "i") },
  }).exec();

  // Send the user's pantry
  p.then((user) => {
    res.status(200).json(user.pantry);
  }).catch((err) => {
    console.log(err);
    res.status(500).send("There was an issue getting the user's pantry");
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


// GET request for recipes that exactly match the user's pantry
app.get("/get/recipes/match-strict/:username", (req, res) => {
  const username = req.params.username;

  // Find the user in the database
  let p = Users.findOne({
    username: { $regex: new RegExp("^" + username, "i") },
  }).exec();

  // Send the recipes
  p.then((user) => {
    // Find the recipes in the database, $all is used to match all ingredients, $size is used to ensure array lengths are the same size
    let p1 = Recipes.find({
      ingredients: { $all: user.pantry, $size: user.pantry.length },
    }).exec();
    p1.then((recipes) => {
      if (recipes.length > 0) {
        res.status(200).json(recipes);
      } else {
        res.status(404).send("No recipes found");
      }
    }).catch((err) => {
      console.log(err);
      res.status(500).send("There was an issue getting the recipes");
    });
  }).catch((err) => {
    console.log(err);
    res.status(404).send("There was an issue getting the user");
  });
});

// GET request for recipes with one or two missing ingredients
app.get("/get/recipes/match-relaxed/:username", (req, res) => {
  const username = req.params.username;

  // Find the user in the database
  let p = Users.findOne({
    username: { $regex: new RegExp("^" + username, "i") },
  }).exec();

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
      
      if (filteredRecipes.length > 0) {
        res.status(200).json(filteredRecipes);
      } else {
        res.status(404).send("No recipes found");
      }
    }).catch((err) => {
      console.log(err);
      res.status(500).send("There was an issue getting the recipes");
    });
  }).catch((err) => {
    console.log(err);
    res.status(404).send("There was an issue getting the user");
  });
});

// GET request to browse all recipes
app.get("/get/recipes/browse", (req, res) => {
  // Fetch all recipes
  let p = Recipes.find({}).exec();

  // Send the recipes
  p.then((recipes) => {
    if (recipes) {
      res.status(200).json(recipes);
    } else {
      res.status(404).send("No recipes found");
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("There was an issue getting the recipes");
  });
});


// GET request for recipes based on ingredients
app.get("/get/recipes/:ingredients", (req, res) => {
  const ingredient = req.params.ingredients

  // Find the recipes in the database
  let p = Recipes.find({ ingredients: { $regex: new RegExp(ingredient, "i") } }).exec();

  // Send the recipes
  p.then((recipes) => {
    if (recipes.length > 0) {
      res.status(200).json(recipes);
    } else {
      res.status(404).send("No recipes found with the specified ingredient");
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("There was an issue getting the recipes");
  });
});

// GET request to get a specific recipe
app.get("/search/recipes/:term", (req, res) => {
  const term = req.params.term;

  // Find the recipe in the database
  let p = Recipes.find({
    name: { $regex: new RegExp(term, "i") },
  }).exec();

  // Send the recipe
  p.then((recipe) => {
    if (recipe.length > 0) {
      res.status(200).json(recipe);
    } else {
      res.status(404).send("No recipes found with the search term");
    }
  }).catch((err) => {
    console.log(err);
    res.status(500).send("There was an issue getting the recipe");
  });
});

// This route creates a new user
app.post("/add/user", (req, res) => {
  let username = req.body.userName;
  let password = req.body.password;

  // Check if the user already exists
  let p = Users.find({
    username: { $regex: new RegExp("^" + username, "i") },
  }).exec();
  p.then((results) => {
    if (results.length > 0) {
      res.status(403).end("That username is already taken");
    } else {
      let newSalt = Math.floor(Math.random() * 1000000000);
      let toHash = password + newSalt;
      var hash = crypto.createHash("sha3-256");
      let data = hash.update(toHash, "utf-8");
      let newHash = data.digest("hex");

      let newUser = new Users({
        username: username,
        salt: newSalt,
        hash: newHash,
        favorites: [],
        pantry: [],
      });

      newUser
        .save()
        .then((result) => {
          res.status(200).end("User created!");
        })
        .catch((err) => {
          console.log(err);
          res.end("Failed to create new account.");
        });
    }
  }).catch((err) => {
    console.log(err);
    res.end("Failed to create new account.");
  });
});

// This route logs in a user
app.post("/account/login", (req, res) => {
  let username = req.body.userName;
  let password = req.body.password;

  // Check if the user exists
  let p = Users.find({
    username: { $regex: new RegExp("^" + username, "i") },
  }).exec();
  p.then((results) => {
    if (results.length >= 1) {
      let existingSalt = results[0].salt;
      let toHash = password + existingSalt;
      var hash = crypto.createHash("sha3-256");
      let data = hash.update(toHash, "utf-8");
      let newHash = data.digest("hex");

      if (newHash === results[0].hash) {
        let sessionID = addSession(username);
        res.cookie("login", username);
        res.cookie("sessionID", sessionID);
        res.end("Login successful!" + JSON.stringify(results));
      } else {
        res.status(403).end("Incorrect password.");
      }
    } else {
      res.status(404).end("User not found.");
    }
  }).catch((err) => {
    console.log(err);
    res.end("Failed to log in.");
  });
});

// This route logs out a user
app.post("/account/logout", (req, res) => {
  let username = req.cookies.login;

  if (sessions[username]) {
    delete sessions[username];
    res.clearCookie("login");
    res.clearCookie("sessionID");
    res.end("Logout successful!");
  } else {
    res.status(404).end("User not found.");
  }
});

/**
 * The following requests involve favorites
 *
 * A GET request for the user's favorite recipes
 * A POST request to add a recipe to the user's favorites
 */

// GET request for the user's favorite recipes
app.get("users/favorites/:username", (req, res) => {
  const username = req.params.username;

  // Find the user in the database
  let p = Users.find({
    username: { $regex: new RegExp("^" + username, "i") },
  }).exec();

  // Send the user's favorites
  p.then((user) => {
    res.status(200).json(user.favorites);
  }).catch((err) => {
    console.log(err);
    res.status(500).send("There was an issue getting the user's favorites");
  });
});

// POST request to add a recipe to the user's favorites
app.post("/users/add/favorite", (req, res) => {
  const username = req.body.username;
  const recipe = req.body.recipe;

  // Find the user in the database
  let p = Users.find({username: { $regex: new RegExp("^" + username, "i") }}).exec();

  // Add the recipe to the user's favorites
  p.then((user) => {
    user.favorites.push(recipe);
    user.save();
  }).then(() => {
    res.status(201).send("Recipe added to favorites!");  // 201 is created status
  }).catch((err) => {
    console.log(err);
    res.status(500).send("Error adding recipe to favorites."); // 500 is internal server error
  });
});

/**
 * Starts the server on a specified port.
 */
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});