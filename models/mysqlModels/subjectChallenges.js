var _ = require("lodash"),
    ChallengesModel = require('../mongoModels/challengesModel'),
    mongoParams = require('../../utils/params/mongoParameters'),
    cm;
function SubjectChallenges() {
    cm = new ChallengesModel();
}
SubjectChallenges.prototype.totalNoOfChallengesBySubject = function (data, callback) {
    var challengesSubject = data;
    var params = mongoParams({});
    cm.find(params, function (err, result) {
        if (err) {
            return callback(err);
        }
        _.forEach(data, function (value, key) {
            challengesSubject[key].totalQuizes = 0;
            challengesSubject[key].choiceQuizes = 0;
            challengesSubject[key].codingQuizes = 0;
            challengesSubject[key].videoQuizes = 0;
            _.forEach(result, function (value, id) {
                if (data[key].id === result[id].subject.id) {
                    challengesSubject[key].totalQuizes++;
                    if (result[id].quiz.name === 'choice') {
                        challengesSubject[key].choiceQuizes++;
                    }
                    if (result[id].quiz.name === 'coding') {
                        challengesSubject[key].codingQuizes++;
                    }
                    if (result[id].quiz.name === 'video') {
                        challengesSubject[key].videoQuizes++;
                    }
                }
            });
        });
        callback(null, challengesSubject);
    });
};
SubjectChallenges.prototype.candidateSubjects = function (data, candidateID, callback) {
    var params = mongoParams({query: {candidate_id: candidateID}});
    var subjectArray = [];
    cm.find(params, function (err, result) {
        if (err) {
            return callback(err);
        }
        _.forEach(data, function (value, key) {
            _.forEach(result, function (value, id) {
                if (data[key].id === result[id].subject.id) {
                    subjectArray.push(data[key]);
                }
            });
        });
        callback(null, _.sortedUniq(subjectArray));
    });
};
module.exports = SubjectChallenges;
