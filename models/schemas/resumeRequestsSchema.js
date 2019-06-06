var resumeRequestSchema = {
    resumeId: {type: String},
    name: {type: String},
    email: {type: String},
    privacyAccessIsEnable: {type: Boolean, default: false},
    resumeRequest: {type: Boolean, default: false},
    lastmoduserid: {type: String},
    lastmoddatetime: {type: Date}
};
module.exports = resumeRequestSchema;