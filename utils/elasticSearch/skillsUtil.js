var elasticsearch = require('elasticsearch'),
    _ = require('lodash'),
    ESQ = require('esq'),
    async = require('async'),
    boosting = require('../../config/elasticSearchBoosting.json'),
    esBoosting = boosting.esBoosting;

function SkillsUtil(url) {
    this.client = new elasticsearch.Client({
        host: url,
        log: 'error'
    });
}

SkillsUtil.prototype.getCategorySkills = function (indexName, type, params, callback) {
    var self = this;
    self.count(indexName, function (err, totalCount) {
        if (err) {
            callback(err, null);
        } else {
            if (params.source.q) {
                self.client.search({
                    index: indexName,
                    type: type,
                    size: totalCount,
                    body: {
                        "query": {
                            "wildcard": {"category": "*" + params.source.q + "*"}
                        },
                        "_source": ['category']
                    }

                }, function (err, response) {
                    callback(err, response.hits.hits);
                });
            } else {
                self.client.search({
                    index: indexName,
                    type: type,
                    size: totalCount,
                    body: {
                        "query": {
                            "match_all": {}
                        }
                    }
                }, function (err, response) {
                    callback(err, response.hits.hits);
                });
            }
        }
    });
};
SkillsUtil.prototype.count = function (indexName, result) {
    var self = this;

    self.client.count({
        index: indexName,
        body: {
            "query": {
                "match_all": {}
            }
        }
    }, function (err, response) {
        result(err, response);
    });
};
SkillsUtil.prototype.findAutoCompleteSkills = function (indexName, type, q, callback) {
    var self = this;
    self.count(indexName, function (err, count) {
        if (err) {
            callback(err, null);
        } else {
            self.client.search({
                index: indexName,
                type: type,
                size: count.count,
                body: {
                    "query": {
                        "match_phrase_prefix": {
                            "skill": {
                                "query": q
                            }
                        }
                    }
                }
            }, function (err, response) {
                callback(err, response.hits.hits);
            });
        }
    });
};
SkillsUtil.prototype.findAllSkills = function (indexName, type,query, callback) {
    var self = this, esq = new ESQ();
    if (query && query.source && query.source.category && query && query.source && query.source.q) {
        self.client.search({
            index: indexName,
            type: type,
            from:query.paging.skip,
            size: query.paging.count,
            body:  {
                "query": {
                    "multi_match" : {
                        "query":query.source.category +","+query.source.q,
                        "operator":"AND",
                        "fields":[
                            "skill",
                            "category"
                        ]
                    }
                }
            }
        }, function (err, response) {
            if (err) {
                callback(err, null);
            }
            self.getAllDocument(response, callback);
        })
    }
    esq.query('query', 'bool', 'must', {"match": {"_all": {"query": query.source.q}}});
    esq.query('query', 'bool', ['should'], {"match_phrase": {"skill": {"query":query.source.q, "boost": 9001}}});
    esq.query('query', 'bool', ['should'], {"match_phrase": {"category": {"query": query.source.q, "boost": 9002}}});
    esq.query('query', 'bool', ['should'], {"match_phrase": {"alias": {"query": query.source.q, "boost": 9003}}});
    self.client.search({
        index: indexName,
        type: type,
        from: query.paging.skip,
        size: query.paging.count,
        body: esq.getQuery()
    },function (err, response) {
        if (err) {
            callback(err, null);
        }
        self.getAllDocument(response, callback);
    })
};
var searchSkillsQueryGenerator = function (values) {
    var esq = new ESQ();
    if (values && values.source && values.source.skill) {
        esq.query('query', 'bool', ['must'], "query_string", {
            "query": values.source.skill.toLowerCase().split(',').join(' OR '),
            "default_operator": "OR",
            "fields": ["skill.keyword", "alias.keyword"]
        });
    }
    if (values && values.source && values.source.category) {
        if (values.source.category === 'back-end') {
            values.source.category = 'back';
        }
        if (values.source.category === 'front-end') {
            values.source.category = 'front';
        }
        esq.query('query', 'bool', ['must'], 'query_string', {
            "query": values.source.category,
            "fields": ["category"]
        });
    }
    if (values && values.filters && (typeof values.filters.sorting === "string" ) && values.filters.sorting !== 'hint') {
        esq.query(['sort'], values.filters.sorting + ".keyword", {"order": "asc"});
    } else if (values && values.filters && (typeof values.filters.sorting === "string" ) && values.filters.sorting === 'hint') {
        esq.query(['sort'], values.filters.sorting, {"order": "asc"});
    } else if (values && values.filters && (typeof values.filters.sorting === "string" ) && values.filters.sorting === 'skill') {
        esq.query(['sort'], values.filters.sorting, {"order": "asc"});
    } else if (values && values.filters && (typeof values.filters.sorting === "string" ) && values.filters.sorting === 'category') {
        esq.query(['sort'], values.filters.sorting, {"order": "asc"});
    }else {
        esq.query(['sort'],'lastmoddatetime', {"order": "asc"});
    }
    return esq.getQuery();
};
SkillsUtil.prototype.findSkills = function (indexName, type, data, callback) {
    var self = this;
    var basicSearchQuery = searchSkillsQueryGenerator(data);
    self.client.search({
        index: indexName,
        type: type,
        from: data.paging.skip,
        size: data.paging.count,
        body: basicSearchQuery
    }, function (err, response) {
        if (err) {
            callback(err, null);
        }
        self.getAllDocument(response, callback);
    })
};
SkillsUtil.prototype.getAllDocument = function (data, callback) {
    var skilldata = [], esData = data;
    async.forEach(data.hits.hits, function (items, callback) {
        skilldata.push(getSingleDocument(items));
        callback(null);
    }, function (err) {
        esData.hits.hits = skilldata;
        callback(err, esData);
    });
};
function getSingleDocument(item) {
    var obj;
    obj = _.omit(item._source, []);
    obj['id'] = item._id;
    return obj;
}
module.exports = SkillsUtil;