/**
 * UsersController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
require('../models/Users');

module.exports = {

    // login a user
    //
    // req.params('username'): user's unique username
    // req.params('password'): user's hashed password
    login: function(req, res) {
        // Check that user exists and that password is correct.
        Users.checkUser(req.params, function(err, checked) {
            if (err || !checked) return res.send(400, 'failed to authenticate');
            if (checked) {
                req.session.authenticated = true;
                return res.send(200);
            } else return res.send(400, 'failed to authenticate');
        });	
    },

    // register a user
    //
    // req.params('username'): user's potential username
    // req.params('password'): user's hashed password
    register: function(req, res) {
        // Find the user
        Users.createUser({ 
            username: req.param('username'), 
            password: req.param('password') 
        }, function(err, primaryKey) {
            if (err) return res.send(400, 'failed to make new user');

            return res.send(200);
        });
    }
};

