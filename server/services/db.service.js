
const path = require('path');
const async = require('async'); 
const mongoose = require('mongoose');
const Reduced = mongoose.model('Reduced');
const Article = mongoose.model('Article');
const xmlReaderService = require('../utilities/xml-article-reader');
const log = {};
let replaceArticleList = [];
let updateArticleList = [];
let createdDate;
const DATA_PATH = path.join(process.cwd(), 'server', 'data');

const runComparison = (fileName) => {
  log.newArticlesCount = 0;
  log.modifiedArticlesCount = 0;
  log.reducedPricesCount = 0;
  
  const filePath = path.join(DATA_PATH, fileName);
  Article.find().then(res => {
    replaceArticleList = [];
    updateArticleList = [];
    const oldArticles = {}
    let count = 0;
    res.forEach(article => {
      count++;
      oldArticles[article.artikelid] = article.toObject();
    });
    const dbEmpty = count === 0;
    xmlReaderService.getJSONFromXML(filePath, (err, articlesFromXml) => {
      if (err) {
        throw new Error(err);
      }
      createdDate = articlesFromXml[0].lastModified;
      initDatabase(dbEmpty, articlesFromXml).then(() => {
        if (!dbEmpty) {
          articlesFromXml.forEach((newArticle) => {
            const oldArticle = oldArticles[newArticle.artikelid];
            // if it's a new article, we want to save it to the collection.
            if (!oldArticle) {
              const article = new Article(newArticle);
              article.save(err => {
                if (err) {
                  console.log('err saving article', err);
                } else {
                  log.newArticlesCount++;
                }
              });
            } else { // Article nr exists in DB.
              checkIfUpdateRequired(oldArticle, newArticle, (modifiedFields) => {
                if (modifiedFields) { // found article nr doesn't match. we should update
                  const article = Object.assign({}, modifiedFields);
                  replaceArticleList.push(article);
                } else { // article found, names match. compare precies below
                  const priceReduced = oldArticle.prisinklmoms > newArticle.prisinklmoms;
                  const priceIncreased = oldArticle.prisinklmoms < newArticle.prisinklmoms;
                  if (priceReduced || priceIncreased) {
                    console.log('Price ', (priceIncreased ? 'increased' : 'reduced') + ' for: ' + newArticle.artikelid);
                    addToUpdateList(newArticle, oldArticle);

                  }
                }
              });
            }
          });
          if (replaceArticleList.length === 0 && updateArticleList.length === 0) {
            printLog();
            console.log('no work left to do. we are done here');
          } else {
            resolveLists(replaceArticleList, updateArticleList).then((modifiedPriceList) => {
              resolvePriceChanges(modifiedPriceList).then((reducedCount) => {
                console.log('articlesUpdated', reducedCount)
                if (reducedCount) {
                  // TODO move&store sortimentfilen_*date*.xml in data/saved
                  log.reducedPricesCount = reducedCount;
                }
                printLog();
              });
            }).catch(err => {
              console.log('error resolving lists', err);
            });
          }
        } else {
          console.log('Database was empty. Added ', articlesFromXml.length, 'articles');
        }
      }).catch(err => {
        console.log('insert many failed', err);
      });
    });
  });
}

const addToUpdateList = (newArticle, oldArticle) => {
  log.modifiedArticlesCount++;
  const newValues = getNewPriceValues(newArticle, oldArticle);
  updateArticleList.push(newValues);
}

const printLog = () => {
  console.log('number of new articles: ', log.newArticlesCount);
}

const resolvePriceChanges = (modifiedArticles) => {
  return new Promise((resolve, reject) => {
    const reducedPriceList = [];
    // a price can go up as well, this filters the reduced prices.
    modifiedArticles.forEach(article => {
      if (article.prissanktProcent > 0) {
        reducedPriceList.push(article);
      }
    });
    if (reducedPriceList.length > 0) {
      const originalReduced = {
        count: reducedPriceList.length,
        date: createdDate,
        articles: reducedPriceList.map(article => {
          return article._id;
        })
      };
      console.log('originalReduced', originalReduced);
      const reduced = new Reduced(originalReduced);
      reduced.save(err => {
        if (err) {
          console.log('err saving reduced articles', err);
        } else {
          resolve(originalReduced.articles.length);
        }
      });
    } else {
      resolve(0);
    }
  });
}

const initDatabase = (dbEmpty, articles) => {
  return new Promise((resolve, reject) => {
    if (dbEmpty) {
      articles.forEach(article => {
        article.prisinklmoms = parseFloat(article.prisinklmoms);
        article.prisPerLiter = parseFloat(article.prisPerLiter);
      });
      Article.insertMany(articles, (error, docs) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

const checkIfUpdateRequired = (oldA, newA, callback) => {
  // TODO make this code less horrible... 
  // returns fields that should update. occurs usually when an article name's spelling error has been corrected.
  const priceReduced = oldA.prisinklmoms > newA.prisinklmoms;
  const priceIncreased = oldA.prisinklmoms < newA.prisinklmoms;
  let modifiedFields = newA;
  if (oldA.nr === '3064003' || oldA.nr === 3064003) {
    console.log('--------------------------------------------');
    console.log('--------------------------------------------');
    console.log('---      BUUUUUUUUUUUUUUUUUUUUUUUG       ---');
    console.log('--------------------------------------------');
    console.log(
      `old namn2: ${oldA.namn2}\nnew namn2: ${newA.namn2}\n\nold namn: ${oldA.namn}\nnew namn: ${newA.namn}\n
      ${oldA.namn}.indexOf(${newA.namn}) == ${oldA.namn.indexOf(newA.namn)}\n
      ${oldA.namn2}.indexOf(${newA.namn2}) == ${oldA.namn2.indexOf(newA.namn2)}\n
      Price has: ${priceReduced || priceIncreased || 'not changed'}\n
      old price: ${oldA.prisinklmoms}\n new price: ${newA.prisinklmoms}
      articleid match: ${oldA.artikelid === newA.artikelid}`
    );
    console.log('--------------------------------------------');
  }
  
  if (
      // if both names differ - we assume the article nr has been replaced -> else
      // (oldA.namn.length === newA.namn.length || oldA.namn2.length === newA.namn2.length)
      // && !(oldA.namn === newA.namn && oldA.namn2 === newA.namn2)
      // check if articleId differ. if it does -it's a new article
      oldA.artikelid === newA.artikelid
      // this check will pass if only one of the names differ
      && ((oldA.namn.indexOf(newA.namn) > -1) || ((oldA.namn2.indexOf(newA.namn2) > -1)))
    ) {
      if (priceReduced || priceIncreased) {
        console.log('Price ', (priceIncreased ? 'increased' : 'reduced') + 'for: ' + newA.artikelid);
        addToUpdateList(newA, oldA);
      }
      modifiedFields = {};
      if (oldA.namn !== newA.namn || oldA.namn2 !== newA.namn2) {
        modifiedFields._id = oldA._id;
        console.log('we should update article', newA.artikelid + ' because:');
        if (oldA.namn !== newA.namn) {
          modifiedFields.namn = newA.namn;
          console.log('old name is: ', oldA.namn, 'new name is', newA.namn);
        }
        if (oldA.namn2 !== newA.namn2) {
          modifiedFields.namn2 = newA.namn2;
          console.log('old name is: ', oldA.namn2, 'new name is', newA.namn2);
        }
        callback(Object.keys(modifiedFields).length > 0 ? modifiedFields : false);
      }

    } else {
      // names are exactly the same - we leave the article as it is.
      callback(false);
    }
}

const getNewPriceValues = (newArticle, oldArticle) => {
  console.log('oldArticle.prisinklmoms', oldArticle.prisinklmoms, '\nnewArticle.prisinklmoms', newArticle.prisinklmoms,'\n');
  const prisProcent = parseFloat(((100*(1 - ((newArticle.prisinklmoms) / (oldArticle.prisinklmoms)))).toFixed(1) ));
  oldArticle.prisHistorik.unshift({pris: oldArticle.prisinklmoms, datum: newArticle.lastModified});
  const prisHistorik = oldArticle.prisHistorik;
  const prisinklmoms = newArticle.prisinklmoms;
  const prissanktProcent = prisProcent;
  const newValues = {
    _id: oldArticle._id,
    prisHistorik: prisHistorik,
    prisinklmoms: prisinklmoms,
    prissanktProcent: prissanktProcent,
    lastModified: newArticle.lastModified
  }
  return newValues;
}

const resolveLists = (replaceList, updateList) => {
  const resucedPriceList = [];
  return new Promise((resolve, reject) => {
    async.eachSeries(replaceList, (article, next) => {
      replaceExistingArticle(article, (error, updatedArticle) => {
        if (error) {
          next(error);
        } else {
          next();
        }
      });
    }, (error) => {
      if (error) {
        console.log('error replacing articles', error);
      }
      async.eachSeries(updateList, (article, next) => {
        updatePriceHistory(article, (error, updatedArticle) => {
          if (error) {
            return next(error);
          } else {
            resucedPriceList.push(updatedArticle);
            next();
          }
        });
      }, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(resucedPriceList);
          }
        })
    });
  });
}

// TODO doc.remove --> doc.save
const replaceExistingArticle = async (article, callback) => {
  console.log(`@replaceExistingArticle ${article.nr} - ${article.namn || article.namn2}`);
  const wasReducedInPrice = article.prissanktProcent;
  if (wasReducedInPrice) {
    console.log('was reduced in price', article);
  }
  return await Article.findOneAndUpdate(
    {_id: article._id},
    { $set: article },
    { new: true })
    .exec(callback);
}

const updatePriceHistory = async (article, callback) => {
  // console.log('@updatePriceHistory - article._id:', article._id);
  return await Article.findOneAndUpdate(
    {_id: article._id},
    { $set: article },
    { new: true })
    .exec(callback);
}

module.exports = {
  runComparison
}