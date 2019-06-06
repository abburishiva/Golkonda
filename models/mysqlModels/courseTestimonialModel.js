var connection = require('../../utils/db/mysqlConnect'),
    jsonUtil = require('../../utils/jsonUtil');
function CourseTestimonial() {
    this.dbMySQL = connection;
    this.tableOnly = 'select ctm.*,DATE_FORMAT(ctm.lastmoddatetime,"%m-%d-%Y %H:%i:%s") as lastmoddatetime from course_testimonial ctm,course c where ctm.courseid=c.id ';
    this.deatailTableSQL = 'ctm.id,ctm.testimonials,ctm.name,ctm.title,ctm.lastmoduserid,c.id as course__id,c.name as course__name,c.alias as course__alias,c.description as course__description';
    this.tableWithDependenciesSQL = this.tableOnly.replace('ctm.*', this.deatailTableSQL);
}
CourseTestimonial.prototype.find = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.filters.courseid) {
        sql += ' AND c.id IN (0,' + params.filters.courseid + ')';
    }
    if (params.filters.name) {
        sql += " AND ctm.name like '" + params.filters.name.toLowerCase() + "'";
    }
    if (params.sorting.sort) {
        sql += sql + " order by " + params.sorting.sort;
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
CourseTestimonial.prototype.findOne = function (params, id, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    sql += ' and ctm.id =' + id;
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
CourseTestimonial.prototype.create = function (data, callback) {
    this.dbMySQL.query('INSERT INTO course_testimonial SET ?', data, function (err, result) {
        if (result) {
            data.id = result.insertId;
        }
        callback(err, data);
    });
};
CourseTestimonial.prototype.update = function (id, data, callback) {
    var self = this, params = {};
    self.findOne(params, id, function (err, result) {
        if (err) {
            return callback(err);
        }
        if (result) {
            self.dbMySQL.query('UPDATE course_testimonial SET ? WHERE id = ' + id, data, function (err) {
                callback(err, {data: data, type: 'update'});
            });
        } else {
            self.create(data, function (err, result) {
                callback(err, {data: result, type: 'create'});
            });
        }
    });
};
CourseTestimonial.prototype.remove = function (id, callback) {
    this.dbMySQL.query('DELETE FROM course_testimonial WHERE id = ' + id, callback);
};
CourseTestimonial.prototype.search = function (params, callback) {
    var sql = this.tableOnly;
    if (params.type) {
        sql = this.tableWithDependenciesSQL;
    }
    if (params.title) {
        sql += " and ctm.title like '%" + params.title + "%'";
    }
    if (params.name) {
        sql += " and  lower(ctm.name) like '%" + params.name + "%'";
    }
    if (params.alias) {
        sql += " and  lower(c.alias) like '%" + params.alias + "%'";
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
module.exports = CourseTestimonial;