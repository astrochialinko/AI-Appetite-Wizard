/*
	Justin Adams, Chia-Lin Ko, and Creed Leichtle
 	CSC 337 Final project   "AI App Wiz"
	
	Javascript for user.
*/



/*Populate Recipes to contentPanel is used to update the bookshelf page
with all/search/filter results. */
function populateRecipes(rep) {
		//debug console.log("populate: "+ rep);
        	document.getElementById("contentPanel").innerHTML = formatRecipes(rep);
}

/**
 * Function: getAllRecipes
 * Purpose:  This function will make a GET request to the server to get
 *           All recipes.
 * 
 * Parameters:   N/A
 * Returns:      array of Recipe Objs
 */
async function getAllRecipes() {
    let url =  "/get/recipes/browse";
    let p = await fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })
    .then((response) => {
	    return response.json();
    }).then((data) => {
        //debug console.log("All Recipes: " + JSON.stringify(data));
	    return data;
    }).catch((err) => {
	window.alert("Error getting all recipes " + err);
    });
    return p;
}

/*Format recipes used to turn the data into string/HTML element*/
function formatRecipes(recipes){
	let htmlString = "";
	for(let recipe of recipes){
		//debug console.log(recipe);
		htmlString +='<a href="#" class="'+
			'recipeLink" onclick = "openRecipe('+recipe+')" >' /*rework how openRecipe is called */
		htmlString += '<div class="Panel bookshelfPanel">';
		htmlString +='<h2 class="recipeTitles">'+recipe.name+'</h2>';
		//need to be updated for sizes in CSS at some point. 
		htmlString +=
		'<div><img class="smallImage" src="../img/'
			+recipe.images[0]+'" alt="'
			+recipe.images[0]+'">';
		htmlString +=
			'<p class="shortDesc">'+recipe.short_description+'</p></div>';
		
		let ct = minutes2Sting(recipe.cookTime);
		htmlString +=
		'<p class="cookTime">Cook Time: '+ ct +'</p>';

		htmlString +=
			'<p id="difficulty">Difficulty: '+recipe.difficulty+'</p></div></a>';
	}
	return htmlString;
}
/* Minutes to string takes a number (mins) in minutes
and converts 145 => "2h:25m" */
function minutes2Sting(mins){
	let outString = '';
	outString = (Math.floor(mins/60)>1) ? ( Math.floor(mins/60)+"h: " ) : '';
	outString += mins%60+ "m"
	return outString;
}

/*open Filter just toggles the */
function openFilter(){
	document.getElementById("filterPanel").style.display= "block";
}

/*filterSubmint collects all the elements of class filterOpt(ions)
and adds the names to a list ready to be sent to the server. */
function filterSubmint(){
	let parts = document.getElementsByClassName("filterOpt");
	let names = []; 
	for (let i = 0 ; i < parts.length ; i++){
		if(parts[i].checked){
			parts[i].checked = false;
			names.push(parts[i].name);
		}
	}
	if(names.length > 0){
		console.log(names);
		/* send names to server */
	}
	document.getElementById("filterPanel").style.display= "none";
}

/*This function will be called when open pantry is clicked on the 
 user's home page from here it opens a page that lets the user update
 what items are in their pantry. 
*/
function openPantry(){
	
}

/**
 * Function: getPantry
 * Purpose:  This function will make a GET request to the server to get
 *           the user's pantry.
 * 
 * NOTE: This is not the final implementation, just a skeleton for testing purposes.
 *       Also, this code was moved from code.js.
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
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }
  }).then((data) => {
      return data;
  }).catch((err) => {
      window.alert(err.message);
  });
}


//filterPanel.style.display = (filterPanel.style.display === "none") ? "block" : "none";

/*Update panrty is called after update is clicked on users pantry 
form it sends all the data to the server to update user's ingredients */

/**
 * Function: updatePantry
 * Purpose:  This function will make a POST request to the server to add
 *           an ingredient to the user's pantry.
 * 
 * NOTE: This is not the final implementation, just a skeleton for testing purposes.
 *       Also, this code was moved from code.js.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function updatePantry() {
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
    if (response.ok) {
        return response.text();
    } else {
        throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }
  }).then(message => {
    window.alert(message);
  }).catch((err) => {
    window.alert(err.message);
  });
}

/*open Filter just toggoles the */
function openFilter(){
	document.getElementById("filterPanel").style.display= "block";
}

/*filterSubmint collects all the elements of class filterOpt(ions)
and adds the names to a list ready to be sent to the server. */
function filterSubmint(){
	let parts = document.getElementsByClassName("filterOpt");
	let names = []; 
	for (let i = 0 ; i < parts.length ; i++){
		if(parts[i].checked){
			parts[i].checked = false;
			names.push(parts[i].name);
		}
	}
	if(names.length > 0){
		console.log(names);
		/* send names to server */
	}
	document.getElementById("filterPanel").style.display= "none";
}

/**
 * Function: getFavorites
 * Purpose:  This function will make a GET request to the server to get
 *           the user's favorites.
 * 
 * NOTE: This code was moved from code.js.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function getFavorites() {
  var username = document.getElementById("username").value;
  let url = "users/favorites/" + username;

  let p = fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
  });
  
  p.then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }
  }).then((data) => {
    return data;
  }).catch((err) => {
    window.alert(err.message);
  });
}

/**
* Function: addFavorite
* Purpose:  This function will make a POST request to the server to add
*           a recipe to the user's favorites.
* 
* NOTE: This code was moved from code.js. 
*
* Parameters:   N/A
* Returns:      N/A
*/
function addFavorite() {
  var username = document.getElementById("username").value;
  var recipe   = document.getElementById("recipe").value;

  let url = "users/add/favorite";

  let p = fetch(url, {
      method: "POST",
      body: JSON.stringify({username: username, recipe: recipe}),
      headers: {"Content-Type": "application/json"}
  });

  p.then((response) => {
    if (response.ok) {
        window.alert(response.text());
    } else {
        throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }
  }).catch((err) => {
      window.alert(err.message);
  });
}

/**
 * I think the following code belongs here, as it is related to the user.
 */

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
  let url = "get/recipes/match-strict/" + username;
  let p = fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
  });
  
  p.then((response) => {
    if (response.ok) {
        return response.json();
    } else if (response.status === 404) {
        throw new Error("No matching recipes found.");
    } else {
        throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }
  }).then((data) => {
      return data;
  }).catch((err) => {
      window.alert(err.message);
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
  let url = "get/recipes/match-relaxed/" + username;
  let p = fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/json"}
  });
  
  p.then((response) => {
    if (response.ok) {
        return response.json();
    } else if (response.status === 404) {
        throw new Error("Error getting user.");
    } else {
        throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }
  }).then((data) => {
      return data;
  }).catch((err) => {
      window.alert(err.message);
  });
}

function logOut() {
    let url = "account/logout";
    let p = fetch(url, {
        method: "POST",
        headers: {"Content-Type": "application/json"}
    });

    p.then((response) => {
        if (response.ok) {
            window.location.href = "/index.html";
        } else {
            throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
        }
    }).catch((err) => {
        window.alert(err.message);
    });
}