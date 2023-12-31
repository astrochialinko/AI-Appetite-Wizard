/*
	Justin Adams, Chia-Lin Ko, and Creed Leichtle
 	CSC 337 Final project   "AI App Wiz"
	
	Javascript for user.
*/

// used to store whatever recipes are on the page 
var currentRecipes = [];
var favRecipes = [];
var favs = [];
var filterValues = { 
				  difficutly: Number,
				  cookTime: Number,
				  allRecipes: Boolean,
				  pantry: Boolean,
				  pantryoffset: Number,
					};
const urlRedirectLogin = "http://146.190.45.141:80/index.html"

/*Populate Recipes to contentPanel is used to update the bookshelf page
with all/search/filter results. */
function populateRecipes(rep) {
		//debug console.log("populate: "+ rep);
        	document.getElementById("contentPanel").innerHTML = formatRecipes(rep);
}/*Populate Favorits "could be steamlined" to favorites is used to update the bookshelf page
with all/search/filter results. */
function populateFavorites(rep) {
		//debug console.log("populate: "+ rep);
        	document.getElementById("favortie").innerHTML = formatRecipes(rep);
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
        headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
	    return response.json();
    }).then((data) => {
        //debug console.log("All Recipes: " + JSON.stringify(data));
	    currentRecipes= data;
	    return data;
    }).catch((err) => {
	console.log("Error getting all recipes " + err);
    });
    return p;
}

/*Format recipes used to turn the data into string/HTML element*/
function formatRecipes(recipes){
	let htmlString = " ";
	if(recipes.length > 0){
	for(let recipe of recipes){
		//debug console.log(recipe);
		htmlString +='<a href="#" class="'+
			'recipeLink" onclick = "openRecipe('+"'"+recipe.name+"'"+')" >' /*rework how openRecipe is called */
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
	}
	return htmlString;
}
/* Minutes to string takes a number (mins) in minutes
and converts 145 => "2h:25m" */
function minutes2Sting(mins){
	let outString = '';
	outString = (Math.floor(mins/60)>0) ? ( Math.floor(mins/60)+"h: " ) : '';
	outString += mins%60+ "m"
	return outString;
}
function openRecipe(name){
	document.getElementById("recipeBody").style.display= "block";
	let r;
	for(r of currentRecipes){ if( r.name === name) break; }
	//debug console.log(r);
	document.getElementById("recipeBody").innerHTML = formatFullRecipe(r);
}
/*Format Full Recipe is a single recipe 'r' formater 
used to convert full recipe into HTML code 'htmlOutput' */
function formatFullRecipe(r){
	//rHeader bar with title and close window 
	let htmlOutput = '<div id ="rHeader">'+
		'<img class="" id="close" src="../img/Close.png" alt = "X" onclick = "closeRecipe()">'+
		'<h1 id="rH1">'+
		r.name+'</h1>';
	//Favorite Icon
	htmlOutput += '<div id= "favStack">'+
			'<img class="fav" id="favF" src="../img/Fav_F.gif" alt = "Fav" onClick="addFavorites(\'' + r._id + '\')">'+
			'<img class="fav" id="favT" src="../img/Fav_T.gif" alt = "Fav" onclick = "removeFavorites(\'' + r._id + '\')">'+
    		'<img class="fav" id="favA" src="../img/Fav_A.gif" alt = "Fav">  </div>';
	// Not working yet need a way to check if users favorite 
	setFavIcon(r._id);
	//Long Description
	htmlOutput += '<p>'+ r.long_description +'</p></div>';
	//rContent image, ing, cook time, difficulty
	htmlOutput += '<div id ="rContent"><ul id = "ing">';
	// for i of ingredients
	for(let i of r.ingredients){ htmlOutput +='<li>'+ i +"</li>";  } 
	//cookTime and diffecutlty
	htmlOutput += '<p id="rCook">Cook Time: '+minutes2Sting(r.cookTime)+'</p>'+ 
		'<p id ="rDiff">Diffeculty: '+r.difficulty+'</p>'+
		'<img class="fullImage" src="../img/'
			+r.images[0]+'" alt="'
			+r.images[0]+'"></div>';
	//rSteps if extra picutre else defealt cooking Image
	htmlOutput += '<div id= "rSteps"><ol>';
	for(let i of r.instructions){  htmlOutput +='<li>'+ i +"</li>"; }
	htmlOutput += '</ol></div></div>'
	return htmlOutput;
}
//make Fav Icon not fully working yet. 
async function setFavIcon(id){
	if(await isFav(id)){
		document.getElementById("favF").style.zIndex=0;
		document.getElementById("favT").style.zIndex=2;
	}
}
async function isFav(id){
	favs = await getFavorites();
	console.log(favs);
	for(let f of favs){
		if(f === id)
			return true;
	}
	return false;
}
//called when close Icon is clicked. 
function closeRecipe(){ document.getElementById("recipeBody").style.display= "none"; }

//called when Fav_F icon is clicked 
function addFavorites(id){
    console.log(id+ " Added")
	addFavorite(id);
    document.getElementById("favA").src="../img/Fav_A.gif";
	document.getElementById("favA").style.zIndex=3;
    document.getElementById("favF").style.zIndex=0;
	setTimeout( function(){
			document.getElementById("favA").style.zIndex=0;
			document.getElementById("favT").style.zIndex=2;
			   },600);
	//add to users fav
}
//called when Fav_T icon is clicked 
function removeFavorites(id){
    console.log(id+ " Removed")
	removeFavorite(id);
    document.getElementById("favF").style.zIndex=2;
    document.getElementById("favT").style.zIndex=0;
	
}


/*open Filter just toggles the */
function openFilter(){
	document.getElementById("filterPanel").style.display= "flex";
}
// Get Bar Value is used to get value from slider bar and update text feilds 
function getFDBValue(){
    let barValue = document.getElementById("diffSlider").value;
    document.getElementById("diff").innerText = barValue;
	filterValues.difficutly = barValue;
	console.log("Set Diff: "+filterValues.difficutly)
}// Get number value from cook time feild. 
function getCTFValue(){
    let number = document.getElementById("ctFeild").value;
    document.getElementById("CT").innerText = minutes2Sting(number);
	filterValues.cookTime= number;
	console.log("Set CT: "+filterValues.cookTime)
}
/*filterSubmint collects all the elements of class filterOpt(ions)
and adds the names to a list ready to be sent to the server. */
async function filterSubmint(){
	let pantryFlag = document.getElementById("pantryFlag").checked;
	let flag = document.getElementsByClassName("radioOpt")[0].checked;
	//filterValues.allRecipes=(flag[0].checked)
	let data;
	if( flag ){ data = await getAllRecipes(); console.log("All");}
	else{ data = await  getFavoritesData(); console.log("FAV"); }
	
	if(filterValues.difficutly > 0){
		data = checkValues("diff", data);
		resetValue("diff"); }
	if(filterValues.cookTime>0){
		data = checkValues("CT", data);
		resetValue("CT"); }
	if(pantryFlag){
		document.getElementById("pantryFlag").checked = false;
		dummyData = "";//search dummyData for recipes with pantry ingredieants. 
	}
	//debug
	console.log(data);
	populateRecipes(data);
			/* send names to server */
	document.getElementById("filterPanel").style.display= "none";
}

//helper function used to reset the cookTime and Difficulty fields. 
function resetValue(flag){
	if(flag == "CT"){
		console.log("CT: "+filterValues.cookTime)
		filterValues.cookTime=0; 
		document.getElementById("ctFeild").value = null;
		document.getElementById("CT").innerText ="..";
		return;
	} else if(flag =="diff"){
		console.log("Diff: "+filterValues.difficutly)
		filterValues.difficutly = 0;
		document.getElementById("diffSlider").value = null;
		document.getElementById("diff").innerText =".."
		return;
	}
	
}
function checkValues(flag, data){
	let outData =[]
	if(flag=="CT"){
			for(let c of data){
			if(c.cookTime <= filterValues.cookTime){
				outData.push(c); 
				console.log("Found C: "+c);}
			}
	} else if(flag =="diff"){
			for(let d of data){
			if(d.difficulty <= filterValues.difficutly ){
				outData.push(d); 
			}
		}
	}
	return outData;
}
//overloaded to work with no flag in which case it clears both feilds. 
//good for when closeing window. 
function resetAllValue(){
	resetValue("CT");
	resetValue("diff");
	document.getElementsByClassName("radioOpt")[0].checked=true;
	document.getElementById("pantryFlag").checked= false;
}







/* Initiates a search for recipes based on the keyword entered in the search input field. */
function searchRecipes() {
  let keyword = document.getElementById("search").value;
  let url = "/search/recipes/" + encodeURIComponent(keyword);

  // Perform the fetch request to the server.
  fetch(url)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        if (response.status === 404) {
          document.getElementById("contentPanel").innerHTML =
            '<p id="contentPanelTxt">No matching recipes found.</p>';
        } else {
          document.getElementById("contentPanel").innerHTML =
            '<p id="contentPanelTxt">There was an issue getting the recipe.</p>';
        }
        throw new Error('No matching recipes found for "' + keyword + '"');
      }
    })
    .then((data) => {
      populateRecipes(data);
    })
    .catch((error) => {
      console.error(error);
    });
}


/**
 * Function: openPantry
 * Purpose:  This function will be called when open pantry is clicked on the
 *           user's home page from here it opens a page that lets the user update
 *           what items are in their pantry.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function openPantry(){
    document.getElementById("pantryPanel").style.display= "block";
	getPantry();
	getIngredients();
}

/**
 * Function: closePantry
 * Purpose:  This function will close the pantry panel.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
function closePantry(){ document.getElementById("pantryPanel").style.display= "none"; }

/**
 * Function: getPantry
 * Purpose:  This function will make a GET request to the server to get
 *           the user's pantry.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */

function getPantry() {
  var username = getCookieUserName();

  // Change this when going live
  let url ="/pantry/"+username;

  let p = fetch(url, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
  });

  p.then((response) => {
    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }
  }).then((data) => {
      updatePantryPanel(data);
  }).catch((err) => {
      console.log("The most annoying errors have no context of where in the code they are. "+err.message);
  });
}
//
function getIngredients() {
  let url = "/ingredients";

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
  }).then((ingredients) => {
      populateIngredientSelection(ingredients);
  }).catch((err) => {
      console.log(err.message);
  });
}


/**
 * Function: updatePantryPanel
 * Purpose:  This function will update the pantry panel with the ingredients in the user's pantry.
 * 
 * Paramters: pantry - Array of ingredients in the user's pantry.
 */
function updatePantryPanel(pantry) {
    if (document.getElementById("pantryPanel") != null) {
        const myIngredients = document.getElementById("myIngredients");
        myIngredients.innerHTML = "<h2>My Ingredients</h2> <ul>";

        for (let i = 0; i < pantry.length; i++) {
            myIngredients.innerHTML += "<li>" + pantry[i] + "</li>";
        }

        myIngredients.innerHTML += "</ul>";
    }
}

//window.onload = function() {
    /*
        This is hardcoded for testing purposes. This will be replaced with a call to the server
        to get all of the ingredients that the user can select from.
    */

/**
 * Function: populateIngredientSelection
 * Purpose:  This function will populate the ingredient selection panel with the ingredients
 *           that the user can select to add to their pantry.
 * 
 * Parameters: ingredients - Array of ingredients that the user can select to add to their pantry.
 * Returns:    N/A 
 */
function populateIngredientSelection(ingredients) {
   if (document.getElementById("ingredientSelection") != null) {
        let htmlString = "<h2>Add Ingredients</h2><div class='ingredients-container'>";
        for (let i = 0; i < ingredients.length; i++) {
            htmlString += '<div class="ingredient-item">';
            htmlString += '<input type="checkbox" class="ingredient" id="' +
                ingredients[i] +
                '" name="' + ingredients[i] + '">';
            htmlString += '<label for="' + ingredients[i] + '">' + ingredients[i] + '</label>';
            htmlString += '</div>';  // Close the ingredient-item div
        }
        htmlString += "</div>";  // Close the ingredients-container div
        document.getElementById("ingredientSelection").innerHTML = htmlString;
   }
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
    var ingredient = getSelectedIngredients();
    var username = getCookieUserName();

    // Change this when going live
    let url = "/pantry/addingredient";

    let p = fetch(url, {
        method: "POST",
        body: JSON.stringify({ ingredient: ingredient, username: username }),
        headers: { "Content-Type": "application/json" },
    });

    p.then((response) => {
        if (response.ok) {
            return response.text();
        } else if (response.status === 403) {
            return response.text();
        } else {
            throw new Error(
                "Something went wrong on the server: " +
                response.status +
                " " +
                response.statusText
            );
        }
    })
        .then((message) => {
            console.log(message);
            window.location.href = "/users/home.html";
        })
        .catch((err) => {
            console.log(err.message);
        });
}

/**
 * Function: getSelectedIngredients
 * Purpose:  This function will get all of the ingredients that the user has selected
 *           to add to their pantry.
 * 
 * @returns {Array} of selected ingredients
 */
function getSelectedIngredients() {
    var checkBoxes = document.getElementsByClassName("ingredient");
    var selectedIngredients = [];

    for (let i = 0; i < checkBoxes.length; i++) {
        if (checkBoxes[i].checked) {
            selectedIngredients.push(checkBoxes[i].name);
        }
    }

    return selectedIngredients;
}

function removeIngredients() {
    var ingredients = getSelectedIngredients();
    var username = getCookieUserName();

    // Change this when going live
    let url = "/pantry/removeingredients";
    
    let p = fetch(url, {
        method: "POST",
        body: JSON.stringify({ingredients: ingredients, username: username}),
        headers: {"Content-Type": "application/json"}
    });

    p.then((response) => {
        if (response.ok) {
            return response.text();
        } else {
            throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
        }
    }).then(message => {
        console.log(message);
        window.location.href = "/users/home.html";
    }).catch((err) => {
        console.log(err.message);
    });
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
async function getFavorites() {
   var username = getCookieUserName();
  
  console.log(document.cookie.login);
  console.log(username);
  let url = "/users/favorites/" + username;
  try {
    let response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }

    let data = await response.json();
	fav = data; 
    return data;
  } catch (err) {
    console.log(err.message);
    return [];
  }
	
}
function getCookieUserName(){
	//console.log("print Cookies: "+document.cookie);
	if(document.cookie === 'undefined'){ 
		location.replace(urlRedirectLogin); }
	
	let j= (document.cookie).split(';');
	//debug console.log("print J1: "+j.findIndex(element => element.includes("login=")));
	let loc = j.findIndex(element => element.includes("login="));
	let c = j[loc].split('=')[1];
	//debug console.log("print C: "+c);
	return c;
}
async function getFavoritesData() {
  var username = getCookieUserName();
  console.log(username);
  let url = "/users/favoritesData/" + username;

  try {
    let response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }

    let data = await response.json();
	currentRecipes = data; 
    return data;
  } catch (err) {
    console.log(err.message);
    return [];
  }
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
function addFavorite(recipeID) {
  var username = getCookieUserName();
  var recipe   = recipeID.trim();
  console.log("adding: "+username+"  "+recipe);
  let url = "/users/add/favorite";

  let p = fetch(url, {
      method: "POST",
      body: JSON.stringify({username: username, recipe: recipe}),
      headers: {"Content-Type": "application/json"}
  });

  p.then((response) => {
    if (response.ok) {
        return response.text();
    } else if (response.status === 403) {
        return response.text();
    } else {
        throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
    }
  }).then(message => {
    console.log(message);
  }).catch((err) => {
    console.log(err.message);
  });
}

function removeFavorite(recipeID) {
    var username = getCookieUserName();
    var recipe   = recipeID.trim();

    let url = "/remove/favorite";

    let p = fetch(url, {
        method: "POST",
        body: JSON.stringify({username: username, recipe: recipe}),
        headers: {"Content-Type": "application/json"}
    });

    p.then((response) => {
        if (response.ok) {
            return response.text();
        } else if (response.status === 403) {
            return response.text();
        } else {
            throw new Error("Something went wrong on the server: " + response.status + " " + response.statusText);
        }
    }).then(message => {
        console.log(message);
    }).catch((err) => {
        console.log(err.message);
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
  var username = getCookieUserName();
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
      console.log(err.message);
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
  var username = getCookieUserName();
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
      console.log(err.message);
  });
}

function logOut() {
    let url = "/account/logout";
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
        console.log(err.message);
    });
}
