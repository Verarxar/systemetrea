const models = require('../models');
const mongoose = require('mongoose');
const Reduced = mongoose.model('Reduced');
const Article = mongoose.model('Article');

// const ReadPreference = require('mongodb').ReadPreference;

function getStatistics(req, res) {
  const statistics = {
    reducedCount: 0,
    articlesCount: 0,
    groupCount: [],
    totalCostReduced: 0
  };
  const docquery = Reduced
    .find()
    .populate( {
      path: 'articles',
      select: 'varugrupp argang prisinklmoms prissanktProcent' });
  const articleQuery = Article
      .find()
      .count({});
  articleQuery.exec().then((count) => {
    console.log('count', count);
    statistics.articlesCount = count;
    let articleTypes = {};
    docquery.exec()
    .then(doc => {
      doc.forEach(obj => {
        statistics.reducedCount = statistics.reducedCount + obj.articles.length;
        obj.articles.forEach(article => {
          const safeAttributeName = article.varugrupp// getSafeKey(article.varugrupp);
          if (!articleTypes[safeAttributeName]) {
            articleTypes[safeAttributeName] = 1;
          } else {
            articleTypes[safeAttributeName]++;
          }
          const originalValue = article.prisinklmoms / (100-article.prissanktProcent);
          const costReduced = originalValue - article.prisinklmoms;
          statistics.totalCostReduced = statistics.totalCostReduced + originalValue;
        });
      });

      for (let key in articleTypes) {
        statistics.groupCount.push(
          { name: key, // getNameByEnum([key]),
            value: articleTypes[key]
          }
        );
      }
      res.status(200).json(statistics);
    })
    .catch(error => {
      console.log('error', error);
      res.status(500).send(error)
    });
  })
  .catch(error => res.status(500).send(error));
}

function getNameByEnum(int) {
  return [
    'Öl',
    'Vitt vin',
    'Mousserande vin',
    'Alkoholfritt',
    'Rosévin',
    'Gin',
    'Vin av flera typer',
    'Whisky',
    'Tequila och Mezcal',
    'Cider',
    'Rom',
    'Okryddad sprit',
    'Övrigt starkvin'
  ][int];
}

function getSafeKey(key) {
  let response = '';
  switch (key) {
    case 'Öl': response = 0; break;
    case 'Vitt vin': response = 1; break;
    case 'Mousserande vin': response = 2; break;
    case 'Alkoholfritt': response = 3; break;
    case 'Rosévin': response = 4; break;
    case 'Gin': response = 5; break;
    case 'Vin av flera typer': response = 6; break;
    case 'Whisky': response = 7; break;
    case 'Tequila och Mezcal': response = 8; break;
    case 'Cider': response = 8; break;
    case 'Rom': response = 10; break;
    case 'Okryddad sprit': response = 11; break;
    case 'Övrigt starkvin': response = 12; break;
    default: response = 13; break;
  }
  return response;
}

module.exports = {
  getStatistics
}