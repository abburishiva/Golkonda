var connection = require('../../utils/db/mysqlConnect'),
    Logger = require('../../utils/winston/logModule'),
    log;

function QuizModel() {
    this.modelType = "mySql";
    log = new Logger();
    this.dbConnection = connection;
    this.choiceSubject = "select s.id as subjectId, s.name, subjects_count from subject s, common_level cl, (select subjectid, levelid,reviewDone, count(subjectid) subjects_count, count(levelid) from choice_question cq group  by subjectid, levelid, reviewDone having (count(subjectid) >4 and count(levelid) > 4 and cq.reviewDone=1)) q where s.id=q.subjectid and cl.id=q.levelid  group by name order by name";
    this.codingSubject = "select s.id as subjectId, s.codemirror_theme as codemirror_theme, s.name, subjects_count from subject s, common_level cl, (select subjectid, levelid, reviewDone, count(subjectid) subjects_count, count(levelid) from coding_question cq group  by subjectid, levelid, reviewDone having (count(subjectid) >4 and count(levelid) > 4  and cq.reviewDone=1)) q where s.id=q.subjectid and cl.id=q.levelid  group by name order by name";
    this.videoSubject = "select s.id as subjectId, s.name, subjects_count from subject s, common_level cl, (select subjectid, levelid, reviewDone, count(subjectid) subjects_count, count(levelid) from video_question vq group  by subjectid, levelid, reviewDone having (count(subjectid) >4 and count(levelid) > 4  and vq.reviewDone=1)) q where s.id=q.subjectid and cl.id=q.levelid  group by name order by name";
    this.audioSubject = "select s.id as subjectId, s.name, subjects_count from subject s, common_level cl, (select subjectid, levelid, reviewDone, count(subjectid) subjects_count, count(levelid) from audio_question aq group  by subjectid, levelid, reviewDone having (count(subjectid) >4 and count(levelid) > 4  and aq.reviewDone=1)) q where s.id=q.subjectid and cl.id=q.levelid  group by name order by name";
    this.whiteBoard = "select s.id as subjectId, s.name, subjects_count from subject s, common_level cl, (select subjectid, levelid, reviewDone, count(subjectid) subjects_count, count(levelid) from whiteboard_question wq group  by subjectid, levelid, reviewDone having (count(subjectid) >4 and count(levelid) > 4  and wq.reviewDone=1)) q where s.id=q.subjectid and cl.id=q.levelid  group by name order by name";
    this.typedSubject = "select s.id as subjectId, s.name, subjects_count from subject s, common_level cl, (select subjectid, levelid, reviewDone, count(subjectid) subjects_count, count(levelid) from typed_question tq group  by subjectid, levelid, reviewDone having (count(subjectid) >4 and count(levelid) > 4  and tq.reviewDone=1)) q where s.id=q.subjectid and cl.id=q.levelid  group by name order by name"
}

QuizModel.prototype.find = function (params, callback) {
    var sql;
    log.info("This is QuizModel findAll");
    if (params.filters.quiztype) {
        if (params.filters.quiztype.toLowerCase() === 'choice') {
            sql = this.choiceSubject;
        } else if (params.filters.quiztype.toLowerCase() === 'coding') {
            sql = this.codingSubject;
        } else if (params.filters.quiztype.toLowerCase() === 'video') {
            sql = this.videoSubject;
        } else if (params.filters.quiztype.toLowerCase() === 'audio') {
            sql = this.audioSubject;
        } else if (params.filters.quiztype.toLowerCase() === 'whiteboard') {
            sql = this.whiteBoard;
        } else if (params.filters.quiztype.toLowerCase() === 'typed') {
            sql = this.typedSubject;
        }
    }
    if (params.filters.subjectid && (params.filters.quiztype || !params.filters.quiztype)) {
        if (!params.filters.quiztype || params.filters.quiztype.toLowerCase() === 'choice') {
            sql = "select id as levelId, name, display_name, questions_count from common_level cl, (select levelid, reviewDone, count(levelid) questions_count from choice_question cq where cq.reviewDone=1 and cq.subjectid=" + params.filters.subjectid + " group by levelid having count(levelid) > 4)  q  where cl.id = q.levelid";
        } else if (params.filters.quiztype.toLowerCase() === 'coding') {
            sql = "select id as levelId, name, display_name, questions_count from common_level cl, (select levelid, reviewDone, count(levelid) questions_count from coding_question co where co.reviewDone=1 and co.subjectid=" + params.filters.subjectid + " group by levelid having count(levelid) > 4)  q  where cl.id = q.levelid";
        } else if (params.filters.quiztype.toLowerCase() === 'video') {
            sql = "select id as levelId, name, display_name, questions_count from common_level cl, (select levelid, reviewDone, count(levelid) questions_count from video_question vq where vq.reviewDone=1 and vq.subjectid =" + params.filters.subjectid + " group by levelid having count(levelid) > 4)  q  where cl.id = q.levelid";
        } else if (params.filters.quiztype.toLowerCase() === 'audio') {
            sql = "select id as levelId, name, display_name, questions_count from common_level cl, (select levelid, reviewDone, count(levelid) questions_count from audio_question aq where aq.reviewDone=1 and  aq.subjectid =" + params.filters.subjectid + " group by levelid having count(levelid) > 4)  q  where cl.id = q.levelid";
        } else if (params.filters.quiztype.toLowerCase() === 'whiteboard') {
            sql = "select id as levelId, name, display_name, questions_count from common_level cl, (select levelid, reviewDone, count(levelid) questions_count from whiteboard_question wq where wq.reviewDone=1 and wq.subjectid =" + params.filters.subjectid + " group by levelid having count(levelid) > 4)  q  where cl.id = q.levelid";
        } else if (params.filters.quiztype.toLowerCase() === 'typed') {
            sql = "select id as levelId, name, display_name, questions_count from common_level cl, (select levelid, reviewDone, count(levelid) questions_count from typed_question tq where tq.reviewDone=1 and tq.subjectid =" + params.filters.subjectid + " group by levelid having count(levelid) > 4)  q  where cl.id = q.levelid";
        } else {
            callback(null, {message: "bad request"});
        }
    }
    this.dbConnection.query(sql, function (err, results) {
        log.info("This is QuizModel findAll and query is ");
        log.error(err);
        callback(err, results);
    });
};


module.exports = QuizModel;








