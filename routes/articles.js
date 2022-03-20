const express = require('express')
const router = express.Router()
const session = require('express-session')
const Article = require('../models/articles.js')
const Prevention = require("sqlstring")
//====================================1st Page=====================
router.get("/", (req, res) => {
  res.render('articles/index')  
});
//==================================Authentication=============

router.get('/signin', (req,res)=>{
  res.render('articles/signin');
})
router.get('/signup', (req,res)=>{
  res.render('articles/signup');
})
router.post('/signup', (req, res)=>{
  var post = req.body
  var sql = `INSERT INTO users(first_name,last_name,mob_no,user_name,email,password)
  VALUES (${Prevention.escape (post.first_name)},${Prevention.escape (post.last_name)},${post.mob_no},
  ${Prevention.escape (post.user_name)},${Prevention.escape (post.email)},${Prevention.escape (post.password)})`;
  Article.query(sql, (err, result) => {
    if(err) {
      res.redirect ("articles/signup")
       console.log(err)
     } else {
      res.render('articles/signin');
     }
})
});

router.post('/signin',(req,res)=>{
  var username = req.body.user_name;
  var password = req.body.password;
  Article.query(
      'SELECT * FROM users WHERE user_name = ? AND password = ?',
      [username, password],
      (error, results) => {
          if (results.length > 0) {
              req.session.loggedin = true;
      req.session.username = username;
      res.render('articles/home');
          } else {
              res.send('Incorrect password or username');
          }
      }
  );
});
//=============================Logout==========================
router.get('/logout', (req, res) => {
  req.session.loggedin = false;
  req.session.username = null;
  res.redirect('/');
});
//============================Dashboard============================
router.get('/dashboard', (req,res)=>{
  var sql='SELECT * FROM articles ORDER BY createAt DESC';
  Article.query(sql, function (err, articlesdata, fields) {
      if (err) console.log("Error : "+err.sqlMessage);
      res.render('articles/dashboard', {articles : articlesdata})
});
}); 
//=============================Menu===============================
router.get("/home", (req, res) => {
        res.render('articles/home')  
});
router.get("/contact-us", (req, res) => {
  res.render('articles/contact-us')  
});



//=============================CRUD===============================

router.get('/new', (req,res)=>{
    res.render('articles/new')
});


router.post('/new', (req,res)=>{
    var post = req.body
    var sql = `INSERT INTO articles(title,content,createAt,updatedAt,published,role)
    VALUES (${Prevention.escape (post.title)},
      ${Prevention.escape (post.content)},
       NOW(),NOW(),0,'Author')`;
    Article.query(sql, (err, result) => {
      if(err) {
         console.log(err)
       } else {
         res.redirect ("/dashboard")
       }
  })
});
router.get('/show/:id', (req,res)=>{
  const id = req.params.id
  const post = req.body
  var sql=`SELECT * FROM articles WHERE id = "${id}" LIMIT 1 `;
  Article.query(sql, function (err, articlesdata, fields) {
        if (err) console.log("Error : "+err.sqlMessage);
        res.render('articles/show', {articlesdata})
  });
});
router.post('/comment', (req,res)=>{
  var post = req.body
  var sql = `INSERT  Comments(name,content)
  VALUES (${Prevention.escape (post.name)},
    ${Prevention.escape (post.content)}) where id = ${post.id} `;
  Article.query(sql, (err, result) => {
    if(err) {
       console.log(err)
     } else {
       res.redirect ("/")
     }
})
});

router.get("/edit/:id", (req, res) => {
  const id = req.params.id
  var sql=`SELECT * FROM articles WHERE id = "${id}" LIMIT 1 `;
  Article.query(sql, function (err, articlesdata, fields) {
        if (err) console.log("Error : "+err.sqlMessage);
        res.render('articles/edit', {articlesdata})
  });
});

router.put("/edit/:id", (req, res) => {
  const post = req.body
  const id = req.params.id
             
  Article.query ( `UPDATE articles
 SET title = ${Prevention.escape (post.title)},
 content = ${Prevention.escape(post.content)},
     updatedAt = NOW()
 WHERE id = "${id}"`, (err, result) => {
      if(err) {
          console.log(err)
       } else { 
          console.log("blog updated")
          res.redirect("/dashboard")
       }
  })
})
router.get('/delete/:id', (req,res)=>{
  const id = req.params.id
  const post = req.body
  var sql=`DELETE FROM articles WHERE id = "${id}" LIMIT 1 `;
  Article.query(sql, function (err, articlesdata, fields) {
        if (err) console.log("Error : "+err.sqlMessage);
        res.redirect("/dashboard")
  });
});
//===================================Search==========================================
router.post("/" , (req,res) =>{
  const post = req.body.search;
  var sql=`SELECT * FROM articles WHERE title like ? ORDER BY createAt DESC `;  
  Article.query(sql,['%'+post+'%'], function (err, articlesdata, fields) {
    if (err) console.log("Error : "+err.sqlMessage);
    res.render('articles/dashboard', {articles : articlesdata})
}); 
})


module.exports = router;