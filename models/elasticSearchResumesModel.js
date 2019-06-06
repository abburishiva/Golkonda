var _ = require('lodash'),
    moment = require('moment'),
    config = require('../config/config.json'),
    ESUtil = require('../utils/elasticSearch/esUtil'),
    Resumes = require('./mongoModels/resumesModel.js'),
    ResumePermissions = require('./mongoModels/resumePermissionsModel'),
    esUtil,
    resumePermissions,
    resumes;

function ElasticSearchModel() {
    esUtil = new ESUtil(config.dev.es_host);
    resumes = new Resumes();
    resumePermissions = new ResumePermissions();
}

ElasticSearchModel.prototype.find = function (params, callback) {
    var limit = params.source;
    if (params.source.type === 'employerView') {
        esUtil.findAll(config.dev.es.indexName, config.dev.es.type, limit, function (err, result) {
            callback(err, result);
        });
    } else if (params.source.type === 'search') {
        this.search(limit, function (err, result) {
            callback(err, result);
        });
    } else if(params.source.type && params.source.type.toLocaleString() === 'metadata') {
        resumes.find(params,function (err, result) {
            if(err){
                callback(err,null);
            }else{
                esUtil.isDocumentExist(config.dev.es.indexName, config.dev.es.type, result[0].resumeId, function (err, exist) {
                    if (exist) {
                        esUtil.displayDocument(config.dev.es.indexName, config.dev.es.type, result[0].resumeId, function (err, display) {
                            delete params.source.type;
                            params = params ? params.source ? params.source['status'] = true : params : params;
                            resumes.findOne(params, result[0].resumeId, function (err, data) {
                                    if (err) {
                                        callback(err, data);
                                    } else if (data) {
                                        delete   data._doc.lastmoddatetime;
                                        delete   data._doc.lastmoduserid;
                                        delete   data._doc.__v;
                                        display.meta_data = data;
                                        callback(err, display);
                                    } else {
                                        display.meta_data = {};
                                        callback(err, display);
                                    }
                                }
                            )
                        });
                    } else {
                        callback(err, null);
                    }
                });
            }
        });
    }else{
        if (params && params.paging && params.paging.count) {
            esUtil.findAll(config.dev.es.indexName, config.dev.es.type, params, function (err, result) {
                callback(err, result);
            });
        } else {
            callback(null, {status: 400, message: "limit is mandatory"});
        }
    }
};
ElasticSearchModel.prototype.search = function (data, callback) {
    var queryData = data.q, dictionaryKeywords = [], arrAliases = [], arrSynonyms = [], unMatchedKeywords = [], originalKeywords;
    originalKeywords = queryData.split(/['.',',',' ','_']/);
    _.forEach(originalKeywords, function (myKey) {
        unMatchedKeywords.push(myKey);
    });
    esUtil.basicSearch(config.dev.es.indexName, config.dev.es.type, dictionaryKeywords, unMatchedKeywords, arrAliases, arrSynonyms, function (err, result) {
        callback(err, result);
    });
};
ElasticSearchModel.prototype.findOne = function (params, id, callback) {
    if (params && params.source && params.source.isResume) {
        esUtil.isDocumentExist(config.dev.es.indexName, config.dev.es.type, id, function (err, exist) {
            callback(err, {resume: exist});
        });
    } else {
        esUtil.isDocumentExist(config.dev.es.indexName, config.dev.es.type, id, function (err, exist) {
            if (exist) {
                esUtil.displayDocument(config.dev.es.indexName, config.dev.es.type, id, function (err, display) {
                    params && params.source ? params.source['status'] = true : params;
                    resumes.findOne(params, id, function (err, data) {
                            if (err) {
                                callback(err, data);
                            } else if (data) {
                                delete   data._doc.lastmoddatetime;
                                delete   data._doc.lastmoduserid;
                                delete   data._doc.__v;
                                display.meta_data = data;
                                callback(err, display);
                            } else {
                                display.meta_data = {};
                                callback(err, display);
                            }
                        }
                    )
                });
            } else {
                callback(err, null);
            }
        });
    }
};
ElasticSearchModel.prototype.getTimeLineData = function (params, id, callback) {
    var dates = [], millis, type, expInMonths, start, diff, end, startInMillis, endInMillis, nowDate, skillDays, sortedDates = [], skills = [], Experience = {}, totalExperience, skillsArr = [], skillExpInDays = [], skillExp = [], work = [], totalWorkingYears = [], s, daysDiff = [], currWorkDate, monthStart, monthEnd, days, monthLength, months, years, workStarted, maxYear, minYear, yAppendix, mAppendix, dAppendix;
    this.findOne(params, id, function (err, data) {
        if (data) {
            sortedDates = data.work.sort(function (a, b) {
                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            });
            _.forEach(data.skills, function (v) {
                _.forEach(v.keywords, function (v) {
                    skillsArr.push(v.toUpperCase());
                })
            });
            sortedDates.forEach(function (v, k) {
                if (!k && !v.startDate || !v.startDate && !v.endDate || v.startDate === "Invalid date") {
                    if (!v.startDate && !v.endDate && k > 0) {
                        v.startDate = sortedDates[k - 1].endDate;
                        if (k === sortedDates.length - 1 && !v.endDate) {
                            nowDate = new Date();
                            v.endDate = nowDate.getDate() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getFullYear();
                        }
                    } else if (!v.startDate && !k || v.startDate === "Invalid date" && !k) {
                        if (!v.endDate) {
                            if (sortedDates[k + 1]) {
                                v.endDate = sortedDates[k + 1].startDate
                            } else {
                                v.endDate = "";
                                v.startDate = "";
                            }
                        }
                        if (v.endDate) {
                            v.startDate = moment(v.endDate,["MM/DD/YYYY", "DD-MMM-YYYY", "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]); //minus one year
                            v.startDate = v.startDate.add(-6, 'months')
                        }
                    } else {
                        v.endDate = "";
                        v.startDate = "";
                    }
                } else if (k === sortedDates.length - 1 && !v.endDate) {
                    nowDate = new Date();
                    v.endDate = nowDate.getDate() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getFullYear();
                } else if (!v.startDate) {
                    v.startDate = sortedDates[k - 1].endDate
                } else if (!v.endDate && k !== sortedDates.length - 1) {
                    v.endDate = sortedDates[k + 1].startDate
                }
                if (v.startDate && v.endDate) {
                    work.push({
                        startDate:  moment(v.startDate,["MM/DD/YYYY", "DD-MMM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]).isValid()? v.startDate : false ,
                        endDate:  moment(v.endDate,["MM/DD/YYYY", "DD-MMM-YYYY", "MM-DD-YYYY", "DD-MM-YYYY", "YYYY-MM-DD"]).isValid()? v.endDate : false ,
                        company: v.company ? v.company : '',
                        position: v.position ? v.position : ''
                    });
                }
                _.forEach(skillsArr, function (skill) {
                    if (v.summary && v.summary.toUpperCase().indexOf(skill) >= 0) {
                        skillExp.push({skill: skill, "yearsIndex": k});
                    }
                });
                _.forEach(sortedDates, function (v) {
                    if (v.startDate || v.endDate) {
                        dates.push(v.startDate, v.endDate);
                    }
                });
            });
            _.uniqWith(skillExp, _.isEqual).forEach(function (val, k) {
                start = new Date(moment(work[val.yearsIndex].startDate, ["MM/DD/YYYY", "DD-MMM-YYYY", "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]));
                end = new Date(moment(work[val.yearsIndex].endDate, ["MM/DD/YYYY", "DD-MMM-YYYY", "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]));
                startInMillis = start.getTime();
                endInMillis = end.getTime();
                millis = endInMillis - startInMillis;
                diff = new moment.duration(millis || 0);
                days = Number.isNaN(diff.asDays()) ? diff.asDays() : 0 ;
                skillExpInDays.push({"skill": val.skill, "days": days})
            });
            skillDays = _.groupBy(skillExpInDays, 'skill');
            for (var a in skillDays) {
                expInMonths = (_.sumBy(skillDays[a], 'days') / 31).toPrecision(2);
                expInMonths.split('.')[1] === '0' ? (expInMonths = expInMonths.split('.')[0]) && (type = "month") : expInMonths && (type = "months");
                skills.push({name: a, experience: expInMonths, type: type});
            }
            dates.forEach(function (date) {
                if (date) {
                    s = new Date(moment(date, ["MM/DD/YYYY", "DD-MMM-YYYY", "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"]));
                    millis = s.getTime();
                    if (millis)
                        daysDiff.push(millis);
                }
            });
            currWorkDate = new Date(Math.max.apply(null, daysDiff));
            workStarted = new Date(Math.min.apply(null, daysDiff));
            if (currWorkDate && workStarted)
                totalExperience = getTotExp(workStarted, currWorkDate);
            if (sortedDates[sortedDates.length - 1])
                totalWorkingYears.push({"workStarted": moment(sortedDates[0].startDate, ["MM/DD/YYYY", "DD-MMM-YYYY", "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"])}, {"currWorkDate": moment(sortedDates[sortedDates.length - 1].endDate, ["MM/DD/YYYY", "DD-MMM-YYYY", "DD-MM-YYYY", "MM-DD-YYYY", "YYYY-MM-DD"])});
            Experience.totalExperience = totalExperience;
            Experience.totalWorkingYears = totalWorkingYears;
            Experience.work = work;
            Experience.skills = skills;
            if (data.education)
                Experience.education = data.education;
        }
        function getTotExp(workStarted, currWorkDate) {
            maxYear = new Date(Date.UTC(currWorkDate.getUTCFullYear(), currWorkDate.getUTCMonth(), currWorkDate.getUTCDate()));
            minYear = new Date(Date.UTC(workStarted.getUTCFullYear(), workStarted.getUTCMonth(), workStarted.getUTCDate()));
            days = maxYear.getDate() - minYear.getDate();
            if (days < 0) {
                maxYear.setMonth(maxYear.getMonth() - 1);
                days += DaysInMonth(maxYear);
            }
            months = maxYear.getMonth() - minYear.getMonth();
            if (months < 0) {
                maxYear.setFullYear(maxYear.getFullYear() - 1);
                months += 12;
            }
            years = maxYear.getFullYear() - minYear.getFullYear();
            if (years > 1) yAppendix = " years";
            else yAppendix = " year";
            if (months > 1) mAppendix = " months";
            else mAppendix = " month";
            if (days > 1) dAppendix = " days";
            else dAppendix = " day";
            if (years || months || days) {
                return years + yAppendix + ", " + months + mAppendix + ", and " + days + dAppendix + " experience.";
            } else {
                return null;
            }
        }

        function DaysInMonth(maxYear) {
            monthStart = new Date(maxYear.getFullYear(), maxYear.getMonth(), 1);
            monthEnd = new Date(maxYear.getFullYear(), maxYear.getMonth() + 1, 1);
            monthLength = (monthEnd - monthStart) / (1000 * 60 * 60 * 24);
            return monthLength;
        }

        if (Experience && !_.isEmpty(Experience)) {
            callback(err, Experience);
        } else {
            callback(err, null);
        }
    });
};

ElasticSearchModel.prototype.filter = function (value, callback) {
    removeObjectProperties(value, ["type", "lastmoddatetime", "lastmoduserid"]);
    esUtil.filter(config.dev.es.indexName, config.dev.es.type, value, function (err, result) {
        callback(err, result);
    });
};
var removeObjectProperties = function (obj, props) {
    for (var i = 0; i < props.length; i++) {
        if (obj.hasOwnProperty(props[i])) {
            delete obj[props[i]];
        }
    }
};
ElasticSearchModel.prototype.create = function (value, callback) {
    if (value.type && value.type.toLowerCase() === 'filteringbyfield') {
        this.filter(value, callback);
    } else if (value.type && value.type.toLowerCase() === 'advancesearch') {
        this.searchWithDetails(value, callback);
    } else {
        esUtil.addDocument(config.dev.es.indexName, config.dev.es.type, value, function (err, bindingData) {
            if (err) {
                callback(err, bindingData);
            } else if (bindingData && bindingData._id) {
                var data = {};
                data.resumeId = bindingData._id;
                data.lastmoddatetime = new Date().toISOString();
                data.lastmoduserid = value.lastmoduserid;
                resumes.create(data, function (err, resumesResult) {
                    if (err) {
                        callback(err, null);
                    } else if (resumesResult && resumesResult.resumeId) {
                        bindingData.meta_data = resumesResult;
                        data.publicAccess = {
                            "permissions": [
                                "basicInfo"
                            ],
                            "enabled": true
                        };
                        resumePermissions.create(data, function (err) {
                            if (err) {
                                callback(err, null);
                            } else {
                                callback(err, bindingData);
                            }
                        });
                    } else {
                        callback(err, bindingData);
                    }
                });
            }
        });
    }
};
ElasticSearchModel.prototype.searchWithDetails = function (value, callback) {
    removeObjectProperties(value, ["type", "lastmoddatetime", "lastmoduserid"]);
    callback (null, {massage:"not working"});
};
ElasticSearchModel.prototype.update = function (id, data, callback) {
    var metaData=data.meta_data;
    delete data.meta_data;
    esUtil.isDocumentExist(config.dev.es.indexName, config.dev.es.type, id, function (err, exist) {
        if (exist) {
            esUtil.updateDocument(config.dev.es.indexName, config.dev.es.type, id, data, function (err, display) {
                if (metaData && !_.isEmpty(metaData)) {
                    resumes.update(id, metaData, function (err, result) {
                        if (err) {
                            callback(err, null);
                        } else if (result){
                            display.meta_data = result;
                            callback(err, display);
                        } else {
                            var body = {};
                            body.resumeId = id;
                            body.lastmoddatetime = new Date().toISOString();
                            body.lastmoduserid = data.lastmoduserid;
                            resumes.create(body, function (err, res) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    delete   res._doc.lastmoddatetime;
                                    delete   res._doc.lastmoduserid;
                                    delete   res._doc.__v;
                                    display.meta_data = res;
                                    callback(err, display);
                                }
                            });
                        }
                    });
                }else{
                    callback(err, display);
                }
            });
        }
        else {
            callback(err, null);
        }
    });
};
ElasticSearchModel.prototype.remove = function (id, callback) {
    esUtil.isDocumentExist(config.dev.es.indexName, config.dev.es.type, id, function (err, exist) {
        if (exist) {
            esUtil.deleteDocument(config.dev.es.indexName, config.dev.es.type, id, function (err, display) {
                var params = {};
                params.source = {resumeId: id};
                resumes.find(params, function (err, data) {
                    if(err){
                        callback(err, display);
                    }else if (data.length > 0) {
                        resumes.remove(data[0]._id, function (err, result) {
                            if (err) {
                                callback(err, null);
                            } else if (result) {
                                resumePermissions.remove(id, function (err) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(err, display);
                                    }
                                });
                            } else {
                                callback(err, display);
                            }
                        });
                    } else {
                        callback(err, display);
                    }
                })
            });
        } else {
            callback(err, null);
        }
    });
};

ElasticSearchModel.prototype.resumeSkillCount = function (params, callback) {
    esUtil.resumeSkillCount(config.dev.es.indexName, config.dev.es.type, params, function (err, data) {
        callback(err, data);
    })
};

module.exports = ElasticSearchModel;
