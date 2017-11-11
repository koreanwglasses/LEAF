/**
 * PostsController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getPost: function (req, res) {
        return res.send('Get Post');
    },
    getThread: function (req, res) {
        return res.send('Get Thread');
    },
    push: function (req, res) {
        return res.send('Push');
    },
    branch: function (req, res) {
        return res.send('Branch');
    }
	
};

