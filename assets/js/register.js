function register(){
  $.ajax({
    url: 'http://localhost:1337/register/user',
    data:{
      firstname: $("#firstName").val(),
      lastname: $("#lastName").val(),
      email: $("#email").val(),
      username: $("#username").val(),
      password: $("#password").val()
      },
    dataType: 'json'
    }
  });

}