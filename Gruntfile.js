var moment = require('moment-timezone');
module.exports = function (grunt) {
    var files = [
        {expand: true, flatten: true, src: ['app.js'], dest: ''},
        {expand: true, flatten: true, src: ['apidocs/api/swagger/swagger.yaml'], dest: 'apidocs/api/swagger'},
        {expand: true, flatten: true, src: ['config/config.json'], dest: 'config'},
        {expand: true, flatten: true, src: ['controllers/loginController.js'], dest: 'controllers'},
        {expand: true, flatten: true, src: ['controllers/resumesController.js'], dest: 'controllers'},
        {expand: true, flatten: true, src: ['controllers/skillsController.js'], dest: 'controllers'},
        {expand: true, flatten: true, src: ['models/elasticSearchResumesModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/jobPostingsModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/shareResumesModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/companyLogosModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/currenciesModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/designationsModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/industriesModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/organizationsModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/shareResumesModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['models/skillsModel.js'], dest: 'models'},
        {expand: true, flatten: true, src: ['utils/elasticSearch/esCache.js'], dest: 'utils/elasticSearch'},
        {expand: true, flatten: true, src: ['utils/firebaseConnections.js'], dest: 'utils'},
        {expand: true, flatten: true, src: ['utils/auth/authorization.js'], dest: 'utils/auth'},
        {expand: true, flatten: true, src: ['utils/db/mysqlConnect.js'], dest: 'utils/db'},
        {expand: true, flatten: true, src: ['utils/googleApiUtils.js'], dest: 'utils'}
    ];
    grunt.initConfig({
        conf: grunt.file.readJSON('config/config.json'),
        config: grunt.file.readJSON('tests/config/config.json'),
        def: grunt.file.readJSON('config/default.json'),
        removelogging: {
            dev: {
                src: "app.js"
            },
            qa: {
                src: ['controllers/*.js', 'models/mysqlModels/*.js', 'models/mongoModels/*.js', 'routes/*.js', 'utils/**/*.js']
            },
            prod: {
                src: ['controllers/*.js', 'models/mysqlModels/*.js', 'models/mongoModels/*.js', 'routes/*.js', 'utils/**/*.js']
            }
        },
        replace: {
            qa: {
                options: {
                    patterns: [
                        {
                            match: "<%= conf.dev.mysql.username %>",
                            replacement: "<%= conf.qa.mysql.username %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.password %>",
                            replacement: "<%= conf.qa.mysql.password %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.host %>",
                            replacement: "<%= conf.qa.mysql.host %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.database %>",
                            replacement: "<%= conf.qa.mysql.database %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.host %>",
                            replacement: "<%= conf.qa.mongodb.host %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.username %>",
                            replacement: "<%= conf.qa.mongodb.username %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.password %>",
                            replacement: "<%= conf.qa.mongodb.password %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.facebook %>",
                            replacement: "<%= conf.qa.talentScreenSecret.facebook %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.linkedin %>",
                            replacement: "<%= conf.qa.talentScreenSecret.linkedin %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.github %>",
                            replacement: "<%= conf.qa.talentScreenSecret.github %>"
                        }
                    ],
                    usePrefix: false
                },
                files: [
                    {expand: true, flatten: true, src: ['config/default.json'], dest: 'config'}
                ]
            },
            appqa: {
                options: {
                    patterns: [
                        {
                            match: ".dev.",
                            replacement: ".qa."
                        },
                        {
                            match: "ops.dev.",
                            replacement: "ops.qa."
                        }
                    ],
                    usePrefix: false
                },
                files: files
            },
            stag: {
                options: {
                    patterns: [
                        {
                            match: "<%= conf.dev.mysql.username %>",
                            replacement: "<%= conf.stag.mysql.username %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.password %>",
                            replacement: "<%= conf.stag.mysql.password %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.host %>",
                            replacement: "<%= conf.stag.mysql.host %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.database %>",
                            replacement: "<%= conf.stag.mysql.database %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.host %>",
                            replacement: "<%= conf.stag.mongodb.host %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.username %>",
                            replacement: "<%= conf.stag.mongodb.username %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.password %>",
                            replacement: "<%= conf.stag.mongodb.password %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.facebook %>",
                            replacement: "<%= conf.stag.talentScreenSecret.facebook %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.linkedin %>",
                            replacement: "<%= conf.stag.talentScreenSecret.linkedin %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.github %>",
                            replacement: "<%= conf.stag.talentScreenSecret.github %>"
                        }

                    ],
                    usePrefix: false
                },
                files: [
                    {expand: true, flatten: true, src: ['config/default.json'], dest: 'config'}
                ]
            },
            appstag: {
                options: {
                    patterns: [
                        {
                            match: ".dev.",
                            replacement: ".stag."
                        },
                        {
                            match: ".qa.",
                            replacement: ".stag."
                        },
                        {
                            match: "ops.qa.",
                            replacement: "ops.stag."
                        },
                        {
                            match: "ops.dev.",
                            replacement: "ops.stag."
                        }
                    ],
                    usePrefix: false
                },
                files: files
            },
            prod: {
                options: {
                    patterns: [
                        {
                            match: "<%= conf.dev.mysql.username %>",
                            replacement: "<%= conf.production.mysql.username %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.password %>",
                            replacement: "<%= conf.production.mysql.password %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.host %>",
                            replacement: "<%= conf.production.mysql.host %>"
                        },
                        {
                            match: "<%= conf.dev.mysql.database %>",
                            replacement: "<%= conf.production.mysql.database %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.host %>",
                            replacement: "<%= conf.production.mongodb.host %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.username %>",
                            replacement: "<%= conf.production.mongodb.username %>"
                        },
                        {
                            match: "<%= conf.dev.mongodb.password %>",
                            replacement: "<%= conf.production.mongodb.password %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.facebook %>",
                            replacement: "<%= conf.production.talentScreenSecret.facebook %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.linkedin %>",
                            replacement: "<%= conf.production.talentScreenSecret.linkedin %>"
                        },
                        {
                            match: "<%= def.talentScreenSecret.github %>",
                            replacement: "<%= conf.production.talentScreenSecret.github %>"
                        }

                    ],
                    usePrefix: false
                },
                files: [
                    {expand: true, flatten: true, src: ['config/default.json'], dest: 'config'}
                ]
            },
            appprod: {
                options: {
                    patterns: [
                        {
                            match: ".dev.",
                            replacement: ".production."
                        },
                        {
                            match: "development",
                            replacement: "production"
                        },
                        {
                            match: "ops.dev.",
                            replacement: "ops."
                        }
                    ],
                    usePrefix: false
                },
                files: files
            },
            yamlprod: {
                options: {
                    patterns: [
                        {
                            match: ".production.",
                            replacement: "."
                        },
                        {
                            match: ".dev.",
                            replacement: "."
                        },
                        {
                            match: ".qa.",
                            replacement: "."
                        },
                        {
                            match: ".stag.",
                            replacement: "."
                        }
                    ],
                    usePrefix: false
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['apidocs/api/swagger/swagger.yaml'],
                    dest: 'apidocs/api/swagger'
                }]

            },
            testSuit: {
                options: {
                    patterns: [
                        {
                            match: "https://api.qa.talentscreen.io/v1/",
                            replacement: "http://localhost:8000/v1/"
                        },
                        {
                            match: ".dev.",
                            replacement: ".stag."
                        }
                    ],
                    usePrefix: false
                },
                files: [
                    {expand: true, flatten: true, src: ['tests/config/config.json'], dest: 'tests/config'},
                    {expand: true, flatten: true, src: ['app.js'], dest: ''},
                    {expand: true, flatten: true, src: ['models/elasticSearchResumesModel.js'], dest: 'models'},
                    {expand: true, flatten: true, src: ['models/jobPostingsModel.js'], dest: 'models'},
                    {expand: true, flatten: true, src: ['models/shareResumesModel.js'], dest: 'models'},
                    {expand: true, flatten: true, src: ['utils/elasticSearch/esCache.js'], dest: 'utils/elasticSearch'},
                    {expand: true, flatten: true, src: ['utils/db/mysqlConnect.js'], dest: 'utils/db'}
                ]
            },
            windows: {
                options: {
                    patterns: [
                        {
                            match: "unix",
                            replacement: "windows"
                        }
                    ],
                    usePrefix: false
                },
                files: [
                    {expand: true, flatten: true, src: ['config/mocha-eslint.json'], dest: 'config'}
                ]
            }
        },
        modify_json: {
            local: {
                expand: true,
                cwd: 'config/',
                src: ['config.json'],
                options: {
                    add: true,
                    fields: {
                        "isLocalMachine": true
                    },
                    indent: 2
                }
            },
            qa: {
                expand: true,
                cwd: 'tests/config/',
                src: ['config.json'],
                options: {
                    add: true,
                    fields: {
                        "mochaUrl": "<%= config.qaUrl %>",
                        "tokenUrl": "<%= config.tokenQaUrl %>"
                    },
                    indent: 2
                }
            },
            stag: {
                expand: true,
                cwd: 'tests/config/',
                src: ['config.json'],
                options: {
                    add: true,
                    fields: {
                        "mochaUrl": "<%= config.stagUrl %>"
                    },
                    indent: 2
                }
            },
            prod: {
                expand: true,
                cwd: 'tests/config/',
                src: ['config.json'],
                options: {
                    add: true,
                    fields: {
                        "mochaUrl": "<%= config.productionUrl %>"
                    },
                    indent: 2
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'mochawesome',
                    reporterOptions: {
                        reportDir: 'tests/reports',
                        reportName: 'report',
                        reportTitle: moment.tz('America/Vancouver').format('MMM, DD YYYY hh:mm A'),
                        reportFilename: 'report',
                        clearRequireCache: true,
                        enableCode: false
                    }
                },
                src: [
                    './tests/**/*.js', '!./tests/reports/assets/*.{js, css}'
                ]
            },
            prod_test: {
                options: {
                    reporter: 'mochawesome',
                    reporterOptions: {
                        reportDir: 'tests_prod/reports',
                        reportName: 'report',
                        reportTitle: moment.tz('America/Vancouver').format('MMM, DD YYYY hh:mm A'),
                        reportFilename: 'report',
                        clearRequireCache: true,
                        enableCode: false
                    }
                },
                src: ['./tests_prod/**/*.js', '!./tests_prod/reports/assets/*.{js, css}']
            }
        },
        eslint: {
            options: {
                rulesDir: "config/rules"
            },
            node: {
                options: {
                    configFile: './config/eslint.json',
                    outputFile: 'lint_logs/api-eslint.log'
                },
                src: [
                    './app.js', './controllers/*.js', './routes/*.js', './models/**/*.js', './utils/**/*.js'
                ]
            },
            json: {
                options: {
                    configFile: './config/json-eslint.json',
                    outputFile: 'lint_logs/json-eslint.log'
                },
                src: [
                    '.config/*.json', './package.json'
                ]
            },
            test: {
                options: {
                    configFile: './config/mocha-eslint.json',
                    outputFile: 'lint_logs/test-api-eslint.log'
                },
                src: [
                    './tests/**/*.js', '!./tests/reports/assets/*.{js, css}'
                ]
            }
        },
        mocha_istanbul: {
            coveralls: {
                src: ['./tests'],
                options: {
                    coverage: true,
                    check: {
                        lines: 75,
                        statements: 75
                    },
                    root: './tests',
                    reportFormats: ['cobertura', 'html']
                }
            }
        },
        istanbul_check_coverage: {
            default: {
                options: {
                    coverageFolder: './codeCoverage',
                    check: {
                        lines: 80,
                        statements: 80
                    }
                }
            }
        },
        nodemon: {
            dev: {
                script: './app.js'
            },
            options: {
                env: {
                    "NODE_ENV": "development"
                    , "NODE_CONFIG": "dev"
                },
                watch: ["server"],
                delay: 30
            }
        },
        concurrent: {
            dev: {
                tasks: ['replace:testSuit', 'modify_json:local', 'eslint', 'nodemon', 'mochaTest:test'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.registerTask('coveralls', ['mocha_istanbul:coveralls']);
    grunt.registerTask('coverage', ['mocha_istanbul:coverage']);
    grunt.registerTask('qa', ['replace:qa', 'replace:appqa', 'eslint']);
    grunt.registerTask('stag', ['replace:stag', 'replace:appstag', 'eslint']);
    grunt.registerTask('prod', ['replace:prod', 'replace:appprod', 'replace:yamlprod', 'eslint']);
    grunt.registerTask('build', ['eslint', 'mochaTest:test']);
    grunt.registerTask('windows', ['replace:windows']);
    grunt.registerTask('server', ['concurrent']);
    grunt.registerTask('grunt-mocha-test', ['mochaTest:test', 'mocha_istanbul:coveralls']);
    grunt.registerTask('grunt-mocha-prod-test', ['mochaTest:prod_test', 'mocha_istanbul:coveralls']);
};
