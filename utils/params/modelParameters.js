var _ = require("lodash");
function getModelParams(req) {
    var filtersArray = [
            'address1',
            'address2',
            'usercity',
            'firstname',
            'lastname',
            'email',
            'workemail',
            'short_name',
            'iso2',
            'iso3',
            'id',
            'name',
            'latitude',
            'longitude',
            'region',
            'zipcode',
            'countryid',
            'lastmoddatetime',
            'lastmoduserid',
            'description',
            'week',
            'day',
            'subjectcategoryid',
            'question',
            'contact',
            'contactid',
            'courseid',
            'batchid',
            'candidateid',
            'jobs_positionid',
            'lastjobcompany',
            'appcompanyid',
            'companyid',
            'experience',
            'lastjoblocation',
            'subjectId',
            'user_name',
            'user_loginid',
            'useragent',
            'username',
            'userid',
            'roleid',
            'categoryid',
            'title',
            'entityid',
            'entityId',
            'employeeid',
            'addressid',
            'uname',
            'code',
            'type',
            'ipaddress',
            'middlename',
            'reviewDone',
            'master_email',
            'login_id',
            'subject',
            'phone',
            'cityid',
            'countOnly',
            'answer',
            'quiztype',
            'quizType',
            'quizes',
            'questiontype',
            'displayname',
            'displayName',
            'questionid',
            'flag',
            'emp_Id',
            'cache',
            'type',
            'subjectid',
            'randomQuiz',
            'levelid',
            'levelId',
            'compilerid',
            'count',
            'review',
            'symbolName',
            'q',
            'order',
            'country'
        ],
        object = req.query,
        typeObj = _.pick(object, ['type']),
        sortObj = _.pick(object, ['sort']),
        pagingObj = _.pick(object, ['start', 'end', 'limit', 'page']),
        filterObj = _.pick(object, filtersArray),
        paramsObject = req.params,
        filterParams = _.pick(paramsObject, filtersArray),
        pagelimit = 0,
        pagingParams = {},
        modelParams = {};
    modelParams.paging = {};
    if (typeObj) {
        modelParams = typeObj;
    }
    if (filterObj || filterParams) {
        if (filterObj.entityId) {
            filterObj.entityid = filterObj.entityId;
            delete filterObj.entityId;
        }
        modelParams.filters = filterObj;
        if (Object.keys(filterParams).length > 0) {
            modelParams.filters = filterParams;
        }
    }

    if (sortObj) {
        modelParams.sorting = sortObj;
    }
    if (pagingObj) {
        pagelimit = 10 * pagingObj.page - 10;
        if (pagingObj.page && pagingObj.limit) {
            pagingParams.limitstart = pagelimit;
            pagingParams.limitend = pagingObj.limit;
        } else if (pagingObj.page) {
            pagingParams.limitstart = pagelimit;
            pagingParams.limitend = 10;
        }
        if (pagingObj.limit) {
            pagingParams.limitend = pagingObj.limit;
        }
        if (pagingObj.start) {
            pagingParams.limitstart = pagingObj.start;
        }
        if (!pagingObj.limit && pagingObj.end) {
            if(((pagingObj.end - pagingObj.start) + 1) > 0)
                pagingParams.limitend = ((pagingObj.end - pagingObj.start) + 1);
        }
        modelParams.paging = pagingParams;
    }
    return modelParams;
}

module.exports = getModelParams;
