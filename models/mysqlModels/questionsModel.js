var ChoiceModel = require('./choiceQuestionsModel'),
    CodingModel = require('./codingQuestionsModel'),
    VideoModel = require('./videoQuestionsModel'),
    AudioModel = require('./audioQuestionsModel'),
    WhiteBoardModel = require('./whiteBoardQuestionsModel'),
    TypedModel = require('./typedQuestionsModel'),
    Logger = require('../../utils/winston/logModule'),
    utils = require('../../utils/params/modelParameters'),
    _ = require('lodash'),
    choice,
    coding,
    video,
    audioModel,
    whiteBoard,
    typedModel,
    log;
function QuestionsModel() {
    this.modelType = 'mySql';
    choice = new ChoiceModel();
    coding = new CodingModel();
    video = new VideoModel();
    audioModel = new AudioModel();
    whiteBoard = new WhiteBoardModel();
    typedModel = new TypedModel();
    log = new Logger();
    log.info("This is QuestionsModel Constructor...");
}
QuestionsModel.prototype.find = function (params, callback) {
    log.info("this is QuestionsModel find function");
    var questiontype = params.filters.questiontype !== undefined ? params.filters.questiontype.match(/[^,]+/g) : 'Alltypes';
    if (questiontype) {
        video.find(params, function (err, videodata) {
            log.error(err);
            log.info("getting video data:-", videodata.length);
            coding.find(params, function (err, codingdata) {
                log.error(err);
                log.info("getting codingdata data:-", codingdata.length);
                choice.find(params, function (err, choicedata) {
                    log.error(err);
                    log.info("getting choicedata data:-", choicedata.length);
                    audioModel.find(params, function (err, audiodata) {
                        log.error(err);
                        whiteBoard.find(params, function (err, whiteboarddata) {
                            log.error(err);
                            typedModel.find(params, function (err, typeddata) {
                                Array.prototype.push.apply(videodata, codingdata);
                                Array.prototype.push.apply(videodata, choicedata);
                                Array.prototype.push.apply(videodata, audiodata);
                                Array.prototype.push.apply(videodata, whiteboarddata);
                                Array.prototype.push.apply(videodata, typeddata);
                                log.error(err);
                                if (questiontype !== 'Alltypes') {
                                    callback(err, _.filter(videodata, _.conforms({
                                        "questiontype": function (n) {
                                            return (questiontype.indexOf(n.toLowerCase()) > -1);
                                        }
                                    })));
                                } else {
                                    callback(err, videodata);
                                }
                            });
                        });
                    });
                });
            });
        });
    } else {
        log.info("{message: Bad Request}");
        callback({message: "Bad Request"});
    }
};
QuestionsModel.prototype.findOne = function (type, id, callback) {
    var params = {}, data = [];
    params.type = type;
    if (params.type === 'audio' && type === 'audio') {
        audioModel.findOne(params, id, function (err, audiodata) {
            params = utils({query: {question: audiodata.question, type: "video"}});
            video.find(params, function (err, videodata) {
                log.error(err);
                params = utils({query: {question: audiodata.question, type: "typed"}});
                typedModel.find(params, function (err, typeddata) {
                    if (videodata.length > 0 && typeddata.length > 0) {
                        data.push(videodata[0]);
                        data.push(typeddata[0]);
                    } else if (typeddata.length > 0 || videodata.length > 0) {
                        if (typeddata.length > 0) {
                            data.push(typeddata[0]);
                        } else {
                            data.push(videodata[0]);
                        }
                    }
                    callback(err, data);
                });
            });
        });
    }
    else if (params.type === 'typed' && type === 'typed') {
        typedModel.findOne(params, id, function (err, typeddata) {
            params = utils({query: {question: typeddata.question, type: "video"}});
            video.find(params, function (err, videodata) {
                log.error(err);
                params = utils({query: {question: typeddata.question, type: "audio"}});
                audioModel.find(params, function (err, audiodata) {
                    if (audiodata.length > 0 && videodata.length > 0) {
                        data.push(audiodata[0]);
                        data.push(videodata[0]);
                    } else if (videodata.length > 0 || audiodata.length > 0) {
                        if (videodata.length > 0) {
                            data.push(videodata[0]);
                        } else {
                            data.push(audiodata[0]);
                        }
                    }
                    callback(err, data);
                });
            });
        });
    }
    else if (params.type === 'video' && type === 'video') {
        video.findOne(params, id, function (err, videodata) {
            params = utils({query: {question: videodata.question, type: "audio"}});
            audioModel.find(params, function (err, audiodata) {
                log.error(err);
                params = utils({query: {question: videodata.question, type: "typed"}});
                typedModel.find(params, function (err, typeddata) {
                    if (audiodata.length > 0 && typeddata.length > 0) {
                        data.push(audiodata[0]);
                        data.push(typeddata[0]);
                    } else if (typeddata.length > 0 || audiodata.length > 0) {
                        if (typeddata.length > 0) {
                            data.push(typeddata[0]);
                        } else {
                            data.push(audiodata[0]);
                        }
                    }
                    callback(err, data);
                });
            });
        });
    }
};

QuestionsModel.prototype.create = function (data, callback) {
    var questionid = [], quizzestype = data.questiontype.sort();
    delete data.questiontype;
    if (quizzestype[2] === 'video' && quizzestype[0] === 'audio' && quizzestype[1] === 'typed' && quizzestype.length === 3) {
        video.create(data, function (err, videodata) {
            questionid[0] = data.id;
            delete data.id;
            log.error(err);
            log.info("getting video data:-", videodata.length);
            audioModel.create(data, function (err, audiodata) {
                questionid[1] = data.id;
                delete data.id;
                log.info("getting audio data:-", audiodata.length);
                log.error(err);
                typedModel.create(data, function (err, typeddata) {
                    questionid[2] = data.id;
                    delete data.id;
                    log.info("getting typed data:-", typeddata.length);
                    Array.prototype.push.apply(videodata, audiodata);
                    Array.prototype.push.apply(videodata, typeddata);
                    log.error(err);
                    delete data.length;
                    videodata.id = questionid;
                    callback(err, videodata);
                });
            });
        });
    } else if (quizzestype[1] === 'video' && quizzestype[0] === 'audio' && quizzestype.length === 2) {
        video.create(data, function (err, videodata) {
            log.error(err);
            questionid[0] = data.id;
            delete data.id;
            log.info("getting video data:-", videodata.length);
            audioModel.create(data, function (err, audiodata) {
                log.error(err);
                questionid[1] = data.id;
                delete data.id;
                log.info("getting audio data:-", audiodata.length);
                Array.prototype.push.apply(videodata, audiodata);
                log.error(err);
                videodata.id = questionid;
                callback(err, videodata);
            });
        });
    } else if (quizzestype[1] === 'video' && quizzestype[0] === 'typed' && quizzestype.length === 2) {
        video.create(data, function (err, videodata) {
            log.error(err);
            questionid[0] = data.id;
            delete data.id;
            log.info("getting video data:-", videodata.length);
            typedModel.create(data, function (err, typeddata) {
                log.info("getting typed data:-", typeddata.length);
                Array.prototype.push.apply(videodata, typeddata);
                log.error(err);
                questionid[1] = data.id;
                delete data.id;
                videodata.id = questionid;
                callback(err, videodata);
            });
        });
    } else if (quizzestype[1] === 'typed' && quizzestype[0] === 'audio' && quizzestype.length === 2) {
        audioModel.create(data, function (err, audiodata) {
            log.error(err);
            questionid[0] = data.id;
            delete data.id;
            typedModel.create(data, function (err, typeddata) {
                log.info("getting typed data:-", typeddata.length);
                Array.prototype.push.apply(audiodata, typeddata);
                log.error(err);
                questionid[1] = data.id;
                delete data.id;
                audiodata.id = questionid;
                callback(err, audiodata);
            });
        });
    } else {
        log.info("{message: Bad Request}");
        callback({message: "Bad Request"});
    }
};
QuestionsModel.prototype.update = function (id, data, callback) {
    var self = this;
    if (data.questiontype === 'audio') {
        self.findOne(data.questiontype, id, function (err, bothdata) {
            delete data.questiontype;
            audioModel.update(id, data, function (err, audiodata) {
                if (bothdata.length > 0 && bothdata.length === 2) {
                    if (bothdata[0] && bothdata[0].questiontype === 'Typed') {
                        typedModel.update(bothdata[0].id, data, function (err, typeddata) {
                            if (bothdata[1] && bothdata[1].questiontype === 'Video') {
                                video.update(bothdata[1].id, data, function (err, videodata) {
                                    log.error(err);
                                    Array.prototype.push.apply(audiodata, videodata);
                                    Array.prototype.push.apply(audiodata, typeddata);
                                    callback(err, audiodata);
                                });
                            }
                        });
                    } else if (bothdata[0] && bothdata[0].questiontype === 'Video') {
                        video.update(bothdata[0].id, data, function (err, videodata) {
                            if (bothdata.length > 0 && bothdata[1] && bothdata[1].questiontype === 'Typed') {
                                typedModel.update(bothdata[1].id, data, function (err, typeddata) {
                                    log.error(err);
                                    Array.prototype.push.apply(audiodata, typeddata);
                                    Array.prototype.push.apply(audiodata, videodata);
                                    callback(err, audiodata);
                                });
                            }
                        });
                    }
                } else if (bothdata.length > 0 && bothdata.length === 1) {
                    if (bothdata[0] && bothdata[0].questiontype === 'Typed') {
                        typedModel.update(bothdata[0].id, data, function (err, typeddata) {
                            log.error(err);
                            Array.prototype.push.apply(audiodata, typeddata);
                            callback(err, audiodata);
                        });
                    } else if (bothdata[0] && bothdata[0].questiontype === 'Video') {
                        video.update(bothdata[0].id, data, function (err, videodata) {
                            log.error(err);
                            Array.prototype.push.apply(audiodata, videodata);
                            callback(err, audiodata);
                        });
                    }
                } else {
                    callback(err, audiodata);
                }
            });
        });
    } else if (data.questiontype === 'typed') {
        self.findOne(data.questiontype, id, function (err, bothdata) {
            delete data.questiontype;
            typedModel.update(id, data, function (err, typeddata) {
                if (bothdata.length > 0 && bothdata.length === 2) {
                    if (bothdata[0] && bothdata[0].questiontype === 'Video') {
                        video.update(bothdata[0].id, data, function (err, videodata) {
                            if (bothdata[1] && bothdata[1].questiontype === 'Audio') {
                                audioModel.update(bothdata[1].id, data, function (err, audiodata) {
                                    log.error(err);
                                    Array.prototype.push.apply(typeddata, audiodata);
                                    Array.prototype.push.apply(typeddata, videodata);
                                    callback(err, typeddata);
                                });
                            }
                        });
                    } else if (bothdata[0] && bothdata[0].questiontype === 'Audio') {
                        audioModel.update(bothdata[0].id, data, function (err, audiodata) {
                            if (bothdata.length > 0 && bothdata[1] && bothdata[1].questiontype === 'Video') {
                                video.update(bothdata[1].id, data, function (err, videodata) {
                                    log.error(err);
                                    Array.prototype.push.apply(typeddata, videodata);
                                    Array.prototype.push.apply(typeddata, audiodata);
                                    callback(err, typeddata);
                                });
                            }
                        });
                    }
                } else if (bothdata.length > 0 && bothdata.length === 1) {
                    if (bothdata[0] && bothdata[0].questiontype === 'Video') {
                        video.update(bothdata[0].id, data, function (err, videodata) {
                            log.error(err);
                            Array.prototype.push.apply(typeddata, videodata);
                            callback(err, typeddata);
                        });
                    } else if (bothdata[0] && bothdata[0].questiontype === 'Audio') {
                        audioModel.update(bothdata[0].id, data, function (err, audiodata) {
                            log.error(err);
                            Array.prototype.push.apply(typeddata, audiodata);
                            callback(err, typeddata);
                        });
                    }
                } else {
                    callback(err, typeddata);
                }

            });
        });
    } else if (data.questiontype === 'video') {
        self.findOne(data.questiontype, id, function (err, bothdata) {
            delete data.questiontype;
            video.update(id, data, function (err, videodata) {
                if (bothdata.length > 0 && bothdata.length === 2) {
                    if (bothdata[0] && bothdata[0].questiontype === 'Typed') {
                        typedModel.update(bothdata[0].id, data, function (err, typeddata) {
                            if (bothdata[1] && bothdata[1].questiontype === 'Audio') {
                                audioModel.update(bothdata[1].id, data, function (err, audiodata) {
                                    log.error(err);
                                    Array.prototype.push.apply(videodata, audiodata);
                                    Array.prototype.push.apply(videodata, typeddata);
                                    callback(err, videodata);
                                });
                            }
                        });
                    } else if (bothdata[0] && bothdata[0].questiontype === 'Audio') {
                        audioModel.update(bothdata[0].id, data, function (err, audiodata) {
                            if (bothdata.length > 0 && bothdata[1] && bothdata[1].questiontype === 'Typed') {
                                typedModel.update(bothdata[1].id, data, function (err, typeddata) {
                                    log.error(err);
                                    Array.prototype.push.apply(videodata, typeddata);
                                    Array.prototype.push.apply(videodata, audiodata);
                                    callback(err, videodata);
                                });
                            }
                        });
                    }
                } else if (bothdata.length > 0 && bothdata.length === 1) {
                    if (bothdata[0] && bothdata[0].questiontype === 'Typed') {
                        typedModel.update(bothdata[0].id, data, function (err, typeddata) {
                            log.error(err);
                            Array.prototype.push.apply(videodata, typeddata);
                            callback(err, videodata);
                        });
                    } else if (bothdata[0] && bothdata[0].questiontype === 'Audio') {
                        audioModel.update(bothdata[0].id, data, function (err, audiodata) {
                            log.error(err);
                            Array.prototype.push.apply(videodata, audiodata);
                            callback(err, videodata);
                        });
                    }
                } else {
                    callback(err, videodata);
                }
            });
        })
    } else {
        log.info("{message: Bad Request}");
        callback({message: "Bad Request"});
    }
};
module.exports = QuestionsModel;
