var resumeSchema = {
    resumeId: {type: String},
    longUid: {type: String},
    shortUid: {type: String},
    resume_downloads:{type:Number,default: 0},
    feedbacks: [],
    average_rating:0,
    lastmoduserid: {type: String},
    lastmoddatetime: {type: Date}
};
module.exports = resumeSchema;
