require('./mongo').connect().then((err) => {
  console.log('success?)');
});

module.exports = {
    debugService: require('./dev-debug.service'),
    logService: require('./log.service'),
    fileService: require('./file.service'),
    // launcherService: require('./launcher.service'),
    // schedulerService: require('./scheduler.service'),
    sortimentFilenService: require('./sortimentfilen.service')
    // userService: require('./user.service')
  };
