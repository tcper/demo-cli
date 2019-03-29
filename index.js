#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
const path = require('path');

program
  .version('0.0.1')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook')

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(env, options){
    var mode = options.setup_mode || "normal";
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });

program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  }).on('--help', function() {
    console.log('  Examples:');
    console.log();
    console.log('    $ deploy exec sequential');
    console.log('    $ deploy exec async');
    console.log();
  });

program
  .command('init')
  .action(function(env){
    const tmp = require('tmp');

    tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
      if (err) throw err;
     
      console.log('Dir: ', path);
      const simpleGit = require('simple-git')(__dirname);
      simpleGit.clone('act16-webpack4-antd-mobx.git', path, null, function() {
        const rmdir = require('rimraf');
        rmdir(path + '/.git', function(error){
          if (error) {
            console.log( error );
            return;  
          }
          
          var ncp = require("ncp");
          ncp(path, __dirname, function(err) {
            if (err) {
               return console.error(err);
             }
             console.log('done!');
          });          
        });

      });
      // Manual cleanup
      cleanupCallback();
    });

    //console.log(__dirname);
    

  });

program.parse(process.argv);
