var ZmqUtility = require('../../utils/zmq/zmqUtility'),
    Logger = require('../../utils/winston/logModule'),
    log,
    _ = require("lodash");
function EmailEngineModel() {
    this.utility = new ZmqUtility();
    log = new Logger();
    log.info("This is EmailEngineModel Constructor...");
}
EmailEngineModel.prototype.sendMessage = function (data, callback) {
    log.info("This is EmailEngineModel sendMessage function...");
    var emailData = _.pick(data, ['from', 'to', 'message_type', 'shareInterviewdata', 'date', 'subject', 'engine', 'test', 'message', 'name', 'candidateDetails', 'debug', 'candidateTotalCount', 'startDate', 'redirect_url', 'job_position', 'position_details', 'interviewHeading', 'employerName', 'attachments', 'organization']);
    if (emailData.message_type && emailData.to) {
        this.utility.pub('engine', emailData);
        log.info("This is EmailEngineModel and successfully send the email");
        callback(null, {code: 200, message: "success"});
    } else {
        log.info("This is EmailEngineModel sendMessage function.Requires all fields");
        callback({code: 406, message: "required fields"});
    }
};
module.exports = EmailEngineModel;
