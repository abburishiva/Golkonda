var JobHelpRequestsSeekerSchema = {
    user_profile: {
        email: {type: String},
        phone_number:{type:String},
        name:{type:String},
        password:{type:String},
    },
    role:{type:String},
    work_details: {
        skills:{type:Array},
        availability:{type:String},
        completion_date:{type:String},
        communication_mode:{type:Array},
        task_description:{type:String},
    },
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};
module.exports = JobHelpRequestsSeekerSchema;