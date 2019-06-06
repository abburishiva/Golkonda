var VideoUploadUtil = require('../utils/video/videoUploadUtil'),
    Logger = require('../utils/winston/logModule'),
    videoUploadUtil,
    log;

function VideoUploadController() {
    videoUploadUtil = new VideoUploadUtil();
    log = new Logger();
    log.info("this is VideoUploadController_constructor");
}

VideoUploadController.prototype.upload = function (req, res, next) {
    var videoFile = {},
        buffer,
        filename;
    log.info("This is upload function");
    if (req.params.name === "upload") {
        if (req.file) {
            filename = req.file.originalname.split('.').pop();
            log.info("when content come form req:filename", filename);
            if (filename === 'webm') {
                buffer = req.file.buffer;
                if (buffer.length > 0) {
                    videoFile.name = req.file.originalname;
                    videoFile.contents = Buffer.from(buffer);
                    log.info("videoFile.contents", videoFile.contents);
                }
            } else if (filename === 'wav') {
                buffer = req.file.buffer;
                if (buffer.length > 0) {
                    videoFile.name = req.file.originalname;
                    videoFile.contents = Buffer.from(buffer);
                }
            } else if (filename === 'mp4') {
                buffer = req.file.buffer;
                if (buffer.length > 0) {
                    videoFile.name = req.file.originalname;
                    videoFile.contents = Buffer.from(buffer);
                }
            } else if (filename === 'aac') {
                buffer = req.file.buffer;
                if (buffer.length > 0) {
                    videoFile.name = req.file.originalname;
                    videoFile.contents = Buffer.from(buffer);
                }
            } else if (filename === 'mov') {
                buffer = req.file.buffer;
                if (buffer.length > 0) {
                    videoFile.name = req.file.originalname;
                    videoFile.contents = Buffer.from(buffer);
                }
            }
        } else {
            filename = req.body.name.split('.').pop();
            log.info("when content come from body: filename", filename);
            if (filename === 'webm') {
                buffer = req.body.contents.split(',').pop();
                if (buffer.length > 0) {
                    videoFile.name = req.body.name;
                    videoFile.contents = Buffer.from(buffer, 'base64');
                }
            } else if (filename === 'wav') {
                buffer = req.body.contents.split(',').pop();
                if (buffer.length > 0) {
                    videoFile.name = req.body.name;
                    videoFile.contents = Buffer.from(buffer, 'base64');
                }
            }
        }
        log.info("videoFile", videoFile, videoFile.contents);
        if (videoFile && videoFile.contents) {
            videoUploadUtil.upload(videoFile, function (err, result) {
                if (err) {
                    next(err);
                    log.error(err);
                } else {
                    res.status(200).send(result);
                }
            });
        } else {
            res.status(400).send({"message": "bad request"});
        }

    } else if (req.params.name === "merge") {
        videoUploadUtil.merge(req.body, function (err, result) {
            if (err) {
                next(err);
                log.error(err)
            } else {
                res.status(200).send(result);
            }
        });
    }
};
module.exports = VideoUploadController;
