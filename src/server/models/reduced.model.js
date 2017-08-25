const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reducedSchema = new Schema(
  {
    articleCount: Number,
    reducedCount: Number,
    apiFileDate: { type: String, required: true, unique: true, dropDups: true },
    articles: { type: Array }
  },
  {
    collection: 'reduced',
    read: 'nearest'
  }
);

module.exports = mongoose.model('Reduced', reducedSchema);
