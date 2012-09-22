/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        // General settings
        pkg: '<json:package.json>',
        meta: {
            banner: '/*!\n' +
                ' * <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? " * " + pkg.homepage + "\n" : "" %>' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>; ' +
                'Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %>\n' +
                ' */'
        },

        // Lints and Tests
        lint: {
            files: ['grunt.js', 'src/js/main.js', 'src/js/app/**/*.js']
        },
        qunit: {
            files: ['test/*.html']
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                browser: true
            }
        },

        // JavaScript
        concat: {
            dist: {
                src: [
                    '<banner:meta.banner>',
                    '<file_strip_banner:dist/js/main.js>'
                ],
                dest: 'dist/js/main.js'
            }
        },
        requirejs: {
            compile: {
                options: {
                    appDir: 'src',
                    baseUrl: 'js',
                    modules: [{ name: 'main'}],
                    mainConfigFile: 'src/js/main.js',
                    dir: 'dist',
                    optimize: 'uglify',
                    preserveLicenseComments: true,
                    removeCombined: true,
                    optimizeCss: 'standard'
                }
            }
        },

        // CSS
        mincss: {
            compress: {
                files: {
                    'dist/css/main.css': 'src/css/main.css'
                }
            }
        },

        // Images

        // Distributing
        clean: {
            dist: ['dist/build.txt']
        },

        // Documentation
        yuidoc: {
            compile: {
                name: 'Stealth',
                description: 'Stealth action game based on WebGL.',
                version: '0.2.0',
                url: 'http://htanjo.github.com/stealth/',
                options: {
                    paths: 'src/js/app',
                    outdir: 'docs'
                }
            }
        },

        // Watch
        watch: {
            lint: {
                files: '<config:lint.files>',
                tasks: 'lint'
            }
        }

    });

    // Load modules.
    grunt.loadNpmTasks('grunt-contrib');

    // Default task.
    grunt.registerTask('default', 'yuidoc requirejs concat mincss clean');

};