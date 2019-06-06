var challengesSchema = {
    candidate_id: {type: String},
    email: {type: String},
    user_agent: {},
    questions: [],
    level: {
        name: {type: String},
        id: {type: Number}
    },
    subject: {
        id: {type: Number},
        name: {type: String},
        icon: {type: String}
    },
    quiz: {
        name: {type: String},
        quizName: {type: String},
        makeChallenge: {type: String}
    },
    collabarateId: {type: String},
    collabaration: {type: Boolean},
    correct: {type: Number, default: 0},
    attempted: {type: Number, default: 0},
    time_taken: {type: Number, default: 0},
    total_time: {type: Number, default: 0},
    youtube_id: {audio: {type: String}, video: {type: String}},
    is_screen_sharing: {type: Boolean, default: false},
    screen_sharing_id: {type: String},
    challengedatetime: {type: Date},
    location: {type: String},
    browser: {type: String},
    definationDetails: {
        emp_id: {type: String},
        definitionId: {type: String},
        interviewerEmail: {type: String},
        interviewerName: {type: String},
        interviewName: {type: String},
        access: {
            live: {type: Boolean},
            collaboration: {type: Boolean},
            collabarateId: {type: String},
            screenSharing: {type: Boolean},
            screen_sharing_id: {type: String},
            public: {type: Boolean}
        },
        events: [],
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
        }
    },
    geo_location: {
        ip_address: {type: String}
    },
    public_view: {
        status: {type: Boolean, default: true},
        likes: {type: Number, default: 0},
        review: {type: Number, default: 0}
    },
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};

module.exports = challengesSchema;