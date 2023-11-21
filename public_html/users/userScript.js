/*
	Justin Adams, Chia-Lin Ko, and Creed Leichtle
 	CSC 337 Final project   "AI App Wiz"
	
	Javascript for user.
*/


const local = "http://localhost:80/"
const live = "http:/146.190.45.141:80/"
//"http:/146.190.45.141:80/" swap this for local when ready to used Dig-Ocean
const urlRoot = live


/*Populate Recipes to contentPanel is used to update the bookshelf page
with all/search/filter results. */
function populateRecipes(recipes) {
		console.log("populate: "+ recipes);
        document.getElementById("contentPanel").innerHTML = formatRecipes(r);
}
/**
 * Function: getAllRecipes
 * Purpose:  This function will make a GET request to the server to get
 *          all recipes.
 * 
 * Parameters:   N/A
 * Returns:      N/A
 */
async function getAllRecipes() {
    let url = "get/recipes/browse";
    await fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    })
    .then((response) => {
			return  response.json();
    }).then((data) => {
        console.log("All Recipes: " + JSON.stringify(data));
		return(data);
    }).catch((err) => {
        window.alert("Error getting all recipes.");
    });
}

let r = [
  {
  "name": "Grilled Cheese",
  "short_description": "A classic comfort food featuring melted cheese between slices of golden-brown bread.",
  "long_description": "Grilled Cheese is a simple yet satisfying comfort food loved by many. This recipe features your choice of cheese melted between slices of buttery, golden-brown bread.",
  "ingredients": [
    "8 slices Bread",
    "8 oz Cheese (cheddar, Swiss, or your favorite melting cheese)",
    "4 tbsp Butter, softened"
  ],
  "instructions": [
    "Place a skillet or griddle over medium heat.",
    "Spread butter on one side of each slice of bread.",
    "Place a slice of bread, butter side down, on the skillet.",
    "Add a generous amount of cheese on top of the bread.",
    "Place another slice of bread on top, butter side up.",
    "Cook until the bottom bread is golden brown and the cheese is melting.",
    "Flip and cook the other side until golden brown and the cheese is fully melted.",
    "Repeat for the remaining slices of bread and cheese.",
    "Slice the grilled cheese sandwiches diagonally and serve hot."
  ],
  "cookTime": 15,
  "difficulty": 1,
  "images": [ 
    "GrilledCheese1.png"
]

  },{
  "name": "Stir-Fried Tofu with Vegetables",
  "short_description": "A quick and flavorful stir-fry featuring tofu, colorful vegetables, and a savory soy sauce.",
  "long_description": "Stir-Fried Tofu with Vegetables is a delicious and nutritious dish that combines tofu, bell peppers, carrots, and broccoli in a savory soy sauce. Quick and easy, it's perfect for a weeknight dinner.",
  "ingredients": [
    "1 block Tofu (extra-firm)",
    "3 tbsp Soy sauce",
    "2 Bell peppers, sliced",
    "2 Carrots, julienned",
    "1 cup Broccoli, florets",
    "2 cloves Garlic, minced",
    "1 tsp Ginger, grated"
  ],
  "instructions": [
    "Press tofu to remove excess water.",
    "Stir-fry tofu, garlic, and ginger in soy sauce.",
    "Add sliced vegetables and cook until tender."
  ],
  "cookTime": 20,
  "difficulty": 1,
  "images": ["StirFriedTofuVeg.png"]
}
]

/*Format recipes used to turn the data into string/HTML element*/
function formatRecipes(recipes){
	let htmlString = "";
	for(let recipe of recipes){
		console.log(recipe);
		htmlString += '<div class="Panel bookshelfPanel">';
		htmlString +='<h2 class="recipeTitles">'+recipe.name+'</h2>';
		
		htmlString +=
		'<img src="./Data/img/'
			+recipe.images[0]+'" alt="'
			+recipe.images[0]+'"><br>';

		htmlString +=
		'<br><p class="shortDesc">'+recipe.short_description+'</p>';

		let ct = minutes2Sting(recipe.cookTime);
		htmlString +=
		'<p class="cookTime">Cook Time: '+ ct +'</p>';

		htmlString +=
			'<p id="difficulty">Difficulty: '+recipe.difficulty+'</p></div>';
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


/*This funtion will be called when open pantry is click on the 
 user's home page from here it opens a page that lets the user update
 what items are in thier pantry. 
*/
function openPantry(){
	
}


//filterPanel.style.display = (filterPanel.style.display === "none") ? "block" : "none";

/*Update panrty is called after update is clicked on users pantry 
form it sends all the data to the server to update user's ingredients */
function updatePantry(){
	
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
