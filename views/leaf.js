$(document).ready(function() {
  $("#sendButton").click(function() {
    $("#output").html($("#message").val());
  });
});

function validate(formObj) {
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
  alert("You have submitted a valid form.");  
  return false;
}