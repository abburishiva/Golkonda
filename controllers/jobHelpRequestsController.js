var JobHelpRequestsModel = require('../models/mongoModels/jobHelpRequestsModel'),
    CommonController = require('../utils/controllerUtil'),
    jwt = require('jsonwebtoken'),
    _ = require('lodash'),
    controllerUtil,
    jhrm;
function JobHelpRequestsController() {
    jhrm = new JobHelpRequestsModel();
    controllerUtil = new CommonController();
}
JobHelpRequestsController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(jhrm, req, res, next);
};
JobHelpRequestsController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(jhrm, req, res, next);
};
JobHelpRequestsController.prototype.create = function (req, res, next) {
    if(!req.body.user_profile.email){
        res.status(400).json({status:400, message:"please Enter email"})
    }else if(!req.body.user_profile.phone_number){
        res.status(400).json({status:400, message:"please Enter phoneNumber"})
    }else if(!req.body.user_profile.name){
        res.status(400).json({status:400, message:"please Enter name"})
    }else if(!req.body.user_profile.password){
        res.status(400).json({status:400, message:"please Enter password"})
    }else {
        jhrm.create(req.body,function(err,data){
            if(err){
                res.send(err)
            }else if(data && !data.user_profile && !data.user_profile.email){
                res.status(400).json(data)
            }else{
                res.status(201).json(data)
            }
        })
    }
};
JobHelpRequestsController.prototype.update = function (req, res, next) {
    controllerUtil.update(jhrm, req, res, next);
};
JobHelpRequestsController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(jhrm, req, res, next);
};
JobHelpRequestsController.prototype.login = function (req, res) {
    var token;
    jhrm.login(req.body, function (err, data) {
        if (err) {
            res.send(err);
        } else {
            if(data && (data.email === req.body.email && data.password === req.body.password)){
                token = jwt.sign(data._doc,'TalentJobHelpRequests',{
                    expiresIn: 60 * 60 * 12
                });
                res.status(200).send(JSON.stringify({
                    message: "Authentication Successful",
                    status: 200,
                    userData: _.omit(data._doc, ["password"]),
                    token: token
                }));
            }else{
                res.status(403).send(JSON.stringify({"message": "Unauthorized"}));
            }

        }
    });
};

module.exports = JobHelpRequestsController;
