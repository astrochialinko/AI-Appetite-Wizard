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
    let url = "http://localhost:80/pantry/addingredient";

    let p = fetch(url, {
        method: "POST",
        body: JSON.stringify({ingredient: ingredient, username: username}),
        headers: {"Content-Type": "application/json"}
    });

    p.then((response) => {
        window.alert("Ingredient added to pantry!");
    }).catch((err) => {
        window.alert("Error adding ingredient to pantry.");
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
    let url = "http://localhost:80/pantry/" + username;

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

