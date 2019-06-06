var elasticsearch = require('elasticsearch'),
    geoipLite = require("geoip-lite"),
    async = require('async'),
    _ = require('lodash'),
    ESQ = require('esq'),
    boosting = require('../../config/elasticSearchBoosting.json'),
    esBoosting = boosting.esBoosting;

function JPUtil(url) {
    this.client = new elasticsearch.Client({
        host: url,
        log: 'error'
    });
}

JPUtil.prototype.findAll = function (indexName, type, emp_id, size, page, callback) {
    var self = this;
    size = size ? size : 10;
    self.client.search({
        index: indexName,
        type: type,
        from: page ? (page * size) - size : 0,
        size: size,
        body: {
            "query": {
                "bool": {
                    "must": [
                        {
                            "match_all": {}
                        }
                    ],
                    "must_not": [],
                    "should": []
                }
            },
            "sort": [
                {
                    "lastmoddatetime": {
                        "order": "desc"
                    }
                }
            ]
        }
    }, function (err, response) {
        if (err) {
            callback(err, null)
        }
        self.getAllDocument(response, callback);
    });
};
var searchSkillAndCategoryQueryGenerator = function (values) {
    var body;
    var esq = new ESQ();
    if (values.skill) {
        values.skill = values.skill.replace(/webservices/gi, 'web services');
        values.skill = values.skill.replace(/plsql/gi, 'pl sql');
        values.skill = values.skill.replace(/angularjs/gi, 'angular js');
        values.skill = values.skill.replace(/-/gi, ',');
        body = values.skill;
    }
    if (values.category) {
        values.category = values.category.replace(/-/gi, ',');
        values.category = values.category.replace(/frontend|ui/gi, 'front-end,UI');
        values.category = values.category.replace(/backend/gi, 'back-end');
        values.category = values.category.replace(/-/gi, ',');
        body = values.category;
    }
    if (values.category && values.skill) {
        body = values.skill + ',' + values.category;
    }
    esq.query('query', 'bool', ['must'], 'query_string', {
        "query": body,
        "default_operator": "OR",
        "fields": ["job.categories.skills", "job.categories.category"]
    });
    esq.query('query', 'bool', ['must'], 'range', 'job.valid_through', {
        "gte": "now",
        "format": "yyyy/MM/dd HH:mm:ss||yyyy/MM/dd||yyyy-MM-dd HH:mm:ss.SSS||yyyy-MM-dd'T'HH:mm:ss.SSSZ||dateOptionalTime||yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||basic_date_time||date_time"
    });
    esq.query(['sort'], 'lastmoddatetime', {"order": "desc"});
    return esq.getQuery();
};
JPUtil.prototype.findSkillAndCategory = function (indexName, type, value, size, page, callback) {
    var self = this;
    size = size ? size : 10;
    var basicSearchQuery = searchSkillAndCategoryQueryGenerator(value);
    self.client.search({
        index: indexName,
        type: type,
        size: size,
        from: page ? (page * size) - size : 0,
        body: basicSearchQuery
    }, function (err, response) {
        if (err) {
            callback(err, null)
        }
        self.getAllDocument(response, callback);
    });
};
JPUtil.prototype.filtering = function (indexName, type, value, size, page, callback) {
    var self = this,
        esq = new ESQ();
    size = size ? size : 10;
    if ((value.decoded && !("is_super" in value.decoded.auth_details)) && (value.query && !(value.query.location || value.query.distance))) {
        var data=geoipLite.lookup(value.headers['x-forwarded-for']);
        esq.query('query', 'bool', ['filter'], {"geo_distance":{"distance" : "25000miles", "job.location.pin": {"lat": data.ll[0],"lon": data.ll[1]}}});
        esq.query(['sort'], {"_geo_distance":{"order" : "asc","unit" : "miles","job.location.pin":{"lat": data.ll[0],"lon": data.ll[1]}}});
    }else{
        if(value.query && (value.query.location || value.query.distance)){
            if(value.headers.location){
                value.headers.location = value.headers.location.includes(',') ? value.headers.location.split(',') : callback(null, {status: 400, message: "don't headers location"}) ;
                var location={
                    "lat": value.headers.location[0],
                    "lon": value.headers.location[1]
                };
                value.query.distance = value.query.distance ? value.query.distance+"miles" : "10miles";
                esq.query('query', 'bool', ['filter'], {"geo_distance":{"distance" : value.query.distance,"job.location.pin": location}});
                esq.query(['sort'], {"_geo_distance":{"order" : value.query.order || "asc","unit" : "miles","job.location.pin": location}});
            }else{
                callback(null, {status: 400, message: "location not found in headers"});
            }
        }
    }
    if (value.query && value.query.uid) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.uid, "fields": ["job.uid"], "default_operator": "OR"}});
    }
    if (value.query && value.query.country) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.country, "fields": ["job.location.country^10"], "default_operator": "OR"}});
    }
    if (value.query && (value.query.state || value.query.region )) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.state || value.query.region , "fields": ["job.location.state^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.city) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.city, "fields": ["job.location.city^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.postalCode) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.postalCode, "fields": ["job.location.postalCode^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.organization) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.organization, "fields": ["job.organization.name^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.url) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.url, "fields": ["job.organization.name^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.baseSalary) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.baseSalary, "fields": ["job.baseSalary.value.currency^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.email) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.email, "fields": ["job.emails^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.skills) {
            value.query.skills = value.query.skills.replace(/webservices/gi, 'web services');
            value.query.skills = value.query.skills.replace(/plsql/gi, 'pl sql');
            value.query.skills = value.query.skills.replace(/angularjs/gi, 'angular js');
            value.query.skills = value.query.skills.replace(/-/gi, ',');
        esq.query('query', 'bool', ['must'], {"terms": {"job.categories.skills": value.query.skills.split(',')}});
    }
    if (value.query && value.query.category) {
            value.query.category = value.query.category.replace(/-/gi, ',');
            value.query.category = value.query.category.replace(/frontend|ui/gi, 'front,UI');
            value.query.category = value.query.category.replace(/backend/gi, 'back');
            value.query.category = value.query.category.replace(/-/gi, ',');
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.category, "fields": ["job.categories.category^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.industry) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.industry, "fields": ["job.industry^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.education) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.education, "fields": ["job.education^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.experience) {
        esq.query('query', 'bool', ['must'], {"terms": {"job.experience.value": value.query.experience.split(',')}});
    }
    if (value.query && value.query.source) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.source, "fields": ["job.source^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.employmentType) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.employmentType, "fields": ["job.employment_type^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.positionStatus) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.positionStatus, "fields": ["job.positionStatus^10"], "default_operator": "OR"}});
    }
    if (value.query && value.query.workAuthorizations) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.query.workAuthorizations+", ALL", "fields": ["job.work_authorizations^10"], "default_operator": "OR"}});
    }
    if (value.params && value.params.emp_id) {
        esq.query('query', 'bool', ['must'], {"query_string": {"query": value.params.emp_id, "fields": ["job.emp_id"], "default_operator": "OR"}});
    }
    if (value.query && value.query.title) {
        esq.query('query', 'bool', ['must'], {"terms": {"job.title.keyword": value.query.title.split(',')}});
    }
    if (value.query && (value.query.timeDate || value.query.timeUnit)) {
        var queryDate;
        if (isNaN(value.query.timeDate)) {
            queryDate = value.query.timeDate.toLowerCase() !== 'today'
                ? (value.query.timeDate.toLowerCase() === 'thisweek' || value.query.timeDate.toLowerCase() === 'this week')
                    ? 'now-1w' : 'now'
                : 'now';
        } else if (value.query.timeDate && !isNaN(value.query.timeDate)) {
            queryDate = value.query.timeDate;
        }
        if (value.query.timeUnit && typeof value.query.timeUnit === 'string') {
            value.query.timeUnit = value.query.timeUnit.toLowerCase();
            value.query.timeUnit = value.query.timeUnit.replace(/^(d|da|day|days)$/, 'd');
            value.query.timeUnit = value.query.timeUnit.replace(/^(h|ho|hou|hour|hours)$/, 'h');
            value.query.timeUnit = value.query.timeUnit.replace(/^(w|we|wee|week|weeks)$/, 'w');
            value.query.timeUnit = value.query.timeUnit.replace(/^(m|mo|mon|mont|month|months)$/, 'M');
            value.query.timeUnit = value.query.timeUnit.replace(/^(y|ye|yea|year|years)$/, 'y');
            queryDate = 'now-' + queryDate + value.query.timeUnit;
        }
        esq.query('query', 'bool', ['must'], 'range', 'job.posted_date', {
            "gte": queryDate || "now",
            "format": "yyyy/MM/dd HH:mm:ss||yyyy/MM/dd||yyyy-MM-dd HH:mm:ss.SSS||yyyy-MM-dd'T'HH:mm:ss.SSSZ||dateOptionalTime||yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||basic_date_time||date_time"
        });
    }
    if (value.decoded && !value.decoded.auth_details.is_super) {
        esq.query('query', 'bool', ['must'], 'range', 'job.valid_through', {
            "gte": "now",
            "format": "yyyy/MM/dd HH:mm:ss||yyyy/MM/dd||yyyy-MM-dd HH:mm:ss.SSS||yyyy-MM-dd'T'HH:mm:ss.SSSZ||dateOptionalTime||yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||basic_date_time||date_time"
        });
        esq.query('_source', ['excludes'], "job.metadata");
    }
    if (value.query && value.query.sort) {
        value.query.sort = value.query.sort.replace(/category|skills|must_have_skills|nice_to_have_skills|title|employment_type/gi, function (matched) {
            matched = (matched === "category" || matched === "skills") ? 'categories.' + matched : matched;
            return matched + ".keyword";
        });
        value.query.sort = "job." + value.query.sort;
        esq.query(['sort'], {[value.query.sort]: {"order": value.query.order || "asc"}});
    } else {
        esq.query(['sort'], {"lastmoddatetime": {"order": value.query.order || "desc"}});
    }
    self.client.search({
        index: indexName,
        type: type,
        from: page ? (page * size) - size : 0,
        size: size,
        body: esq.getQuery()
    }, function (err, response) {
        if (err) {
            callback(err, null)
        }
        self.getAllDocument(response, callback);
    });
};
var basicSearchQueryGenerator = function ( unMatchedKeywords) {
    var esq = new ESQ();
    esq.query('bool', ['must'], {match: {"_all": {"query": unMatchedKeywords}}});
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.categorys.category": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.pub_summary
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.categorys.skills": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.int_name
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.title": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.bas_label
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.description": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.skills_name
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.educational_requirements": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.skills_level
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.employer.name": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.skills_keywords
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.location.City": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.work_company
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.location.State": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.work_summary
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.location.Name": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.vol_organization
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.location.PostalCode": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.vol_position
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.must_have_skills": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.int_keywords
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.nice_to_have_skills": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.pub_summary
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.organization.name": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.vol_highlights
            }
        }
    });
    esq.query('bool', ['should'], {
        "match_phrase": {
            "job.responsibilities": {
                "query": unMatchedKeywords,
                "boost": esBoosting.originalBoost.skills_keywords
            }
        }
    });
    return esq.getQuery();
};
JPUtil.prototype.basicSearch = function (indexName, type, dictionaryKeywords, unMatchedKeywords, callback) {
    var self = this,
        basicSearchQuery = basicSearchQueryGenerator( unMatchedKeywords[0] );
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
JPUtil.prototype.isIndexExist = function (indexName, callback) {
    this.client.indices.exists({
        index: indexName
    }, function (err, data) {
        callback(err, data);
    });
};
JPUtil.prototype.isDocumentExist = function (indexName, type, id, callback) {
    this.client.exists({
        index: indexName,
        type: type,
        id: id
    }, function (err, data) {
        callback(err, data);
    });
};
JPUtil.prototype.addDocument = function (indexName, type, data, callback) {
    this.client.index({
        index: indexName,
        type: type,
        body: data
    }, function (err, data) {
        callback(err, _.omit(data, ['_index', '_type']));
    });
};
JPUtil.prototype.updateDocument = function (indexName, type, id, body, callback) {
    this.client.update({
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
JPUtil.prototype.deleteDocument = function (indexName, type, id, callback) {
    this.client.delete({
        index: indexName,
        type: type,
        id: id
    }, function (err, data) {
        callback(err, data);
    });
};
JPUtil.prototype.displayDocument = function (indexName, type, id, callback) {
    var self = this;
    self.client.get({
        index: indexName,
        type: type,
        id: id
    }, function (err, response) {
        callback(err, getSingleDocument(response));
    });
};

JPUtil.prototype.findJobs = function (indexName, type, candidateSkills, callback) {
    this.client.search({
        index: indexName,
        type: type,
        body: {
            "aggregations": {
                "skills_count": {
                    "terms": {
                        "field": "job.categories.skills"
                    }
                }
            }
        }
    }, function (err, response) {
        var candidateJobs = [];
        if (response && response.aggregations && response.aggregations.skills_count && response.aggregations.skills_count.buckets) {
            var jobCount = response.aggregations.skills_count.buckets.map(function (value) {
                return {
                    label: value.key,
                    value: value.doc_count
                };
            });

            function searchSkills(skill) {
                var isSkill = false;
                for (var j = 0; j < jobCount.length; j++) {
                    if (jobCount[j].label === skill.toLowerCase()) {
                        isSkill = true;
                        candidateJobs.push({"label": skill, "value": jobCount[j].value});
                        break;
                    }
                }
                if (!isSkill)
                    return candidateJobs.push({"label": skill, "value": 0});
            }

            candidateSkills.forEach(function (item) {
                searchSkills(item)
            });
            callback(err, {
                totalJobs: jobCount.slice(0, 5),
                candidateJobs: candidateJobs,
                totalJobsCount: response.hits.total
            });
        } else {
            callback(err, {
                totalJobs: [],
                candidateJobs: [],
                totalJobsCount: 0
            });
        }
    });
};

JPUtil.prototype.displayOnlySkills = function (indexName, type, skillsList, callback) {
    var self = this;
    self.client.search({
        index: indexName,
        type: type,
        from: 0,
        size: 9999,
        body: {
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "query": skillsList.join(),
                                "default_operator": "OR",
                                "fields": ["skill"]
                            }
                        }
                    ]
                }
            }
        }
    }, function (err, response) {
        if (err) {
            callback(err, null);
        }
        self.getData(response, function (err, getData) {
            callback(err, getData);
        });

    });
};

JPUtil.prototype.latestJobs = function (indexName, type, params, callback) {
    var self = this;
    self.client.search({
        index: indexName,
        type: type,
        from: 0,
        size: 5,
        body: {
            'query': {
                'match_all': {}
            },
            'sort': [{
                'lastmoddatetime': {
                    'order': 'desc'
                }
            }],
            '_source': ['job.title', 'lastmoddatetime', 'job.organization.name','job.organization.url','job.valid_through', 'job.location.city', 'job.location.state', 'job.location.country', 'job.positionStatus','job.employment_type','job.description','job.employer.name']
        }
    }, function (err, response) {
        if (err) {
            callback(err, null)
        } else {
            callback(null, response.hits.hits)
        }
    });
}

JPUtil.prototype.getData = function (data, callback) {
    var jobApplyData = [];
    async.each(data.hits.hits, function (items, callback) {
        jobApplyData.push(_.omit(items._source, []));
        callback(null);
    }, function (err) {
        data.hits.hits = jobApplyData;
        callback(err, data);
    });
};
JPUtil.prototype.getAllDocument = function (data, callback) {
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
    obj = _.omit(item._source.job, []);
    obj['id'] = item._id;
    obj['lastmoduserid'] = item._source.lastmoduserid;
    obj['lastmoddatetime'] = item._source.lastmoddatetime;
    return obj;
}
JPUtil.prototype.getMultipleDocuments = function (indexName, type, ids , callback) {
    this.client.mget({
        index: indexName,
        type: type,
        body: {
                "ids" : ids
        }
    }, function (err, response) {
        if (err) {
            callback(err, null)
        } else
            callback(err, response);
    });
};

JPUtil.prototype.checkDuplicate = function (indexName, type, title, email, callback) {
    var self = this;
    self.client.search({
        index: indexName,
        type: type,
        body: {
            "query": {
                "multi_match": {
                    "query": title,
                    "operator": "AND",
                    "fields": [
                        "job.title"
                    ]
                }
            }
        }
    }, function (err, response) {
        if (err) {
            callback(err, null);
        } else if (response && response.hits && response.hits.hits.length > 0) {
            self.checkDuplicateMail(indexName, type, email, function (err, res) {
                if (err) {
                    callback(err, null);
                } else if (res && res.hits && res.hits.hits.length) {
                    callback(null, "This job Already Exist");
                } else {
                    callback(null, "save");
                }
            });
        } else {
            callback(null, "save");
        }
    });
};

JPUtil.prototype.checkDuplicateMail = function (indexName, type, email, callback) {
    this.client.search({
        index: indexName,
        type: type,
        body: {
            "query": {
                "multi_match": {
                    "query": email,
                    "operator": "AND",
                    "fields": [
                        "job.employer.email"
                    ]
                }
            }
        }
    }, function (err, response) {
        if (err) {
            callback(err, null);
        } else if (response && response.hits && response.hits.hits.length > 0) {
            callback(null, response)
        } else {
            callback(null, []);
        }
    });
};

JPUtil.prototype.filterDataCount = function (indexName, type, req, callback) {
    var self = this;
    self.client.search({
        index: indexName,
        type: type,
        body: {
            "aggs": {
                "skillsCount": {
                    "terms": {
                        "field": "job.categories.skills.keyword",
                        "size": 25
                    }
                },
                "jobTitleCount": {
                    "terms": {
                        "field": "job.title.keyword",
                        "size": 25
                    }
                },
                "experienceCount": {
                    "terms": {
                        "field": "job.experience.value",
                        "size": 25
                    }
                },
                "jobTypeCount": {
                    "terms": {
                        "field": "job.employment_type.keyword",
                        "size": 25
                    }
                }
            }
        }
    }, function (err, data) {

        if (err) {
            callback(err, null);
        } else if (data && data.aggregations) {
            callback(null, {
                skills: data.aggregations.skillsCount.buckets,
                jobtitle: data.aggregations.jobTitleCount.buckets,
                experience: data.aggregations.experienceCount.buckets,
                jobtype: data.aggregations.jobTypeCount.buckets
            });
        } else {
            callback(null, {message: 'something went Wrong'});
        }
    })

};

module.exports = JPUtil;
