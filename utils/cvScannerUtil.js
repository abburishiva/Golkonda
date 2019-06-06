var request = require('request'),
    cheerio = require("cheerio"),
    _ = require('lodash');
function ResumeSkills() {

}
ResumeSkills.prototype.techWords = function (req, res, callback) {
    if (req.basics) {
        req.body = {};
        req.body.resume= JSON.stringify(req);
    }
    var options = {
        method: 'post',
        url: 'https://glossarytech.com/scanner/analyze',
        form: {
            "content": req.body.resume
        }
    };
    request(options, function (err, response) {
        if (err) {
            return res.send(err);
        }
        var i,
            resumeSkills = [],
            category = [],
            input = JSON.parse(response.body),
            skillsSet = cheerio.load(input.content)('a'),
            categoriesSet = cheerio.load(input.filter)('label');
        for (i = 0; i < skillsSet.length; i = i + 1) {
            resumeSkills.push({
                skill: skillsSet[i].children[0].data,
                id: skillsSet[i].attribs['data-filter'].replace('filter-', '')
            });
        }
        resumeSkills = _.uniqBy(resumeSkills, function (e) {
            return e.skill;
        });

        for (i = 0; i < categoriesSet.length; i = i + 1) {
            category.push({
                category: categoriesSet[i].children[0].children[0].data,
                skills: [],
                id: categoriesSet[i].attribs.for
            });
        }
        category = _.uniqBy(category, function (e) {
            return e.category;
        });
        for (i = 0; i < resumeSkills.length; i = i + 1) {
            var count = 0, length = category.length;
            _.each(category, function (item) {
                length = length - 1;
                if (parseInt(resumeSkills[i].id, 10) === parseInt(item.id, 10)) {
                    if (resumeSkills[i].skill.length > 0) {
                        item.skills.push(resumeSkills[i].skill.toLowerCase());
                    }
                }
                if (i === (resumeSkills.length - 1) && length === 0) {
                    _.each(category, function (item) {
                        item.skills = _.uniq(item.skills);
                    });
                    resumeSkills = [];
                    for (i = 0; i < category.length; i = i + 1) {
                        if (category[i].skills.length > 0) {
                            delete category[i].id;
                            count += category[i].skills.length;
                            resumeSkills.push(category[i]);
                        }
                    }
                    if (req.basics) {
                        return  callback(resumeSkills);
                    } else{
                        return res.header({'x-total-count': count}).json(resumeSkills);
                    }
                }
            });
        }
    });

};

module.exports = ResumeSkills;
