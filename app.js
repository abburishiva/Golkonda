//GOLKONDA API
var cluster = require('cluster');
if (cluster.isMaster) {
    var numWorkers = require('os').cpus().length,
        i;
    for (i = 0; i < numWorkers; i++) {
        cluster.fork();
    }
    cluster.on('exit', function () {
        setTimeout(function () {
            cluster.fork();
        }, 5000);
    });
} else {
    var express = require('express'),
        compression = require('compression'),
        path = require('path'),
        methodOverride = require('method-override'),
        bodyParser = require('body-parser'),
        mongoose = require('mongoose'),
        config = require('./config/config.json'),
        Logger = require('./utils/winston/logModule'),
        app = express(),
        async = require('async'),
        helmet = require('helmet'),
        log = new Logger(),
        mongoHost = config.dev.mongodb.host,
        portListen = config.listen,
        redis = require('redis'),
        mongoDbUri = 'mongodb://' + config.dev.mongodb.username + ':' + config.dev.mongodb.password + '@' + mongoHost + '/talentdb';
    if (process.env.ENVTYPE === 'docker') {
        setTimeout(function () {
            async.apply(mongoose.connect(mongoDbUri, {
                useMongoClient: true
            }));
        }, 60000)
    } else {
        async.apply(mongoose.connect(mongoDbUri, {
            useMongoClient: true
        }));
    }
    mongoose.connection.on('connected', function () {
        log.info('Mongoose default connection open to ' + mongoDbUri);
    });
    mongoose.connection.on('error', function (err) {
        log.error('Mongoose default connection error: ' + err);
    });
    mongoose.connection.on('disconnected', function () {
        log.info('Mongoose default connection disconnected');
    });
    process.on('SIGINT', function () {
        mongoose.connection.close(function () {
            log.info('Mongoose default connection disconnected through app termination');
            process.exit(0);
        });
    });
    client = redis.createClient(config.redis.port, config.redis.host);
    client.on('connect', function () {
        log.info('redis connected');
    });
    client.on("error", function (err) {
        log.error(err);
        client.quit();
    });
    process.on('exit', function () {
        log.info('process exit');
        process.exit();
    });
    process.on('sigint', function () {
        log.info('process sigint');
    });
    process.on('uncaughtException', function (err) {
        log.error("uncaughtException" + err);
    });
    app.use(function (req, res, next) {
        log.info("this is request headers function..!");
        if (process.env.ENVTYPE === 'docker') {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS, HEAD");
            res.header("Access-Control-Expose-Headers", "X-TOTAL-COUNT");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,X-TOTAL-COUNT, X-access-token");
        }
        if (req.url.substr(-1) === '/') {
            log.info("Welcome To TalentScreen.!");
            return res.send({
                message: "Welcome To TalentScreen!"
            });
        }
        next();
    });

    function parallel(middlewares) {
        return function (req, res, next) {
            async.each(middlewares, function (mw, cb) {
                mw(req, res, cb);
            }, next);
        };
    }

    app.use(parallel([
        compression(),
        helmet(),
        methodOverride('X-HTTP-Method'),
        methodOverride('X-HTTP-Method-Override'),
        methodOverride('X-Method-Override'),
        methodOverride('_method'),
        bodyParser.json({limit: '1000mb', extended: true}),
        bodyParser.urlencoded({limit: '1000mb', extended: true})
    ]));
// ROUTER
    app.use('/v1', require('./routes'));
    app.listen(portListen);
    app.use(function (err, req, res, next) {
        log.info("This is error handling function");
        log.error(req, err);
        res.status(err.status).send(err);
    });
    module.exports = app;
}