var SwaggerExpress = require('swagger-express-mw'),
    app = require('express')(),
    http = require('http'),
    SwaggerUi = require('./././swagger-tools/middleware/swagger-ui'),
    Logger = require('../utils/winston/logModule'),
    server,
    log = new Logger(),
    config = {
        appRoot: __dirname
    };

SwaggerExpress.create(config, function (err, swaggerExpress) {
    log.info("SwaggerExpress.create function....!!!");
    if (err) {
        log.error("swaggerExpress create function:-"+err);
    }
    app.use(function (req, res, next) {
        log.info("welcome to talentscreen docs");
        if (req.url.substr(1)=== '') {
            return res.send({
                message: "Welcome To Talent-Screen API-Documentation"
            });
        }
        next();
    });
    log.info("running the swagger ui here");
    app.use(SwaggerUi(swaggerExpress.runner.swagger));
    log.info("registering the app here");
    swaggerExpress.register(app);
    //server = http.createServer(app).listen(80, function(){
    //    log.error("creating http server :-"+err);
    //});
    app.listen(3000);
});
module.exports = app;