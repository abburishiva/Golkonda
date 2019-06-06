var CandidateModel = require('./mongoModels/candidateModel'),
    connection = require('../utils/db/mysqlConnect'),
    ResumeModel = require('./mongoModels/resumesModel'),
    EmpInterviews = require('./mongoModels/employerInterviewsModel'),
    EmployerModel = require('./mongoModels/employeeModel'),
    PublicChallengesModel = require('./mongoModels/publicChallengesModel.js'),
    ChallengesModel = require('./mongoModels/challengesModel'),
    DashboardCardsJson = require("../config/dashboardCards.json"),
    JobPostingsModel = require('./jobPostingsModel'),
    EmployerQuestionsModel = require('./mongoModels/employeeQuestionsModel'),
    CandidateInterviewsModel = require('../models/mongoModels/candidateInterviewsModel'),
    OrganizationModel = require('./organizationsModel'),
    ElasticResumeModel = require('./elasticSearchResumesModel'),
    employeeSubjectModel = require('../models/mongoModels/employerSubjectsModel'),
    JobApplicationModel = require('./mongoModels/jobApplicationsModel'),
    _=require('lodash'),
    cm, rm, ei, em, pcm, jpm, chm, eqm, ci, om, erm, esm, jam;

function CardsDashboard() {
    this.dbMySQL = connection;
    cm = new CandidateModel();
    rm = new ResumeModel();
    ei = new EmpInterviews();
    em = new EmployerModel();
    pcm = new PublicChallengesModel();
    jpm = new JobPostingsModel();
    chm = new ChallengesModel();
    ci = new CandidateInterviewsModel();
    eqm = new EmployerQuestionsModel();
    om = new OrganizationModel();
    erm = new ElasticResumeModel();
    esm = new employeeSubjectModel();
    jam = new JobApplicationModel();
}

Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});
CardsDashboard.prototype.getCandidateCards = function (params, callback) {
    var self = this, candidateSkills;
    var candidateProfileSkills = new Promise(function (res, rej) {
        cm.findOne(params, params.decoded._id, function (err, data) {
            if (err) {
                rej(err, null);
            } else {
                candidateSkills = data.user_profile.skills_interested
                res([])
            }
        });
    });
    var findPublicChallengesCount = new Promise(function (res, rej) {
        pcm.findPublicChallengesCount({}, function (err, data) {
            if (err) {
                rej(err, null);
            } else {
                res(data.publicChallenges);
            }
        });
    });
    var findChallengesCount = new Promise(function (res, rej) {
        chm.findChallengesCount({}, function (err, data) {
            if (err) {
                rej(err);
            } else {
                data.card = "candidateCards";
                getQuizzes(data, function (err, data) {
                    if (data) {
                        res(data.count);

                    }
                });
                getQuizzes(data, function (err, data) {
                    if (data) {
                        res(data)
                    }
                })

            }
        })

    });
    var findEmployersCount = new Promise(function (res, rej) {
        em.findEmployersCount({}, function (err, data) {
            if (err) {
                rej(err, null);
            } else {
                res(data.employee);

            }
        })

    });
    var jobsCount = new Promise(function (res, rej) {
        jpm.jobsCount(candidateSkills, function (err, data) {
            if (err) {
                rej(err, null);
            } else {
                res([data.totalJobsCount, data.totalJobs, data.candidateJobs])
            }
        })

    });
    Promise.all([candidateProfileSkills, findPublicChallengesCount, findChallengesCount, findEmployersCount, jobsCount]).then(function (total) {
        var totalCount = total.flat(1)
        self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.id;', function (err, data) {
            var candidateDashboard = [];

            if (err) {
                callback(err, null);
            } else if (data.length > 0) {
                for (var i = 0; i < DashboardCardsJson.candidateCards.length; i++) {
                    for (var j = 0; j < data.length; j++) {

                        var candidateDashboardData = DashboardCardsJson.candidateCards[i];
                        if ((candidateDashboardData.key === data[j].cardname)) {
                            candidateDashboardData.card_type = data[j].name;
                            if (typeof totalCount[i] === "object") {
                                candidateDashboardData._source = totalCount[i];
                            } else {
                                candidateDashboardData.count = totalCount[i];
                            }
                            candidateDashboard.push(candidateDashboardData);
                        }
                    }
                }
                candidateDashboard.unshift(candidateDashboard[candidateDashboard.length - 1]);
                candidateDashboard.pop();
                callback(err, candidateDashboard);
            } else {
                callback(err, {message: "something went wrong"});
            }
        });


    }).catch(function (err) {
        callback(err, null);
    })
}

CardsDashboard.prototype.getEmployeeCards = function (params, callback) {
    var totalCount = [], totalChallengeTypes, employeeDashboard, employerDashboardData, self = this;

    ei.findInterviewsCount({}, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            var totalInterviews = data.totalSkills;
            pcm.findPublicChallengesCount({}, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    totalCount.push(data.publicChallenges);
                    cm.findCandidatesCount({}, function (err, data) {
                        if (err) {
                            callback(err, null);
                        } else {
                            var totalSkills = data.totalSkills;
                            totalCount.push(totalInterviews);
                            totalCount.push(totalSkills);
                            totalCount.push(data.candidates);
                            rm.findResumesCount({}, function (err, data) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    totalCount.push(data.resume);
                                    self.dbMySQL.query('select name from common_types where entityid = (select id from common_entity where name = "TEST_TYPES");', function (err, common_types) {
                                        if (err) {
                                            callback(err, null);
                                        } else {
                                            totalChallengeTypes = [];
                                            for (var x in common_types) {
                                                totalChallengeTypes.push(common_types[x].name);
                                            }
                                            totalCount.push(totalChallengeTypes);
                                            chm.findChallengesCount({}, function (err, data) {
                                                if (err) {
                                                    callback(err, null);
                                                } else {
                                                    data.card = "employerCards";
                                                    getQuizzes(data, function (err, data) {
                                                        if (data) {
                                                            totalCount.push(data.count);
                                                            self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.id;', function (err, data) {
                                                                employeeDashboard = [];

                                                                if (err) {
                                                                    callback(err, null);
                                                                } else if (data.length > 0) {
                                                                    for (var i = 0; i < DashboardCardsJson.employerCards.length; i++) {
                                                                        for (var j = 0; j < data.length; j++) {

                                                                            employerDashboardData = DashboardCardsJson.employerCards[i];

                                                                            if (employerDashboardData.key === data[j].cardname) {
                                                                                employerDashboardData.card_type = data[j].name;
                                                                                if (typeof totalCount[i] === "object") {
                                                                                    employerDashboardData._source = totalCount[i];
                                                                                } else {
                                                                                    employerDashboardData.count = totalCount[i];
                                                                                }
                                                                                employeeDashboard.push(employerDashboardData);
                                                                            }
                                                                        }
                                                                    }
                                                                    employeeDashboard.unshift(employeeDashboard[employeeDashboard.length - 1]);
                                                                    employeeDashboard.pop();
                                                                    callback(err, employeeDashboard);
                                                                } else {
                                                                    callback(err, {message: "something went wrong"});
                                                                }
                                                            });
                                                        } else {
                                                            callback(err, {message: "something went wrong in Quizzes"});
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

CardsDashboard.prototype.getSecEmployeeCards = function (params, callback) {
    var self = this, employerDashboardDataSecond, employerDashboardData = [], category = [], totalCount = [];

    jpm.latestJobs(params, function (err, jobsData) {
        if (err) {
            callback(err, null)
        } else {
            totalCount.push(jobsData.totalJobsCount);
    eqm.findEmpQuestionsCount(params, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            totalCount.push(data.questionsCount);
            ei.findEmpInterviewsCount(params, function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    totalCount.push(data.employeeInterviewsCount);
                    self.dbMySQL.query("SELECT common_category.name, count(subject.categoryid) from subject left join common_category on (subject.categoryid= common_category.id) group by common_category.id", function (err, data) {
                        if (err) {
                            callback(err, null);
                        } else {
                            for (var i in data) {
                                if (data[i].name !== null) {
                                    category.push({label: data[i].name, value: data[i]['count(subject.categoryid)']});
                                }
                            }
                            totalCount.push(category);
                            self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.id;', function (err, data) {
                                if (err) {
                                    callback(err, null);
                                } else if (data.length > 0) {
                                    for (var i = 0; i < DashboardCardsJson.secondTimeEmployeeCards.length; i++) {
                                        for (var j = 0; j < data.length; j++) {
                                            employerDashboardDataSecond = DashboardCardsJson.secondTimeEmployeeCards[i];
                                            if (employerDashboardDataSecond.key === data[j].cardname) {
                                                employerDashboardDataSecond.card_type = data[j].name;
                                                if (typeof totalCount[i] === "object") {
                                                    employerDashboardDataSecond._source = totalCount[i];
                                                } else {
                                                    employerDashboardDataSecond.count = totalCount[i];
                                                }
                                                employerDashboardData.push(employerDashboardDataSecond);

                                                self.getEmployeeCards(params, function (req, firstTimeData) {
                                                    if (firstTimeData) {
                                                        firstTimeData.forEach(function (data) {
                                                            if (data.key !== "WELCOME") {
                                                                employerDashboardData.push(data);
                                                            }
                                                        });
                                                        callback(err, employerDashboardData);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                } else {
                                    callback(err, {message: "something went wrong"});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
        }
    });
};

CardsDashboard.prototype.getSecTimeCandidateCards = function (params, callback) {
    var secondData = [], totalQuizzes = [], self = this, finalData = [];
    this.getCandidateCards(params, function (req, firstTimeData) {
        if (firstTimeData) {
            firstTimeData.forEach(function (data, val) {
                if (data.card_type !== "TEXT") {
                    finalData.push(data);
                }
            });
            pcm.getCompletedPublicChallengesCount(params, function (err, results) {
                if (err) {
                    callback(err, null);
                } else {
                    secondData.push(results);
                    ci.findAllInterviewsCount(params, function (err, res) {
                        if (err) {
                            callback(err, null);
                        } else {
                            secondData.push(res);
                            chm.findCompletedQuizzesCount(params, function (err, res) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    secondData.push(res);
                                    chm.getAWeekChallengesCount(params, function (err, res) {
                                        if (err) {
                                            callback(err, null);
                                        } else {
                                            secondData.push(res.challenges);
                                            ci.findUpcomingInterviewsCount(params, function (err, res) {
                                                if (err) {
                                                    callback(err, null);
                                                } else {
                                                    totalQuizzes.push(res);
                                                    ci.findCompletedInterviewsCount(params, function (err, res) {
                                                        if (err) {
                                                            callback(err, null);
                                                        } else {
                                                            totalQuizzes.push(res);
                                                            ci.findExpiredInterviewsCount(params, function (err, res) {
                                                                if (err) {
                                                                    callback(err, null);
                                                                } else {
                                                                    totalQuizzes.push(res);
                                                                    secondData.push(totalQuizzes);
                                                                    self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.id;', function (err, data) {
                                                                        if (err) {
                                                                            callback(err, null);
                                                                        } else if (data.length > 0) {
                                                                            DashboardCardsJson.secondTimeCandidateCards.forEach(function (v, key) {
                                                                                data.forEach(function (val, k) {
                                                                                    if (val.cardname === v.key) {
                                                                                        if (secondData[key].count >= 0) {
                                                                                            v.card_type = val.name;
                                                                                            v.count = secondData[key].count;
                                                                                        } else {
                                                                                            v.card_type = val.name;
                                                                                            v._source = secondData[key];
                                                                                        }
                                                                                        finalData.push(v)
                                                                                    }
                                                                                })
                                                                            });
                                                                            callback(err, finalData);
                                                                        } else {
                                                                            callback(err, {message: "something went wrong"});
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

function getQuizzes(data, res) {
    for (var j = 0; j < DashboardCardsJson[data.card].length; j++) {
        if (DashboardCardsJson[data.card][j].key === "QUIZES") {
            DashboardCardsJson[data.card][j].count = data.quizCount;
            DashboardCardsJson.count = data.quizCount;
            for (var i = 0; i < data.allQuizesCount.length; i++) {
                if (data.allQuizesCount[i].label === 'choice') {
                    DashboardCardsJson[data.card][j].choiceQuizCount = data.allQuizesCount[i].value;
                }
                if (data.allQuizesCount[i].label === 'typed') {
                    DashboardCardsJson[data.card][j].typedQuizCount = data.allQuizesCount[i].value;
                }
                if (data.allQuizesCount[i].label === 'audio') {
                    DashboardCardsJson[data.card][j].audioQuizCount = data.allQuizesCount[i].value;
                }
                if (data.allQuizesCount[i].label === 'video') {
                    DashboardCardsJson[data.card][j].videoQuizCount = data.allQuizesCount[i].value;
                }
                if (data.allQuizesCount[i].label === 'coding') {
                    DashboardCardsJson[data.card][j].codingQuizCount = data.allQuizesCount[i].value;
                }
            }
        }
    }
    res(null, DashboardCardsJson);
}

CardsDashboard.prototype.getCandidateChallengeCards = function (params, callback) {
    var self = this, alldata = [], publicChallenge = [], ChallengesCount = [], finaldata = [], quizzes = {}, keys,
        publicChallenges = {};
    pcm.findPublicChallengesCount({}, function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            publicChallenge.push({publicChallengesCount: res.publicChallenges})
            pcm.findPublicChallengesSkillsCount(params, function (err, res) {
                if (err) {
                    callback(err, null)
                } else {
                    if (res) {
                        Quizzes(res, function (err, res) {
                            if (err) {
                                callback(err, null)
                            }
                            else {
                                publicChallenge.push({PublicChallenges: res})
                                for (var i = 0; i < publicChallenge.length; i++) {
                                    keys = Object.keys(publicChallenge[i]);

                                    publicChallenges[keys] = publicChallenge[i][keys];
                                }
                                alldata.push(publicChallenges)
                                chm.findQuizzesCount(params, function (err, res) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        ChallengesCount.push({quizCount: res.quizCount})
                                        Quizzes(res, function (err, res) {
                                            if (err) {
                                                callback(err, null);
                                            } else {
                                                ChallengesCount.push({myQuizzes: res})
                                                for (var i = 0; i < ChallengesCount.length; i++) {
                                                    keys = Object.keys(ChallengesCount[i]);

                                                    quizzes[keys] = ChallengesCount[i][keys];
                                                }
                                                alldata.push(quizzes)

                                                pcm.findChallengesidCount(params, function (err, res) {
                                                    if (err) {
                                                        callback(err, null)
                                                    } else {
                                                        alldata.push(res)
                                                        chm.getARecentChallengesCount(params, function (err, res) {
                                                            if (err) {
                                                                callback(err, null)
                                                            } else {
                                                                alldata.push({RecentChallengesCount: res})
                                                                pcm.getAllRecentaddChallengesCount(params, function (err, res) {
                                                                    if (err) {
                                                                        callback(err, null)
                                                                    } else {
                                                                        alldata.push({getAllRecentaddPublicChallenges: res})

                                                                        self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.id;', function (err, data) {
                                                                            if (err) {
                                                                                callback(err, null);
                                                                            } else if (data.length > 0) {
                                                                                DashboardCardsJson.candidateChallengesCards.forEach(function (v, key) {
                                                                                    data.forEach(function (val, k) {
                                                                                        if (val.cardname === v.key) {
                                                                                            v.card_type = val.name;
                                                                                            v._source = alldata[key];
                                                                                            finaldata.push(v)
                                                                                        }
                                                                                    })
                                                                                })
                                                                                callback(err, finaldata);
                                                                            } else {
                                                                                callback(err, []);
                                                                            }
                                                                        })


                                                                    }
                                                                })
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                }

            })
        }
    })
}

function Quizzes(data, res) {
    var allQuizzesCount = [], labaltype = ["choice", "typed", "audio", "video", "coding"], QuizzesCount = [];
    for (var j = 0; j < data.allQuizesCount.length; j++) {
        if (data.allQuizesCount[j].label === 'choice') {
            allQuizzesCount.push({label:'choice',value: data.allQuizesCount[j].value});
        }
        if (data.allQuizesCount[j].label === 'typed') {
            allQuizzesCount.push({label:'typed',value: data.allQuizesCount[j].value});
        }
        if (data.allQuizesCount[j].label === 'audio') {
            allQuizzesCount.push({label:'audio',value: data.allQuizesCount[j].value});
        }
        if (data.allQuizesCount[j].label === 'video') {
            allQuizzesCount.push({label:'video',value: data.allQuizesCount[j].value});
        }
        if (data.allQuizesCount[j].label === 'coding') {
            allQuizzesCount.push({label:'coding',value: data.allQuizesCount[j].value});
        }
    }
    function searchSkills(labaltype) {
        var isLabalType = false;
        for (var j = 0; j < allQuizzesCount.length; j++) {
            if (allQuizzesCount[j].label === labaltype.toLowerCase()) {
                isLabalType = true;
                QuizzesCount.push({"label": labaltype, "value": allQuizzesCount[j].value});
                break;
            }
        }
        if (!isLabalType)
            return QuizzesCount.push({"label": labaltype, "value": 0});
    }

    labaltype.forEach(function (item) {
        searchSkills(item)
    });

    res(null, QuizzesCount);
}

CardsDashboard.prototype.jobsDashboard = function (params, callback) {
    var jobsCards = [], count = 0, latestAddedPositions = [], positionDetails, self = this;
    jpm.latestJobs(params, function (err, jobsData) {
        if (err) {
            callback(err, null)
        } else {
            cm.findCandidatesCount(params.params, function (err, candidateData) {
                if (err) {
                    callback(err, null)
                } else {
                    erm.resumeSkillCount(params.params, function (err, resumeData) {
                        if (err) {
                            callback(err, null)
                        } else {
                            return new Promise(function (resolve, reject) {
                                jam.getJobId(params.params, function (err, data) {
                                    if (err) {
                                        reject(err)
                                    } else {
                                        data.latestAddedApplications.forEach(function (v, k) {
                                            cm.findOne(params.params, data.latestAddedApplications[k].candidate_id, function (err, canData) {
                                                if (err) {
                                                    reject(err)
                                                } else {
                                                    jpm.getById(data.latestAddedApplications[k].job_id, function (err, details) {
                                                        if (err) {
                                                            reject(err)
                                                        } else {
                                                            if (details) {
                                                                positionDetails = {
                                                                    "candidate_name": canData.user_profile.name,
                                                                    "jobTitle": details.title.trim(),
                                                                    "company": details.organization.name,
                                                                    "job_applied_date": v.job_applied_date
                                                                };
                                                            } else {
                                                                positionDetails = {
                                                                    "candidate_name": canData.user_profile.name,
                                                                    "jobTitle": "",
                                                                    "company": "",
                                                                    "job_applied_date": v.job_applied_date
                                                                };
                                                            }
                                                            latestAddedPositions.push(positionDetails);
                                                            count++;
                                                            if (count === 3) {
                                                                jobsCards.push({
                                                                    totalJobsCount: jobsData.totalJobsCount,
                                                                    recentPostedJobs: jobsData.recentPostedJobs
                                                                });
                                                                jobsCards.push({skillBasedJobs: jobsData.totalJobs});
                                                                jobsCards.push({skillBasedCandidates: candidateData.totalSkills.slice(0, 5)});
                                                                jobsCards.push({latestAddedPositions: latestAddedPositions, TotalApplicationsCount:data.count});
                                                                jobsCards.push({skillsBasedOnResumes: resumeData});
                                                                resolve(jobsCards)
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        });
                                    }
                                });
                            }).then(function (res) {
                                self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.id and ct.name IN ("LATEST_ADDED_POSITIONS","SKILL_BASED_JOBS","SKILL_BASED_CANDIDATES","LATEST_APPLIED_POSITIONS","SKILL_BASED_RESUMES");', function (err, data) {
                                    for (var i = 0; i < DashboardCardsJson.employeeJobsDashboardCards.length; i++) {
                                        for (var j = 0; j < data.length; j++) {
                                            if (DashboardCardsJson.employeeJobsDashboardCards[i].key === data[j].cardname) {
                                                DashboardCardsJson.employeeJobsDashboardCards[i].card_type = data[j].name;
                                                DashboardCardsJson.employeeJobsDashboardCards[i]._source = res[i];
                                            }
                                        }
                                    }
                                    callback(null, DashboardCardsJson.employeeJobsDashboardCards)
                                });
                            }).catch(function (err) {
                                callback(err, null)
                            });
                        }
                    });
                }
            });
        }
    });
};
CardsDashboard.prototype.MyInterviews = function (params, callback) {
    var self = this, Interviews = [];
    var findUpcomingInterviewsCount = new Promise(function (resolve, reject) {
        ci.findUpcomingInterviewsCount(params, function (err, res) {
            if (err) {
                reject(err);
            } else {
                Interviews.push(res)
                resolve([]);
            }
        })
    })
    var findCompletedInterviewsCount = new Promise(function (resolve, reject) {
        ci.findCompletedInterviewsCount(params, function (err, res) {
            if (err) {
                reject(err);
            } else {
                Interviews.push(res)
                resolve([]);
            }
        })
    })
    var findExpiredInterviewsCount = new Promise(function (resolve, reject) {
        ci.findAllInterviewsCount(params, function (err, result) {
            if (err) {
                reject(err);
            } else {
                ci.findExpiredInterviewsCount(params, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        Interviews.push(res)
                        resolve({count: result.count, myInterviews: Interviews})
                    }
                })
            }
        })
    })
    var findChallengesAllCount = new Promise(function (resolve, reject) {
        ci.findChallengesAllCount(params, function (err, res) {
            if (err) {
                reject(err, null)
            } else {
                resolve({totalInterviews: res})

            }
        })
    })
    var RecentlyPerformedInterviews = new Promise(function (resolve, reject) {
        ci.RecentlyPerformedInterviews(params, function (err, res) {
            if (err) {
                reject(err, null)
            } else {
                resolve({recentlyPerformedInterviews: res});
            }
        })
    })
    var UpcomingInterviews = new Promise(function (resolve, reject) {
        ci.UpcomingInterviews(params, function (err, res) {
            if (err) {
                reject(err, null)
            } else {
                resolve({upcomingInterviews: res})
            }
        })
    })
    Promise.all([findUpcomingInterviewsCount, findCompletedInterviewsCount, findExpiredInterviewsCount, findChallengesAllCount, RecentlyPerformedInterviews, UpcomingInterviews]
    ).then(function (res) {
        var totalQuizzes, finaldata = [];
        totalQuizzes = res.flat(1);
        self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.id;', function (err, data) {
            if (err) {
                callback(err, null);
            } else if (data.length > 0) {
                DashboardCardsJson.candidateMyInterviewsCards.forEach(function (v, key) {
                    data.forEach(function (val, k) {
                        if (val.cardname === v.key) {
                            v.card_type = val.name;
                            v._source = totalQuizzes[key];
                            finaldata.push(v)
                        }
                    })
                })
                callback(err, finaldata);
            }
        })
    }).catch(function (err) {
        callback(err, null)
    })
};
CardsDashboard.prototype.getLibraryCards = function (req, callback) {
    var latestAddSub = [], category = [], self = this, libraryData = [], finalData = [],mySubject=0;
    esm.getSubjects(req, function (err, data) {
        if (err) {
            callback(err, null)
        } else {
            for (var i = 0; i < data.length; i++) {
                latestAddSub.push({name: data[i].name, date: data[i].lastmoddatetime});
            }
            libraryData.push({latestAddSub: latestAddSub});
            self.dbMySQL.query("SELECT common_category.name, count(subject.categoryid) from subject left join common_category on (subject.categoryid= common_category.id) group by common_category.id", function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    for (var i in data) {
                        mySubject += data[i]['count(subject.categoryid)'];
                        if (data[i].name !== null) {
                            category.push({label: data[i].name, value: data[i]['count(subject.categoryid)']});
                        }
                    }
                    libraryData.push({mySubjects:mySubject,subjectsOnCategory: _.orderBy(category, ['value'], ['desc'])});
                    eqm.findEmpQuestionsCount(req, function (err, empQuesData) {
                        if (err) {
                            callback(err, null)
                        } else {
                            libraryData.push({questionsCount: empQuesData.questionsCount});
                            libraryData.push({questionsBasedOnSubjects: empQuesData.questionsOnSubjects});
                            libraryData.push({quesOnQuizzes: empQuesData.quesOnQuizzes});
                            ei.findEmpInterviewsCount(req.params, function (err, data) {
                                if (err) {
                                    callback(err, null)
                                } else {
                                    libraryData.push(data);
                                    eqm.findEmpQuestionsCount(req, function (err, empQuesData) {
                                        if (err) {
                                            callback(err, null)
                                        } else {
                                            libraryData.push({resentAddedQuestions: empQuesData.resentAddedQuestions});
                                            self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.name in("LATEST_ADDED SUBJECTS","MY_SUBJECTS","QUESTIONS_COUNT","QUESTIONS_BASED_ON_SUBJECTS","QUESTIONS_ON_QUIZZES","POPULAR_QUESTIONS","RECENTLY_ADDED_QUESTIONS");', function (err, data) {
                                                if (err) {
                                                    callback(err, null)
                                                } else if (data.length > 0) {
                                                    DashboardCardsJson.employerLibreryCards.forEach(function (v, key) {
                                                        data.forEach(function (val, k) {
                                                            if (val.cardname === v.key) {
                                                                v.card_type = val.name;
                                                                v._source = libraryData[key];
                                                                finalData.push(v)
                                                            }
                                                        })
                                                    });
                                                    callback(err, finalData);
                                                } else {
                                                    callback(err, null);
                                                }
                                            })
                                        }
                                    })
                                }
                            })

                        }
                    });
                }
            });
        }
    });
};
CardsDashboard.prototype.getCandidateJobsCards = function (params, callback) {
    var self = this,jobs = [], appliedJobs = [], final = [], count = 1, papularJobs = [], popularJobsCount = [],
        popularcompaniesCount = [], latestAddedJobs, latestjobs = [], recentjobs = [], obj,popularcompanies = [],latestJobs,latestJobsCount=[],finaldata=[],
        arr = [], recentjob, recent = [],popularcompany;
    jpm.jobsCount([], function (err, res) {
        if (err) {
            callback(err, null)
        } else {
            jobs.push({jobsCount: res.totalJobs});
            jam.findAppliedJobsCount(params, function (err, res) {
                if (err) {
                    callback(err, null)
                } else {
                    var skilArr = [];
                    res.map(function (val) {
                        skilArr.push(val.job_id);
                    });
                    jpm.getMultipleDocuments(skilArr, function (err, res) {
                        if (err) {
                            callback(err, null)
                        } else {
                            if(res && res.docs) {
                                res.docs.map(function (val) {
                                    if (val._source && val._source.job)
                                        val._source.job.categories.map(function (val) {
                                            appliedJobs = appliedJobs.concat(val.skills).sort();
                                        })
                                })
                                appliedJobs.forEach(function (val, key) {
                                    if (val === appliedJobs[key + 1]) {
                                        count++;
                                    } else {
                                        final.push({skill: val, count: count});
                                        count = 1;
                                    }
                                })
                            }
                            jobs.push({AppliedJobs: _.orderBy(final, ['count'], ['desc']).slice(0, 5)});
                            jpm.latestJobs(params, function (err, res) {
                                if (err) {
                                    callback(err)
                                } else {
                                    latestAddedJobs = res.recentPostedJobs.slice(0, 4);
                                    latestAddedJobs.map(function (val) {
                                        latestjobs.push(val.name)
                                    });
                                    latestJobs = latestjobs.toString();
                                    om.getMultipleLatestJobs(latestJobs, function (err, res) {
                                        if (err) {
                                            callback(err, null)
                                        }else{
                                            if (res && res.responses) {
                                                res.responses.map(function (val) {
                                                    if(val && val.hits.hits) {
                                                        val.hits.hits.map(function (val1) {
                                                            latestAddedJobs.map(function (val, key) {
                                                                if (val1._source.name === val.name) {
                                                                    if(val1 && val1._source.logo) {
                                                                        latestAddedJobs[key].logo = val1._source.logo
                                                                    }
                                                                }
                                                            })
                                                        })
                                                    }
                                                })
                                                jobs.push({latestAddedJobs: latestAddedJobs})
                                            }
                                            jam.getCandidateJobId(params, function (err, res2) {
                                                if (err) {
                                                    callback(err, null)
                                                } else {
                                                    res2.map(function (val) {
                                                        recentjobs.push(val.job_id)
                                                    })
                                                    jpm.getMultipleDocuments(recentjobs, function (err, res) {
                                                        if (err) {
                                                            callback(err, null)
                                                        } else {
                                                            if(res && res.docs) {
                                                                res.docs.map(function (val) {
                                                                    if (val && val._source && val._source.job && val._source.job.organization.name) {
                                                                        obj = {
                                                                            title: val._source.job.title,
                                                                            employeementType: val._source.job.employment_type,
                                                                            orgName: val._source.job.organization.name,
                                                                            location : val._source.job.location,
                                                                            lastmoddatetime : val._source.job.lastmoddatetime,
                                                                            valid_through : val._source.job.valid_through,
                                                                            positionStatus : val._source.job.positionStatus,
                                                                            description : val._source.job.description,
                                                                            employerName : val._source.job.employer.name,
                                                                            name : val._source.job.organization.name,
                                                                            jobId:val._id
                                                                        }
                                                                    } else if (val && val._source && val._source.job && val._source.job.organization.url) {
                                                                        obj = {
                                                                            title: val._source.job.title,
                                                                            employeementType: val._source.job.employment_type,
                                                                            orgName: val._source.job.organization.url,
                                                                            location : val._source.job.location,
                                                                            lastmoddatetime : val._source.job.lastmoddatetime,
                                                                            valid_through : val._source.job.valid_through,
                                                                            positionStatus : val._source.job.positionStatus,
                                                                            description : val._source.job.description,
                                                                            employerName : val._source.job.employer.name,
                                                                            jobId:val._id
                                                                        }
                                                                    }
                                                                    recent.push(obj)
                                                                });
                                                                recent.map(function (val) {
                                                                    if (val && val.orgName) {
                                                                        arr.push(val.orgName)
                                                                    }
                                                                })
                                                            }else {
                                                                arr = "something went wrong"
                                                            }
                                                            recentjob = arr.toString();
                                                            om.getMultipleLatestJobs(recentjob, function (err, res) {
                                                                if (err) {
                                                                    callback(err, null)
                                                                } else {
                                                                        res.responses.map(function (val) {
                                                                            if (val && val.hits && val.hits.hits) {
                                                                                val.hits.hits.map(function (val1) {
                                                                                    recent.map(function (val, key) {
                                                                                        if (val1 && val1._source && val1._source.name === val.orgName || val1 && val1._source && val1._source.url === val.orgName) {
                                                                                            if(val1 && val1._source.logo) {
                                                                                                recent[key].logo = val1._source.logo
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                })
                                                                                recent.map(function (val) {
                                                                                    if(val && val.title) {
                                                                                        latestJobsCount.push({
                                                                                            companylogo: val.logo,
                                                                                            position: val.title,
                                                                                            employeementType: val.employeementType,
                                                                                            description:val.description,
                                                                                            lastmoddatetime:val.lastmoddatetime,
                                                                                            location:val.location,
                                                                                            positionStatus:val.positionStatus,
                                                                                            employerName:val.employerName,
                                                                                            valid_through:val.valid_through,
                                                                                            name: val.name,
                                                                                            jobId:val.jobId
                                                                                        })
                                                                                    }
                                                                                })
                                                                            }
                                                                        })
                                                                        jobs.push({recentlyAppliedJobs: latestJobsCount})
                                                                    jam.findPopularJobs(params, function (err, res1) {
                                                                        if (err) {
                                                                            callback(err, null)
                                                                        } else {
                                                                            res1.map(function (val) {
                                                                                papularJobs.push(val.job_id)
                                                                                popularcompaniesCount.push(val.count)
                                                                            })
                                                                            jpm.getMultipleDocuments(papularJobs, function (err, popularjobs) {
                                                                                if (err) {
                                                                                    callback(err, null)
                                                                                } else {
                                                                                    if(popularjobs && popularjobs.docs) {
                                                                                        popularjobs.docs.map(function (val, k) {
                                                                                            if (val && val._source && val._source.job && val._source.job.organization && val._source.job.organization.name) {
                                                                                                res1[k].title = val._source.job.title;
                                                                                                res1[k].name = val._source.job.organization.name;
                                                                                                res1[k].location = val._source.job.location;
                                                                                                res1[k].lastmoddatetime = val._source.job.lastmoddatetime;
                                                                                                res1[k].valid_through = val._source.job.valid_through;
                                                                                                res1[k].positionStatus = val._source.job.positionStatus;
                                                                                                res1[k].description = val._source.job.description;
                                                                                                res1[k].employerName = val._source.job.employer.name;
                                                                                                res1[k].jobId = val._id;
                                                                                            }
                                                                                            else if (val && val._source && val._source.job && val._source.job.organization && val._source.job.organization.url) {
                                                                                                res1[k].title = val._source.job.title;
                                                                                                res1[k].name = val._source.job.organization.url;
                                                                                                res1[k].location = val._source.job.location;
                                                                                                res1[k].lastmoddatetime = val._source.job.lastmoddatetime;
                                                                                                res1[k].valid_through = val._source.job.valid_through;
                                                                                                res1[k].positionStatus = val._source.job.positionStatus;
                                                                                                res1[k].description = val._source.job.description;
                                                                                                res1[k].employerName = val._source.job.employer.name;
                                                                                                res1[k].jobId = val._id;
                                                                                            }
                                                                                        })

                                                                                        res1.map(function (val) {
                                                                                            if (val && val.name) {
                                                                                                popularcompanies.push(val.name)
                                                                                            } else {
                                                                                                popularcompanies = "something went wrong"
                                                                                            }
                                                                                        })
                                                                                    }else {
                                                                                        popularcompanies = "something went wrong"
                                                                                    }
                                                                                     popularcompany = popularcompanies.toString();
                                                                                    om.getMultipleLatestJobs(popularcompany, function (err, res) {
                                                                                        if (err) {
                                                                                            callback(err, null)
                                                                                        } else {
                                                                                                res.responses.map(function (val) {
                                                                                                    if (val && val.hits && val.hits.hits) {
                                                                                                        val.hits.hits.map(function (val1) {
                                                                                                            res1.map(function (val, key) {
                                                                                                                if (val && val1._source && val1._source.name === val.name || val && val1._source && val1._source.url === val.name) {
                                                                                                                    if(val1 && val1._source.logo) {
                                                                                                                        res1[key].logo = val1._source.logo
                                                                                                                    }
                                                                                                                }
                                                                                                            })
                                                                                                        })
                                                                                                        res1.map(function (val) {
                                                                                                            if (val && val.name) {
                                                                                                                popularJobsCount.push({
                                                                                                                    companylogo: val.logo,
                                                                                                                    position: val.title,
                                                                                                                    name: val.name,
                                                                                                                    count: val.count,
                                                                                                                    description:val.description,
                                                                                                                    lastmoddatetime:val.lastmoddatetime,
                                                                                                                    location:val.location,
                                                                                                                    positionStatus:val.positionStatus,
                                                                                                                    employerName:val.employerName,
                                                                                                                    valid_through:val.valid_through,
                                                                                                                    jobId:val.jobId
                                                                                                                })
                                                                                                            }
                                                                                                        })
                                                                                                    }
                                                                                                })
                                                                                                jobs.push({popularJobs: popularJobsCount})
                                                                                                self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.name in("JOBS_BASED_ON_SUBJECTS","APPLIED_JOBS","LATEST_ADDED_JOBS","RECENTLY_APPLIED_JOBS","MOST_APPLIED_JOBS");', function (err, data) {
                                                                                                    if (err) {
                                                                                                        callback(err, null);
                                                                                                    } else if (data.length > 0) {
                                                                                                        DashboardCardsJson.candidateJobsDashboardCards.forEach(function (v, key) {
                                                                                                            data.forEach(function (val, k) {
                                                                                                                if (val.cardname === v.key) {
                                                                                                                    v.card_type = val.name;
                                                                                                                    v._source = jobs[key];
                                                                                                                    finaldata.push(v)
                                                                                                                }
                                                                                                            })
                                                                                                        })
                                                                                                        callback(err, finaldata);
                                                                                                    } else {
                                                                                                        callback(err, []);
                                                                                                    }
                                                                                                })
                                                                                        }
                                                                                    })

                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }

                                                            })

                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }

    })
};
CardsDashboard.prototype.interviewsDashboard = function (req, callback) {
    var self = this, interviewsDashboard = [];
    ei.findEmpInterviewsCount(req, function (err, interviewsCount) {
        if (err) {
            callback(err, null);
        } else {
            interviewsDashboard.push(
                {employeeInterviewsCount: interviewsCount.employeeInterviewsCount},
                {totalInterviews: interviewsCount.totalInterviews},
                {empPublicChallenges: interviewsCount.totalPublicInterviews},
                {latestSharedInterviews: interviewsCount.latestSharedInterviews},
                {latestSharedPublicChallenges: interviewsCount.latestSharedPublicChallenges});

            self.dbMySQL.query('select ct.name as cardname, ce.name from common_types ct,common_entity ce where ct.entityid=ce.id and ct.id and ct.name IN ("TOTAL_INTERVIEWS","EMP_INTERVIEWS","EMP_PUBLIC_CHALLENGES","LATEST_SHARED_INTERVIEWS","LATEST_SHARED_PUBLIC_CHALLENGES");', function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    for (var i = 0; i < DashboardCardsJson.employeeInterviewsDashboardCards.length; i++) {
                        for (var j = 0; j < data.length; j++) {
                            if (DashboardCardsJson.employeeInterviewsDashboardCards[i].key === data[j].cardname) {
                                DashboardCardsJson.employeeInterviewsDashboardCards[i].card_type = data[j].name;
                                DashboardCardsJson.employeeInterviewsDashboardCards[i]._source = interviewsDashboard[i];
                            }
                        }
                    }
                    callback(null, DashboardCardsJson.employeeInterviewsDashboardCards);
                }
            });
        }
    });
};

module.exports = CardsDashboard;