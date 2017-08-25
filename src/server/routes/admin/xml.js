const express = require('express');
const router = express.Router();

var adminService = require('./services/admin.service');

router.get('/fetch', (req, res) => {
  adminService.getExternalApiXML(req, res);
});

router.delete('/files/:name', (req, res) => {
  adminService.deleteFile(req, res);
});

router.get('/files', (req, res) => {
  adminService.getFileNames(req, res);
});

module.exports = router;