var userReviewsSchema = {
    name: {type: String},
    company: {type: String},
    candidateId: {type: String},
    employerId: {type: String},
    imageClass: {type: String},
    message: {type: String},
    rating: {type: String},
    isPublic: {type: Boolean, default: false},
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};
module.exports = userReviewsSchema;