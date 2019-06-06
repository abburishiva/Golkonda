var JobPostingsModel = require('../models/jobPostingsModel');

function JobPostingsController() {
    this.model = new JobPostingsModel();
}

JobPostingsController.prototype.get = function (req, res) {
    this.model.findAll(req, function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else if (data && (data.status || data.message)) {
            data.message = data.message ? data.message : 'Bad Request';
            res.status(400).json({status: 400, message: data.message});
        } else if (data.hits.total <= 0) {
            res.status(204).json({status: 204, msg: "Data not found"});
        } else {
            res.header('X-TOTAL-COUNT', data.hits.hits.length);
            res.status(200).json(data.hits.hits);
        }
    });
};
JobPostingsController.prototype.getById = function (req, res) {
    this.model.getById(req.params.id, function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else if (!data) {
            res.status(204).json({status: 204, msg: "Record not found"});
        } else {
            res.status(200).json(data);
        }
    });
};
JobPostingsController.prototype.create = function (req, res) {
    if (req && req.decoded) {
        req.body.lastmoduserid = req.decoded._id;
    }
    req.body.lastmoddatetime = new Date().toISOString();
    this.model.create(req.body, function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else if (data && (data.status || data.message)) {
            res.status(400).json(data);
        } else {
            res.status(201).json(data);
        }
    });
};
JobPostingsController.prototype.update = function (req, res) {
    if (req && req.decoded) {
        req.body.lastmoduserid = req.decoded._id;
    }
    req.body.lastmoddatetime = new Date().toISOString();
    this.model.update(req.params.id, req.body, function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else if (!data) {
            res.status(204).json({status: 204, msg: "Record not found"});
        } else {
            res.status(200).json(data);
        }
    });
};
JobPostingsController.prototype.remove = function (req, res) {
    this.model.remove(req.params.id, function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else if (!data) {
            res.status(404).json({status: 404, msg: "Record not found"});
        } else {
            res.status(204).json(data);
        }
    });
};

JobPostingsController.prototype.getFilterDataCount = function (req, res) {
    this.model.getData(req, function (err, data) {
        if (err) {
            res.status(500).json(err);
        } else {
            res.status(200).json(data);
        }

    })
};

module.exports = JobPostingsController;

