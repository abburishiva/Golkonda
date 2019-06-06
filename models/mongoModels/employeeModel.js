var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Logger = require('../../utils/winston/logModule'),
    TalentUsersModel = require('./talentUsersModel'),
    getSchema = require('../schemas/employersSchema.js'),
    employeeSchema = new Schema(getSchema),
    EmployeeSchemaModel = mongoose.model('employers', employeeSchema),
    talentUsersModel,
    log;

function Employee() {
    this.modelType = 'mongo';
    log = new Logger();
    this.employeeSchemaModel = EmployeeSchemaModel;
    talentUsersModel = new TalentUsersModel();
}
Employee.prototype.find = function (params, callback) {
    log.info('info at find method of Employer Model in mongo models');
    this.employeeSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
Employee.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne method of Employer Model in mongo models');
    this.employeeSchemaModel.findOne({_id: id}, callback);
};
Employee.prototype.create = function (data, callback) {
    log.info('info at create method of Employer Model in mongo models');
    this.employeeSchemaModel.create(data, callback);
};
Employee.prototype.update = function (id, data, callback) {
    log.info('info at update method of Employer Model in mongo models');
    var conditions = {_id: id}, update = data, options = {multi: true};
    this.employeeSchemaModel.update(conditions, update, options, callback);
};
Employee.prototype.remove = function (id, callback) {
    log.info('info at remove method of Employer Model in mongo models');
    talentUsersModel.remove({employerId: id}, function (err, result) {
        log.info(err);
        log.info('info at remove method of talentUser model in mongo models');
    });
    this.employeeSchemaModel.remove({_id: id}, callback);
};
Employee.prototype.search = function (params, callback) {
    log.info('info at search method of Employer Model in mongo models');
    this.employeeSchemaModel.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};

Employee.prototype.findEmployersCount = function (EmployersCount, callback) {
    var self = this;
    self.employeeSchemaModel.count({}, function (err, employers) {
        callback(err, {employee: employers});
    });
};

module.exports = Employee;