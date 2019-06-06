var elasticsearch = require('elasticsearch'),
    _ = require('lodash'),
    ESQ = require('esq');

function ESUtil(url) {
    this.client = new elasticsearch.Client({
        host: url,
        log: 'error'
    });
}

ESUtil.prototype.isDocumentExist = function (indexName, type, id, callback) {
    this.client.exists({
        index: indexName,
        type: type,
        id: id
    }, function (err, data) {
        callback(err, data);
    });
};
var resumeSearchQueryGenerator = function (id, data) {
    var esq = new ESQ();
    if (data.length <= 0) {
        data = ['PrivateAccess'];
    }
    esq.query('query', 'match', '_id', id);
    esq.query('_source', data);
    return esq.getQuery();
};
ESUtil.prototype.displayDocument = function (indexName, type, id, data, callback) {
    var resumeSearchQuery = resumeSearchQueryGenerator(id, data);
    this.client.search({
        index: indexName,
        type: type,
        body: resumeSearchQuery
    }, function (err, response) {
        callback(err, _.omit(response.hits.hits[0]._source, []));
    });
};
module.exports = ESUtil;