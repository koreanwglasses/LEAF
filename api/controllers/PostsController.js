/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    getPost: function(req, res) {
    },

    getThread: function(req, res) {
    },

    //  no need for GET, since everything is dynamically updated with AJAX 
    //  anyway, and CRUD is implemented by default.

    //  Create a new branch off a post
    //
    //  req.params('id'): id of post to branch off of
    //  req.params('post'): json with data about the new post (see Posts model)
    //
    //  User authentication (will be) handled here
    //  User info is handled here with sessions
    branch: function(req, res) {
        return res.send('Hola!');

    },

    //  Create a new post at the end of branch
    //
    //  req.params('id'): id of post (in chain) to push back to
    //      (handled by model) if the post specified itself is not a leaf, but
    //      there are no branches downstream, the model will just place the new 
    //      post at the end of the chain.
    //      However, if there is a branch downstream, the model will return an
    //      error, which should be handled by the controller
    //  req.params('post): json with data about the new post (see Posts model)
    //
    //  User authentication (will be) handled here
    //  User info is handled here with sessions
    push: function(req, res) {

    }
};

