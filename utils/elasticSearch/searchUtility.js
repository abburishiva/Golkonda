var elasticsearch = require('elasticsearch');
function searchUtility(url) {
    this.client = new elasticsearch.Client({
        host: url,
        log: 'error'
    });
}

searchUtility.prototype.existDocument = function (indexName, type, id, callback) {
    this.client.exists({
        index: indexName,
        type: type,
        id: id
    }).then(function (data) {
        callback(null, data);
    }), function (err) {
        callback(err);
    }
};

searchUtility.prototype.displayDocument = function (indexName, type, id) {
    return this.client.get({
        index: indexName,
        type: type,
        id: id
    })
}

searchUtility.prototype.createIndex = function (indexName) {
    return this.client.indices.create({
        index: indexName
    });
};

searchUtility.prototype.deleteIndex = function (indexName) {
    return this.client.indices.delete({
        index: indexName
    });
};

searchUtility.prototype.createMapping = function (indexName, type) {
    return this.client.indices.putMapping({
        index: indexName,
        type: type,
        body: {
            properties: {
                "basics": {
                    "name": {type: 'string'},
                    "label": {type: 'string'},
                    "picture": {type: 'string'},
                    "email": {type: 'string'},
                    "phone": {type: 'string'},
                    "website": {type: 'string'},
                    "summary": {type: 'string'},
                    "location": {
                        "address": {type: 'string'},
                        "postalCode": {type: 'string'},
                        "city": {type: 'string'},
                        "countryCode": {type: 'string'},
                        "region": {type: 'string'}
                    },
                    "profiles": [
                        {
                            "network": {type: 'string'},
                            "username": {type: 'string'},
                            "url": {type: 'string'}
                        }
                    ]
                },
                "work": [],
                "volunteer": [
                    {
                        "organization": {type: 'string'},
                        "position": {type: 'string'},
                        "website": {type: 'string'},
                        "startDate": {type: 'string'},
                        "endDate": {type: 'string'},
                        "summary": {type: 'string'},
                        "highlights": [{type: 'string'}]
                    }
                ],
                "education": [
                    {
                        "institution": {type: 'string'},
                        "area": {type: 'string'},
                        "studyType": {type: 'string'},
                        "startDate": {type: 'string'},
                        "endDate": {type: 'string'},
                        "gpa": {type: 'string'},
                        "courses": [{type: 'string'}]
                    }
                ],
                "awards": [
                    {
                        "title": {type: 'string'},
                        "date": {type: 'string'},
                        "awarder": {type: 'string'},
                        "summary": {type: 'string'}
                    }
                ],
                "publications": [
                    {
                        "name": {type: 'string'},
                        "publisher": {type: 'string'},
                        "releaseDate": {type: 'string'},
                        "website": {type: 'string'},
                        "summary": {type: 'string'}
                    }
                ],
                "skills": [
                    {type: 'string'}
                ],
                "languages": [
                    {
                        "language": {type: 'string'},
                        "fluency": {type: 'string'}
                    }
                ],
                "interests": [
                    {
                        "name": {type: 'string'},
                        "keywords": [{type: 'string'}]
                    }
                ],
                "references": [
                    {
                        "name": {type: 'string'},
                        "reference": {type: 'string'}
                    }
                ]
            }
        }
    });
};

searchUtility.prototype.addDocument = function (indexName, type, data, callback) {
    this.client.index({
        index: indexName,
        type: type,
        body: data
    }).then(function (data) {
        callback(null, data);
    }), function (err) {
        callback(err);
    }
};

searchUtility.prototype.existIndex = function (indexName) {
    return this.client.indices.exists({
        index: indexName
    });
};

searchUtility.prototype.deleteDocument = function (indexName, type, id) {
    return this.client.delete({
        index: indexName,
        type: type,
        id: id
    });
};
searchUtility.prototype.updateDocument = function (indexName, type, id, body) {
    return this.client.update({
        index: indexName,
        type: type,
        id: id,
        body: {
            doc: body
        }
    });
};

searchUtility.prototype.search = function (indexName, type, body, callback) {
    this.client.search({
        index: indexName,
        type: type,
        body: body
    }).then(function (body) {
        callback(null, body);
    }, function (error) {
        callback(error);
    });
};

module.exports = searchUtility;
