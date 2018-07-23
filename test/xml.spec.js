const { expect } = require('chai');
const path = require('path');
const SERVER_DATA_PATH = path.join(process.cwd(), 'server', 'data');
let testHelper;
let fileService;

describe('XML', function() {
  beforeEach(function() {
    fileService = require('../server/utilities/file-service');
    testHelper = require('./utilites/file-copy');
  });
  describe('copy', function() {
    it ('file should exist', function() {
      const filePath = path.join(SERVER_DATA_PATH, 'tmp', 'small.xml');
      let fileExist = testHelper.checkFileExist(filePath);
      if (!fileExist) {
        testHelper.copyXMLFile();
      }
      expect(testHelper.checkFileExist(filePath)).to.equal(true);
    });
  });
  // describe('rename', function() {
  //   it ('should return filename', function() {
  //     fileService.renameFile('small.xml', (err, res) => {
  //       expect(err).to.equal(null);
  //     })
  //   });
  // })
});