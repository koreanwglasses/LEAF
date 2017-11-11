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
    }
};

