var CodeCompilerUtil = require('../utils/codeCompilerUtil'),
    CommonController = require('../utils/controllerUtil'),
    Logger = require('../utils/winston/logModule'),
    ccu,
    log,
    controllerUtil;

function CodeCompilerController() {
    ccu = new CodeCompilerUtil();
    controllerUtil = new CommonController();
    log = new Logger();
}

CodeCompilerController.prototype.getAll = function (req, res, next) {
    controllerUtil.get(ccu, req, res, next);
};
CodeCompilerController.prototype.getById = function (req, res, next) {
    controllerUtil.getById(ccu, req, res, next);
};
CodeCompilerController.prototype.create = function (req, res, next) {
    controllerUtil.create(ccu, req, res, next);
};
CodeCompilerController.prototype.update = function (req, res, next) {
    controllerUtil.update(ccu, req, res, next);
};
CodeCompilerController.prototype.remove = function (req, res, next) {
    controllerUtil.remove(ccu, req, res, next);
};
CodeCompilerController.prototype.compile = function (req, res) {
    log.info('info at CodeCompilerController compile funnction and req is');
    ccu.compile(req.body, function (err, results) {
        if (err) {
            log.error(err.code);
            res.status(err.code).send(err);
        } else {
            if (!results) {
                return res.status(404).send({message: 'no records found'});
            }
            log.info('info at CodeCompilerController compile funnction and result is');
            res.status(200).send(results);
        }
    });
};
module.exports = CodeCompilerController;
