var publicChallengesSchema ={
    email: {type: String},
    candidate_id: {type: String},
    user_agent: {},
    questions_size:{type:Number},
    questions: [],
    isVideo: {type: Boolean},
    isAudio: {type: Boolean},
    level: {
        name: {type: String},
        id: {type: Number}
    },
    subject: [],
    quiz: {
        name: [],
        makeChallenge: {type: String},
        limit: {type: Number},
        totaltime: {type: Number}
    },
    feedback: {type: String},
    rating: {type: Number},
    interviewDetail: {
        emp_id: {type: String},
        interviewId: {type: String},
        definitionId: {type: String},
        allowTime: {type: Number},
        interviewerEmail: {type: String},
        interviewerName: {type: String},
        interviewName: {type: String},
        interviewType: {type: String},
        type: {type: String},
        source: {type: String},
        likes:{type: Number},
        access: {
            live: {type: Boolean},
            collaboration: {type: Boolean},
            public: {type: Boolean}
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
        events: []
    },
    correct: {type: Number, default: 0},
    attempted: {type: Number, default: 0},
    total_time: {type: Number, default: 0},
    time_taken: {type: Number, default: 0},
    youtube_id: {
        audio: {type: String},
        video: {type: String}
    },
    challengeCreatedDatetime: {type: Date, default: Date.now},
    challengeCompletedDatetime: {type: Date},
    location: {type: String},
    browser: {type: String},
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
module.exports = publicChallengesSchema;