var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CandidateAssignmentModel() {
    this.modelType = 'mySql';
    this.dbMySQL = connection;
    this.tableOnly = 'select cas.*,DATE_FORMAT(cas.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from candidate_assignment cas ,class_assignment cla,rec_candidate rc,course_batch cb,subject s, common_candidate cc  where cas.assignmentid=cla.id and cas.candidateid=rc.id and  rc.batchid=cb.id  and cla.subjectid=s.id and rc.candidateid=cc.id';
    this.deatailTableSQL = 'cas.id,rc.id as rec_candidate__id,rc.portalid as rec_candidate__portalid,cb.id as rec_candidate__course_batch__id,cb.courseid as rec_candidate__course_batch__courseid,cb.name as rec_candidate__course_batch__name,DATE_FORMAT(cb.orientationdate,"%m-%d-%Y %H:%i:%s") as rec_candidate__course_batch__orientationdate,DATE_FORMAT(cb.startdate,"%m-%d-%Y %H:%i:%s") as rec_candidate__course_batch__startdate,DATE_FORMAT(cb.enddate,"%m-%d-%Y %H:%i:%s") as rec_candidate__course_batch__enddate,cc.id as rec_candidate__common_candidate__id,cc.workstatusid as rec_candidate__common_candidate__workstatusid,cc.highesteducation as rec_candidate__common_candidate__highesteducation,cc.lastjobcompany as rec_candidate__common_candidate__lastjobcompany,cc.lastjoblocation as rec_candidate__common_candidate__lastjoblocation,DATE_FORMAT(cc.enrolldate,"%m-%d-%Y %H:%i:%s") as rec_candidate__common_candidate__enrolldate,rc.leadid as rec_candidate__leadid,rc.notes as rec_candidate__notes,cla.id as class_assignment__id,s.id as class_assignment__subject__id,s.categoryid as class_assignment__subject__categoryid,s.name as class_assignment__subject__name,s.icon_class as class_assignment__subject__icon_class,s.description as class_assignment__subject__description,cla.question as class_assignment__question,cas.answer,cas.lastmoduserid';
    this.tableWithDependenciesSQL = this.tableOnly.replace("cas.*", this.deatailTableSQL);
}
CandidateAssignmentModel.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.candidateid) {
        sql += ' and rc.id = ' + params.filters.candidateid;
    }
    if (params.filters.subjectid) {
        sql += ' and s.id = ' + params.filters.subjectid;
    }
    if (params.filters.batchid) {
        sql += ' and cb.id = ' + params.filters.batchid;
    }
    if (params.filters.answer) {
        sql += " and cas.answer like '" + params.filters.answer + "'";
    }
    if (params.filters.question) {
        sql += " amd cla.question like '" + params.filters.question + "'";
    }
    if (params.filters.name) {
        sql += " and cb.name like '" + params.filters.name + "'";
    }
    if (params.filters.assignmentid) {
        sql += ' and  cla.id = ' + params.filters.assignmentid;
    }
    if (params.sorting.sort) {
        sql = sql + " order by " + params.sorting.sort;
    }
    if (params.paging.limitstart && params.paging.limitend) {
        sql += " limit " + params.paging.limitstart + " , " + params.paging.limitend;
    } else if (params.paging.limitend) {
        sql += " limit " + params.paging.limitend;
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
        }
    });
};
CandidateAssignmentModel.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' AND cas.id = ' + id;
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            var finalResult = {};
            finalResult = jsonUtil.reStructureJSONEntity(results[0]);
            callback(err, finalResult);
        } else {
            callback(err, results[0]);
        }
    });
};
CandidateAssignmentModel.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO candidate_assignment SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CandidateAssignmentModel.prototype.update = function (id, data, callback) {
    this.dbMySQL.query('UPDATE candidate_assignment SET ? WHERE id = ' + id, data, function (err) {
        callback(err, data);
    });
};
CandidateAssignmentModel.prototype.remove = function (id, data, callback) {
    this.dbMySQL.query('DELETE FROM candidate_assignment WHERE id = ' + id, data, function (err) {
        if (err) {
            return callback(err, null);
        }
        callback(null);
    });
};
CandidateAssignmentModel.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.name) {
        sql += " and  lower(s.name) like '%" + params.name + "%'";
    }
    if (params.answer) {
        sql += " and  (cas.answer)  like '%" + params.answer + "%'";
    }
    this.dbMySQL.query(sql, function (err, results) {
        if (err) {
            return callback(err);
        }
        if (params.type && params.type.toLowerCase() === 'all') {
            jsonUtil.restructureJSONArray(results, callback);
        } else {
            callback(err, results);
        }
    });
};
module.exports = CandidateAssignmentModel;