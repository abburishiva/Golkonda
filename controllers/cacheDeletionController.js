var CacheUtil = require('../utils/cache/cacheUtil'),
    cache;
function CacheDeletionController() {
    cache = new CacheUtil();
}
CacheDeletionController.prototype.remove = function (req, res, next) {
    cache.removeRoutes(req, res, next);
};
module.exports = CacheDeletionController;