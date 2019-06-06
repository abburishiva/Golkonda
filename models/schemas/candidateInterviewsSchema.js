var candidateInterviewsSchema = {
    email: {type: String},
    candidate_id: {type: String},
    user_agent: {},
    questions: [],
    level: {
        id: {type: Number},
        name: {type: String}
    },
    subject: [],
    quiz: {
        name: [],
        makeChallenge: {type: String},
        limit: {type: Number},
        totaltime: {type: Number}
    },
    interviewDetail: {
        emp_id: {type: String},
        definitionId: {type: String},
        interviewId: {type: String},
        allowTime: {type: Number},
        interviewerEmail: {type: String},
        interviewerName: {type: String},
        interviewType: {type: String},
        interviewStartDateTime: {type: Date},
        interviewExpiredDateTime: {type: Date},
        rescheduled: {type: Boolean, default: false},
        rescheduledConfirm: {type: Boolean, default: false},
        access: {
            live: {type: Boolean},
            collaboration: {type: Boolean},
            collabarateId: {type: String},
            screenSharing: {type: Boolean},
            screen_sharing_id: {type: String},
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
        retake: {type: Boolean, default: false},
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
    screenSharingVideoId: {type: String},
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
    feedback: {type: String},
    rating: {type: Number},
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};
module.exports = candidateInterviewsSchema;
