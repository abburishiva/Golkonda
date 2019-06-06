var ResumesModel = require('../models/resumesModel'),
    Logger = require('../utils/winston/logModule'),
    _ = require('lodash'),
    cvScannerUtil = require('../utils/cvScannerUtil'),
    ESUtil = require('../utils/elasticSearch/esUtil'),
    config = require('../config/config.json'),
    categories,
    totalSkill, cv,
    log,
    model,esUtil;

function ResumesController() {
    model = new ResumesModel();
    log = new Logger();
    cv = new cvScannerUtil();
    esUtil = new ESUtil(config.dev.es_skills.host);
}
ResumesController.prototype.create = function (req, res) {
    log.info("this is ResumesController create ", req);
    model.sendDocument(req, function (err, data) {
        if (err) {
            log.error(req, err);
            res.status(err.code).send(err);
        } else {
            cv.techWords(data, res, function (skillsData) {
                categories = {};
                esUtil.findSkills(config.dev.es_skills.indexName,config.dev.es_skills.type,function(err,dbData){
                    if(err){
                        log.error("err",err);
                    } else {
                        skillsData.forEach(function (resumeValue, resumeKey) {
                            Object.keys(dbData.hits.hits[0]._source.categories).forEach(function (key, value) {
                                if ( resumeValue.category && key === resumeValue.category.toLowerCase()) {
                                    totalSkill = _.union(resumeValue.skills, dbData.hits.hits[0]._source.categories[key].keyskills);
                                    categories[key] = {};
                                    categories[key].keyskills = totalSkill;
                                }
                            })
                        });
                    }
                });
            });
            setTimeout(function () {
                var updateObj={
                    "categories":categories
                };
                esUtil.updateDocument(config.dev.es_skills.indexName,config.dev.es_skills.type,config.dev.es_skills.id,updateObj,function(err,data){
                    if(err){
                        log.error("updateDocument",err);
                    } else {
                        log.info("Update Document Data",data);
                    }
                })
            }, 60000);
            res.send(data);
        }
    });
};
module.exports = ResumesController;
