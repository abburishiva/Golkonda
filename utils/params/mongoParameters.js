var _ = require("lodash");

function getMongoModelParams(req) {
    var modelParams = {}, body, params, paramsData, pagingData, sortObj, sourcedata, skipCount, searchObj, pagingObj,
        sourceObj, paramsObj, sourceArr, searchArr;
    modelParams.paging = {};
    modelParams.filters = {};
    modelParams.source = {};
    modelParams.search = {};
    modelParams.paging.count = 0;
    modelParams.paging.skip = 0;
    modelParams.filters.sorting = {$natural: -1};
    if (req.query) {
        body = req.query;
    }
    if (req.params) {
        params = req.params;
    }
    paramsData = ['candidate_id', 'email', 'challenge_id', 'resumeId', 'interview_id', 'subject_id', 'question_id', 'emp_id', 'name', 'user_id', 'email_id', 'id'];
    pagingData = ['start', 'end', 'limit', 'page', 'count'];
    sourcedata = ['_id', 'id', 'status', 'isResume', 'definitionId', 'interviewerName', 'company', 'accesstype', 'sl', 'el', 'q', 'name', 'domain', 'location', 'url', 'interviewId', 'isPublic', 'zone', 'isSuper', 'offset', 'candidate_id', 'candidateEmail', 'resume_id', 'resumeId', 'shortUid', 'challengeId', 'source', 'source_id', 'sourceEmail', 'improve_message', 'role', 'key', 'quiztype', 'startdate', 'enddate', 'subject', 'level', 'email', 'quiztypeid', 'subjectid', 'levelid', 'emp_id', 'type', 'position', 'totalTime', 'quizLimit', 'category', 'skillSort', 'skill', 'list', 'industry', 'date', 'jobId'];
    sortObj = _.pick(body, ['sort']);
    if (sortObj && sortObj.sort) {
        if (sortObj.sort.toString().toLowerCase() === "timetaken") {
            modelParams.filters.sorting = [[sortObj.sort.toString().toLowerCase(), -1]];
        }
        if (sortObj.sort.toString().toLowerCase() === "subject") {
            modelParams.filters.sorting = [['subject.name', -1]];
        }
        if (sortObj.sort.toString().toLowerCase() === "challengedate") {
            modelParams.filters.sorting = [['challengeDateTime', -1]];
        }
        if (sortObj.sort.toString().toLowerCase() === "id") {
            modelParams.filters.sorting = [['_id', -1]];
        }
        if (sortObj.sort.toString().toLowerCase() === "lastModDate") {
            modelParams.filters.sorting = [['lastModDate', -1]];
        }
        if (sortObj.sort.toString().toLowerCase() === "latest") {
            modelParams.filters.sorting = [['lastModDateTime', -1]];
        }
        if (sortObj.sort.toString().toLowerCase() === "startdate") {
            modelParams.filters.sorting = [['interviewDetail.interviewStartDateTime', -1]];
        }
        if (sortObj.sort.toString().toLowerCase() === "enddate") {
            modelParams.filters.sorting = [['interviewDetail.interviewExpiredDateTime', -1]];
        }
        if (sortObj.sort.toString().toLowerCase() === "name") {
            modelParams.filters.sorting = 'name';
        }
        if (sortObj.sort.toString().toLowerCase() === "location") {
            modelParams.filters.sorting = 'location';
        }
        if (sortObj.sort.toString().toLowerCase() === "legalName") {
            modelParams.filters.sorting = 'legalName';
        }
        if (sortObj.sort.toString().toLowerCase() === "industry") {
            modelParams.filters.sorting = 'industry';
        }
        if (sortObj.sort.toString().toLowerCase() === "url") {
            modelParams.filters.sorting = 'url';
        }
        if (sortObj.sort.toString().toLowerCase() === "category") {
            modelParams.filters.sorting = 'category';
        }
        if (sortObj.sort.toString().toLowerCase() === "date") {
            modelParams.filters.sorting = 'date';
        }
        if (sortObj.sort.toString().toLowerCase() === "skill") {
            modelParams.filters.sorting = 'skill';
        }
        if (sortObj.sort.toString().toLowerCase() === "hint") {
            modelParams.filters.sorting = 'hint';
        }
        if (sortObj.sort.toString().toLowerCase() === "lastmoddatetime") {
            modelParams.filters.sorting = 'lastmoddatetime';
        }
    }
    pagingObj = _.pick(body, pagingData);
    if (pagingObj) {
        if (pagingObj.page) {
            skipCount = 10 * pagingObj.page - 10;
            modelParams.paging.skip = skipCount;
            if (!pagingObj.count || !pagingObj.limit) {
                modelParams.paging.count = 10;
            }
        }
        if (pagingObj.start) {
            skipCount = 1 * pagingObj.start - 1;
            modelParams.paging.skip = skipCount;
            if (pagingObj.end || pagingObj.limit || pagingObj.count) {
                if ((pagingObj.end - pagingObj.start + 1) > 0) {
                    modelParams.paging.count = (pagingObj.end - pagingObj.start + 1 || pagingObj.limit || pagingObj.count)
                }
            } else {
                modelParams.paging.count = 10;
            }
        }
        if (pagingObj.count || pagingObj.limit) {
            if (pagingObj.count) {
                modelParams.paging.count = pagingObj.count;
            } else if (pagingObj.limit) {
                modelParams.paging.count = pagingObj.limit;
            }
        }
    }
    sourceObj = _.pick(body, sourcedata);
    paramsObj = _.pick(params, paramsData);
    if (sourceObj || paramsObj) {
        sourceArr = [];
        if (sourceObj.quiztype) {
            sourceArr.push(['quiz.name', sourceObj.quiztype]);
        }
        if (sourceObj.quizLimit) {
            sourceArr.push(['quiz.limit', sourceObj.quizLimit]);
        }
        if (sourceObj.quiztypeid) {
            sourceArr.push(['quiz.id', sourceObj.quiztypeid]);
        }
        if (sourceObj.startdate) {
            if (sourceObj.startdate && sourceObj.enddate) {
                sourceArr.push(['challengedatetime', {
                    "$gte": new Date(sourceObj.startdate.toString()),
                    "$lt": new Date(sourceObj.enddate.toString())
                }]);
            } else {
                sourceArr.push(['challengedatetime', {
                    "$gte": new Date(sourceObj.startdate.toString()),
                    "$lt": new Date(sourceObj.startdate.toString())
                }]);
            }
        }
        if (sourceObj.subject) {
            sourceArr.push(['subject.name', sourceObj.subject]);
        }
        if (sourceObj.subjectid) {
            sourceArr.push(['subject.id', sourceObj.subjectid]);
        }
        if (sourceObj.totalTime) {
            sourceArr.push(['quiz.totaltime', sourceObj.totalTime]);
        }
        if (sourceObj.level) {
            sourceArr.push(['level.name', sourceObj.level]);
        }
        if (sourceObj.levelid) {
            sourceArr.push(['level.id', sourceObj.levelid]);
        }
        if (sourceObj.email) {
            sourceArr.push(['user_profile.email', sourceObj.email.toLowerCase()]);
        }
        if (sourceObj.sourceEmail) {
            sourceArr.push(['sourceEmail', sourceObj.sourceEmail.toLowerCase()]);
        }
        if (sourceObj.source_id) {
            sourceArr.push(['source_details.source_id', sourceObj.source_id]);
        }
        if (sourceObj.definitionId) {
            sourceArr.push(['interviewDetail.definitionId', sourceObj.definitionId]);
        }
        if (sourceObj.id) {
            sourceArr.push(['id', sourceObj.id]);
        }
        if (paramsObj.id) {
            sourceArr.push(['_id', paramsObj.id]);
        }
        if (sourceObj._id) {
            sourceArr.push(['_id', sourceObj._id]);
        }
        if (sourceObj.improve_message) {
            sourceArr.push(['improve_message', sourceObj.improve_message]);
        }
        if (sourceObj.role) {
            sourceArr.push(['role', sourceObj.role]);
        }
        if (sourceObj.candidate_id) {
            sourceArr.push(['candidate_id', sourceObj.candidate_id]);
        }
        if (sourceObj.interviewId) {
            sourceArr.push(['interviewDetail.interviewId', sourceObj.interviewId]);
        }
        if (sourceObj.emp_id) {
            sourceArr.push(['emp_id', sourceObj.emp_id]);
        }
        if (paramsObj.resumeId) {
            sourceArr.push(['resumeId', paramsObj.resumeId]);
        }
        if (sourceObj.resumeId) {
            sourceArr.push(['resumeId', sourceObj.resumeId]);
        }
        if (sourceObj.shortUid) {
            sourceArr.push(['shortUid', sourceObj.shortUid]);
        }
        if (sourceObj.sl) {
            sourceArr.push(['sl', sourceObj.sl]);
        }
        if (sourceObj.el) {
            sourceArr.push(['el', sourceObj.el]);
        }
        if (sourceObj.q) {
            sourceArr.push(['q', sourceObj.q]);
        }
        if (sourceObj.skill) {
            sourceArr.push(['skill', sourceObj.skill]);
        }
        if (sourceObj.domain) {
            sourceArr.push(['domain', sourceObj.domain]);
        }
        if (sourceObj.industry) {
            sourceArr.push(['industry', sourceObj.industry]);
        }
        if (sourceObj.location) {
            sourceArr.push(['location', sourceObj.location]);
        }
        if (sourceObj.url) {
            sourceArr.push(['url', sourceObj.url]);
        }
        if (sourceObj.name) {
            sourceArr.push(['name', sourceObj.name]);
        }
        if (sourceObj.accesstype) {
            sourceArr.push(['access.public', sourceObj.accesstype]);
        }
        if (sourceObj.resume_id) {
            sourceArr.push(['resume_id', sourceObj.resume_id]);
        }
        if (sourceObj.isPublic) {
            sourceArr.push(['isPublic', sourceObj.isPublic]);
        }
        if (sourceObj.type) {
            sourceArr.push(['type', sourceObj.type]);
        }
        if (sourceObj.interviewerName) {
            sourceArr.push(['interviewDetail.interviewerName', sourceObj.interviewerName]);
        }
        if (sourceObj.company) {
            sourceArr.push(['interviewDetail["positionDetails.company.name"]', sourceObj.company]);
        }
        if (paramsObj.email) {
            sourceArr.push(['user_profile.email', paramsObj.email]);
        }
        if (sourceObj.status) {
            sourceArr.push(['status', sourceObj.status]);
        }
        if (sourceObj.isResume) {
            sourceArr.push(['isResume', sourceObj.isResume]);
        }
        if (sourceObj.key) {
            sourceArr.push(['key', sourceObj.key]);
        }
        if (sourceObj.position) {
            sourceArr.push(['auth_details.apply_position', sourceObj.position.toUpperCase()]);
        }
        if (sourceObj.list) {
            sourceArr.push(['list', sourceObj.list]);
        }
        if (sourceObj.category) {
            sourceArr.push(['category', sourceObj.category]);
        }
        if (sourceObj.skillSort) {
            sourceArr.push(['skillSort', sourceObj.skillSort]);
        }
        if (sourceObj.jobId) {
            sourceArr.push(['job_id', sourceObj.jobId]);
        }
        if (req.originalUrl && (req.originalUrl.indexOf('challenges') > 14 || req.originalUrl.indexOf('questions') > 14 || req.originalUrl.indexOf('subjects') > 14 || req.originalUrl.indexOf('interviews') > 14 || req.originalUrl.indexOf('shareInterviews') > 1 || req.originalUrl.indexOf('jobs') > 14)) {
            if (paramsObj.emp_id) {
                sourceArr.push(['emp_id', paramsObj.emp_id]);
            }
            if (paramsObj.candidate_id) {
                sourceArr.push(['candidate_id', paramsObj.candidate_id]);
            }
            if (paramsObj.challenge_id) {
                sourceArr.push(['_id', paramsObj.challenge_id]);
            }
            if (sourceObj.challengeId) {
                sourceArr.push(['challengeId', sourceObj.challengeId]);
            }
            if (paramsObj.question_id) {
                sourceArr.push(['_id', paramsObj.question_id]);
            }
            if (paramsObj.subject_id) {
                sourceArr.push(['_id', paramsObj.subject_id]);
            }
            if (paramsObj.interview_id) {
                sourceArr.push(['_id', paramsObj.interview_id]);
            }
            if (sourceObj.candidateEmail) {
                sourceArr.push(['email', sourceObj.candidateEmail]);
            }
            if (sourceObj.offset) {
                sourceArr.push(['offset', sourceObj.offset]);
            }
            if (sourceObj.zone) {
                sourceArr.push(['zone', sourceObj.zone]);
            }
        } else {
            if (paramsObj.emp_id) {
                sourceArr.push(['_id', paramsObj.emp_id]);
            }
            if (paramsObj.candidate_id) {
                sourceArr.push(['_id', paramsObj.candidate_id]);
            }
        }
        if (req.originalUrl && req.originalUrl.indexOf('public/challenges') > 1) {
            sourceArr.push(['access.public', 'true']);
        }
        modelParams.source = _.fromPairs(sourceArr);
    }
    searchObj = _.pick(body, sourcedata);
    if (searchObj) {
        searchArr = [];
        if (searchObj.candidate_id) {
            searchArr.push(['candidate_id', {$regex: new RegExp(searchObj.candidate_id, 'i')}]);
        }
        if (searchObj.quiztype) {
            sourceArr.push(['quiz.name', {$regex: new RegExp(searchObj.quiztype, 'i')}]);
        }
        if (searchObj.startdate) {
            if (searchObj.startdate && searchObj.enddate) {
                searchArr.push(['challengedatetime', {
                    "$gte": new Date(searchObj.startdate.toString()),
                    "$lt": new Date(searchObj.enddate.toString())
                }]);
            } else {
                searchArr.push(['challengedatetime', {
                    "$gte": new Date(searchObj.startdate.toString()),
                    "$lt": new Date(searchObj.startdate.toString())
                }]);
            }
        }
        if (searchObj.subject) {
            searchArr.push(['subject.name', {$regex: new RegExp(searchObj.subject, 'i')}]);
        }
        if (searchObj.level) {
            searchArr.push(['level.name', {$regex: new RegExp(searchObj.level, 'i')}]);
        }
        if (searchObj.email) {
            sourceArr.push(['email', {$regex: new RegExp(searchObj.email, 'i')}]);
        }
        if (searchObj.name) {
            sourceArr.push(['name', {$regex: new RegExp(searchObj.name, 'i')}]);
        }
        if (searchObj.emp_id) {
            sourceArr.push(['emp_id', {$regex: new RegExp(searchObj.emp_id, 'i')}]);
        }
        modelParams.search = _.fromPairs(searchArr);
    }
    return modelParams;
}

module.exports = getMongoModelParams;
