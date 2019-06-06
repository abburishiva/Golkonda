var resumePermissionsSchema = {
    resumeId: {type: String},
    longUid: {type: String},
    publicAccess: {
        enabled: {type: Boolean, default: true},
        permissions: []
    },
    privateAccess: [{
        email: {type: String},
        privacyAccessIsEnable: {type: Boolean, default: false},
        resumeRequest :  {type: Boolean, default: false},
        lastmoddatetime: {type: Date}
    }],
    requests:[],
    lastmoduserid: {type: String},
    lastmoddatetime: {type: Date}
};
module.exports = resumePermissionsSchema;