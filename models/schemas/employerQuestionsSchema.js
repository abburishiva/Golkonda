var employeeQuestionsModel = {
    question_id: {type: Number},
    emp_id: {type: String},
    choice_options: [],
    subject: {
        id: {type: Number},
        subject_id: {type: Number},
        category_id: {type: Number},
        name: {type: String},
        description: {type: String}
    },
    common_level: {
        id: {type: Number},
        name: {type: String}
    },
    questiontype: {type: String},
    question: {type: String},
    hint: {type: String},
    preparetime: {type: Number},
    testcases: {type: String},
    template: {type: String},
    answer: {type: String},
    time: {type: Number},
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};
module.exports = employeeQuestionsModel;