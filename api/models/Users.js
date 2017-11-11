/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {
        // id is created automatically and stored as primaryKey 
        username: {
            type: 'text',
            unique: true,
        },
        password: { type: 'string' }
    },

    // Attempts to create a user
    // Checks if the user exists, if not, creates the user
    //
    // options.username: user's unique username
    // options.password: hashed password
    createUser: function(options, cb) {
        // Check if the user exists
        Users.find({ username: options.username })
            .exec(function(err, user) {
                if (err) return cb(err);
                if (user.length != 0) return cb(new Error('user already exists'));

                // Actually create the new user 
                Users.create({
                    username: options.username,
                    password: options.password
                }).exec(function (err, newUser) { 
                    if (err) return cb(err);
                    if (!newUser) return(new Error('failed to create new user'));

                    return cb(null, newUser.primaryKey);
                });
            });
    },

    // Attempts to login a user
    // Checks if user exists, checks password, and then sets authentication
    //
    // options.username: user's unique username
    // options.password: hashed password
    checkUser: function(options, cb) {
        // Find the user
        Users.find({ username: options.username })
            .exec(function(err, user) {
                if (err) return cb(err);
                if (!user) return cb(null, false);

                // Check that the password hashes match
                return cb(null, options.password === user.password);
            });
    }
};

