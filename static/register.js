

async function validateForm(){
    if (document.getElementById("username").value == "" 
    || document.getElementById("email").value == "" 
    || document.getElementById("password").value == ""
    || document.getElementById("repassword").value == "") {
        alert("All fields must be filled out");
    } else if (await doesUserExit()){
        validatePassword()
    }
}

async function doesUserExit(){
        
    response = await axios.get('https://localhost:3000/users/all')

    usernameExistance = response.data.filter(
        function(data){ return data.username == document.getElementById("username").value}
    )

    emailExistance = response.data.filter(
        function(data){ return data.username == document.getElementById("email").value}
    )
    if(emailExistance.length == 0 && usernameExistance.length == 0){
        return true;
    } else{
        alert("Username or email already exists")
        return false;
    }
}


function validatePassword() {
    
    pass = document.getElementById("password")
    repass = document.getElementById("repassword")
    if(pass.value === repass.value) {
        document.getElementById("registerForm").submit()
        alert("Registration successful!")
        location.href="https://localhost:3000/"
    } else {
        alert("Passwords do not match")
    }
}

function showPassword() {
    var x = document.getElementById("password");
    var y = document.getElementById("repassword");
  if (x.type === "password") {
    x.type = "text";
    y.type = "text";
  } else {
    x.type = "password";
    y.type = "password";
  }
}