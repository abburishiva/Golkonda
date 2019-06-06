var request = require('request'),
    connection = require('./db/mysqlConnect'),
    SubjectModel = require('../models/mysqlModels/subjectModel'),
    modelUtil = require('./jsonUtil'),
    Logger = require('../utils/winston/logModule'),
    modelParams = require('./params/modelParameters.js'),
    sub,
    log;

function CodeCompilerUtil() {
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    this.tableOnly = "select cc.* from code_compiler cc,subject s where cc. subjectid=s.id";
    this.deatailTableSQL = "cc.id,cc.compilerid,s.id as subject__id, s.test_framework as subject__testFrameWork,s.template as subject__template, s.categoryid as subject__categoryid,s.name as subject__name,s.mode as subject__mode,s.icon_class as subject__icon_class,CASE s.flag WHEN 0 THEN 'false' WHEN 1 THEN  'true' END AS subject__flag,s.description as subject__description,cc.compiler_required,cc.lastmoddatetime,cc.lastmoduserid";
    this.tableWithDependenciesSQL = this.tableOnly.replace("cc.*", this.deatailTableSQL);
    sub = new SubjectModel();
    log = new Logger();
    log.info("This is CodeCompilerUtil Constructor...");
}
CodeCompilerUtil.prototype.find = function (params, callback) {
    log.info('info code compiler find method');
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.subjectId) {
        sql += '  AND s.id = ' + params.filters.subjectId;
    }
    if (params.filters.compilerid) {
        sql += '  AND cc.compilerid = ' + params.filters.compilerid;
    }
    if (params.sorting.sort) {
        sql = sql + " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + "," + params.paging.limitend;
    }
    else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, results) {
        log.info('info at code compiler find method and sql query');
        if (err) {
            log.error(err);
            return callback(err);
        }
        if (params.type === 'all') {
            modelUtil.restructureJSONArray(results, callback);
        }
        else {
            log.info('info at code compiler find method and results');
            callback(null, results);
        }
    });
};
CodeCompilerUtil.prototype.findOne = function (params, id, callback) {
    log.info('info code compiler findOne method');
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' ' + 'and cc.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        log.info('info at code compiler find method and sql query');
        if (err) {
            log.error(err);
            return callback(err, null);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = modelUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        }
        else {
            log.info('info at code compiler findOne method and results');
            callback(null, results[0]);
        }
    });
};
CodeCompilerUtil.prototype.create = function (data, callback) {
    log.info('info at code compiler create method and data ');
    var self = this;
    if (data.compilerid) {
        if (data.name) {
            var subjectName = modelParams({query: {name: data.name}});
            sub.find(subjectName, function (err, result) {
                delete data.name;
                if (result.length > 0) {
                    data.subjectid = result[0].id;
                    self.dbMySQL.query('INSERT INTO code_compiler SET ?', data, function (err, result) {
                        callback(err, data);
                    });
                } else {
                    log.info('info at code compiler create method and no subject data  in subject model');
                    callback({message: 'please add subject in subject table'});
                }
            });
        }
    } else {
        log.info('info at code compiler create method and no  data id  in req  data');
        callback({message: 'please provide subject_id of "rextester.com" as compilerid in your data'});
    }
};
CodeCompilerUtil.prototype.update = function (id, data, callback) {
    log.info('info at code compiler update method and id');
    this.dbMySQL.query('UPDATE  code_compiler SET ? WHERE id = ' + id, data, callback);
};
CodeCompilerUtil.prototype.remove = function (id, callback) {
    log.info('info at code compiler remove method and id');
    this.dbMySQL.query('delete FROM code_compiler WHERE id = ' + id, callback);
};
CodeCompilerUtil.prototype.compile = function (params, callback) {
    log.info('info at code compiler compile method and params');
    var self = this;
    if (params.languageId) {
        var subjectid = modelParams({query: {subjectId: params.languageId}});
        self.find(subjectid, function (err, data) {
            log.info('info at code compiler compile method and data');
            if (data.length > 0) {
                request.post({
                    url: 'https://rextester.com/rundotnet/Run',
                    form: {
                        LanguageChoiceWrapper: data[0].compilerid,
                        EditorChoiceWrapper: params.editorId,
                        Program: params.code
                    }
                }, function (err, httpResponse, body) {
                    if (err) {
                        log.error(err);
                        callback({message: err}, null);
                    } else {
                        callback(err, body);
                    }
                });
            } else {
                callback(err, null);
            }
        });
    } else {
        log.info('info at code compiler compile method and req  is bad req');
        callback({message: 'bad request'});
    }
};
module.exports = CodeCompilerUtil;
