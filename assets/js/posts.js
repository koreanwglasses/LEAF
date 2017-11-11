function getPost(div, id){
  $.ajax ({
    url: '/posts/find',
    type: "POST",
    data: {
      id: id
    },
    dataType: "application/json"
  })

  .done(function(result) {
    div.append(result.content)
  });
}