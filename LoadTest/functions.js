'use strict';

module.exports = {
    generateRandomData,
    employerInterviewsData,
    employersChallenges,
    employerQuestions,
    employerSubjects,
    subjects
};

// Make sure to "npm install faker" first.
const Faker = require('faker');

function generateRandomData(userContext, events, done) {
    // generate data with Faker:
    const name = `${Faker.name.firstName()} ${Faker.name.lastName()}`;
    const email_address = Faker.internet.exampleEmail();
    const password = Faker.internet.password();
    const subjectid = Faker.random.number(1,65);
    const levelid = Faker.random.number(5,10);
    const question = Faker.lorem.words();
    const choice1 = Faker.lorem.words();
    const choice2 = Faker.lorem.words();
    const choice3 = Faker.lorem.words();
    const choice4 = Faker.lorem.words();
    const hint = Faker.lorem.words();
    const description = Faker.lorem.words();
    const boolean = Faker.random.boolean();
    const emp_int_events = Faker.random.arrayElement(["challengeComplete","challengeOpen","challengeStarted"]);
    const id = Faker.random.alphaNumeric(24);
// add variables to virtual user's context:
    userContext.vars.name = name;
    userContext.vars.email_address = email_address;
    userContext.vars.password = password;
    userContext.vars.subjectid = subjectid;
    userContext.vars.levelid = levelid;
    userContext.vars.question = question;
    userContext.vars.choice1 = question;
    userContext.vars.choice2 = choice2;
    userContext.vars.choice3 = choice3;
    userContext.vars.choice4 = choice4;
    userContext.vars.hint = hint;
    userContext.vars.app_type = "talentscreen";
    userContext.vars.type = "string";
    userContext.vars.role = "candidate";
    userContext.vars.message_type = "string";
    userContext.vars.description = description;
    userContext.vars.id = id;
    userContext.vars.boolean = boolean;
// continue with executing the scenario:
    return done();
};

function employerInterviewsData(userContext, events, done) {
    const email_address = Faker.internet.exampleEmail();
    const emp_int_events = Faker.random.arrayElement(["challengeComplete","challengeOpen","challengeStarted"]);
    const type = Faker.random.arrayElement(["schedule","ondemand"]);
    const quiz_type = Faker.random.arrayElement(["choice","coding","video"]);
    const is_verified = Faker.random.arrayElement(["Y","N"]);
    const startDate = Faker.date.future(2);
    const endDate = Faker.date.future(2);
    const expiredTime = Faker.date.future(2);
    const lastmoddatetime = Faker.date.past(10);
    const id = Faker.random.alphaNumeric(24);
    const boolean = Faker.random.boolean();
    userContext.vars.email_address = email_address;
    userContext.vars.type = type;
    userContext.vars.emp_int_events = emp_int_events;
    userContext.vars.quiz_type = quiz_type;
    userContext.vars.startDate = startDate;
    userContext.vars.endDate = endDate;
    userContext.vars.lastmoddatetime = lastmoddatetime;
    userContext.vars.expiredTime = expiredTime;
    userContext.vars.live = boolean;
    userContext.vars.collaboration = boolean;
    userContext.vars.public = boolean;
    userContext.vars.sendemail = email_address;
    userContext.vars.id = id;
    userContext.vars.boolean = boolean;
    userContext.vars.message_type = "string";
    userContext.vars.role = "employee";
    userContext.vars.last_verification_code = is_verified;
    userContext.vars.first_login_completed =  is_verified;
    userContext.vars.is_user_verified = is_verified;
    userContext.vars.is_super = is_verified;
    return done();
};

function employersChallenges(userContext, events, done) {
    const types = Faker.random.arrayElement(["choice","coding","video"]);
    const type = Faker.random.arrayElement(["choice","coding","video"]);
    const level = Faker.random.arrayElement(["BEGINNER","ADVANCED","PROFICIENT"]);
    const answer = Faker.random.arrayElement(["1","2","3","4"]);
    const time_given = Faker.random.arrayElement(["60s","100s"]);
    const emp_id = Faker.random.alphaNumeric(24);
    const id = Faker.random.number(1,65);
    const question = Faker.lorem.words();
    userContext.vars.types = types;
    userContext.vars.type = type;
    userContext.vars.is_super = is_verified;
    userContext.vars.emp_id = emp_id;
    userContext.vars.level = level;
    userContext.vars.id = id;
    userContext.vars.source = "talentscreen";
    userContext.vars.question = question;
    userContext.vars.answer = answer;
    userContext.vars.time_given = time_given;
    done();
};

function employerQuestions(userContext, events, done) {
    const emp_id = Faker.random.alphaNumeric(24);
    const _id = Faker.random.alphaNumeric(24);
    const question = Faker.lorem.words();
    const answer = Faker.lorem.words();
    const time = Faker.random.arrayElement(["60","100","120"]);
    const id = Faker.random.arrayElement(["1","2","3"]);
    const name = Faker.random.arrayElement(["ADVANCED","BEGINNER","PROFICIENT"]);
    const subjectid = Faker.random.number(1,65);
    const category_id = Faker.random.number(1,65);
    userContext.vars.emp_id = emp_id;
    userContext.vars._id = _id;
    userContext.vars.question = question;
    userContext.vars.answer = answer;
    userContext.vars.time = time;
    userContext.vars.id = id;
    userContext.vars.name = name;
    userContext.vars.subject_id = subjectid;
    userContext.vars.category_id = category_id;
};

function employerSubjects(userContext, events, done) {
    const emp_id = Faker.random.alphaNumeric(24);
    const name = Faker.lorem.words();
    const description = Faker.lorem.words();
    const id = Faker.random.number(1,65);
    const alias = Faker.lorem.word();
    userContext.vars.emp_id = emp_id;
    userContext.vars.name = name;
    userContext.vars.description = description;
    userContext.vars.id = id;
    userContext.vars.alias = alias;

};

function subjects(userContext, events, done) {
    const name = Faker.lorem.words();
    const description = Faker.lorem.words();
    userContext.vars.name = name;
    userContext.vars.description = description;
};
