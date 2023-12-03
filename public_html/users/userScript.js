/*
	Justin Adams, Chia-Lin Ko, and Creed Leichtle
 	CSC 337 Final project   "AI App Wiz"
	
	Javascript for user.
*/

// used to store whatever recipes are on the page
var currentRecipes = [];

/*Populate Recipes to contentPanel is used to update the bookshelf page
with all/search/filter results. */
function populateRecipes(rep) {
  //debug console.log("populate: "+ rep);
  document.getElementById("contentPanel").innerHTML = formatRecipes(rep);
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
 * Function: getAllRecipes
 * Purpose:  This function will make a GET request to the server to get
 *           All recipes.
 *
 * Parameters:   N/A
 * Returns:      array of Recipe Objs
 */
async function getAllRecipes() {
  let url = "/get/recipes/browse";
  let p = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      //debug console.log("All Recipes: " + JSON.stringify(data));
      currentRecipes = data;
      return data;
    })
    .catch((err) => {
      window.alert("Error getting all recipes " + err);
    });
  return p;
}

/*Format recipes used to turn the data into string/HTML element*/
function formatRecipes(recipes) {
  let htmlString = "";
  for (let recipe of recipes) {
    //debug console.log(recipe);
    htmlString +=
      '<a href="#" class="' +
      'recipeLink" onclick = "openRecipe(' +
      recipe +
      ')" >'; /*rework how openRecipe is called */
    htmlString += '<div class="Panel bookshelfPanel">';
    htmlString += '<h2 class="recipeTitles">' + recipe.name + "</h2>";
    //need to be updated for sizes in CSS at some point.
    htmlString +=
      '<div><img class="smallImage" src="../img/' +
      recipe.images[0] +
      '" alt="' +
      recipe.images[0] +
      '">';
    htmlString +=
      '<p class="shortDesc">' + recipe.short_description + "</p></div>";

    let ct = minutes2Sting(recipe.cookTime);
    htmlString += '<p class="cookTime">Cook Time: ' + ct + "</p>";

    htmlString +=
      '<p id="difficulty">Difficulty: ' + recipe.difficulty + "</p></div></a>";
  }
  return htmlString;
}
/* Minutes to string takes a number (mins) in minutes
and converts 145 => "2h:25m" */
function minutes2Sting(mins) {
  let outString = "";
  outString = Math.floor(mins / 60) > 1 ? Math.floor(mins / 60) + "h: " : "";
  outString += (mins % 60) + "m";
  return outString;
}
function openRecipe(name) {
  document.getElementById("recipeBody").style.display = "block";
  let r;
  for (r of currentRecipes) {
    if (r.name === name) break;
  }
  //debug console.log(r);
  document.getElementById("recipeBody").innerHTML = formatFullRecipe(r);
}
/*Format Full Recipe is a single recipe 'r' formater 
used to convert full recipe into HTML code 'htmlOutput' */
function formatFullRecipe(r) {
  //rHeader bar with title and close window
  let htmlOutput =
    '<div id ="rHeader">' +
    '<img class="" id="close" src="Close.png" alt = "X" onclick = "closeRecipe()">' +
    '<h1 id="rH1">' +
    r.name +
    "</h1>";
  //Favorite Icon
  htmlOutput +=
    '<div id= "favStack">' +
    '<img class="fav" id="favF" src="Fav_F.gif" alt = "Fav" onClick="addFavorites(\'' +
    r._id +
    "')\">" +
    '<img class="fav" id="favT" src="Fav_T.gif" alt = "Fav" onclick = "removeFavorites(\'' +
    r.name +
    "')\">" +
    '<img class="fav" id="favA" src="Fav_A.gif" alt = "Fav">  </div>';
  // Not working yet need a way to check if users favorite
  // isFav(r._id);
  //Long Description
  htmlOutput += "<p>" + r.long_description + "</p></div>";
  //rContent image, ing, cook time, difficulty
  htmlOutput += '<div id ="rContent"><ul id = "ing">';
  // for i of ingredients
  for (let i of r.ingredients) {
    htmlOutput += "<li>" + i + "</li>";
  }
  //cookTime and diffecutlty
  htmlOutput +=
    '<p id="rCook">Cook Time: ' +
    minutes2Sting(r.cookTime) +
    "</p>" +
    '<p id ="rDiff">Diffeculty: ' +
    r.difficulty +
    "</p>" +
    '<img class="fullImage" src="../img/' +
    r.images[0] +
    '" alt="' +
    r.images[0] +
    '"></div>';
  //rSteps if extra picutre else defealt cooking Image
  htmlOutput += '<div id= "rSteps"><ol>';
  for (let i of r.instructions) {
    htmlOutput += "<li>" + i + "</li>";
  }
  htmlOutput += "</ol></div></div>";
  return htmlOutput;
}
//make Fav Icon not fully working yet.
function setFavIcon(id) {
  if (isFav(id)) {
    document.getElementById("favF").style.zIndex = 0;
    document.getElementById("favT").style.zIndex = 2;
  }
}
//called when close Icon is clicked.
function closeRecipe() {
  document.getElementById("recipeBody").style.display = "none";
}

//called when Fav_F icon is clicked
function addFavorites(name) {
  console.log(name + " Added");
  document.getElementById("favA").src = "Fav_A.gif";
  document.getElementById("favA").style.zIndex = 3;
  document.getElementById("favF").style.zIndex = 0;
  setTimeout(function () {
    document.getElementById("favA").style.zIndex = 0;
    document.getElementById("favT").style.zIndex = 2;
  }, 600);
  //add to users fav
}
//called when Fav_T icon is clicked
function removeFavorites(name) {
  console.log(name + " Removed");
  document.getElementById("favF").style.zIndex = 2;
  document.getElementById("favT").style.zIndex = 0;
}

/*open Filter just toggles the */
function openFilter() {
  document.getElementById("filterPanel").style.display = "block";
}

/*filterSubmint collects all the elements of class filterOpt(ions)
and adds the names to a list ready to be sent to the server. */
function filterSubmint() {
  let parts = document.getElementsByClassName("filterOpt");
  let names = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].checked) {
      parts[i].checked = false;
      names.push(parts[i].name);
    }
  }
  if (names.length > 0) {
    console.log(names);
    /* send names to server */
  }
  document.getElementById("filterPanel").style.display = "none";
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
function openPantry() {
  document.getElementById("pantryPanel").style.display = "block";
}

/**
 * Function: closePantry
 * Purpose:  This function will close the pantry panel.
 *
 * Parameters:   N/A
 * Returns:      N/A
 */
function closePantry() {
  document.getElementById("pantryPanel").style.display = "none";
}

window.onload = getPantry();

/**
 * Function: getPantry
 * Purpose:  This function will make a GET request to the server to get
 *           the user's pantry.
 *
 * Parameters:   N/A
 * Returns:      N/A
 */

function getPantry() {
  var username = document.cookie
    .split("=")[1]
    .split(";")[0]
    .split("%20")
    .join(" ");

  // Change this when going live
  let url = "http://localhost:80/pantry/" + username;

  let p = fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  p.then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(
        "Something went wrong on the server: " +
          response.status +
          " " +
          response.statusText
      );
    }
  })
    .then((data) => {
      updatePantryPanel(data);
    })
    .catch((err) => {
      window.alert(
        "The most annoying errors have no context of where in the code they are. " +
          err.message
      );
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

window.onload = function () {
  /*
        This is hardcoded for testing purposes. This will be replaced with a call to the server
        to get all of the ingredients that the user can select from.
    */
  const ingredients = ["Milk", "Eggs", "Flour"];
  populateIngredientSelection(ingredients);
};

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
    let htmlString = "<h2>Add Ingredients</h2>";
    for (let i = 0; i < ingredients.length; i++) {
      htmlString +=
        '<input type="checkbox" class="ingredient" id="' +
        ingredients[i] +
        '" name="' +
        ingredients[i] +
        '">';
      htmlString +=
        '<label for="' +
        ingredients[i] +
        '">' +
        ingredients[i] +
        "</label><br>";
    }
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
  var username = document.cookie
    .split("=")[1]
    .split(";")[0]
    .split("%20")
    .join(" ");

  // Change this when going live
  let url = "http://localhost:80/pantry/addingredient";

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
      window.alert(message);
      window.location.href = "/users/home.html";
    })
    .catch((err) => {
      window.alert(err.message);
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
  var username = document.cookie
    .split("=")[1]
    .split(";")[0]
    .split("%20")
    .join(" ");

  // Change this when going live
  let url = "http://localhost:80/pantry/removeingredients";

  let p = fetch(url, {
    method: "POST",
    body: JSON.stringify({ ingredients: ingredients, username: username }),
    headers: { "Content-Type": "application/json" },
  });

  p.then((response) => {
    if (response.ok) {
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
      window.alert(message);
      window.location.href = "/users/home.html";
    })
    .catch((err) => {
      window.alert(err.message);
    });
}

/*open Filter just toggoles the */
function openFilter() {
  document.getElementById("filterPanel").style.display = "block";
}

/*filterSubmint collects all the elements of class filterOpt(ions)
and adds the names to a list ready to be sent to the server. */
function filterSubmint() {
  let parts = document.getElementsByClassName("filterOpt");
  let names = [];
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].checked) {
      parts[i].checked = false;
      names.push(parts[i].name);
    }
  }
  if (names.length > 0) {
    console.log(names);
    /* send names to server */
  }
  document.getElementById("filterPanel").style.display = "none";
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
    headers: { "Content-Type": "application/json" },
  });

  p.then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error(
        "Something went wrong on the server: " +
          response.status +
          " " +
          response.statusText
      );
    }
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
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
function addFavorite(recipeID) {
  var username = document.cookie
    .split("=")[1]
    .split(";")[0]
    .split("%20")
    .join(" ");
  var recipe = recipeID.trim();

  let url = "/add/favorite";

  let p = fetch(url, {
    method: "POST",
    body: JSON.stringify({ username: username, recipe: recipe }),
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
      window.alert(message);
    })
    .catch((err) => {
      window.alert(err.message);
    });
}

function removeFavorite(recipeID) {
  var username = document.cookie
    .split("=")[1]
    .split(";")[0]
    .split("%20")
    .join(" ");
  var recipe = recipeID.trim();

  let url = "/remove/favorite";

  let p = fetch(url, {
    method: "POST",
    body: JSON.stringify({ username: username, recipe: recipe }),
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
      window.alert(message);
    })
    .catch((err) => {
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
    headers: { "Content-Type": "application/json" },
  });

  p.then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) {
      throw new Error("No matching recipes found.");
    } else {
      throw new Error(
        "Something went wrong on the server: " +
          response.status +
          " " +
          response.statusText
      );
    }
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
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
    headers: { "Content-Type": "application/json" },
  });

  p.then((response) => {
    if (response.ok) {
      return response.json();
    } else if (response.status === 404) {
      throw new Error("Error getting user.");
    } else {
      throw new Error(
        "Something went wrong on the server: " +
          response.status +
          " " +
          response.statusText
      );
    }
  })
    .then((data) => {
      return data;
    })
    .catch((err) => {
      window.alert(err.message);
    });
}

function logOut() {
  let url = "/account/logout";
  let p = fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  p.then((response) => {
    if (response.ok) {
      window.location.href = "/index.html";
    } else {
      throw new Error(
        "Something went wrong on the server: " +
          response.status +
          " " +
          response.statusText
      );
    }
  }).catch((err) => {
    window.alert(err.message);
  });
}
