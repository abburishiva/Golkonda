var connection = require('../../utils/db/mysqlConnect'),
    SubjectChallenges = require('./subjectChallenges'),
    modelUtil = require('../../utils/jsonUtil'),
    Logger = require('../../utils/winston/logModule'),
    log,
    sc;
function SubjectModel() {
    log = new Logger();
    this.dbMySQL = connection;
    this.modelType = 'mySql';
    sc = new SubjectChallenges();
    this.tableOnly = "select s.*,CASE s.flag WHEN 0 THEN 'false' WHEN 1 THEN 'true' END AS flag ,DATE_FORMAT(s.lastmoddatetime,'%b %d %Y %h:%i %p') as lastmoddatetime from  subject s,common_category cc where s.categoryid=cc.id";
    this.deatailTableSQL = "s.id, s.name, s.description ,s.mode ,s.template,s.test_framework ,s.codemirror_theme, s.icon_class,cc.id as common_category__id,cc.name as common_category__name, cc.display_name as common_category__display_name, cc.entityid as common_category__entityid,cc.description as common_category__description,cc.enabled as common_category__enabled";
    this.tableWithDependenciesSQL = this.tableOnly.replace("s.*", this.deatailTableSQL);
}
SubjectModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    log.info("info find function in subject model:-");
    if (params.filters.flag) {
        sql += " AND s.flag = " + params.filters.flag;
    }
    if (params.filters.name) {
        sql += " AND lower(s.name) ='" + params.filters.name.toString().toLowerCase() + "' ";
    }
    if (params.filters.categoryid) {
        sql += " AND s.categoryid =" + params.filters.categoryid;
    }
    if (params.sorting.sort && params.sorting.sort !== 'popularity') {
        sql += " order by s." + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;

    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;

    }
    log.info("info find function in subject model", {params: params, sql: sql});
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            callback(err);
        } else if (params.type === 'all') {
            modelUtil.restructureJSONArray(results, function (err, results) {
                if (params.filters.candidate_id) {
                    sc.candidateSubjects(results, params.filters.candidate_id, callback);
                } else if (params.sorting.sort === 'popularity') {
                    sc.totalNoOfChallengesBySubject(results, callback);
                } else {
                    callback(err, results);
                }
            });
        } else if (params.filters.candidate_id) {
            sc.candidateSubjects(results, params.filters.candidate_id, callback);
        } else if (params.sorting.sort === 'popularity') {
            sc.totalNoOfChallengesBySubject(results, callback);
        } else {
            log.info("info find function in subject model and result are ", {results: results});
            callback(err, results);
        }
    });
};
SubjectModel.prototype.findOne = function (params, id, callback) {
    log.info("findOne function in subject model:-");
    var sql = this.tableOnly;
    log.info("This is SubjectModel sql Query findOne:-" + sql);
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
        log.info("This is SubjectModel tableWithDependenciesSQL Query in findOne:-" + sql);
    }
    sql += ' ' + 'and s.id = ' + id;
    log.info("Query in findOne:-" + sql);
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            log.error(err);
            return callback(err);
        }
        if (params.type === 'all') {
            modelUtil.restructureJSONArray(results, function (err, result) {
                log.info("restructureJSONArray:-" + results);
                log.error(err);
                callback(err, result[0]);
            });
        } else {
            callback(null, results[0]);
        }

    });
};
SubjectModel.prototype.create = function (data, callback) {
    data.flag = data.flag ? JSON.parse(data.flag) : false;
    log.info("posting data in subject model:-" + data);
    this.dbMySQL.query('INSERT INTO  subject SET ?', data, function (err, result) {
        log.info("posting data in subject model:-" + data);
        if (result) {
            log.info("posting data in subject model result:-" + result);
            data.id = result.insertId;
        }
        callback(err, data);
        log.error(err);
    });
};
SubjectModel.prototype.update = function (id, data, callback) {
    data.flag = data.flag ? JSON.parse(data.flag) : false;
    log.info("updating data in subject model:-" + data);
    this.dbMySQL.query('UPDATE  subject SET ? WHERE id = ' + id, data, function (err, result) {
        log.info("this is updated function result:-" + result);
        callback(err, data);
        log.error(err);
    });
};
SubjectModel.prototype.remove = function (id, callback) {
    log.info("this is remove function :-" + id);
    this.dbMySQL.query('DELETE FROM  subject WHERE id = ' + id, callback);
};

SubjectModel.prototype.search = function (params, callback) {
    log.info("this is search function :-");
    var query = this.tableOnly + " where lower(s.name) like '%" + params.name.toString().toLowerCase() + "%' or lower(s.description) like '%" + params.name.toString().toLowerCase() + "%'";
    this.dbMySQL.query(query, callback);
};
module.exports = SubjectModel;
