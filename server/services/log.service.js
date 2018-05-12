// middleware to use for all requests
function mrCurious(req, res, next){
  ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  header_ip = req.headers['x-forwarded-for'];
  console.log(" @: ", new Date());
  console.log(" ip: ", ip);
  console.log(" if Proxy: ", header_ip);
  fs.appendFile("./log.txt", new Date() + "\r\n" + "ip: " + ip
  + "\r\n" + "x-forwarded-for: " + header_ip + "\r\n \r\n", function(err) {
      if(err) {
          return console.log(err);
      }
     console.log("The file was saved!");
  });
  next();
};

module.exports = {
  mrCurious
}