/*
 * Description: Client for AI Apetite Wizard/CookMe. This client will
 *              handle all requests to the server and display the
 *              appropriate data.
 *
 * Authors: Justin Adams, Chia-Lin Ko, and Creed Leichtle
 *
 * Course: CSC 337 Web Development
 */

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
    });
    
    p.then((response) => {
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
    });
    
    p.then((response) => {
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
    });
    
    p.then((response) => {
        return response.json();
    }).then((data) => {
        window.alert("Recipes with " + term + ": " + data);
    }).catch((err) => {
        window.alert("Error getting recipes with " + term + ".");
    });
}