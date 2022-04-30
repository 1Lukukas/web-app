async function login() {
	if (await validateForm()) {
		const response = await axios.post('https://localhost:3000/users/login', {
			username: document.getElementById("username").value
		})
		window.localStorage.setItem('access_token', response.data.accessToken);
		location.href = "https://localhost:3000/lol"
	}
}

async function validateForm() {
	if (document.getElementById("username").value == "" ||
		document.getElementById("password").value == "") {
		alert("All fields must be filled out");
	} else if (await validateLogin()) {
        return true
	}
	return false;
}

async function validateLogin() {

	response = await axios.get('https://localhost:3000/users/all')

	usernameExistance = response.data.filter(
		function(data) {
			return data.username == document.getElementById("username").value
		}
	)
    password = document.getElementById("password").value
	if (usernameExistance.length == 0 || usernameExistance[0].password != password) {
		alert("Username or password wrong")
		return false;
	} else {
		return true;
	}
}

// async function validatePassword() {
// 	response = await axios.get('https://localhost:3000/users/all')
// 	usernameExistance = response.data.filter(
// 		function(data) {
// 			return data.username == document.getElementById("username").value
// 		}
// 	)
//     console.log(usernameExistance)
// 	password = document.getElementById("password").value
// 	if (usernameExistance[0].password == password) {
// 		return true
// 	} else {
// 		alert("Username or password wrong")
// 		return false
// 	}
// }