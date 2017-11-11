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
    }
};

