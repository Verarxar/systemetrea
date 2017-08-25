const Article = require('../../../models/article.model');

function getArticles(req, res) {

  const docquery = Article.find({});
  docquery
    .exec()
    .then(articles => {
      res.status(200).json(articles);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function postArticle(req, res) {
  console.log("postArticle: ", req.body);
  const originalArticle = { nr: req.body.nr, namn: req.body.namn, prisinklmoms: req.body.pris };
  const article = new Article(originalArticle);
  article.save(error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(article);
    console.log('Article created successfully!');
  });
}

function putArticle(req, res) {
  const originalArticle = {
    id: parseInt(req.params.nr, 10),
    name: req.body.namn,
    saying: req.body.pris
  };
  Article.findOne({ id: originalArticle.nr }, (error, article) => {
    if (checkServerError(res, error)) return;
    if (!checkFound(res, article)) return;

    article.namn = originalArticle.namn;
    article.pris = originalArticle.pris;
    article.save(error => {
      if (checkServerError(res, error)) return;
      res.status(200).json(article);
      console.log('Article updated successfully!');
    });
  });
}

function deleteArticle(req, res) {
  const id = parseInt(req.params.nr, 10);
  Article.findOneAndRemove({ id: id })
    .then(article => {
      if (!checkFound(res, article)) return;
      res.status(200).json(article);
      console.log('Article deleted successfully!');
    })
    .catch(error => {
      if (checkServerError(res, error)) return;
    });
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

module.exports = {
  getArticles,
  postArticle,
  putArticle,
  deleteArticle
};
