async function login() {
	if (username = await validateForm()) {
		const response = await axios.post('https://localhost:3000/users/login', {
			username: username
		})
		window.localStorage.setItem('access_token', response.data.accessToken);
		location.href = "https://localhost:3000/lol"
	}
}

async function validateForm() {
	if (document.getElementById("login").value == "" ||
		document.getElementById("password").value == "") {
		alert("All fields must be filled out");
	} else if (username = await validateLogin()) {
        return username
	}
	return false;
}

async function validateLogin() {

	response = await axios.get('https://localhost:3000/users/all')
	if(document.getElementById('login').type == "text"){
		loginExistance = response.data.filter(
			function(data) {
				return data.username == document.getElementById("login").value
			}
		)
	}
	else {
		loginExistance = response.data.filter(
			function(data) {
				return data.email == document.getElementById("login").value
			}
		)
	}
    password = document.getElementById("password").value
	if (loginExistance.length == 0 || loginExistance[0].password != password) {
		alert(`${document.getElementById('loginLabel').innerHTML} or password wrong`)
		return false;
	} else {
		return loginExistance[0].username;
	}
}

function handleRadioClick() {
  if (document.getElementById('usernameOption').checked) {
    document.getElementById('loginLabel').innerHTML= "Username"
	document.getElementById('login').type = "text"
  } else {
    document.getElementById('loginLabel').innerHTML = "Email"
	document.getElementById('login').type = "email"
  }
}

const radioButtons = document.querySelectorAll('input[name="select"]');
console.log(radioButtons)
radioButtons.forEach(radio => {
  radio.addEventListener('click', handleRadioClick);
});