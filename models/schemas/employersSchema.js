var employersSchema = {
    user_profile: {
        email: {type: String},
        name: {type: String},
        phone: {type: String},
        picture_link: {type: String},
        picture_blob: {type: String}
    },
    source_details: {
        username: {type: String},
        password: {type: String},
        source: {type: String}
    },
    employer_details: {
        country_name: {type: String},
        company_size: {type: String},
        company_name: {type: String},
        job_title: {type: String},
        requiredSkills: [],
        chooseTalentScreenType: []
    },
    auth_details: {
        is_super: {type: Boolean, default: false},
        is_user_verified: {type: String, default: 'N'},
        first_login_completed: {type: String, default: 'N'},
        last_verification_code: {type: String, default: 'N'},
        registereddatetime: {type: Date, default: Date}
    },
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};

module.exports = employersSchema;