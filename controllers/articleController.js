var express = require('express');
var path = require('path');
var Article = require('../models/Article.js');
var Note = require('../models/Note.js');
var router = express.Router();

var request = require("request");
var cheerio = require("cheerio");
var ObjectId = require('mongoose').Types.ObjectId;

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/savedArticles", function(req, res) {
    res.render("saved");
});

router.get("/getSavedArticles", function(req, res) {

    Article.find({saved: true}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

router.get("/getNote", function(req, res) {
    var query = { _id: new ObjectId(req.query.id) };
    Note.find(query, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

router.get("/articles", function(req, res) {

    Article.find({}, function(error, doc) {
        if (error) {
        console.log(error);
        } else {
            res.json(doc);
        }
    });
});

router.post("/save", function(req, res) {
    Article.findOneAndUpdate({ "_id": req.body.articleId }, { "saved": true })
  
    .exec(function(err, doc) {
    
      if (err) {
        console.log(err);
      }
      else {
      
        res.sendStatus(200);
      }
    });
});

router.post("/delete", function(req, res) {
    Article.findOneAndUpdate({ "_id": req.body.articleId }, { "saved": false })
 
    .exec(function(err, doc) {
   
      if (err) {
        console.log(err);
      }
      else {
      
        res.sendStatus(200);
      }
    });
});

router.post("/saveNote", function(req, res) {
    var obj = {
        body: req.body.content
    };
    var newNote = new Note(obj);
    
    
      newNote.save(function(error, doc) {
       
        if (error) {
          console.log(error);
        }
       
        else {
        
          var noteId = doc._id;
          Article.findOneAndUpdate({ "_id": req.body.articleId }, { "note": doc._id })
          
          .exec(function(err, doc) {
           
            if (err) {
              console.log(err);
            }
            else {
              
              res.send({note: noteId});
            }
          });
        }
      });
});

router.post("/removeNote", function(req, res) {
  
    Article.findOneAndUpdate({ "_id": req.body.articleId }, { "note": null })
    
    .exec(function(err, doc) {
   
      if (err) {
        console.log(err);
      }
      else {
        
        res.sendStatus(200);
      }
    });
});



router.post("/scrape", function(req, res) {
   
    request("https://www.nytimes.com/section/technology", function(error, response, html) {
     
      var $ = cheerio.load(html);
      
      $("article").each(function(i, element) {
      
        var result = {};
  
        
        result.title = $(this).find(".headline").text().replace(/(\r\n|\n|\r)/gm,"").trim();
        result.link = $(this).find("a").attr("href");
        result.storyId = $(this).parent("li").attr("id");
        if(result.title != '' && result.storyId != undefined) {
         
            var entry = new Article(result);
            
          
            Article.update(
                {storyId: entry.storyId},
                {$setOnInsert: entry},
                {upsert: true},
                function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                }
            );
        }
      })
    }).on('response', function(response){
        res.send(response);
    });
  });

module.exports.Router = router;