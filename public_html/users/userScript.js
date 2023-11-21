/*
	Justin Adams, Chia-Lin Ko, and Creed Leichtle
 	CSC 337 Final project   "AI App Wiz"
	
	Javascript for user.
*/


const local = "http://localhost:80/"
const live = "http:/146.190.45.141:80/"
//"http:/146.190.45.141:80/" swap this for local when ready to use Dig-Ocean
const urlRoot = live


/*This function will be called when the open pantry is clicked on the 
 user's home page from here it opens a page that lets the user update
 what items are in their pantry. 
*/
function openPantry(){
	
}


/*Update pantry is called after update is clicked on the user's pantry 
form it sends all the data to the server to update the user's ingredients */
function updatePantry(){
	
}
/*open Filter just toggles the */
function openFilter(){ document.getElementById("filterPanel").style.display= "block"; }

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
	console.log(names);
	/* send names to server */
	document.getElementById("filterPanel").style.display= "none";
}
