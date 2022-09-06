//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


//Schema
mongoose.connect("mongodb://localhost:27017/wikidb", {useNewUrlParser: true});
const articleSchema = {
    title: String,
    content: String
};
//Model
const Article = new mongoose.model("Article", articleSchema);

/////////Request t=Targetting all Articles///
//refactor for all same route
app.route("/articles")
.get(function(req, res){
  Article.find(function(err, foundArticles){
    if(!err){
        res.send(foundArticles);
    }else{
      res.send(err);
    }

  });
})

.post(function(req,res){

const newArticle = new Article({
  title: req.body.title,
  content: req.body.content
});
newArticle.save(function(err){
  if(!err){
    res.send("Succesfully added a new article");
  }else {
    res.send(err);
  }
});
})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if(!err){
    res.send("Sucessfully deleted all the articles");
  }else{
    res.send(err);
  }
});
});
/////////Request Targetting specific Articles///
app.route("/articles/:titleArticle",)
.get(function(req,res){

  Article.findOne({title: req.params.titleArticle},function(err, foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else {
      res.send("No article matching that title was found.");
    }
  });
})
.put(function(req,res){
  Article.updateOne(
    {title: req.params.titleArticle},
    {title: req.body.title, content: req.body.content},

    function(err){
      if(!err){
        res.send("Succesfully updated article")
      }
    });
})
.patch(function(req, res){
  Article.updateOne(
    {title: req.params.titleArticle},
    {$set: req.body},
    function(err){
      if(!err){
      res.send("Succesfully updated the atricle.");
    } else {
      res.send(err);
    }
  })
})

.delete(function(req, res){
  Article.deleteOne(
    {title: req.params.titleArticle},
    // {$set: req.body},
    function(err){
      if(!err){
        res.send("Succesfully deleted the article");
      }else{
        res.send(err);
      }
    }

  );
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
