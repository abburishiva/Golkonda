var skillsModel = require('./skillsModel'),
    _ = require('lodash'),
    sm;

function CategoriesModel() {
    sm = new skillsModel();
}

CategoriesModel.prototype.find = function (req, callback) {
    var categories = [], allCategories, categoriesOnSkill = [];
    sm.getCategories(req, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            if (req.source.q) {
                data.map(function (key) {
                    categories.push(key._source.category);
                })

                allCategories = _.uniq(categories);
                if (req.paging.count > 0) {
                    callback(null, allCategories.slice(0, req.paging.count));
                } else {
                    callback(null, _.uniq(categories))
                }
            } else if (req.source.skill) {
                data.map(function (value) {
                    if (value._source.skill.toLowerCase() === req.source.skill.toLowerCase()) {
                        categoriesOnSkill.push(value._source.category)
                    }
                    if (value._source.alias) {
                        value._source.alias.map(function (alias) {
                            if (alias.toLowerCase() === req.source.skill.toLowerCase()) {
                                categoriesOnSkill.push(value._source.category)
                            }
                        });
                    }
                });
                callback(null, _.uniq(categoriesOnSkill));
            } else {
                data.map(function (key) {
                    categories.push(key._source.category);
                })
                allCategories = _.uniq(categories);
                if (req.paging.count > 0) {
                    callback(null, allCategories.slice(0, req.paging.count));
                } else {
                    callback(null, _.uniq(categories))
                }
            }
        }
    });
}

module.exports = CategoriesModel;
