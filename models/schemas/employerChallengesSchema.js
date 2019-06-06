var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    subSchema = new Schema({
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
    employerChallengesSchema = {
        emp_id: {type: String},
        definationName: {type: String},
        email: {type: String},
        detail: {
            id: {type: Number},
            name: {type: String},
            makeChallenge: {type: String},
            types: [],
            level: {type: String}
        },
        subject: {
            id: {type: Number},
            name: {type: String},
            type: {type: String}
        },
        access: {
            start_date: {type: String},
            end_date: {type: String},
            public: {type: Boolean, default: true},
            screen_sharing: {type: Boolean, default: false},
            collaboration: {type: Boolean, default: false},
            live: {type: Boolean, default: false}
        },
        questions: {
            source: {type: String},
            type: {type: String},
            list: [subSchema]
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
            noOfPositions: {type: String},
            description: {type: String},
            skills: []
        },
        notifications: {
            type: {type: String},
            events: []
        },
        feedback: {type: String},
        rating: {type: Number},
        lastmoddatetime: {type: Date},
        lastmoduserid: {type: String}
    };

module.exports = employerChallengesSchema;