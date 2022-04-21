function validateForm() {
    let x = document.forms["myForm"]["amount"].value;
    if (x == "") {
      alert("Amount must be filled out");
      return false;
    }
  }
  
function confirmDelete() {
  if (confirm("Are you sure you want to delete this record?")) {
    document.getElementById("submitDelete").click()
  } 
}
