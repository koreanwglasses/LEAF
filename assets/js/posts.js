function getPost(div, id){
    $.ajax ({
        url: '/posts/getPost',
        type: 'POST',
        data: JSON.stringify({
            id: id
        }),
        dataType: 'json',
        contentType: 'json',
        success: function(result) {
            div.text(result.content);
        }
    });
}

var posts = {lastPostId:1};

function getChain(){
    var div = $('#chain');
    var id = $('#postid').val();
    $.ajax({
        url: '/posts/getChain',
        type: 'POST',
        data: JSON.stringify({
            id: id
        }),
        dataType: 'json',
        contentType: 'json',
        success: function(result) {
            for(var i=1;i<result.ids.length;i++){
              div.append('<div></div>');
              getPost(div.children().last(), element);
            }
            posts.lastPostId = result.ids[result.ids.length-1];
            if(result.isBranch) {
                div.append('<div>(Chain branches to ' + result.next.join(' ') + ')</div>');
            }
            if(result.isLeaf) {
                div.append('<div>(Chain ends here)</div>');
            }
            if(result.maxReached) {
                div.append('<div>(Chain continues with ' + result.next[0] + ')</div>');
            }
        },
        error: function(xhr, status, err) {
            console.log(err);
        }
    });
}