function login(user, pass){
  $.ajax({
  url: 'http://localhost:1337/',
  data: {
    username: user,
    password: pass
  },
  dataType: 'applications/json'

  });
}