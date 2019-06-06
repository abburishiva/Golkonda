var EventEmitter = require('events').EventEmitter,
    config = require('config'),
    fs = require('fs'),
    exec = require('exec'),
    _ = require('lodash'),
    zmqUtility = require('../zmq/zmqUtility'),
    Logger = require('../winston/logModule'),
    log;

function VideoUploadUtil() {
    this.utility = new zmqUtility();
    log = new Logger();
    log.info("this is VideoUploadUtil");
}

VideoUploadUtil.prototype.upload = function (file, callback) {
    log.info("VideoUploadUtil.prototype.upload");
    if (!fs.existsSync(config.quizVideo.SOURCE_PATH)) {
        this.mkdir(config.quizVideo.SOURCE_PATH);

    }
    if (!fs.existsSync(config.quizVideo.DESTINATION_PATH)) {
        this.mkdir(config.quizVideo.DESTINATION_PATH);
    }
    var uploadVideo = this.uploadUsingEventEmitter(file);
    log.info("uploadVideo", uploadVideo);
    uploadVideo.on("Error", function (data) {
        log.info("data", data);
        callback({status: 500, error: data});
    });
    uploadVideo.on("Completed", function (result) {
        log.info("result", result);
        callback(null, {name: result});
    });
};
VideoUploadUtil.prototype.mkdir = function (dirname) {
    log.info("VideoUploadUtil.prototype.mkdir1", dirname);
    exec(['mkdir', '../' + dirname.split('/')[1]], function (err) {
        log.info("VideoUploadUtil.prototype.mkdir2");
        log.error(err);
        exec(['mkdir', '../' + dirname.split('/')[1] + "/" + dirname.split('/')[2]], function (err) {
            if (err) {
                log.error(err);
            }
            log.info("VideoUploadUtil.prototype.mkdir3");
        });
    });
};
VideoUploadUtil.prototype.merge = function (source, callback) {
    if (source.fileName) {
        var format = source.fileName.split('_').pop();
    }
    if (format === 'audio' || format === 'mobileaudio') {
        this.utility.pub('audio', source);
    } else {
        this.utility.pub('video', source);
    }
    log.info("sucessfully uploaded");
    callback(null, {message: "sucessfully uploaded"});
};

VideoUploadUtil.prototype.uploadUsingEventEmitter = function (file) {
    var e = new EventEmitter();
    var fileRootName = file.name.split('.').shift(),
        fileExtension = file.name.split('.').pop(),
        filePathBase = config.quizVideo.SOURCE_PATH,
        fileRootNameWithBase = filePathBase + fileRootName,
        filePath = fileRootNameWithBase + '.' + fileExtension;
    log.info("fileRootNameWithBase");
    fs.stat(filePath, function (err) {
        var localPath = filePath;
        if (!err) {
            e.emit("Error", "File already exists");
            log.info("File already exists");
        } else if (err.code === 'ENOENT') {
            fs.writeFile(localPath, file.contents, function (err) {
                if (err) {
                    e.emit("Error", err);
                    log.error(err);
                }
                e.emit("Completed", file.name);
                log.info("Completed");
            });
        } else {
            e.emit("Error", err);
            log.error(err);
        }
    });
    return (e);
};

module.exports = VideoUploadUtil;