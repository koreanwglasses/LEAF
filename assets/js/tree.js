
var treejs = (function () {
    var nodes = {};

    var box = function(container) {
        this.isBox = true;

        this.container = container;
        this.container.append('<div class="box"></div>');
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

            // draw_lines();
        });
    };

    box.prototype.terminator = function(index) {
        var n = this.children[index];
        while(n.child && n.child.isNode) {
            n = n.child;
        }
        return n;
    };

    var node = function(container, post, outside) {
        this.isNode = true;
        var _self = this;

        if(!outside)
            nodes[post.id] = this;

        this.container = container;

        this.container.append('<div class="box"></div>');
        this.outer = this.container.children().last();
        this.outer.append('<div class="node"></div>');
        this.domelement = this.outer.children().last();
        this.domelement.text(post.content + ' ');

        this.domelement.append('<a> →</a>');
        this.branch_ui = this.domelement.children().last();
        this.branch_ui.on('click', function() {
            push_branch(post.id, 'New Branch', function(err, result) {
                if(err) return console.error(err);

                // _self.add_as_branch(result);
                reset();
                first_node(rootId);
            });
        });
        this.branch_ui.hide();
        this.domelement.on('mouseenter', function() {
            _self.branch_ui.show();
            draw_lines();
        });
        this.domelement.on('mouseleave', function() {
            _self.branch_ui.hide();
            draw_lines();
        });
        this.domelement.on('dblclick', function() {
            reset();
            rootId = post.id;
            first_node(rootId);
        });

        this.id = post.id;
        this.post = post;
        this.child = null;

        draw_lines();
    };

    node.prototype.add_child = function(post) {
        this.child = new node(this.container, post);
    };

    node.prototype.branch = function() {
        if(this.child && this.child.isNode) {
            var tmp = this.child;

            this.child = new box(this.container);

            this.child.add_as_branch(tmp.post);
            
        } else {
            this.child = new box(this.container);
        }
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
    var rootNode = null;
    var history_div = null;
    var founder = false;

    var first_node = function(id) {
        get_post(id, function(err, result) {
            if(err) return console.error(err);

            // history

            get_history(id, function(err, res) {
                if(err) return console.error(err);

                function updateHistory(index) {
                    if(index < res.ids.length) {
                        get_post(res.ids[index], function(err, post) {
                            if(err) return console.error(err);
                            
                            new node($('#history'), post, true);
                            
                            updateHistory(index + 1);
                        });
                    }
                }

                updateHistory(0);
            });

            // tree

            var container = $('#tree-container');

            var top = rootNode = new node(container, {id:-1, content:'(Current)'});
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

    var reset = function() {
        nodes = {};
        rootNode.container.empty();
        $('#history').empty();
        draw_lines();
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

    var push_branch = function(id, content, res) {
        $.ajax ({
            url: '/posts/branch',
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

    var get_history = function(id, res) {
        $.ajax ({
            url: '/posts/getHistory',
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

    var resize_canvas = function() {
        $('#tree-canvas').attr('width', $(window).width());
        $('#tree-canvas').attr('height', $(window).height());
    };
    resize_canvas();

    $(window).on('resize', resize_canvas);

    var c = document.getElementById('tree-canvas');
    var ctx = c.getContext('2d');

    var draw_lines = function() {
        resize_canvas();
        ctx.clearRect(0,0,c.width, c.height);

        Object.keys(nodes).forEach(function(key) {
            if(nodes[nodes[key].post.parent] !== undefined) {
                var r2 = nodes[key].domelement[0].getBoundingClientRect();
                var r1 = nodes[nodes[key].post.parent].domelement[0].getBoundingClientRect();

                var x1 = 0.5 * (r1.left + r1.right) + window.scrollX;
                var y1 = 0.5 * (r1.top + r1.bottom) + window.scrollY;

                var x2 = 0.5 * (r2.left + r2.right) + window.scrollX;
                var y2 = 0.5 * (r2.top + r2.bottom) + window.scrollY;

                ctx.beginPath();
                ctx.moveTo(x1,y1);
                ctx.lineTo(x2,y2);
                ctx.strokeStyle = '#004400';
                ctx.stroke();
            }
        });
    };

    console.log(1);

    return {
        pull: pull,
        draw_lines: draw_lines
    };
})();