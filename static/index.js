function validateForm() {
    let x = document.forms["myForm"]["amount"].value;
    if (x == "") {
      alert("Amount must be filled out");
      return false;
    }
  }
  
function confirmDelete() {
  if (confirm("Are you sure you want to delete this record?")) {
    document.getElementById("deleteForm").submit()
  } 
}

async function create(){
    try {await axios.post('https://localhost:3000/records/create2',
      {
      amount: document.getElementById('amount').value,
      recordType: document.getElementById('recordType').value
      },
      {headers:{
        'Authorization': "Bearer " + window.localStorage.getItem('access_token')
    }})
    }
    catch(err){
      console.log(err)
    }
  }

  const getAllRecords = async () => {
    axios = require('axios');
    response = await axios.get('https://localhost:3000/records/all', {headers:{
        'Authorization': "Bearer " + window.localStorage.getItem('access_token')
    }})
    response.data
    return 
}