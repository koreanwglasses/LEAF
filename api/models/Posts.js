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
        parent: { type: 'integer'}, // id of parent
        source: { type: 'integer' }, // id of user

    },

    //  Create a new branch off a post
    //
    //  options.id: id of post to branch off of
    //  options.post: json with data about the new post (see attributes)
    //  options.user: id of user
    branch: function(options, cb) {
        Posts.find({id: options.id}).exec(function(err, records) {
            if(err) return cb(err);

            if(records.length == 0) return cb(new Error('Post does not exist'));

            var post = {
                parent: options.id,
                source: options.user
            };

            Object.assign(post, options.post);

            Posts.create(post).exec(function(err, newPost) {
                if(err) return cb(err);

                Links.create({id: options.id, child: newPost.id}).exec(function(err) { 
                    if(err) return cb(err);

                    return cb(null, newPost);
                });
            });
        });
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
    //  options.user: id of current user
    push: function(options, cb) {
        Links.getLowest({id: options.id}, function(err, lowest) {
            if(err) cb(err);

            if(lowest.isLeaf == false) return cb(new Error('Cannot push post to this thread: ambiguous branch'));

            var opts = {};
            Object.assign(opts, options);
            opts.id = lowest.id;

            Posts.branch(opts, cb); 
        });
    },

    // forwards call to links. See Links.getChain for function details
    getChain: function(options, cb) {
        Links.getChain(options, cb);
    }
};

