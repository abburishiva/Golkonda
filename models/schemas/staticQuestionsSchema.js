var StaticQuestionsSchema = {
    questions: {
        type: {type: String},
        count: {type: Number},
        list: []
    },
    level: {
        name: {type: String},
        id: {type: Number}
    },
    subject: [{
        name: {type: String},
        id: {type: Number}
    }],
    quiz: {
        name: [{
            type:{type:String}}],
        makeChallenge: {type: String},
        limit: {type: Number},
        totaltime: {type: Number}
    },
    levelParams: [],
    emp_id: {type: String},
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
}
module.exports = StaticQuestionsSchema;

