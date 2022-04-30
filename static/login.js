
async function validateForm() {
    //document.getElementById("loginForm").submit()
    //validation
    
    const response = await axios.post('https://localhost:3000/users/login',
        {
            username: document.getElementById("username").value
        })
    window.localStorage.setItem('access_token', response.data.accessToken);
    location.href="https://localhost:3000/lol"
}