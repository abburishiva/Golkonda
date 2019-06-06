var newsLetterSchema = {
    subject: {type: String},
    schedule_time: {type: Date},
    send_time: {type: Date},
    content: {type: String},
    lastmoddatetime: {type: Date},
    lastmoduserid: {type: String}
};
module.exports = newsLetterSchema;
