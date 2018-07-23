
const schedule = require('node-schedule');

const dbService = require('./db.service');
const fileService = require('../utilities/file-service');
const fileDownloader = require('../utilities/file-downloader');


const run = () => {
  fileDownloader.getSortimentfilen(str => {
    fileService.renameFile(str, (err, fileName) => {
      console.log('initiating runComparison()');
      dbService.runComparison(fileName);
    });
  })
}

const init = () => {
  const rule = new schedule.RecurrenceRule();
  rule.minute = 0;
  rule.hour = 6;
  rule.date = 1;
  schedule.scheduleJob(rule, function(){
    run();
  });
  // run();
  // dbService.runComparison('sortimentfilen_2017-06-01.xml');
  // dbService.runComparison('sortimentfilen_2017-09-01.xml');
  // dbService.runComparison('sortimentfilen_2017-12-01.xml');
  // dbService.runComparison('sortimentfilen_2018-03-01.xml');
  // dbService.runComparison('sortimentfilen_2018-07-16.xml');
  // dbService.runComparison('sortimentfilen_2018-07-20.xml');
}

module.exports = {
  init
}
