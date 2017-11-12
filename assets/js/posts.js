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

function getChain(div, id){
  $.ajax({
    url: '/posts/getChain',
    type: "POST",
    data: {
      id: id
    },
    dataType: "application/json"
  })
  .done(function(result) {
    
    result.ids
  });
}