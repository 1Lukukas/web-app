// eslint-disable-next-line no-unused-vars
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
        
    // eslint-disable-next-line no-undef
    const response = await axios.get('https://localhost:3000/users/all')

    const usernameExistance = response.data.filter(
        function(data){ return data.username == document.getElementById("username").value}
    )

    const emailExistance = response.data.filter(
        function(data){ return data.email == document.getElementById("email").value}
    )
    if(emailExistance.length == 0 && usernameExistance.length == 0){
        console.log(emailExistance.length + " " + usernameExistance.length)
        return true;
    } else{
        alert("Username or email already exists")
        return false;
    }
}


function validatePassword() {
    
    const pass = document.getElementById("password")
    const repass = document.getElementById("repassword")
    if(pass.value === repass.value) {
        document.getElementById("registerForm").submit()
        alert("Registration successful!")
        //location.href="https://localhost:3000/"
    } else {
        alert("Passwords do not match")
    }
}

// eslint-disable-next-line no-unused-vars
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