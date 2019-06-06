var fs = require('fs'),
    request = require("request"),
    buffer,
    url,
    Logger = require('../utils/winston/logModule'),
    log;
function ResumesModel() {
    log = new Logger();
    log.info("This is ResumesModel Constructor...");
}
ResumesModel.prototype.sendDocument = function (resumedata, callback) {
    log.info("This is ResumesModel sendDocument...");
    var data = resumedata.file;
    buffer = JSON.stringify(data.buffer);
    data.buffer = buffer;
    fs.readFile('./config/config.json', 'utf8', function (error, configData) {
        log.info("This is configData in ResumesModel ...");
        if (error) {
            log.error(error);
            callback({code: 206, message: error});
        } else {
            configData = JSON.parse(configData.toString());
            log.info("This is json parsed data in ResumesModel ...");
            if (resumedata.query) {
                log.info("This is query of internalResumeApiUrl in ResumesModel ...");
                url = configData.internalResumeApiUrl + '?type=' + resumedata.query.type;
            } else {
                url = configData.internalResumeApiUrl;
                log.info("This is internalResumeApiUrl in ResumesModel ...");
            }
            request.post({url: url, form: {file: data}}, function (err, httpResponse, body) {
                if (err) {
                    log.error(error);
                    callback({code: 206, message: 'upload failed:' + err});
                } else {
                    callback(null, JSON.parse(body));
                }
            });
        }
    });
};
module.exports = ResumesModel;