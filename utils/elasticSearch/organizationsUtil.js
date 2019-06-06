var elasticsearch = require('elasticsearch'),
    async = require('async'),
    _ = require('lodash'),
    ESQ = require('esq'),
    boosting = require('../../config/elasticSearchBoosting.json'),
    esBoosting = boosting.esBoosting;

function OrganizationsUtil(url) {
    this.client = new elasticsearch.Client({
        host: url,
        log: 'error'
    });
}

var searchOrganizationsQueryGenerator = function (values) {
    var esq = new ESQ();
    if (values && values.source.name) {
        esq.query('query', 'bool', ['must'], 'match_phrase', {
            "name.keyword": values.source.name
        });
    } else if (values && values.source.url) {
        esq.query('query', 'bool', ['must'], 'query_string', {
            "query": "*" + values.source.url + "*",
            "default_operator": "OR",
            "fields": ["url", "domain"]
        });
    } else if (values && values.source.domain) {
        esq.query('query', 'bool', ['must'], 'query_string', {
            "query": "*" + values.source.domain + "*",
            "default_operator": "OR",
            "fields": ["url", "domain"]
        });
    } else if (values && values.source.location) {
        esq.query('query', 'bool', ['must'], 'query_string', {
            "query": '"' + values.source.location + '"',
            "default_operator": "OR",
            "fields": ["location"]
        })
    } else if (values && values.autocomplete && values.source.q) {
        esq.query('query', 'bool', ['must'], 'query_string', {
            "query": values.source.q + "*",
            "fields": ["name"]
        });
        esq.query(['_source'], "name");
    } else if (values && values.source.q) {
        esq.query('query', 'bool', ['must'], 'query_string', {
            "query": "*" + values.source.q + "*",
            "fields": ["name", "url", "domain", "location", "industry", "legalName", "logo"]
        });
    } else if (values && values.source.industry) {
        esq.query('query', 'bool', ['must'], 'match_phrase', {
            "industry.keyword": values.source.industry
        });
    }
    if ((values.source.q || values.source.location || values.source.industry) && (values.filters.sorting === 'name' || values.filters.sorting === 'industry' || values.filters.sorting === 'location')) {
        esq.query(['sort'], values.filters.sorting + ".keyword", {"order": "asc"});
        return esq.getQuery();
    } else {
        esq.query(['sort'], 'lastmoddatetime', {"order": "desc"});
        return esq.getQuery();
    }
};

OrganizationsUtil.prototype.findOrganizations = function (indexName, type, data, callback) {
    var self = this, field;
    if ((data.source.location) && (data.source.industry)) {
        if (data.filters.sorting === 'name' || data.filters.sorting === 'industry' || data.filters.sorting === 'location') {
            field = data.filters.sorting
        } else {
            field = 'name'
        }
        self.client.search({
            index: indexName,
            type: type,
            from: data.paging.skip,
            size: data.paging.count,
            body: {
                "query": {
                    "bool": {
                        "must": [{
                            "match": {
                                "location": data.source.location
                            }
                        },
                            {
                                "match": {
                                    "industry": '"' + data.source.industry + '"'
                                }
                            }
                        ]
                    }
                },
                "sort": [{
                    [field + ".keyword"]: {
                        "order": "asc",
                    }
                }]
            }
        }, function (err, response) {
            if(err){
                callback(err,null);
            }
            self.getAllDocument(response, callback);
        });
    } else {
        var basicSearchQuery = searchOrganizationsQueryGenerator(data);
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
    }
};

OrganizationsUtil.prototype.findAll = function (indexName, type, params, callback) {
    var self = this, field;
    if (params && params.filters && params.filters.sorting === 'name' || params && params.filters && params.filters.sorting === 'industry' || params && params.filters && params.filters.sorting === 'location') {
        field = params.filters.sorting
    } else {
        field = 'name'
    }
    self.client.search({
        index: indexName,
        type: type,
        from: params.paging.skip,
        size: params.paging.count,
        body: {
            "query": {
                "match_all": {}
            },
            "sort": [{
                [field + ".keyword"]: {
                    "order": "asc",
                }
            }]
        }
    }, function (err, response) {
        if (err) {
            callback(err, null);
        }
        self.getAllDocument(response, callback);
    });
};

OrganizationsUtil.prototype.displayOrganization = function (indexName, type, body, callback) {
    var self = this;
    self.client.search({
        index: indexName,
        type: type,
        body: {
            "query": {
                "bool": {
                    "must": {
                        "query_string": {
                            "query": (body.url || body.domain),
                            "default_operator": "OR",
                            "fields": ["url", "domain"]
                        }
                    },
                    "must_not": [],
                    "should": []
                }
            }
        }
    }, function (err, response) {
        if (err) {
            callback(err, null);
        }
        self.getAllDocument(response, callback);
    });
};
OrganizationsUtil.prototype.displayOrganizationName = function (indexName, type, body, callback) {
    var self = this;
    self.client.search({
        index: indexName,
        type: type,
        body: {
            "query": {
                "bool": {
                    "must": {
                        "query_string": {
                            "query": (body.name),
                            "default_operator": "OR",
                            "fields": ["name"]
                        }
                    },
                    "must_not": [],
                    "should": []
                }
            }
        }
    }, function (err, response) {
        if (err) {
            callback(err, null);
        }
        callback(null, response.hits.hits)
    });
};
OrganizationsUtil.prototype.getAllDocument = function (data, callback) {
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
    obj['id'] = item._id;
    return obj;
}
OrganizationsUtil.prototype.getMultipleDocuments = function (indexName, type, name , callback) {
    var self = this;
    self.client.msearch({
        index: "organizations",
        type: "details",
        body: [{
            "query": {
                "match_all": {}
            }
        },{
            "query": {
                "query_string": {
                    "query": name,
                    "fields": ["name","url"]
                }
            }
        }
        ]}, function (err, response) {
        if (err) {
            callback(err, null)
        } else
            callback(err, response);
    });
};
module.exports = OrganizationsUtil;