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
const app = express();
const port = 3000;

// Connect to the database
const db = mongoose.connection;
const mongoDBURL = "mongodb://127.0.0.1/aiapetite";
mongoose.connect(mongoDBURL, {useNewUrlParser: true});
db.on("error", () => {console.log("MongoDB connection error")});

// Set up the schema for the recpies
var recipeSchema = new mongoose.Schema({
    name: String,
    images: [String],
    shortDesc: String,
    longDesc: String,
    ingredients: [String],
    cookTime: Number,
    category: [String],
    difficulty: Number
});

var Recipes = mongoose.model("Recipes", recipeSchema);

// Set up the schema for the users
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    favorites: [String],
    pantry: [String]
});

var Users = mongoose.model("Users", userSchema);

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
    let p = Users.find({username: {$regex: new RegExp('^' + req.params.username.toLowerCase(), 'i')}}).exec();

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
    let p = Users.find({username: {$regex: new RegExp('^' + req.params.username.toLowerCase(), 'i')}}).exec();

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
app.get('/get/recipes/:ingredients', (req, res) => {
    const ingredients = req.params.ingredients.split(",");

    // Find the recipes in the database
    let p = Recipes.find({ingredients: {$in: ingredients}}).exec();

    // Send the recipes
    p.then((recipes) => {
        res.send(recipes);
    }).catch((err) => {
        console.log(err);
        console.log("There was an issue getting the recipes");
    });
});