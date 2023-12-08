const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'assets/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

module.exports = (app) => {
  const article = require('./controllers/article.controller.js');
  const user = require('./controllers/user.controller.js');
  var router = require('express').Router();

  router.get('/articles', article.findAllArticles);
  router.get('/articles/:id', article.findOneArticle);
  router.get('/articles/tag/:id', article.getArticleByTag);
  router.post('/articles/create', upload.single('image'), article.createArticle);
  router.put('/articles/update/:id', upload.single('image'), article.updateArticle);

  router.get('/', user.findFirstUser);
  router.post('/login', user.loginUser);
  router.post('/logout', user.logoutUser);
  router.get('/validator', user.validateUser);

  app.use('/', router);
};
