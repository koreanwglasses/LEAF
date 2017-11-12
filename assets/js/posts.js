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
            div.append('<a class="branch_here">  --> :p </a>');
            div.children().last().on('click', function() {
                branch(id);
            });
        }
    });
}

var posts = {
    firstPostId:0,
    lastPostId:0,
    branches: {}
};

function getChain(maxPosts){
    if(maxPosts === undefined) maxPosts = 25;
    var div = $('#chain');
    var id = posts.lastPostId;

    $.ajax({
        url: '/posts/getChain',
        type: 'POST',
        data: JSON.stringify({
            id: id,
            maxPosts: maxPosts
        }),
        dataType: 'json',
        contentType: 'json',
        success: function(result) {
            if(div.children().length > 0) div.children().last().remove();
            for(var i=1;i<result.ids.length;i++){
                div.append('<div></div>');
                getPost(div.children().last(), result.ids[i]);
            }
            posts.lastPostId = result.ids[result.ids.length-1];
            if(result.isBranch) {
                if(posts.branches[result.ids[result.ids.length - 1]] !== undefined) {
                    posts.lastPostId = posts.branches[result.ids[result.ids.length - 1]];
                } else {
                    posts.lastPostId = result.next[0];
                    posts.branches[result.ids[result.ids.length - 1]] = result.next[0];
                }
                var text = '<div>(Chain branches to';
                for(var i = 0; i < result.next.length; i++) {
                    text += ' <a>' + result.next[i] + '</a>';
                }
                text += ')<br>(Currently on branch ' + posts.lastPostId + ')</div>';
                div.append(text);
        
                var i = 0;
                div.children().last().children().each(function() {
                    if(i < result.next.length) {
                        var _self = $(this);
                        _self.on('click', function() {
                            posts.branches[result.ids[result.ids.length - 1]] = parseInt(_self.text());
                            clearChain();
                            posts.lastPostId = posts.firstPostId;
                            getChain();
                        });
                        i++;
                    }
                });

                div.append('<div>loading...</div>');
                getChain(maxPosts - result.ids.length);
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

function clearChain() {
    $('#chain').empty();
}

function push() {
    $.ajax ({
        url: '/posts/push',
        type: 'POST',
        data: JSON.stringify({
            id: posts.lastPostId,
            post: {
                content: $('#input_text').val()
            }
        }),
        dataType: 'json',
        contentType: 'json',
        success: function(result) {
            getChain();
            $('#input_text').val('');
            posts.lastPostId = result.id;
        },
        error: function(xhr, status, err) {
            console.log(err);
        }
    });
}

function branch(postId) {
    $.ajax ({
        url: '/posts/branch',
        type: 'POST',
        data: JSON.stringify({
            id: postId,
            post: {
                content: $('#input_text').val()
            }
        }),
        dataType: 'json',
        contentType: 'json',
        success: function(result) {
            posts.branches[postId] = result.id;
            clearChain();
            posts.lastPostId = posts.firstPostId;
            getChain();
            $('#input_text').val('');
        },
        error: function(xhr, status, err) {
            console.log(err);
        }
    });
}

(function() {
    setInterval(getChain, 1000);
})();