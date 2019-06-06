var elasticsearch = require('elasticsearch'),
    async = require('async'),
    _ = require('lodash'),
    ESQ = require('esq'),
    esq = new ESQ(),
    boosting = require('../../config/elasticSearchBoosting.json'),
    esBoosting = boosting.esBoosting;

function ESUtil(url) {
    this.client = new elasticsearch.Client({
        host: url,
        log: 'error'
    });
}

ESUtil.prototype.findAll = function (indexName, type, limit, callback) {
    var self = this;
    if (limit.type === 'employerView') {
        self.client.search({
            index: indexName,
            type: type,
            from: limit.paging.skip,
            size: limit.paging.count,
            body: {
                "query": {
                    "match_all": {}
                },
                "_source": ["basics.summary", "education", "volunteer", "awards"],
                "sort": [{"_timestamp": {"order": "desc"}}]
            }
        }, function (err, response) {
            if (err) {
                callback(err, null);
            }
            self.getAllDocument(response, callback);
        });
    } else {
        var order = "asce";
        if (limit.filters.sorting['$natural']) {
            delete limit.filters.sorting['$natural'];
            limit.filters.sorting = "lastmoddatetime";
            order = "desc";
        }
        self.client.search({
            index: indexName,
            type: type,
            from: limit.paging.skip,
            size: limit.paging.count,
            body: {
                "query": {
                    "match_all": {}
                },
                "sort": [{
                    [limit.filters.sorting]: {
                        "order": order
                    }
                }]
            }
        }, function (err, response) {
            if (err) {
                callback(err, null);
            }
            self.getAllDocument(response, callback);
        });
    }
};

var basicSearchQueryGenerator = function (dictionaryKeywords, unMatchedKeywords, arrAliases, arrSynonyms) {
    var esq = new ESQ();

    esq.query('bool', ['must'], { match: { "_all" : {"query":  unMatchedKeywords.join(",")}}});
    esq.query('bool', ['should'], {'terms': {"basics.label": unMatchedKeywords, "boost": esBoosting.originalBoost.bas_label}});
    esq.query('bool', ['should'], {'terms': {"basics.summary": unMatchedKeywords, "boost": esBoosting.originalBoost.bas_summary }});
    esq.query('bool', ['should'], {'terms': {"skills.name": unMatchedKeywords, "boost": esBoosting.originalBoost.skills_name}});
    esq.query('bool', ['should'], {'terms': {"skills.level": unMatchedKeywords, "boost": esBoosting.originalBoost.skills_level }});
    esq.query('bool', ['should'], {'terms': {"skills.keywords": unMatchedKeywords, "boost": esBoosting.originalBoost.skills_keywords }});
    esq.query('bool', ['should'], {'terms': {"work.highlights": unMatchedKeywords, "boost": esBoosting.originalBoost.work_highlights }});
    esq.query('bool', ['should'], {'terms': {"work.company": unMatchedKeywords, "boost": esBoosting.originalBoost.work_company}});
    esq.query('bool', ['should'], {'terms': {"work.position": unMatchedKeywords, "boost": esBoosting.originalBoost.work_position }});
    esq.query('bool', ['should'], {'terms': {"work.summary": unMatchedKeywords, "boost": esBoosting.originalBoost.work_summary }});
    esq.query('bool', ['should'], {'terms': {"vol.organization": unMatchedKeywords, "boost": esBoosting.originalBoost.vol_organization}});
    esq.query('bool', ['should'], {'terms': {"vol.position": unMatchedKeywords, "boost": esBoosting.originalBoost.vol_position }});
    esq.query('bool', ['should'], {'terms': {"vol.summary": unMatchedKeywords, "boost": esBoosting.originalBoost.vol_summary }});
    esq.query('bool', ['should'], {'terms': {"vol.highlights": unMatchedKeywords, "boost": esBoosting.originalBoost.vol_highlights }});
    esq.query('bool', ['should'], {'terms': {"edu.institution": unMatchedKeywords, "boost": esBoosting.originalBoost.edu_institution}});
    esq.query('bool', ['should'], {'terms': {"edu.area": unMatchedKeywords, "boost": esBoosting.originalBoost.edu_area }});
    esq.query('bool', ['should'], {'terms': {"edu.studyType": unMatchedKeywords, "boost": esBoosting.originalBoost.edu_studyType }});
    esq.query('bool', ['should'], {'terms': {"edu.courses": unMatchedKeywords, "boost": esBoosting.originalBoost.edu_courses}});
    esq.query('bool', ['should'], {'terms': {"awa.title": unMatchedKeywords, "boost": esBoosting.originalBoost.awa_title }});
    esq.query('bool', ['should'], {'terms': {"awa.awarder": unMatchedKeywords, "boost": esBoosting.originalBoost.awa_awarder }});
    esq.query('bool', ['should'], {'terms': {"awa.summary": unMatchedKeywords, "boost": esBoosting.originalBoost.awa_summary }});
    esq.query('bool', ['should'], {'terms': {"pub.name": unMatchedKeywords, "boost": esBoosting.originalBoost.pub_name}});
    esq.query('bool', ['should'], {'terms': {"pub.publisher": unMatchedKeywords, "boost": esBoosting.originalBoost.pub_publisher }});
    esq.query('bool', ['should'], {'terms': {"pub.summary": unMatchedKeywords, "boost": esBoosting.originalBoost.pub_summary }});
    esq.query('bool', ['should'], {'terms': {"int.name": unMatchedKeywords, "boost": esBoosting.originalBoost.int_name}});
    esq.query('bool', ['should'], {'terms': {"int.keywords": unMatchedKeywords, "boost": esBoosting.originalBoost.int_keywords }});

    esq.query('bool', ['should'], {'terms': {"basics.label": unMatchedKeywords, "boost": esBoosting.aliasesBoost.bas_label }});
    esq.query('bool', ['should'], {'terms': {"basics.summary": unMatchedKeywords, "boost": esBoosting.aliasesBoost.bas_summary }});
    esq.query('bool', ['should'], {'terms': {"skills.name": unMatchedKeywords, "boost": esBoosting.aliasesBoost.skills_name}});
    esq.query('bool', ['should'], {'terms': {"skills.level": unMatchedKeywords, "boost": esBoosting.aliasesBoost.skills_level }});
    esq.query('bool', ['should'], {'terms': {"skills.keywords": unMatchedKeywords, "boost": esBoosting.aliasesBoost.skills_keywords }});
    esq.query('bool', ['should'], {'terms': {"work.highlights": unMatchedKeywords, "boost": esBoosting.aliasesBoost.work_highlights }});
    esq.query('bool', ['should'], {'terms': {"work.company": unMatchedKeywords, "boost": esBoosting.aliasesBoost.work_company}});
    esq.query('bool', ['should'], {'terms': {"work.position": unMatchedKeywords, "boost": esBoosting.aliasesBoost.work_position }});
    esq.query('bool', ['should'], {'terms': {"work.summary": unMatchedKeywords, "boost": esBoosting.aliasesBoost.work_summary }});
    esq.query('bool', ['should'], {'terms': {"vol.organization": unMatchedKeywords, "boost": esBoosting.aliasesBoost.vol_organization}});
    esq.query('bool', ['should'], {'terms': {"vol.position": unMatchedKeywords, "boost": esBoosting.aliasesBoost.vol_position }});
    esq.query('bool', ['should'], {'terms': {"vol.summary": unMatchedKeywords, "boost": esBoosting.aliasesBoost.vol_summary }});
    esq.query('bool', ['should'], {'terms': {"vol.highlights": unMatchedKeywords, "boost": esBoosting.aliasesBoost.vol_highlights }});
    esq.query('bool', ['should'], {'terms': {"edu.institution": unMatchedKeywords, "boost": esBoosting.aliasesBoost.edu_institution}});
    esq.query('bool', ['should'], {'terms': {"edu.area": unMatchedKeywords, "boost": esBoosting.aliasesBoost.edu_area }});
    esq.query('bool', ['should'], {'terms': {"edu.studyType": unMatchedKeywords, "boost": esBoosting.aliasesBoost.edu_studyType }});
    esq.query('bool', ['should'], {'terms': {"edu.courses": unMatchedKeywords, "boost": esBoosting.aliasesBoost.edu_courses}});
    esq.query('bool', ['should'], {'terms': {"awa.title": unMatchedKeywords, "boost": esBoosting.aliasesBoost.awa_title }});
    esq.query('bool', ['should'], {'terms': {"awa.awarder": unMatchedKeywords, "boost": esBoosting.aliasesBoost.awa_awarder }});
    esq.query('bool', ['should'], {'terms': {"awa.summary": unMatchedKeywords, "boost": esBoosting.aliasesBoost.awa_summary }});
    esq.query('bool', ['should'], {'terms': {"pub.name": unMatchedKeywords, "boost": esBoosting.aliasesBoost.pub_name}});
    esq.query('bool', ['should'], {'terms': {"pub.publisher": unMatchedKeywords, "boost": esBoosting.aliasesBoost.pub_publisher }});
    esq.query('bool', ['should'], {'terms': {"pub.summary": unMatchedKeywords, "boost": esBoosting.aliasesBoost.pub_summary }});
    esq.query('bool', ['should'], {'terms': {"int.name": unMatchedKeywords, "boost": esBoosting.aliasesBoost.int_name}});
    esq.query('bool', ['should'], {'terms': {"int.keywords": unMatchedKeywords, "boost": esBoosting.aliasesBoost.int_keywords }});

    esq.query('bool', ['should'], {'terms': {"basics.label": unMatchedKeywords, "boost": esBoosting.synonymsBoost.bas_label }});
    esq.query('bool', ['should'], {'terms': {"basics.summary": unMatchedKeywords, "boost": esBoosting.synonymsBoost.bas_summary }});
    esq.query('bool', ['should'], {'terms': {"skills.name": unMatchedKeywords, "boost": esBoosting.synonymsBoost.skills_name}});
    esq.query('bool', ['should'], {'terms': {"skills.level": unMatchedKeywords, "boost": esBoosting.synonymsBoost.skills_level }});
    esq.query('bool', ['should'], {'terms': {"skills.keywords": unMatchedKeywords, "boost": esBoosting.synonymsBoost.skills_keywords }});
    esq.query('bool', ['should'], {'terms': {"work.highlights": unMatchedKeywords, "boost": esBoosting.synonymsBoost.work_highlights }});
    esq.query('bool', ['should'], {'terms': {"work.company": unMatchedKeywords, "boost": esBoosting.synonymsBoost.work_company}});
    esq.query('bool', ['should'], {'terms': {"work.position": unMatchedKeywords, "boost": esBoosting.synonymsBoost.work_position }});
    esq.query('bool', ['should'], {'terms': {"work.summary": unMatchedKeywords, "boost": esBoosting.synonymsBoost.work_summary }});
    esq.query('bool', ['should'], {'terms': {"vol.organization": unMatchedKeywords, "boost": esBoosting.synonymsBoost.vol_organization}});
    esq.query('bool', ['should'], {'terms': {"vol.position": unMatchedKeywords, "boost": esBoosting.synonymsBoost.vol_position }});
    esq.query('bool', ['should'], {'terms': {"vol.summary": unMatchedKeywords, "boost": esBoosting.synonymsBoost.vol_summary }});
    esq.query('bool', ['should'], {'terms': {"vol.highlights": unMatchedKeywords, "boost": esBoosting.synonymsBoost.vol_highlights }});
    esq.query('bool', ['should'], {'terms': {"edu.institution": unMatchedKeywords, "boost": esBoosting.synonymsBoost.edu_institution}});
    esq.query('bool', ['should'], {'terms': {"edu.area": unMatchedKeywords, "boost": esBoosting.synonymsBoost.edu_area }});
    esq.query('bool', ['should'], {'terms': {"edu.studyType": unMatchedKeywords, "boost": esBoosting.synonymsBoost.edu_studyType }});
    esq.query('bool', ['should'], {'terms': {"edu.courses": unMatchedKeywords, "boost": esBoosting.synonymsBoost.edu_courses}});
    esq.query('bool', ['should'], {'terms': {"awa.title": unMatchedKeywords, "boost": esBoosting.synonymsBoost.awa_title }});
    esq.query('bool', ['should'], {'terms': {"awa.awarder": unMatchedKeywords, "boost": esBoosting.synonymsBoost.awa_awarder }});
    esq.query('bool', ['should'], {'terms': {"awa.summary": unMatchedKeywords, "boost": esBoosting.synonymsBoost.awa_summary }});
    esq.query('bool', ['should'], {'terms': {"pub.name": unMatchedKeywords, "boost": esBoosting.synonymsBoost.pub_name}});
    esq.query('bool', ['should'], {'terms': {"pub.publisher": unMatchedKeywords, "boost": esBoosting.synonymsBoost.pub_publisher }});
    esq.query('bool', ['should'], {'terms': {"pub.summary": unMatchedKeywords, "boost": esBoosting.synonymsBoost.pub_summary }});
    esq.query('bool', ['should'], {'terms': {"int.name": unMatchedKeywords, "boost": esBoosting.synonymsBoost.int_name}});
    esq.query('bool', ['should'], {'terms': {"int.keywords": unMatchedKeywords, "boost": esBoosting.synonymsBoost.int_keywords }});

    return esq.getQuery();
};

ESUtil.prototype.basicSearch = function (indexName, type, dictionaryKeywords, unMatchedKeywords, arrAliases, arrSynonyms, callback) {
    var self = this;
    var basicSearchQuery = basicSearchQueryGenerator(dictionaryKeywords, unMatchedKeywords, arrAliases, arrSynonyms);
    self.client.search({
        index: indexName,
        type: type,
        body: {
            "query": basicSearchQuery
        }
    }, function (err, response) {
        if (err) {
            callback(err, null)
        }
        self.getAllDocument(response, callback);
    });
};
ESUtil.prototype.isDocumentExist = function (indexName, type, id, callback) {
    this.client.exists({
        index: indexName,
        type: type,
        id: id
    }, function (err, data) {
        callback(err, data);
    });
};
ESUtil.prototype.displayDocument = function (indexName, type, id, callback) {
    var self = this;
    self.client.get({
        index: indexName,
        type: type,
        id: id
    }, function (err, response) {
        callback(err, getSingleDocument(response));
    });
};
ESUtil.prototype.addDocument = function (indexName, type, data, callback) {
    this.client.index({
        index: indexName,
        type: type,
        body: data
    }, function (err, data) {
        callback(err, _.omit(data, ['_index', '_type']));
    });
};
var advanceSearchQueryGenerator = function (data, mustKeywords, dictionaryKeywords, arrAliases, arrSynonyms, unMatchedKeywords, sum, jobAliases, unMatchedDesignationKeywords) {
    var esq = new ESQ();
    esq.query('bool', ['must'], 'bool', ['should'], [{ "match_phrase" : {"basics.label": { "query": [mustKeywords, dictionaryKeywords, unMatchedKeywords, unMatchedDesignationKeywords], "boost": esBoosting.originalBoost.label }}},
        { "match_phrase" : {"basics.summary": { "query": [mustKeywords, dictionaryKeywords, unMatchedKeywords, unMatchedDesignationKeywords], "boost": esBoosting.originalBoost.summary }}},
        { "match_phrase" : {"skills.keywords": { "query": [mustKeywords, dictionaryKeywords, unMatchedKeywords, unMatchedDesignationKeywords], "boost": esBoosting.originalBoost.keywords }}},
        { "match_phrase" : {"work.highlights": { "query": [mustKeywords, dictionaryKeywords, unMatchedKeywords, unMatchedDesignationKeywords], "boost": esBoosting.originalBoost.highlights }}},
        { "match_phrase" : {"work.company": { "query": [mustKeywords, dictionaryKeywords, unMatchedKeywords, unMatchedDesignationKeywords], "boost": esBoosting.originalBoost.company }}},
        { "match_phrase" : {"work.position": { "query": [mustKeywords, dictionaryKeywords, unMatchedKeywords, unMatchedDesignationKeywords], "boost": esBoosting.originalBoost.position }}},
        { "match_phrase" : {"education.studyType": { "query": [mustKeywords, dictionaryKeywords, unMatchedKeywords, unMatchedDesignationKeywords], "boost": esBoosting.originalBoost.studyType}}},

        { "match_phrase" : {"basics.label": { "query": [jobAliases, arrAliases], "boost": esBoosting.aliasesBoost.label }}},
        { "match_phrase" : {"basics.summary": { "query": [jobAliases, arrAliases], "boost": esBoosting.aliasesBoost.summary }}},
        { "match_phrase" : {"skills.keywords": { "query": [jobAliases, arrAliases], "boost": esBoosting.aliasesBoost.keywords }}},
        { "match_phrase" : {"work.highlights": { "query": [jobAliases, arrAliases], "boost": esBoosting.aliasesBoost.highlights }}},
        { "match_phrase" : {"work.company": { "query": [jobAliases, arrAliases], "boost": esBoosting.aliasesBoost.company }}},
        { "match_phrase" : {"work.position": { "query": [jobAliases, arrAliases], "boost": esBoosting.aliasesBoost.position }}},
        { "match_phrase" : {"education.studyType": { "query": [jobAliases, arrAliases], "boost": esBoosting.aliasesBoost.studyType}}},

        { "match_phrase" : {"basics.label": { "query": [arrSynonyms], "boost": esBoosting.synonymsBoost.label }}},
        { "match_phrase" : {"basics.summary": { "query": [arrSynonyms], "boost": esBoosting.synonymsBoost.summary }}},
        { "match_phrase" : {"skills.keywords": { "query": [arrSynonyms], "boost": esBoosting.synonymsBoost.keywords}}},
        { "match_phrase" : {"work.highlights": { "query": [arrSynonyms], "boost": esBoosting.synonymsBoost.highlights }}},
        { "match_phrase" : {"work.company": { "query": [arrSynonyms], "boost": esBoosting.synonymsBoost.company}}},
        { "match_phrase" : {"work.position": { "query": [arrSynonyms], "boost": esBoosting.synonymsBoost.position }}},
        { "match_phrase" : {"education.studyType": { "query": [arrSynonyms], "boost": esBoosting.synonymsBoost.studyType}}}]);
    esq.query('bool', ['must_not'], { "terms" : {"_all" : data.unMatchedWords}});
    esq.query('bool', ['should'], [{"terms": {"work.highlights": data.atLeastOneMatch, minimum_match : 1}}]);
    esq.query('bool', ['should'], [{"match_phrase": {"_all": { "query": [sum, unMatchedDesignationKeywords]}}},
        {"match_phrase": { "work.position": { "query": [data.anyJob, jobAliases] }}}]);
    esq.query('bool', ['should'], [{"match_phrase": {"_all": { "query": data.schoolName }}},
        {"match_phrase": { "work.position": { "query": data.address }}}]);
    esq.query('bool', {"minimum_number_should_match" : 0});
    return esq.getQuery();
};
ESUtil.prototype.advanceSearch = function (indexName, type, data, mustKeywords, dictionaryKeywords, arrAliases, arrSynonyms, unMatchedKeywords, sum, jobAliases, unMatchedDesignationKeywords, callback) {
    var self = this,
        advanceSearchQuery = advanceSearchQueryGenerator(data, mustKeywords, dictionaryKeywords, arrAliases, arrSynonyms, unMatchedKeywords, sum, jobAliases, unMatchedDesignationKeywords);
    self.client.search({
        index: indexName,
        type: type,
        body: {
            "query": advanceSearchQuery
        }
    }, function (err, response) {
        if (err) {
            callback(err, null);
        }
        self.getAllDocument(response, callback);
    });
};
ESUtil.prototype.updateDocument = function (indexName, type, id, body, callback) {
    var self = this;
    self.client.update({
        index: indexName,
        type: type,
        id: id,
        body: {
            doc: body
        }
    }, function (err, data) {
        callback(err, _.omit(data, ['_index', '_type']));
    });
};
ESUtil.prototype.deleteDocument = function (indexName, type, id, callback) {
    this.client.delete({
        index: indexName,
        type: type,
        id: id
    }, function (err, data) {
        callback(err, data);
    });
};
var filteringQueryGenerator = function (data) {
    for (var keyword in data) {
        var field = keyword,
            keywordsQuery = data[field];
    }
    var esq = new ESQ();
    if(field == "basics.name") {
        esq.query('query','filtered', 'query', { match_phrase: { "basics.name": { query : keywordsQuery } } });
    } else if(field == "basics.label") {
        esq.query('query','filtered', 'query', { match_phrase: { "basics.label": { query : keywordsQuery } } });
    } else if(field == "basics.email") {
        esq.query('query','filtered', 'query', { match_phrase: { "basics.email": { query : keywordsQuery } } });
    } else if(field == "basics.summary") {
        esq.query('query', 'bool', ['must'], { terms: { "basics.summary" : keywordsQuery, "minimum_match":keywordsQuery.length } });
    } else if(field == "skills.name") {
        esq.query('query','filtered', 'query', { match_phrase: { "skills.name": { query : keywordsQuery } } });
    } else if(field == "skills.keywords") {
        esq.query('query', 'bool', ['must'], { terms: { "skills.keywords" : keywordsQuery, "minimum_match":keywordsQuery.length } });
    } else if(field == "work.company") {
        esq.query('query','filtered', 'query', { match_phrase: { "work.company": { query : keywordsQuery } } });
    } else if(field == "work.position") {
        esq.query('query','filtered', 'query', { match_phrase: { "work.position": { query : keywordsQuery } } });
    } else if(field == "work.highlights") {
        esq.query('query', 'bool', ['must'], { terms: { "work.highlights" : keywordsQuery, "minimum_match":keywordsQuery.length } });
    } else if(field == "awards.title") {
        esq.query('query','filtered', 'query', { match_phrase: { "awards.title": { query : keywordsQuery } } });
    } else if(field == "awards.summary") {
        esq.query('query', 'bool', ['must'], { terms: { "awards.summary" : keywordsQuery, "minimum_match":keywordsQuery.length } });
    } else if(field == "education") {
        esq.query('query', 'bool', ['must'], { terms: { "basics.summary" : keywordsQuery, "minimum_match":keywordsQuery.length } });
    } else if(field == "references") {
        esq.query('query','filtered', 'query', { match_phrase: { "references": { query : keywordsQuery } } });
    } else if(field == "interests") {
        esq.query('query', 'bool', ['must'], { terms: { "interests" : keywordsQuery, "minimum_match":keywordsQuery.length } });
    } else if(field == "volunteer") {
        esq.query('query', 'bool', ['must'], { terms: { "volunteer" : keywordsQuery, "minimum_match":keywordsQuery.length } });
    } else if(field == "languages") {
        esq.query('query', 'bool', ['must'], { terms: { "languages" : keywordsQuery, "minimum_match":keywordsQuery.length } });
    } else {
        return ({status: 400, message: "Bad Request...!"});
    }
    return esq.getQuery();
};
ESUtil.prototype.filter = function (indexName, type, data, callback) {
    var self = this, sortQuery = filteringQueryGenerator(data);
    if (sortQuery.message) {
        callback(null, sortQuery);
    } else {
        this.client.search({
            index: indexName,
            type: type,
            body: sortQuery
        }, function (err, response) {
            if (err) {
                callback(err, null);
            }
            self.getAllDocument(response, callback);
        });
    }
};

ESUtil.prototype.findSkills = function (indexName, type, size, callback) {
    size = size ? size : 20;
    this.client.search({
        index: indexName,
        type: type,
        size: size,
        body: {
            "query": {
                "match_all": {}
            }
        }
    }, function (err, response) {
        callback(err, response);
    })
};
ESUtil.prototype.getAllDocument = function (data, callback) {
    var jobApplyData = [], esData = data;
    async.each(data.hits.hits, function (items, callback) {
        jobApplyData.push(getSingleDocument(items));
        callback(null);
    }, function (err) {
        esData.hits.hits = jobApplyData;
        callback(err, esData);
    });
};

function getSingleDocument(item) {
    var obj;
    obj = _.omit(item._source, []);
    if(obj && Array.isArray(obj.work) && obj.work.length > 1){
        obj.work = obj.work.sort(function(a, b){
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }).reverse();
    }
    if(obj && Array.isArray(obj.education) && obj.education.length > 1){
        obj.education = obj.education.sort(function(a, b){
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }).reverse();
    }
    if(obj && Array.isArray(obj.volunteer) && obj.volunteer.length > 1){
        obj.volunteer = obj.volunteer.sort(function(a, b){
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }).reverse();
    }
    obj['id'] = item._id;
    return obj;
}
ESUtil.prototype.count = function (indexName, result) {
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

ESUtil.prototype.resumeSkillCount = function (indexName, type, params, callback) {
    this.client.search({
        index: indexName,
        type: type,
        body: {
            "aggregations": {
                "skills_count": {
                    "terms": {
                        "field": "skills.keywords",
                        size: 5,
                    }
                }
            }
        }
    }, function (err, response) {
        if (err) {
            callback(err, null)
        } else {
            var resumeSkillsCount = response.aggregations.skills_count.buckets.map(function (value) {
                return {
                    label: value.key,
                    value: value.doc_count
                };
            });
            callback(null, resumeSkillsCount);
        }
    });
};

module.exports = ESUtil;
