$(document).ready(function() {
  $("#sendButton").click(function() {
    $("#output").html($("#message").val());
  });
});

function validateRegister(formObj) {
  if(formObj.firstName.value == "") {
    alert("You must enter a first name.");
    return false;
  }
  if(formObj.lastName.value == "") {
    alert("You must enter a last name.");
    return false;
  }
  if(formObj.email.value == "" || !formObj.email.value.includes("@") || !formObj.email.value.includes(".")) {
    alert("You must enter a valid email.");
    return false;
  }
  if(formObj.username.value == "") {
    alert("You must enter a username.");
    return false;
  }
  if(formObj.password.value.length < 6) {
    alert("Password must be greater then 6 characters.");
    return false;
  }
  if(formObj.password.value != formObj.confirmpassword.value){
    alert("You did not match your passwords");
    return false;
  }
  alert("You have submitted a valid form.");  
  return false;
}
function validateLogin(formObj) {
  if(formObj.username.value == ""){
    alert("You did not enter a username");
    return false;
  }
  alert("You have submitted a valid form.");  
  return false;
}