var express = require('express'),
    app = express(),
    jwt = require('jsonwebtoken'),
    config = require('config'),
    model,
    SearchResumeModel = require('../models/shareResumesModel');
app.set('super_secret', config.super_secret);

function SearchController() {
    model = new SearchResumeModel();
}

SearchController.prototype.getById = function (req, res) {
    var email;
    if (req.headers['x-access-token']) {
        var token = jwt.decode(req.headers['x-access-token']);
        email = token.user_profile.email;
    }
    model.getById(req.params.id, email, function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else if (!data) {
            res.status(404).json({status: 404, msg: "Data not found"});
        } else {
            res.status(200).json(data);
        }
    });
};
module.exports = SearchController;
