const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const xmlFileSchema = new Schema(
  {
    name: String,
    size: Number,
    hasBeenRun: Boolean,
    apiFileDate: { type: String, required: true, unique: true, dropDups: true },
  },
  {
    collection: 'files',
    read: 'nearest'
  }
);

module.exports = mongoose.model('Xml', xmlFileSchema);
