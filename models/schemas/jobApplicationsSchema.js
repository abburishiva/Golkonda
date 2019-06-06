var jobApplicationsSchema = {
    candidate_id: {type: String},
    job_id: {type: String},
    resume_id:{type:String},
    job_applied_date: {type: Date},
    lastmoduserid: {type: String},
    lastmoddatetime: {type: Date}
};
module.exports = jobApplicationsSchema;