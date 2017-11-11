$(document).ready(function() {
  $("#sendButton").click(function() {
    $("#output").html($("#message").val());
  });
});