var SkillsModel = require('../models/skillsModel'),
    OrganizationsModel = require('../models/organizationsModel'),
    LookupDesignationsModel = require('../models/mysqlModels/lookupDesignationsModel'),
    _ = require("lodash"),
    sm, om, led;

function AutoComplete() {
    sm = new SkillsModel();
    led = new LookupDesignationsModel();
    om = new OrganizationsModel();
}

AutoComplete.prototype.find = function (req, callback) {
    var completeObj = [], organizations = [], skills, designations = [];
    req.autocomplete = true;

    if (req && req.paging && req.paging.count > 0) {
        if (req && req.source && req.source.q) {
            if(req.source.skill === "true"){
                sm.autoComplete(req, function (err, skillsData) {
                    if (err) {
                        callback(err, null);
                    } else {
                        skills = skillsData;
                        callback(null, skills.slice(0, req.paging.count));
                    }
                })
            }else {
                sm.autoComplete(req, function (err, skillsData) {
                    if (err) {
                        callback(err, null);
                    } else {
                        skills = skillsData;
                        led.search({name: req.source.q}, function (err, designationsData) {
                            if (err) {
                                callback(err, null);
                            } else {
                                designationsData.map(function (value) {
                                    designations.push(value.name);
                                });
                                om.find(req, function (err, organizationsData) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        if (!Array.isArray(organizationsData)) {
                                            organizationsData.hits.hits.map(function (value) {
                                                organizations.push(value.name);
                                            });
                                        }
                                        if ((skills.length || organizations.length || designations.length) > 0) {
                                            completeObj = _.union(skills, organizations, designations);
                                        }
                                        if (completeObj.length > 0) {
                                            callback(null, completeObj.slice(0, req.paging.count));
                                        } else {
                                            callback(null, completeObj);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        } else {
            callback(null, {"status": 404, "message": "something went wrong"});
        }
    } else {
        callback(null, {status: 400, message: "limit is mandatory"});
    }
}

module.exports = AutoComplete;
