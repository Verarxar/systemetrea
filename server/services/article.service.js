const mongoose = require('mongoose');
const Reduced = mongoose.model('Reduced');
// const ReadPreference = require('mongodb').ReadPreference;

function getArticles(req, res) {
  const docquery = Reduced
    .find()
    .populate( {
      path: 'articles',
      select: 'namn namn2 varugrupp argang prisinklmoms prissanktProcent lastModified nr',
      options: { sort: { 'prissanktProcent': 'descending'} } })
    .sort({ 'date': 'descending' });

  docquery.exec()
  .then(doc => res.status(200).json(doc))
  .catch(error => res.status(500).send(error));
}

module.exports = {
  getArticles
}