const model = require("../models/article.models.js");
const { cookieCheck, getCookie } = require("../global.utils.js");

// Article model
exports.findAllArticles = async (req, res) => {
  if (!(await cookieCheck(req.headers.cookie))) {
    res.redirect("http://localhost:5500/app/login");
    return;
  }

  model.getAll((err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving articles.",
      });
    }

    res.send(data);
  });
};

exports.findOneArticle = async (req, res) => {
  if (!(await cookieCheck(req.headers.cookie))) {
    res.redirect("http://localhost:5500/app/login");
    return;
  }

  model.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          message: `Not found article with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error retrieving article with id ${req.params.id}.`,
        });
      }
    }

    res.send(data);
  });
};

exports.createArticle = (req, res) => {
  const { tag_id, article_title, article_content} = req.body;
  const publisher_id = getCookie("login-token", req.headers.cookie);
  const image = req.file ? req.file.filename : null;

  const newArticle = {
    tag_id,
    article_title,
    article_content,
    publisher_id,
    image,
  };

  model.create(newArticle, (err, data) => {
    if (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the article.",
      });
    } else {
      res.send(data);
    }
  });
};

exports.updateArticle = (req, res) => {
  const { tag_id, article_title, article_content} = req.body;
  const image = req.file ? req.file.filename : null;
  const publisher_id = getCookie("login-token", req.headers.cookie);

  const updatedArticle = {
    tag_id,
    article_title,
    article_content,
    publisher_id,
    image,
  };

  model.update(req.params.id, updatedArticle, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(400).send({
          message: `Not found article with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: `Error updating article with id ${req.params.id}.`,
        });
      }
    }

    res.send(data);
  });
};

exports.getArticleByTag = (req, res) => {
  model.findByTag(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occured while retrieving articles.",
      });
    }

    res.send(data);
  });
}