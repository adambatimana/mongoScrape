// DEPENDANCIES
let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let logger = require("morgan");

 //require articles

 //scraping tools
 let request = require("request");
 let cheerio = require("cheerio");

 mongoose.Promise = Promise;

 //initialize express
 let app = express();

 //morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended:false
}));

//database config with mongoose

mongoose.connect("mongodb://localhost/webscrape");
let db = mongoose.connection;
//errors
db.on("error", function(error){
  console.log("MOngoose ERROR: ", error);
});

//log success message
db.once("open", function(){
    console.log("MONGOOSE CONNECT SUCCESS!")
})

// ============================================
//              ROUTES
// ============================================


app.get("/scrape", function(req,res){
      request("http://www. .com/", function(error,response,html){
            let $ = cheerio.load(html);
                //grab h2 in artcile tags and save them as prop of result object
                $("").each(function(i,element){
                      let result = {};
                      result.title = $(this).children("a").text();
                      result.link = $(this).children("a").attr("href");

                      let entry = new Article(result);

                      entry.save(function(err,doc){
                            if (err) {
                                console.log(err);
                            }
                            else{
                                console.log(doc);
                            }
                      });//end entry.save
                });//end .EACH
      });//end request
      res.send("SCRAPE COMPLETED!")
});//end app.get


//get articles scraped from mongodb
app.get("/articles", function(req,res){
      Article.find({},function(error,doc){
            if (error) {
                console.log(error);
            } else {
                res.json(doc);
            }//end ifelse
      });//end find
});//end app.get

//create a new note or replace existing once
app.post("/articles/:id", function(req,res){
      let newNote = new Note(req.body);

      newNote.save(function(error,doc){
            if (error) {
                console.log(error);
            } else {
                Article.findOneAndUpdate({"_id" : req.params.id}, {"note" : doc._id})
                .execute(function(err,doc){
                      if (err) {
                        console.log(err);
                      } else {
                        res.send(doc);
                      }

                });//end execute
            }//end ifelse
      });//end newNote.save
});//end post

//listen on port
app.listen(8000, => console.log("APP RUNNING ON PORT 8000!"));

// app.listen(3000, function() {
//   console.log("App running on port 3000!");
// });
