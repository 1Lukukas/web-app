async function details(){
    response = await axios.get('https://localhost:3000/users/me', 
    {headers:{
        'Authorization': "Bearer " + window.localStorage.getItem('access_token')
    }})
    document.getElementById("email").value = response.data.email
    document.getElementById("username").value = response.data.username
  }