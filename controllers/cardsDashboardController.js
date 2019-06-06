var CardsDashboardModel = require("../models/cardsDashboardModel"),
    cdm;

function CardsDashboard() {
    cdm = new CardsDashboardModel();
}

CardsDashboard.prototype.getAll = function (req, res, next) {

    if (req && req.decoded && req.decoded.auth_details && req.decoded.auth_details.first_login_completed === 'N') {
        if (req && req.decoded && req.decoded.role === 'candidate') {
            cdm.getCandidateCards(req, function (err, data) {
                if (err) {
                    return next({status: 500, error: err});
                } else {
                    res.header('X-TOTAL-COUNT', data.length);
                    res.status(200).json(data);
                }
            });
        }
        else if (req && req.decoded && req.decoded.role === 'employee') {
            cdm.getEmployeeCards(req, function (err, data) {
                if (err) {
                    return next({status: 500, error: err});
                } else {
                    res.header('X-TOTAL-COUNT', data.length);
                    res.status(200).json(data);
                }

            });
        }
    } else if (req && req.decoded && req.decoded.auth_details && req.decoded.auth_details.first_login_completed === 'Y') {
        if (req && req.decoded && req.decoded.role === 'employee') {
            if (req.params.name === 'jobs') {
                cdm.jobsDashboard(req, function (err, data) {
                    if (err) {
                        return next({status: 500, error: err})
                    } else {
                        res.header('X-TOTAL-COUNT', data.length);
                        res.status(200).json(data);
                    }
                });
            } else if(req.params.name==="library"){
                cdm.getLibraryCards(req, function (err, data) {
                    if (err) {
                        return next({status: 500, error: err});
                    } else {
                        res.header('X-TOTAL-COUNT', data.length);
                        res.status(200).json(data);
                    }
                });
            } else if (req.params.name === 'interviews') {
                cdm.interviewsDashboard(req, function (err, data) {
                    if (err) {
                        return next({status: 500, error: err})
                    } else {
                        res.header('X-TOTAL-COUNT', data.length);
                        res.status(200).json(data);
                    }
                });
            } else if(!req.params.name) {
                cdm.getSecEmployeeCards(req, function (err, data) {
                    if (err) {
                        return next({status: 500, error: err});
                    } else {
                        res.header('X-TOTAL-COUNT', data.length);
                        res.status(200).json(data);
                    }
                });
            } else {
                res.status(400).json({message: "Bad Request"});
            }
        } else if (req && req.decoded && req.decoded.role === 'candidate') {
            if (req.params.name === 'challenge') {
                cdm.getCandidateChallengeCards(req, function (err, data) {
                    if (err) {
                        return next({status: 500, error: err});
                    } else {
                        res.header('X-TOTAL-COUNT', data.length);
                        res.status(200).json(data);
                    }
                });
            }else if(req.params.name === 'interviews') {
            cdm.MyInterviews(req, function (err, data) {
                if (err) {
                    return next({status: 500, error: err});
                } else {
                    res.header('X-TOTAL-COUNT', data.length);
                    res.status(200).json(data);
                }
            });
        }  else if(req.params.name === 'jobs') {
                cdm.getCandidateJobsCards(req, function (err, data) {
                    if (err) {
                        return next({status: 500, error: err});
                    } else {
                        res.header('X-TOTAL-COUNT', data.length);
                        res.status(200).json(data);
                    }
                });
            }else if(!req.params.name) {
                cdm.getSecTimeCandidateCards(req, function (err, data) {
                    if (err) {
                        return next({status: 500, error: err});
                    } else {
                        res.header('X-TOTAL-COUNT', data.length);
                        res.status(200).json(data);
                    }
                });
            } else {
                res.status(400).json({message: "Bad Request"});
            }
        }
    } else {
        res.status(204).json({"message": "Not Authorized"});
    }
};

module.exports = CardsDashboard;
