/**
 * Links.js
 *
 * @description :: Stores children of nodes
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        id: { type: 'integer' },
        child: { type: 'integer'}
    },

    //  Gets the id of the children
    //
    //  options.id: id of post to children of 
    getChildren: function(options, cb) {
        Links.find({id: options.id}).exec(function(err, records) {
            if(err) return cb(err);

            var children = [];
            records.forEach(function(element) {
                children.push(element.child);
            }, this);

            return cb(null, children);
        });
    },

    // Gets the lowest post in chain. May be a branching point or a leaf
    //
    // options.id: id of post
    //
    // result.id: id of lowest post
    // result.isLeaf: a self explanatory boolean
    getLowest: function(options, cb) {
        Links.getChildren({id: options.id}, function(err, children) {
            if(err) return cb(err);

            if(children.length == 0) return cb(null, {id: options.id, isLeaf: true});
            if(children.length > 1) return cb(null, {id: options.id, isLeaf: false});

            return Links.getLowest({id: children[0]}, cb);
        });
    },

    // Gets the chain down to a leaf or branch. Does not return past posts.
    // Current post is the first element of result.ids
    //
    // options.id: id of starting point
    // options.maxPosts: maximum posts to send back
    // options.depth: (used internally)
    //
    // result.ids: ids in order
    // result.isLeaf: is true if the last node is a leaf.
    // result.isBranch: is true if the last node is a branch/
    // result.maxReached: is true if maxPosts was reached
    getChain: function(options, cb) {
        if(options.maxPosts === undefined) options.maxPosts = 5;
        if(options.depth === undefined) options.depth = 0;

        Links.getChildren({id: options.id}, function(err, children) {
            if(err) return cb(err);

            if(options.depth >= options.maxPosts) return cb(null, {ids: [options.id], isLeaf: false, isBranch: false, maxReached: true});
            if(children.length == 0) return cb(null, {ids: [options.id], isLeaf: true, isBranch: false, maxReached: false});
            if(children.length > 1) return cb(null, {ids: [options.id], isLeaf: false, isBranch: true, maxReached: false});

            Links.getChain({id: children[0], maxPosts: options.maxPosts, depth: options.depth + 1}, function(err, result) {
                var chain = [options.id]; 
                [].push.apply(chain, result.ids);
                return cb(err, {ids: chain, isLeaf: result.isLeaf, isBranch: result.isBranch, maxReached: result.maxReached});
            });
        });
    }
};

