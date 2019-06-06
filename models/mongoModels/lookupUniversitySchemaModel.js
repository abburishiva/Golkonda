var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var lookupUniversityModel = new Schema({
    id: {type: Number},
    alpha_two_code: {type: String},
    countryid: {type: Number},
    domain: {type: String},
    name: {type: String},
    web_page: {type: String},
    lastmodedatetime: {type: String},
    lastmodeuserid: {type: Number}
});

module.exports = mongoose.model('lookup_universities', lookupUniversityModel);