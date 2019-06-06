var mongoose = require('mongoose');
var schemaModel = mongoose.model('resume_keywords', {});
var dictionaryData;
function ResumeKeywordsDictionary() {
}

ResumeKeywordsDictionary.prototype.getMongoDictionary = function (value, callback) {
    schemaModel.find({}, {_id: 0}, function (err, data) {
        if (err) {
            callback(err);
        } else {
            dictionaryData = data[0]['_doc'];
            callback(null, dictionaryData);
        }
    });
};


module.exports = ResumeKeywordsDictionary;