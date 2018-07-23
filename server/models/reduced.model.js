const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reducedSchema = new Schema(
  {
    count: Number,
    date: { type: Date, required: true, unique: true, dropDups: true },
    articles: [ { type: Schema.Types.ObjectId, ref: 'Article' }]
  },
  {
    collection: 'reduced',
    read: 'nearest'
  }
);

mongoose.model('Reduced', reducedSchema);
