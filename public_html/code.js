/*
 * Description: Client for AI Apetite Wizard/CookMe. This client will
 *              handle all requests to the server and display the
 *              appropriate data.
 *
 * Authors: Justin Adams, Chia-Lin Ko, and Creed Leichtle
 *
 * Course: CSC 337 Web Development
 */


const local = "http://localhost:80/"
//"http:/146.190.45.141:80/" swap this for local when ready to used Dig-Ocean
const urlRoot = local

/**
 * Function: addIngredient
 * Purpose:  This function will make a POST request to the server to add
 *           an ingredient to the user's pantry.
 * 
 * NOTE: This is not the final implementation, just a skeleton for testing purposes.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function addIngredient() {
    var ingredient = document.getElementById("ingredient").value;
    var username = document.getElementById("username").value;

    // Change this when going live
    let url = urlRoot + "pantry/addingredient";

    let p = fetch(url, {
        method: "POST",
        body: JSON.stringify({ingredient: ingredient, username: username}),
        headers: {"Content-Type": "application/json"}
    });

    p.then((response) => {
        if (response.ok) {
            window.alert("Ingredient added to pantry!");
        } else {
            window.alert("Error adding ingredient to pantry. Server responded with status: " + response.status);
        }
    }).catch((err) => {
        window.alert("Error adding ingredient to pantry.");
        console.log(err);
    });
}

/**
 * Function: getPantry
 * Purpose:  This function will make a GET request to the server to get
 *           the user's pantry.
 * 
 * NOTE: This is not the final implementation, just a skeleton for testing purposes.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */

function getPantry() {
    var username = document.getElementById("username").value;

    // Change this when going live
    let url = urlRoot + "pantry/" + username;

    let p = fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });

    p.then((response) => {
        return response.json();
    }).then((data) => {
        window.alert(data);
    }).catch((err) => {
        window.alert("Error getting pantry.");
    });
}

/**
 * Function: getStrictMatchRecipes
 * Purpose:  This function will make a GET request to the server to get
 *           recipes that match exactly what the user has in their pantry.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function getStrictMatchRecipes() {
    var username = document.getElementById("username").value;

    let url = urlRoot + "get/recipes/match-strict/" + username;

    let p = fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        window.alert("Strict Match Recipes: " + data);
    }).catch((err) => {
        window.alert("Error getting strict match recipes.");
    });
}

/**
 * Function: getRelaxedMatchRecipes
 * Purpose:  This function will make a GET request to the server to get
 *           recipes where the recipes are only missing one or two ingredients.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function getRelaxedMatchRecipes() {
    var username = document.getElementById("username").value;

    let url = urlRoot + "get/recipes/match-relaxed/" + username;

    let p = fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        window.alert("Relaxed Match Recipes: " + data);
    }).catch((err) => {
        window.alert("Error getting relaxed match recipes.");
    });
}

/**
 * Function: getAllRecipes
 * Purpose:  This function will make a GET request to the server to get
 *          all recipes.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function getAllRecipes() {
    let url = urlRoot + "get/recipes/browse";

    let p = fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        window.alert("All Recipes: " + data);
    }).catch((err) => {
        window.alert("Error getting all recipes.");
    });
}

/**
 * Function: searchByIngredient
 * Purpose:  This function will make a GET request to the server to get
 *           recipes that contain a specific ingredient.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function searchByIngredient() {
    var ingredient = document.getElementById("ingredient").value;

    let url = urlRoot + "get/recipes/" + ingredient;

    let p = fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        window.alert("Recipes with " + ingredient + ": " + data);
    }).catch((err) => {
        window.alert("Error getting recipes with " + ingredient + ".");
    });
}

/**
 * Function: searchRecipes
 * Purpose:  This function will make a GET request to the server to get
 *           recipes by a search term.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function searchRecipes() {
    var term = document.getElementById("term").value;

    let url = urlRoot + "/search/recipes/" + term;

    let p = fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }).then((response) => {
        return response.json();
    }).then((data) => {
        window.alert("Recipes with " + term + ": " + data);
    }).catch((err) => {
        window.alert("Error getting recipes with " + term + ".");
    });
}