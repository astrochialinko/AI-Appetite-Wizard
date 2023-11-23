// upload files
const mongoose = require("mongoose");
const express = require("express");
const parser = require("body-parser");
const path = require("path")
const fs = require("fs")
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

// Set up the schema for the recipes
var recipeSchema = new mongoose.Schema({
  name: String,
  short_description: String,
  long_description: String,
  ingredients: [String],
  cookTime: Number,
  difficulty: Number,
  images: [String]
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

// uploadFiles checks the directoryPath for JSON files. 
//then uploads the ones it finds to the DB as Recipes
function uploadFiles(directoryPath) {
  // Read the contents of the directory
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.log("Error reading directory:", err);
      return;
    }
    // Process each file in the directory
    files.forEach( ( file ) => {
      if (path.extname(file) == ".JSON") {
        const filePath = directoryPath + file.name; }
        // Read the content of the JSON file
        fs.readFile(filePath, "utf8", async(err, data) => {
          if (err) {
            console.log("Error reading file:", err);
            return;
          }

          // Parse the JSON data
          try {
            const jsonData = JSON.parse(data);
            const newRecipe = new Recipes(jsonData);
			console.log("Added to DB")
			  console.log(newRecipe);
			await newRecipe.save()
  			.then(() => {
    			console.log(`Recipe from ${file} added to MongoDB`);
  			})
  			.catch((saveErr) => {
    			console.error("Error saving recipe to MongoDB:", saveErr);
  			});
          } catch (jsonParseErr) {
            console.log("Error parsing JSON:", jsonParseErr);
          }
        });
      }
    });
  });
}
//called with path Data located in 
//the root folder of the project files
uploadFiles("./Data/");
console.log("running..");
