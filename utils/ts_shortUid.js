var randomString = require("randomstring"),
    _ = require('lodash'),
    generateUID, uniqueId;

function generateFinalUniqueId(shortUid, increment, max, baseUrl, commonModel, results, callback) {
    var shortUid_list = results.map(function (item) {
        return item.shortUid;
    });
    var finalBoolean = _.some(shortUid_list, _.method('match', shortUid));
    if (finalBoolean) {
        var refreshId = shortUid.split(/(\d+)/).filter(Boolean);
        if (refreshId.length > 1) {
            if (parseInt(refreshId[1])) {
                uniqueId = refreshId[0] + ((parseInt(refreshId[1]) < 9 ? '0' + (parseInt(refreshId[1]) + increment) : (parseInt(refreshId[1]) + increment)))
            } else {
                uniqueId = refreshId[0] + (refreshId[1] + '01')
            }
        } else {
            uniqueId = refreshId[0] + '01'
        }
        if (uniqueId.length > max) {
            var shortStr = uniqueId.split(/(\d+)/).filter(Boolean);
            if (shortStr.length > 1) {
                if (parseInt(shortStr[1])) {
                    uniqueId = shortStr[0].slice(0, max - shortStr[1].length) + shortStr[1];
                } else {
                    uniqueId = shortStr[0] + shortStr[1].slice(0, max - shortStr[0].length);
                }
            } else {
                uniqueId = shortStr[0].slice(0, max);
            }
        }
        return search(uniqueId.toLowerCase(), increment, 14, baseUrl, commonModel, callback);
    } else {
        return callback(shortUid.toLowerCase());
    }
}

function search(shortUid, increment, max, baseUrl, commonModel, callback) {
    client.hgetall(baseUrl, function (err, cacheData) {
        if (cacheData && cacheData['0']) {
            generateFinalUniqueId(shortUid, increment, max, baseUrl, commonModel, JSON.parse(cacheData['0']), callback);
        } else {
            commonModel.find({}, function (err, results) {
                generateFinalUniqueId(shortUid, increment, max, baseUrl, commonModel, results, callback);
            });
        }
    });
}
generateUID = function (min, median, max, primaryArray, secondaryArray) {
    var shortUid, randomNumbers = Math.floor(100000 + Math.random() * 900000);
    if (primaryArray.length > 1 && primaryArray[1].length > 0 && primaryArray[0].length > 0 && (primaryArray[0].length > min || primaryArray[1].length > min)) {
        if (primaryArray[1].length > min) {
            if (primaryArray[1].length < max) {
                shortUid = primaryArray[0].charAt(0) + primaryArray[1];
            } else {
                shortUid = primaryArray[0].charAt(0) + primaryArray[1].slice(0, 13);
            }
        } else if (primaryArray[0].length > min) {
            if (primaryArray[0].length < max) {
                shortUid = primaryArray[1].charAt(0) + primaryArray[0];
            } else {
                shortUid = primaryArray[1].charAt(0) + primaryArray[0].slice(0, 13);
            }
        }
    } else if (secondaryArray.length > 1 && secondaryArray[1].length > 0 && secondaryArray[0].length > 0 && (secondaryArray[1].length > min || secondaryArray[0].length > min)) {
        if (secondaryArray[1].length > min) {
            if (secondaryArray[1].length < max) {
                shortUid = secondaryArray[0].charAt(0) + secondaryArray[1];
            } else {
                shortUid = secondaryArray[0].charAt(0) + secondaryArray[1].slice(0, 13);
            }
        } else if (secondaryArray[0].length > min) {
            if (secondaryArray[0].length < max) {
                shortUid = secondaryArray[1].charAt(0) + secondaryArray[0];
            } else {
                shortUid = secondaryArray[1].charAt(0) + secondaryArray[0].slice(0, 13);
            }
        }
    } else if (primaryArray[0].length >= secondaryArray[0].length && primaryArray[0].length > min) {
        if (primaryArray[0] < max) {
            shortUid = primaryArray[0];
        } else {
            shortUid = primaryArray[0].slice(0, max);
        }
    } else if (secondaryArray[0].length > primaryArray[0].length && secondaryArray[0].length > min) {
        if (secondaryArray[0] < max) {
            shortUid = secondaryArray[0];
        } else {
            shortUid = secondaryArray[0].slice(0, max);
        }
    } else {
        shortUid = randomString.generate({
            length: 8,
            charset: 'alphanumeric'
        });
    }
    if (shortUid.length < median) {
        if (shortUid.length === 6) {
            shortUid += randomNumbers.toString().slice(0, median - (shortUid.length - 1));
        } else {
            shortUid += randomNumbers.toString().slice(0, median - shortUid.length);
        }
    }
    return shortUid.toLowerCase();
};

function generateShortUid(params, callback) {
    var dynamicId = generateUID(params.min, params.median, params.max, params.primaryArray, params.secondaryArray)
    search(dynamicId, 1, params.max, params.baseUrl, params.commonModel, function (result) {
        return callback(result);
    });
}
module.exports = generateShortUid;

