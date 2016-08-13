/**
 * Created by frank25184 on 7/16/16.
 */
module.exports = function(grunt){
    //load plugins
    [
        'grunt-cafe-mocha',//use it to run tests about crosspage and logic
        'grunt-contrib-jshint',
        'grunt-exec',
    ].forEach(function(task){
        grunt.loadNpmTasks(task);
    });
    
   // setting plugins
    grunt.initConfig({
        //default folder
        paths: {
            js: 'public/js'
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
        // }
    });

    //regiter task
    grunt.registerTask('default', ['cafemocha'/*, 'jshint'//*,'exec'*/]);
};