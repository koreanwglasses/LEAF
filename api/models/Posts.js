/**
 * Posts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        //  id is created automatically, and is stored as primaryKey
        //  https://sailsjs.com/documentation/concepts/models-and-orm/attributes

        content: { type: 'text' },
        source: { type: 'integer' } // id of user
    },

    //  Create a new branch off a post
    //
    //  options.id: id of post to branch off of
    //  options.post: json with data about the new post (see attributes)
    //
    //  User info is in sessions
    branch: function(options, cb) {

    },

    //  Create a new post at the end of branch
    //
    //  options.id: id of post (in chain) to push back to
    //      if the post specified itself is not a leaf, but
    //      there are no branches downstream, the model will just place the new 
    //      post at the end of the chain.
    //      However, if there is a branch downstream, the model will return an
    //      error, which should be handled by the controller
    //  options.post: json with data about the new post (see attributes)
    //
    //  User info is in sessions
    push: function(options, cb) {

    }
};

