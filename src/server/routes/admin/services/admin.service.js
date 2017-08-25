const ReadPreference = require('mongodb').ReadPreference;
const mongoose = require('mongoose');
const xmlService = require('../../../dataServices/xml.service');
const XmlFile = require ('../../../models/xml.model.js');
const filesService = require('../../../dataServices/files.service');
var moment = require('moment');

function getFileNames(req, res) {
  filesService.getFileList(function(err, docs) {
    var runnableFiles = [];
    var hasBeenRunFound = false;
    var lastRunDate = docs[0].apiFileDate;
    docs.forEach(function(file) {
      if(moment(lastRunDate).isBefore(moment(file.apiFileDate))) {
        if(file.hasBeenRun) {
          foundHasBeenRun = true;
          lastRunDate = file.apiFileDate;
        } else {
          runnableFiles.push(file);
        }
      }
    });
    if(!hasBeenRunFound) {
      res.status(200).json(docs);
    } else {
      res.status(200).json(runnableFiles);
    }
    // let _filesSorted = runnableFiles.sort(function(a, b){
    //   return moment(b.apiFileDate).format('X')-moment(a.apiFileDate).format('X')
    // });    
    
  });

}

function dropDB(req, res) {
  mongoose.connection.collections['articles'].drop( function(err) {
    if(err) {
      handleError(res, err, 'unable to delete collection articles');
      return;
    }
    mongoose.connection.collections['reduced'].drop( function(err) {
      if(err) {
        handleError(res, err, 'unable to delete collection reduced');
        return;
      }    
      mongoose.connection.collections['files'].drop( function(err) {
        if(err) {
          handleError(res, err, 'unable to delete collection files');
          return;
        }
        rebuildXmlFilesCollection().then(function(files) {
          XmlFile.create(files, function(err, result) {
            if(err) {
              console.log("err creating xmlfiles db: ", err);
            }
            res.status(200).json(result);
          });
        });
        
      });
    });
  });
}

function rebuildXmlFilesCollection() {
  return xmlService.getFileStats().then(function(fileNames) {
    return fileNames;
  }).catch(function(err){
      return err;
  });
}

function getExternalApiXML(req, res) {
  console.log("attempting to fetch xml");
  xmlService.getXml(function(error) {
    if(error) {
      return handleError(res, error, "err fetching XML");
    }
    xmlService.renameFile(function(error, fileData) {
      if(error){
        return handleError(res, error);
      }
      const xmlFile = new XmlFile(fileData);
      xmlFile.save(function(err, doc) {
        if(err) {
          console.log("err saving xml file data: ", err);
          res.status(503).json("new xml file downloaded, but error occured when saving info about it in the DB");
          return;
        }
        res.status(200).json(fileData);
      });
    });
  });
}

function insertXml(req, res) {
// req.on( 'response', function ( data ) {
//     console.log( data.headers[ 'content-length' ] );
// } );  
//   console.log("postArticle: ", req.body);
// }
}


function deleteFile(req, res) {
  console.log("req", req.params);
  xmlService.deleteFile(req.params.name, function(error, file) {
    if(error) {
      return handleError(res, error, "err deleting XML");
    }
    res.status(200).send(file);
  });
  
}

function deleteAllFiles(req, res) {
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

function checkFound(res, article) {
  if (!article) {
    res.status(404).send('Article not found.');
    return;
  }
  return article;
}

function handleError(res, error, customMessage) {
  console.error("@admin.service: " + customMessage, error);
  return res.status(500).send(error);
}
module.exports = {
  getFileNames,
  getExternalApiXML,
  insertXml,
  deleteFile,
  deleteAllFiles,
  dropDB
};

