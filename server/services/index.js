require('./mongo').connect().then((err) => {
  console.log('success?)');
});

module.exports = {
    runService: require('./run.service'),
    logService: require('./log.service.js'),
    fileService: require('./file.service.js'),
    launcherService: require('./launcher.service.js'),
    schedulerService: require('./scheduler.service.js'),
    userService: require('./user.service')
  };
  