;
var treejs = (function () {
    var nodes = {};

    var box = function(container) {
        this.isBox = true;

        this.container = container;
        this.container.append('<div class="node"></div>');
        this.domelement = this.container.children().last();

        this.child_container = [];
        this.children = [];
    };

    box.prototype.add_as_branch = function(post) {
        var index = this.child_container.length;

        this.domelement.append('<div class="chain"></div>');
        var newChain = this.domelement.children().last();

        this.child_container.push(newChain);

        var newNode = new node(newChain, post);

        this.children.push(newNode);
        var _self = this;
        newChain.on('mouseenter', function(event) {
            event.stopPropagation();

            $('#tree-container .chain.focus').removeClass('focus');
            newChain.addClass('focus');

            push_ui(newChain);     
            current_node = _self.terminator(index).id;
            focused = newChain;
        });
    };

    box.prototype.terminator = function(index) {
        var n = this.children[index];
        while(n.child && n.child.isNode) {
            n = n.child;
        }
        return n;
    };

    var node = function(container, post) {
        this.isNode = true;

        nodes[post.id] = this;

        this.container = container;

        this.container.append('<div class="node"></div>');
        this.domelement = this.container.children().last();
        this.domelement.text(post.content + ' ');

        this.id = post.id;
        this.child = null;
    };

    node.prototype.add_child = function(post) {
        this.child = new node(this.container, post);
    };

    node.prototype.branch = function() {
        this.child = new box(this.container);
    };

    node.prototype.add_as_branch = function(post) {
        if(this.child == null || !this.child.isBox) this.branch();
        this.child.add_as_branch(post);
    };

    var old_push_ui = [];
    var current_node = 0;
    var ready = false;
    var push_ui = function(chain) {
        old_push_ui.forEach(function(doe){
            doe.remove();
        });

        chain.append('<div>+</div>');
        leaf_opts = chain.children().last();

        old_push_ui.push(leaf_opts);

        var editing = false;
        leaf_opts.on('click', function(event) {
            event.stopPropagation();

            if(!editing) {
                leaf_opts.empty();
                leaf_opts.append('<input type="text">');
                editing = true;
                ready = true;
            }

            var input = leaf_opts.children().last();
            input.unbind();
            input.bind('keyup', function(event) {
                if(event.which == 13) {
                    push_post(current_node, input.val(), function(err, result) {
                        if(err) return console.error(err);
                        
                        add_node(result.id, false);

                        old_push_ui.forEach(function(doe){
                            doe.remove();
                        });
                    });
                }
            });
        });
    };

    // build tree
    var rootId = 100;
    var founder = false;

    var first_node = function(id) {
        get_post(id, function(err, result) {
            if(err) return console.error(err);

            var container = $('#tree-container');
            var top = new node(container, {id:-1, content:''});
            top.add_as_branch(result);

            get_children(result.id, function(err, children) {
                if(err) return console.error(err);

                var isBranch = children.length > 1;
                children.forEach(function(id) {
                    add_node(id, isBranch);
                }, this);
            });
        });
    };

    var add_node = function(id, isBranch) {
        get_post(id, function(err, result) {
            if(err) return console.error(err);

            if(isBranch) {
                nodes[result.parent].add_as_branch(result);
            } else {
                nodes[result.parent].add_child(result);
            }
            
            get_children(result.id, function(err, children) {
                if(err) return console.error(err);

                var isBranch = children.length > 1;
                children.forEach(function(id) {
                    add_node(id, isBranch);
                }, this);
            });
        });
    };

    var leaves = [];
    var focused = null;

    var pull = function() {
        get_children(current_node, function(err, result) {
            if(err) console.error(err);

            if(result.length == 1) {
                current_node = result[0];
                add_node(current_node, false);
            }
            var isBranch = result.length > 1;
        });
    };

    var push_post = function(id, content, res) {
        $.ajax ({
            url: '/posts/push',
            type: 'POST',
            data: JSON.stringify({
                id: id,
                post: {
                    content: content
                }
            }),
            dataType: 'json',
            contentType: 'json',
            success: function(result) {
                if(res) res(null, result);
            },
            error: function(xhr, status, err) {
                if (res) res(err);
            }
        });
    };

    var get_post = function(id, res) {
        $.ajax ({
            url: '/posts/getPost',
            type: 'POST',
            data: JSON.stringify({
                id: id
            }),
            dataType: 'json',
            contentType: 'json',
            success: function(result) {
                res(null, result);
            },
            error: function(xhr, status, err) {
                res(err);
            }
        });
    };

    var get_children = function(id, res) {
        $.ajax ({
            url: '/posts/getChildren',
            type: 'POST',
            data: JSON.stringify({
                id: id
            }),
            dataType: 'json',
            contentType: 'json',
            success: function(result) {
                res(null, result);
            },
            error: function(xhr, status, err) {
                res(err);
            }
        });
    };

    first_node(rootId);

    setInterval(pull, 1000);

    return {
        pull: pull
    };
})();