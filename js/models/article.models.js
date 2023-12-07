const sql = require('../db.utils.js');

// {
//     "id": 1,
//     "tag_id": 3,
//     "article_title": "Judul Artikel",
//     "article_content": "Konten Artikel Lorem ipsum dolor sit amet",
//     "publisher_id": 1,
//     "image": "image-1-image.png",
//     "created_at": "2023-12-04T21:12:53.000Z",
//   }
const Article = function (article) {
    this.id = article.id;
    this.tag_id = article.tag_id;
    this.article_title = article.article_title;
    this.article_content = article.article_content;
    this.publisher_id = article.publisher_id;
    this.image = article.image;
    this.created_at = article.created_at;
};

Article.getAll = result => {
    sql.query(`SELECT 
                articles.id, 
                articles.tag_id, 
                articles.article_title, 
                articles.article_content, 
                articles.publisher_id, 
                users.username AS publisher, 
                tag.tag_name AS tag_name, 
                articles.image,
                articles.created_at
               FROM 
                articles 
               JOIN tag ON articles.tag_id = tag.id 
               JOIN users ON articles.publisher_id = users.id`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        result(null, res);
    });
}

Article.findById = (id, result) => {
    sql.query(`SELECT
        articles.id,
        articles.tag_id,
        articles.article_title,
        articles.article_content,
        articles.publisher_id,
        users.username AS publisher,
        articles.image
    FROM
        articles
    JOIN tag ON articles.tag_id = tag.id
    JOIN users ON articles.publisher_id = users.id
    WHERE
    articles.id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("articles: ", res);
        result(null, res);
    });
}

Article.create = (newArticle, result) => {
    const { tag_id, article_title, article_content, publisher_id, image } = newArticle;
    sql.query('SELECT id FROM users WHERE session = ?', [publisher_id], (err, res) => {
        const publisher = res[0].id || 1;
        console.log('publisher: ', publisher);
        sql.query('INSERT INTO articles (`id`, `tag_id`, `article_title`, `article_content`, `publisher_id`, `image`, `created_at`) VALUES (NULL, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)', 
        [tag_id, article_title, article_content, publisher, image], 
        (err, res) => {
        if (err) {
            console.log('error: ', err);
            result(err, null);
            return;
        }
    
        console.log('created article: ', { id: res.insertId, ...newArticle });
        result(null, { id: res.insertId, ...newArticle });
        });
    });
  };

Article.update = (id, article, result) => {
    sql.query(
        "UPDATE articles SET tag_id = ?, article_title = ?, article_content = ?, publisher_id = ?, image = ? WHERE id = ?",
        [article.tag_id, article.article_title, article.article_content, article.publisher_id, article.image, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Article with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated article: ", { id: id, ...article });
            result(null, { id: id, ...article });
        }
    );
}

Article.findByTag = (tag_id, result) => {
    sql.query(`SELECT
        articles.id,
        articles.tag_id,
        articles.article_title,
        articles.article_content,
        articles.publisher_id,
        tag.tag_name AS tag_name, 
        users.username AS publisher,
        articles.image,
        articles.created_at
    FROM
        articles
    JOIN tag ON articles.tag_id = tag.id
    JOIN users ON articles.publisher_id = users.id
    WHERE
    articles.tag_id = '${tag_id}'`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null, res);
    });
}


module.exports = Article;