var candidateSchema = {
    user_profile: {
        email: {type: String},
        name: {type: String},
        phone: {type: String},
        picture_link: {type: String},
        picture_blob: {type: String},
        country_name: {type: String},
        education: {type: String},
        address: {type: String},
        candidate_role: [],
        work_status: {type: String},
        preferred_location: {type: String},
        preferred_industry: {type: String},
        years_of_experience: {type: String},
        skills_interested: [],
        skills_update: {type: Boolean,  default: true},
        jobs_skills: {type: Boolean , default:true},
        prime: {type: Boolean, default: false}
    },
    source_details: {
        password: {type: String},
        source: {type: String},
        source_id: {type: String},
        username: {type: String}
    },
    auth_details: {
        is_user_verified: {type: String, default: 'N'},
        first_login_completed: {type: String, default: 'N'},
        last_verification_code: {type: String},
        apply_position: {type: String, default: 'N'},
        apply_position_accepted: {type: String, default: 'N'},
        registereddatetime: {type: Date, default: Date}
    },
    resume_id: {type: String},
    selectedTheme: {type: String},
    demo_details: {
        video_demo: {type: Boolean, default: true},
        coding_demo: {type: Boolean, default: true},
        audio_demo: {type: Boolean, default: true},
        typed_demo: {type: Boolean, default: true},
        choice_demo: {type: Boolean, default: true}
    },
    tour_details: {
        video_tour: {type: Boolean, default: true},
        coding_tour: {type: Boolean, default: true},
        choice_tour: {type: Boolean, default: true},
        audio_tour: {type: Boolean, default: true},
        typed_tour: {type: Boolean, default: true}
    },
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};

module.exports = candidateSchema;