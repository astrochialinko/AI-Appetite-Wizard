// JavaScript AI App Wiz 


const local = "http://localhost:80/"
//"http://:80/" swap this for local when ready to used Dig-Ocean
const urlRoot = local


/* New user is called when client clicks the new user button. 
from here the  fuction sends a post request to the server
including the user name and password. 
//Need to add checkReqired()
*/ 
function createUser(){
    let name = document.getElementById("newUser").value;
    let pass = document.getElementById("newPass").value;

	if(validateUserForm(name, pass)){
		let url = urlRoot + "add/user/";
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
				document.getElementById('newUserWarnings').innerHTML=console.log('User successfully added');
			} else {
		   //debug console.log('Server returned an error:', response.status);
			}
		})
		.catch((error) => {
				document.getElementById('newUserWarnings').innerHTML= error;
		});
	}
}
/* User Login Gets 'name' and 'pass' from the current page 
and stores them in obj 'user' which is sent to url a mix 
of urlRoot and account/login   userLogin also takes any errors 
and displaies them under the login button */
function userLogin(){
	let name = document.getElementById("userID").value;
    let pass = document.getElementById("passID").value;

		let url = urlRoot + "account/login";
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
					document.getElementById('loginWwarnings').innerHTML= text; 
			});
			} else if (response.ok) {
				window.location.href = '/accounts/home.html'
			} else {
				document.getElementById('loginWwarnings').innerHTML =
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