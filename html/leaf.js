$(document).ready(function() {
  $("#sendButton").click(function() {
    $("#output").html($("#message").val());
  });
});

function validate(formObj) {
  if(formObj.password.value.length < 6) {
    alert("Password must be greater then 6 characters");
    return false;
  }
  alert("You have submitted a valid form.");  
  return false;
}