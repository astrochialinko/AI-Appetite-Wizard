/*
	Justin Adams, Chia-Lin Ko, and Creed Leichtle
 	CSC 337 Final project   "AI App Wiz"
	
	Javascript for login and new user.
*/

//IDK why but it doesn't seem like we need a direct path for our fetch. 
//const local = "http://localhost:80/"
//const live = "http:/146.190.45.141:80/"
//"http:/146.190.45.141:80/" swap this for local when ready to used Dig-Ocean
//const urlRoot = local	


/* New user is called when client clicks the new user button. 
from here the  fuction sends a post request to the server
including the user name and password. 
//Need to add checkReqired()
*/ 
function createUser(){
    let name = document.getElementById("newUser").value;
    let pass = document.getElementById("newPass").value;

	if(validateUserForm(name, pass)){
		let url =  "/add/user/";
		user = { userName: name , password: pass};
		//debug console.log(post);
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(user),
			headers: { 'Content-Type': 'application/json'}
		})
		.then((response) => {
			if (response.status === 403) {// idk if i'm using 403 right but it seemed right
				document.getElementById('newUserWarnings').innerHTML= "User is unavaliable<br>try again"
				//window.alert("User is usered");
			} else if (response.ok) {
				//debug 
				document.getElementById('newUserWarnings').innerHTML='User successfully added';
			} else {
		   //debug console.log('Server returned an error:', response.status);
			}
		})
		.catch((error) => {
				document.getElementById('newUserWarnings').innerHTML= error;
		});
	}
}
/* User Login Gets 'name' and 'pass' from the current page `1`
and stores them in obj 'user' which is sent to url a mix 
of urlRoot and account/login   userLogin also takes any errors 
and displaies them under the login button */
function userLogin(){
	let name = document.getElementById("userID").value;
    let pass = document.getElementById("passID").value;

		let url =  "/account/login";
		user = { userName: name , password: pass};
		fetch(url, {
			method: 'POST',
			body: JSON.stringify(user),
			headers: {'Content-Type': 'application/json'},
			credentials: 'include'
		})
		.then((response) => {
			if (response.status === 403 || response.status === 404) {
				return response.text()
			.then( (text) => { 
					document.getElementById('loginWarnings').innerHTML= text; 
			});
			} else if (response.ok) {
				window.location.href = '/users/home.html'
			} else {
				document.getElementById('loginWarnings').innerHTML =
					'Server returned an error:'+ response.status ;
			}
		})
		.catch((error) => {
				document.getElementById('loginWwarnings').innerHTML=  error;
		});
}
//This function is intented to make sure the user is inputing valid username and password
//newUser passes in n:name and p:password  which are checked for validity before returing true
//if everything is valid.  
function validateUserForm(n,p){
	if( ! n.match(/^[a-zA-Z0-9]{1,16}$/) ){
		document.getElementById('newUserWarnings').innerHTML="UserName invalid";
		return false;
	}
	if( ! p.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/)){
		document.getElementById('newUserWarnings')
			.innerHTML="Password must be at least 8" 
					 +"<br>characters and include a" 
					 +"<br>number and a special character.";
		return false;
	}
	return true;
}