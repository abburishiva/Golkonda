var EsUtil = require('../utils/elasticSearch/esUtil'),
    SkillsUtil = require("../utils/elasticSearch/skillsUtil"),
    Autocomplete = require('autocomplete-trie'),
    config = require('../config/config.json'),
    _ = require('lodash'),
    Logger = require('../utils/winston/logModule'),
    esUtil, skillsUtil,
    log;

function SkillsModel() {
    skillsUtil = new SkillsUtil(config.dev.es_host);
    esUtil = new EsUtil(config.dev.es_host);
    log = new Logger();
}
SkillsModel.prototype.find = function (params, callback) {
    var matchedSkills = [],skillsList=[],matcheSkills = [],skillList=[];
    if ( params && params.source && params.source.q){
        skillsUtil.findAllSkills(config.dev.es_skills.indexName, config.dev.es_skills.type, params, function (err, result) {
            result.hits.hits.map(function (value) {
                matchedSkills.push(value);
            });
            if(params.source.list) {
                matchedSkills.map(function (value) {
                    skillsList.push(value.skill)
                });
                callback(null, skillsList.sort())
            }
            callback(null, _.orderBy(matchedSkills, [params.filters.sorting], ['asc']));
        })
    } else {
        skillsUtil.findSkills(config.dev.es_skills.indexName, config.dev.es_skills.type, params, function (err, result) {
            result.hits.hits.map(function (value) {
                matcheSkills.push(value);
            });
            if(params.source.list) {
                matcheSkills.map(function (value) {
                    skillList.push(value.skill)
                });
                callback(null, skillList.sort())
            }
            callback(null, matcheSkills);
        });
    }
};
SkillsModel.prototype.findOne = function (params, id, callback) {
    esUtil.displayDocument(config.dev.es_skills.indexName, config.dev.es_skills.type, id, function (err, data) {
        callback(err, data);
    });
};
SkillsModel.prototype.create = function (data, callback) {
    var Skils = data.skill, alreadyExists = true;
    if (data && (data.skill && data.category) && (data.skill.trim() && data.category.trim() !== "")) {
        data.skill = data.skill.trim();
        data.category = data.category.trim();
        skillsUtil.count(config.dev.es_skills.indexName, function (err, res) {
            if(err){
                callback(err,null);
            }else {
                esUtil.findSkills(config.dev.es_skills.indexName, config.dev.es_skills.type, res.count, function (err, res) {
                    for (var i = 0; i < res.hits.hits.length; i++) {
                        if (res.hits.hits[i]._source.skill === data.skill) {
                            alreadyExists = false;
                        }
                    }
                    if (alreadyExists) {
                        esUtil.addDocument(config.dev.es_skills.indexName, config.dev.es_skills.type, data, function (err, res) {
                            callback(err, res);
                        });
                    } else {
                        callback(null, {"Status": 200, "message": Skils + " is already Exists"});
                    }
                });
            }
        });
    } else {
        callback(null, {"message": "skill and category are mandatory"})
    }
};
SkillsModel.prototype.update = function (id, data, callback) {
    esUtil.isDocumentExist(config.dev.es_skills.indexName, config.dev.es_skills.type, id, function (err, exit) {
        if (exit) {
            esUtil.displayDocument(config.dev.es_skills.indexName, config.dev.es_skills.type, id, function (err, res) {
                if (res) {
                    var aliases = _.union(data.alias, res.alias);
                    data.alias = aliases
                }
                esUtil.updateDocument(config.dev.es_skills.indexName, config.dev.es_skills.type, id, data, function (err, display) {
                    callback(err, display);
                });
            });
        }
    })
};
SkillsModel.prototype.remove = function (id, callback) {
    esUtil.isDocumentExist(config.dev.es_skills.indexName, config.dev.es_skills.type, id, function (err, exit) {
        if (exit) {
            esUtil.deleteDocument(config.dev.es_skills.indexName, config.dev.es_skills.type, id, function (err, data) {
                if (err) {
                    callback(err, {message: "error"});
                } else {
                    callback(null, data);
                }
            });
        }
    })
};

SkillsModel.prototype.autoComplete = function (req, callback) {
    var self = this, skillsAutoComplete = [];
    if (req.autocomplete) {
        skillsUtil.findAutoCompleteSkills(config.dev.es_skills.indexName, config.dev.es_skills.type, req.source.q, function (err, Dbdata) {
            Dbdata.map(function (value) {
                if (value._source.skill.toLowerCase().startsWith(req.source.q.toLowerCase())) {
                    skillsAutoComplete.push(value._source.skill);
                }
            });
            callback(err, skillsAutoComplete)
        });
    }
};
SkillsModel.prototype.getCategories = function (params, callback) {
    skillsUtil.getCategorySkills(config.dev.es_skills.indexName, config.dev.es_skills.type, params, function (err, data) {
        callback(err, data);
    });
};
module.exports = SkillsModel;
