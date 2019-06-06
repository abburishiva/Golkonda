var Logger = require('../winston/logModule'),
    process = require('../../config/config.json'),
    isLocalMachine = require('../../config/config.json').isLocalMachine,
    log;
function CacheUtil() {
    log = new Logger();
}
var getCacheKey = function (url) {
    return url.replace('?authentication=false&cache=disabled', '').replace('?cache=disabled&authentication=false', '').replace('?cache=disabled', '').replace('?authentication=false', '');
};
CacheUtil.prototype.get = function (baseUrl, url, params, callback) {
    log.info('info at get method in caheUtil.js in cache directive in utils');
    if (params.cache !== 'disabled' || process.env.NODE_ENV === 'production') {
        client.hgetall(baseUrl, function (err, cacheData) {
            if (err) {
                log.error(err);
                if (isLocalMachine)
                    return callback({status: 404});
                else
                    return ({status: 500, error: err});
            }
            var item = getCacheKey(url);
            if (item === '/') {
                item = '0';
            }
            if (cacheData && cacheData[item]) {
                callback(null, JSON.parse(cacheData[item]));
            } else {
                callback({status: 404});
            }
        });
    } else {
        callback({status: 404});
    }
};
CacheUtil.prototype.set = function (baseUrl, url, data) {
    log.info('info at set method in cache directive in utils');
    var item = getCacheKey(url);
    if (item === '/') {
        item = '0';
    }
    client.hmset(baseUrl, item, JSON.stringify(data), function (err) {
        return ({status: 206, error: err});
    });
};
CacheUtil.prototype.delete = function (baseUrl, url) {
    log.info('info at delete method in caheUtil.js in cache directive in utils and no cache data found');
    if (baseUrl === '/v1/questions') {
        client.del('/v1/app/quizzes');
    }
    if (baseUrl === '/v1/candidates_interviews' || baseUrl === '/v1/candidates') {
        client.del('/v1/candidates');
        client.del('/v1/candidates_interviews');
    }
    if(baseUrl === '/v1/user/register'){
        client.del('/v1/candidates');
    }
    if(baseUrl === '/v1/users/reviews'){
        client.del('/v1/users/public/reviews');
    }
    client.del(baseUrl, '0');
    var item = getCacheKey(url);
    if (item !== '0') {
        client.del(baseUrl, item);
    }
};
CacheUtil.prototype.removeRoutes = function (req, res) {
    log.info('info at removeRoutes method in caheUtil.js in cache directive in utils');
    if (req.body.base_url) {
        var route = req.body.delete_url,
            baseUrl = req.body.base_url,
            url,
            last_element;
        if (req.body.type.toLowerCase() === "one") {
            log.info('info at removeRoutes method in caheUtil.js and req for deleting single sub_url on base url');
            if (route === baseUrl) {
                last_element = baseUrl;
            } else {
                url = route.split(baseUrl);
                last_element = url[1];
            }
            client.keys(baseUrl, function (err, cacheBaseUrl) {
                if (err) {
                    log.error(err);
                    return ({status: 500, error: err});
                }
                if (cacheBaseUrl && cacheBaseUrl.length > 0) {
                    client.hkeys(cacheBaseUrl[0].toString(), function (err, subkeys) {
                        function checking(item) {
                            return item === last_element;
                        }

                        if (err) {
                            log.error(err);
                            return ({status: 500, error: err});
                        }
                        if (subkeys.length > 0) {
                            if (subkeys.find(checking)) {
                                client.hdel([cacheBaseUrl[0].toString(), last_element], function (err, reply) {
                                    if (reply === 1) {
                                        log.info('info at removeRoutes method in caheUtil.js and successfully deleted subkey on this base url.');
                                        return res.status(200).send({"msg": "successfully deleted subkey on this base url"});
                                    }
                                });
                            } else {
                                log.info('info at removeRoutes method in caheUtil.js and no subkey fonded  on this base url.');
                                return res.status(404).send({"msg": "No subkeys found on this base url to delete"});
                            }
                        }
                    });
                } else {
                    return res.status(404).send({"msg": "No cacheBaseUrl found to delete"});
                }
            });
        } else if (req.body.type.toLowerCase() === "all") {
            log.info('info at removeRoutes method in caheUtil.js and deleting all sub keys based on base url.');
            client.keys(baseUrl, function (err, basekey) {
                if (basekey.length > 0) {
                    client.del(baseUrl, function (err, subkeys) {
                        if (err) {
                            log.error(err);
                            res.status(500).send(err);
                        }
                        log.info('info at removeRoutes method in caheUtil.js and successfully deleted all sub keys based on base url.');
                        res.status(200).send({"msg": "All routes are deleted based on below route", "route": basekey});
                    });
                } else {
                    log.info('info at removeRoutes method in caheUtil.js and no sub keys found based on base url.');
                    res.status(404).send({"msg": "No route found to delete"});
                }
            });
        }
    } else if (req.body.type.toLowerCase() === "all") {
        log.info('info at removeRoutes method in caheUtil.js and deleting all sub keys based on base url.');
        client.keys('*', function (err, rows) {
            if (rows.length > 0) {
                client.FLUSHDB(function (err, reply) {
                    if (err) {
                        log.error(err);
                        res.status(500).send(err);
                    }
                    log.info('info at removeRoutes method in caheUtil.js and deleting all routes.');
                    res.status(200).send({"msg": "All routes has deleted"});
                });
            } else {
                log.info('info at removeRoutes method in caheUtil.js and No route found to delete.');
                res.status(404).send({"msg": "No route found to delete"});
            }
        });
    }
};
module.exports = CacheUtil;
