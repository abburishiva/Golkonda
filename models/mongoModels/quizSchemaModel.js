var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var date1 = new Date();
var testQuizModel = new Schema({
    candidateid: {type: String},
    questions: [],
    correctanswers: {type: Number},
    atempted: {type: Number},
    timetaken: {type: String},
    subjectid: {type: Number},
    quiztype: {type: Number},
    quizname: {type: String},
    youtubeid: {type: String},
    date: {type: String},
    totaltime: {type: Number}
});
module.exports = mongoose.model('testquiz', testQuizModel);
