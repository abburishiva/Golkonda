var employersSubjectSchema = {
    emp_id: {type: String},
    name: {type: String},
    description: {type: String},
    template: {type: String},
    codemirror_theme: {type: String},
    category: {
        id: {type: Number},
        name: {type: String},
        description: {type: String},
        alias: {type: String}
    },
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};
module.exports = employersSubjectSchema;