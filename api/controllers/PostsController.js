/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    //  See Posts model for attributes
    getPost: function(req, res) {
        Posts.find({id: req.param('id')}, function(err, result) {
            if(err) return res.negotiate(err);
            return res.json(result[0]);
        });
    },

    getChildren: function(req, res) {
        Links.getChildren({id: req.param('id')}, function(err, result) {
            if(err) return res.negotiate(err);
            return res.json(result);
        });
    },

    // Gets the chain down to a leaf or branch. Does not return past posts.
    // Current post is the first element of result.ids
    //
    // req.params.id: id of starting point
    // req.params.maxPosts: maximum posts to send back
    //
    // result.ids: ids in order
    // result.next: posts that could follow this post
    // result.isLeaf: is true if the last node is a leaf.
    // result.isBranch: is true if the last node is a branch/
    // result.maxReached: is true if maxPosts was reached
    getChain: function(req, res) {
        Posts.getChain({id: req.param('id'), maxPosts: req.param('maxPosts')}, function(err, result) {
            if(err) return res.negotiate(err);
            return res.json(result);
        });
    },

    //  Returns the history of from this node
    //  Current post is last element of result.ids
    // 
    // req.params.id: id of starting point
    // req.params.maxPosts: maximum posts to send back (unimplemented)
    //
    // result.ids: ids
    // result.maxReached: is true if maxPosts was reached (unimplemented)
    getHistory: function(req, res) {
        Posts.getHistory({id: req.param('id'), maxPosts: req.param('maxPosts')}, function(err, result) {
            if(err) return res.negotiate(err);
            return res.json(result);
        });
    },

    //  no need for GET, since everything is dynamically updated with AJAX 
    //  anyway, and CRUD is implemented by default.

    //  Create a new branch off a post
    //
    //  req.param('id'): id of post to branch off of
    //  req.param('post'): json with data about the new post (see Posts model)
    //
    //  res: returns 
    //
    //  User authentication (will be) handled here
    //  User info is handled here with sessions
    branch: function(req, res) {
        var options = {
            id: req.param('id'),
            post: req.param('post')
        };

        Posts.branch(options, function(err, newPost) {
            if(err) {
                // better error negotiation later
                res.negotiate(err);
            } else {
                res.json(newPost);
            }
        });
    },

    //  Create a new post at the end of branch
    //
    //  req.param('id'): id of post (in chain) to push back to
    //      (handled by model) if the post specified itself is not a leaf, but
    //      there are no branches downstream, the model will just place the new 
    //      post at the end of the chain.
    //      However, if there is a branch downstream, the model will return an
    //      error, which should be handled by the controller
    //  req.param('post'): json with data about the new post (see Posts model)
    //
    //  User authentication (will be) handled here
    //  User info is handled here with sessions
    push: function(req, res) {
        var options = {
            id: req.param('id'),
            post: req.param('post')
        };

        Posts.push(options, function(err, newPost) {
            if(err) {
                // better error negotiation later
                res.negotiate(err);
            } else {
                res.json(newPost);
            }
        });
    }
};

