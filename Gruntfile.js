/**
 * Created by frank25184 on 7/16/16.
 */
module.exports = function(grunt){
    //load plugins
    [
        'grunt-cafe-mocha',//use it to run tests about crosspage and logic
        'grunt-contrib-jshint',
        'grunt-exec',
        'grunt-contrib-sass',
        'grunt-contrib-uglify',
        'grunt-contrib-cssmin',
        'grunt-hashres',
        'grunt-contrib-watch',
        'grunt-lint-pattern'
    ].forEach(function(task){
        grunt.loadNpmTasks(task);
    });
    
   // setting plugins
    grunt.initConfig({
        //default folder
        paths: {
            js: 'public/js',
            scss: 'public/sass',
            css: 'public/css',
            release: 'public/release/'
        },

        cafemocha:{
            all:{src: ['<%= paths.js %>/cross-test/tests-*.js','<%= paths.js %>/logic-test/tests-*.js','<%= paths.js %>/stress-test/tests-*.js'], options: {ui:'tdd'}}
        },
        // jshint:{
        //     //app: ['<%= paths.js %>/**/*.js'],
        //     //qa: ['Gruntfile.js','<%= paths.js %>/*-test/**/*.js']
        // },
        // exec:{
        // exec:{
        //     linkchecker:
        //               {cmd: 'linkchecker http://localhost:8000'}
        // },
      sass: {
        dist: {
          files: [{
            expand: true,
            cwd: '<%= paths.scss %>',
            src: ['*.scss'],
            dest: 'public/css',
            ext: '.css'
          }]
        }
      },



        uglify: {
            options: {
              mangle: {
                except: ['jQuery', 'angularjs']
              }
            },
            dist: {
              files: {
                '<%= paths.release %>/js/app.min.js': ['<%= paths.js %>/**/*.js','!public/js/*-test/*.js']
              }
            }
        },

        // ccsmin: {
        //     combine: {
        //         files: {
        //             'public/css/app.css': ['public/css/**/*.css','!public/css/app*.css']
        //         },
        //     },
        //     minify: {
        //         src: 'public/css/app.css',
        //         dest: 'public/css/app.min.css',
        //     }
        // },
       
        cssmin: {
          target: {
            files: [
            {
              '<%= paths.release %>/css/app.min.css': ['<%= paths.css %>/*.css','!<%= paths.css %>/output.css']
            }
            // {
            //   expand: true,
            //   cwd: '<%= paths.css %>',
            //   src: ['*.css', '!*.min.css'],
            //   dest: '<%= path.release >',
            //   ext: '.min.css'
            // }
            ]
          }
        },

        hashres: {
            options:{
                fileNameFormat: '${name}.${hash}.${ext}'
            },
            all: {
                src: [
                   '<%= paths.release %>/js/app.min.js',
                   '<%= paths.release %>/css/app.min.css',
 
                ],
                dest: [
                   'views/layouts/main.handlebars',
                ]
            }
        },


// watch: {
//   options: {
//     dateFormat: function(time) {
//       grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
//       grunt.log.writeln('Waiting for more changes...');
//     },
//   },
//   scripts: {
//     files: 'public/**/*',
//     tasks: ['sass','cssmin','uglify:dist','hashres'],
//   },
// },

watch: {
  options: {
    dateFormat: function(time) {
      grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
      grunt.log.writeln('Waiting for more changes...');
    },
  },

  css: {
    files: ['<%= paths.scss %>/**/*.scss'],
    tasks: ['sass','cssmin','hashres'],
    // options: {
    //   livereload: true,
    // },
  },

  js: {
    files: ['<%= paths.js %>/**/*.js'],
    tasks: ['uglify','hashres'],
  },


},


        // watch: {

        //     configFiles: {
        //         files: ['**/*.js'],
        //         tasks: ['sass','cssmin','uglify'],
        //         options: {
        //             dateFormat: function(time) {
        //                 grunt.log.writeln('The watch finished in ' + time + 'ms at' + (new Date()).toString());
        //                 grunt.log.writeln('Waiting for more changes...');
        //             },
        //             livereload: true,
        //         },                
        //     },
        // },



         lint_pattern: {
            // view_statics: {
            //     options: {
            //         rules: [
            //            {
            //             pattern: /<link [^>]*href=["'](?!\{\{static )/,
            //             message: 'Un-mapped static resource found in <link>.'
            //            },

            //            {
            //             pattern: /<script [^>]*src=["'](?!\{\{static )/,
            //             message: 'Un-mapped static resource found in <script>.'
            //            },

            //            {
            //             pattern: /<img [^>]*href=["'](?!\{\{static )/,
            //             message: 'Un-mapped static resource found in <img>.'
            //            },


            //         ],
            //     },//end of options

            //     files: {
            //         src: [
                   
            //             'views/**/*.handlebars',
            //         ],
                    
            //     },


            // },//end of view_statics

            css_statics: {
                options: {
                    rules: [
                         {
                            pattern: /url\(/,
                            message: 'Un-mapped static resource found in sass property.'
                         },

                    ],
                },
                files: {
                    src: [
                       'public/sass/**/*.scss',
                       '!public/sass/modules/_function.scss'
                    ],
                },
            },


         },


         });//end of grunt.initConfig


    //regiter task
    //grunt.registerTask('watch',['watch']);
    grunt.registerTask('default', [/**'lint_pattern', */'sass','cssmin','uglify:dist','hashres']/*, 'jshint'//*,'exec'*/);
    grunt.registerTask('test', [/**'cafemocha',**/'lint_pattern']/*, 'jshint'//*,'exec'*/);
    grunt.registerTask('static', ['sass','cssmin','uglify:dist','hashres']);
};