var mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema,
    Logger = require('../../utils/winston/logModule'),
    getSchema = require('../schemas/candidateSchema.js'),
    EsResumesModel = require('../elasticSearchResumesModel'),
    TalentUsersModel = require('./talentUsersModel'),
    candidateSchema = new Schema(getSchema),
    CandidateSchemaModel = mongoose.model('candidates', candidateSchema),
    log,
    esResumesModel,
    talentUsersModel;

function Candidate() {
    this.candidateSchemaModel = CandidateSchemaModel;
    this.modelType = 'mongo';
    talentUsersModel = new TalentUsersModel();
    esResumesModel = new EsResumesModel();
    log = new Logger();
}

Candidate.prototype.find = function (params, callback) {
    log.info('info at find method of Candidate model in mongo models');
    if (!params.paging.count) {
        callback(null, {status: 400, message: "Please provide limit to get data"});
    } else {
        if (params.source && params.source.type === 'talentUsers') {
            talentUsersModel.find({source: {candidateId: params.source.candidateId}}, callback);
        } else {
            if (params.resumeID) {
                this.candidateSchemaModel.findOne({"resume_id": params.resumeID}, function (err, data) {
                    callback(err, data);
                });
            } else {
                this.candidateSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
            }
        }
    }
};
Candidate.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne method of Candidate model in mongo models');
    this.candidateSchemaModel.findOne({_id: id}, callback);
};
Candidate.prototype.create = function (data, callback) {
    log.info('info at create method of Candidate model in mongo models');
    this.candidateSchemaModel.create(data, callback);
};
Candidate.prototype.update = function (id, data, callback) {
    log.info('info at update method of Candidate model in mongo models');
    var self = this, conditions = {_id: id}, update = data, options = {multi: true};
    if (update.isResumeDeleted) {
        self.candidateSchemaModel.update(conditions, {$unset: {resume_id: 1}}, {multi: false}, callback);
    } else {
        if (update && update.resume_id) {
            esResumesModel.findOne({}, update.resume_id, function (err, results) {
                if (!results) {
                    delete update.resume_id;
                }
                return self.candidateSchemaModel.update(conditions, update, options, callback);
            });
        } else {
            return self.candidateSchemaModel.update(conditions, update, options, callback);
        }
    }
};
Candidate.prototype.remove = function (id, callback) {
    log.info('info at remove method of Candidate model in mongo models');
    talentUsersModel.remove({candidateId: id}, function (err, result) {
        log.info(err);
        log.info('info at remove method of talentUser model in mongo models', result);
    });
    this.candidateSchemaModel.remove({_id: id}, callback);
};
Candidate.prototype.search = function (params, callback) {
    log.info('info at search method of Candidate model in mongo models');
    this.candidateSchemaModel.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};

Candidate.prototype.findCandidatesCount = function (params, callback) {
    var self = this, candidateSkills;
    self.candidateSchemaModel.aggregate([{$unwind: "$user_profile.skills_interested"}, {$project: {"user_profile.skills_interested": {$toLower: "$user_profile.skills_interested"}}}, {
        $group: {
            _id: "$user_profile.skills_interested",
            count: {$sum: 1}
        }
    }], function (err, data) {
        var value = data.map(function (value) {
            return {
                label: value._id,
                value: value.count
            };
        });

        self.candidateSchemaModel.count({}, function (err, candidates) {
            candidateSkills = _.orderBy(_.uniqWith(value, _.isEqual), ['value'], ['desc']);
            callback(err, {candidates: candidates, totalSkills: candidateSkills.slice(0, 10)});
        });
    });
};

module.exports = Candidate;