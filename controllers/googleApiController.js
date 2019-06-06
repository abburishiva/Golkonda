var GoogleApiUtils = require('./../utils/googleApiUtils');

function GoogleApiController(){
    this.gau = new GoogleApiUtils();
}
GoogleApiController.prototype.getAll = function(req, res, next){
    this.gau.find(req.body, function(err, result){
        if(err){
            return next({status: 500, error: err});
        }else{
            res.status(200).json(JSON.parse(result));
        }
    });
};

module.exports = GoogleApiController;