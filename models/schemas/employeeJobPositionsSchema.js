var employeeJobPositionsSchema = {

    title: {type: String},
    location: {
        State: {type: String},
        Country: {type: String},
        PostalCode: {type: String},
        City: {type: String},
        Name: {type: String}
    },
    experience: {
        total: {type: Number},
        units: {type: String}
    },
    type: {type: String},
    baseSalary: {
        value: {
            minValue: {type: Number},
            maxValue: {type: Number},
            value : {type: Number},
            currency: {type: String},
            unitText: {type: String}
        }
    },
    organisation: {
        name: {type: String},
        level: {type: String},
        manpower: {type: String},
        url: {type: String}
    },
    description: {type: String},
    duration: {
        total: {type: Number},
        units: {type: String}
    },
    primary_email: {type: String},
    education: {type: String},
    url: {type: String},
    skills: [],
    emails: [],
    phones: [],
    fax: {type: String},
    categories: {},
    reference_id: {type: String},
    employer: {
        name: {type: String},
        identifier: {type: Number},
        apply_url: {type: String}
    },
    must_have_skills: {type: String},
    nice_to_have_skills: {type: String},
    Educational_requirement: {type: String},
    special_commitments: {type: String},
    incentives_compentation: {type: String},
    job_benifits: [],
    posted_on: {type: Date},
    valid_through: {type: Date},
    linkedin: {type: String},
    emp_id: {type: String},
    totalPositions: {type: Number},
    category: {type: String},
    metadata: {
        x_parsed_by: {type: String},
        content_encoding: {type: String},
        content: {type: String},
        content_type: {type: String}
    },
    lastmoduserid: {type: String},
    lastmoddatetime: {type: Date}
};
module.exports = employeeJobPositionsSchema;
