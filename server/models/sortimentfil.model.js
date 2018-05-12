const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rawSchema = new Schema(
  {
    date: String,
    count: Number,
    articles: []
  },
  {
    collection: 'sortimentfil',
    read: 'nearest'
  }
);

const Sortimentfil = mongoose.model('Sortimentfil', rawSchema);

module.exports = Sortimentfil;