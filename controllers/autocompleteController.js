var AutoCompleteModel = require("../models/autocompleteModel"),
    CommonController = require('../utils/controllerUtil'),
    acm, controllerUtil;

function AutoComplete() {
    acm = new AutoCompleteModel();
    controllerUtil = new CommonController();
}

AutoComplete.prototype.getAll = function (req, res, next) {
    controllerUtil.get(acm, req, res, next);
};

module.exports = AutoComplete;