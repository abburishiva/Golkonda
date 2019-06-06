var mongoose = require('mongoose'),
    CategoryModel = require("../mysqlModels/commonCategoryModel.js"),
    Logger = require('../../utils/winston/logModule'),
    getSchema = require('../schemas/employerSubjectsSchema.js'),
    Schema = mongoose.Schema,
    subjectsSchema = new Schema(getSchema),
    SubjectsSchema = mongoose.model('employer_subjects', subjectsSchema),
    connection = require('../../utils/db/mysqlConnect'),
    categoryModel,
    log;
function EmployeeSubjectsModel() {
    this.modelType = 'mongo';
    this.subjectsSchemaModel = SubjectsSchema;
    categoryModel = new CategoryModel();
    log = new Logger();
    this.dbMySQL = connection;
}
EmployeeSubjectsModel.prototype.find = function (params, callback) {
    log.info('info at find method of employer_subjects model in mongo models');
    this.subjectsSchemaModel.find(params.source, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
EmployeeSubjectsModel.prototype.findOne = function (params, id, callback) {
    log.info('info at findOne method of employer_subjects model in mongo models');
    this.subjectsSchemaModel.findOne({_id: id}, callback);
};
EmployeeSubjectsModel.prototype.create = function (data, callback) {
    log.info('info at create method of employer_subjects model in mongo models');
    var self = this, common_category = [];
    if (data.categoryid) {
        categoryModel.findOne({}, data.categoryid, function (err, categoryData) {
            common_category.push({
                id: categoryData.id,
                name: categoryData.name,
                description: categoryData.description,
                alias: categoryData.alias
            });
            data.category = common_category[0];
            self.subjectsSchemaModel.create(data, callback);
        });
    } else {
        log.info('info at create method of employer_subjects model in mongo models and please provide category name');
        callback(null, {"message": "please provide category id"});
    }
};
EmployeeSubjectsModel.prototype.update = function (id, data, callback) {
    log.info('info at update method of employer_subjects model in mongo models');
    var self = this, conditions = {_id: id}, update = data, common_category = [], options = {multi: true};
    if (update.categoryid) {
        categoryModel.findOne({}, update.categoryid, function (err, categoryData) {
            common_category.push({
                id: categoryData.id,
                name: categoryData.name,
                description: categoryData.description,
                alias: categoryData.alias
            });
            update.category = common_category[0];
            self.subjectsSchemaModel.update(conditions, update, options, callback);
        });
    }
};
EmployeeSubjectsModel.prototype.remove = function (id, callback) {
    log.info('info at remove method of employer_subjects model in mongo models');
    this.subjectsSchemaModel.remove({_id: id}, callback);
};
EmployeeSubjectsModel.prototype.search = function (params, callback) {
    log.info('info at search method of employer_subjects model in mongo models');
    this.subjectsSchemaModel.find(params.search, callback).sort(params.filters.sorting).skip(params.paging.skip).limit(parseInt(params.paging.count, 10));
};
EmployeeSubjectsModel.prototype.getSubjects = function (params, callback) {
    var self=this;
    if (params.params.name === 'library') {
        if (params.decoded.auth_details.is_super) {
            self.dbMySQL.query("SELECT name,lastmoddatetime FROM subject ORDER BY lastmoddatetime DESC LIMIT 5;", function (err, questions) {
                if(err){
                    callback(err, null);
                }else {
                    callback(null, questions);
                }
            })
        }else {
            self.subjectsSchemaModel.find({},callback).sort({lastmoddatetime: -1}).limit(5);
        }
    }else {
        log.info('info at find method of employer_subjects model in mongo models');
        self.subjectsSchemaModel.find({},callback).sort({lastmoddatetime: -1}).limit(5);
    }

};
module.exports = EmployeeSubjectsModel;



