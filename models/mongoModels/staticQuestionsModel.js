var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('lodash'),
    Schema = mongoose.Schema,
    Logger = require('../../utils/winston/logModule'),
    getSchema = require('../schemas/staticQuestionsSchema.js'),
    questionsSchemaModel = new Schema(getSchema),
    QuestionsSchema = mongoose.model('static_questions', questionsSchemaModel),
    log;
function StaticQuestionsModel() {
    this.modelType = 'mongo';
    log = new Logger();
    this.questionsSchemaModel = QuestionsSchema;
}
StaticQuestionsModel.prototype.find = function (params, callback) {
    log.info('info at find method of static_questions model in mongo models');
    this.questionsSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));

};
StaticQuestionsModel.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne method of static_questions model in mongo models');
    if(Object.keys(params.source).length > 0) {
        var timeOrCount;
        if (params.source['quiz.totaltime'])
            timeOrCount = {'quiz.totaltime': params.source['quiz.totaltime']};
        if (params.source['quiz.limit'])
            timeOrCount = {'quiz.limit': params.source['quiz.limit']};
        if(params.source['subject.id']) {
            var subject = params.source['subject.id'].split(","),
                subjects = [];
            subject.forEach(function (val) {
                subjects.push({
                    'subject.id': val
                });
            });
        }
        if(params.source['quiz.name']) {
            var type = params.source['quiz.name'].split(","),
                types = [];
            type.forEach(function (val) {
                types.push({
                    'quiz.name.type': val
                });
            });
        }
        if(id && subjects && types && timeOrCount && params.source['level.id']) {
            this.questionsSchemaModel.find({emp_id: id, $and: [{$and: subjects}, timeOrCount, {$and: types}, {'level.id': params.source['level.id']}]}, function (err, data) {
                var res = [];
                if(data) {
                    data.map(function (e) {
                        if (e.subject.length === subject.length && type.length === e.quiz.name.length) {
                            res.push(e);
                        }
                    });
                    if (res.length != 0)
                        callback(err, res);
                    else
                        callback (err, {"message": "No Record Found"});
                } else {
                    callback (err, null);
                }
            });
        }
        else {
            callback(null, {"message": "Route Is Incomplete"});
        }
    }
};
StaticQuestionsModel.prototype.create = function (data, callback) {
    log.info('info at create method of static_questions model in mongo models');
    this.questionsSchemaModel.create(data, callback);
};
StaticQuestionsModel.prototype.update = function (id, data, callback) {
    log.info('info at update method of static_questions model in mongo models');
    var self = this, conditions = {_id: id}, update = data, options = {multi: true};
    self.questionsSchemaModel.update(conditions, update, options, callback);
};
StaticQuestionsModel.prototype.remove = function (id, callback) {
    log.info('info at remove method of static_questions model in mongo models');
    this.questionsSchemaModel.remove({_id: id}, callback);
};
StaticQuestionsModel.prototype.search = function (params, callback) {
    log.info('info at search method of static_questions model in mongo models');
    this.questionsSchemaModel.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};


module.exports = StaticQuestionsModel;