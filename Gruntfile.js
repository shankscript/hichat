'use strict';

module.exports = function (grunt) {


    grunt.initConfig({
        "clean": {
            "options":{
                force:true
            },
            "debug": {
                "src": ['dest/**']
            }
        },
        "copy": {
            "debug": {
                "files": [
                    {expand: true, src: ['public/**'], dest: 'dest/'},
					{expand: false, src: ['server/server.js'], dest: 'dest/server.js'}
                ]
            }
        },
        "cssmin": {
            "debug": {
                "files": [
                    {expand: true, src: ['public/css/main.css'], dest: 'dest/'}
                ]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-clean");

    grunt.registerTask("default", ["clean","copy","cssmin"]);
    grunt.registerTask("del", ["clean"]);
    console.log("hello world");
}