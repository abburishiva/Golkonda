var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    sendEmailSchema = new Schema({
        email: {type: String},
        access: {
            public: {type: Boolean, default: false},
            screenSharing: {type: Boolean, default: false},
            collaboration: {type: Boolean, default: false},
            live: {type: Boolean, default: false}
        }
    }, {_id: false}),
    questionsSchema = new Schema({
        id:{type: Number},
        subjectid:{type: Number},
        questiontype: {type: String},
        preparetime: {type: Number},
        time: {type: Number},
        weightage: {type: Boolean},
        tested: {type: Boolean},
        approved: {type: Boolean},
        reviewed: {type: Boolean},
        user: {type: Boolean},
        explanation: {type: String},
        answer: {type: String},
        choice6: {type: String},
        choice5: {type: String},
        choice4: {type: String},
        choice3: {type: String},
        choice2: {type: String},
        choice1: {type: String},
        question: {type: String},
        template: {type: String},
        testcases: {type: String},
        hint: {type: String}
    }, {_id: false}),
    employerInterviewSchema = {
        emp_id: {type: String},
        shortUid: {type: String},
        email: {type: String},
        definition: {
            id: {type: String},
            name: {type: String}
        },
        sendEmail: [sendEmailSchema],
        interviewStartDateTime: {type: String},
        interviewExpiredDateTime: {type: String},
        events: [],
        subject: [],
        access: {
            public: {type: Boolean, default: false},
            screenSharing: {type: Boolean, default: false},
            collaboration: {type: Boolean, default: false},
            live: {type: Boolean, default: false}
        },
        positionDetails: {
            experience: {type: String},
            company: {
                name: {type: String},
                location: {type: String},
                phone: {type: String}
            },
            position: {type: String},
            positionType: {type: String},
            noOfPositions: {type: Number},
            description: {type: String},
            skills: []
        },
        questions: {
            type: {type: String},
            source: {type: String},
            list: [questionsSchema]
        },
        detail: {},
        types: [],
        lastmoddatetime: {type: Date},
        lastmoduserid: {type: String}
    };
module.exports = employerInterviewSchema;
