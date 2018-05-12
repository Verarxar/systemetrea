var Schedule	 = require('node-schedule');
var rule = new Schedule.RecurrenceRule();
var automated	 = require('./launcher.service');

rule.minute = 0;
rule.hour = 18;

function startScheduler() {
  schedule.scheduleJob('* 06 1 * *', function(){
    automated.run(function(err, data){
      if(err){
        console.log("error?: ", err);
      }
      console.log("Automated process might have passed successfully\n", data);
    });
  });
}

module.exports = {
   startScheduler
}
