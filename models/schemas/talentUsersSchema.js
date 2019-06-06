var talentUsersSchema = {
    sourceEmail: {type: String},
    profileLink: {type: String},
    source: {type: String},
    candidateId: {type: String},
    employerId: {type: String},
    lastmoddatetime: {type: Date, default: new Date().toISOString()}
};

module.exports = talentUsersSchema;