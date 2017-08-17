// DEPENDANCIES
let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let logger = require("morgan");

//require articles
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
//scraping tools
let request = require("request");
let cheerio = require("cheerio");

mongoose.Promise = Promise;

//initialize express
let app = express();

//morgan and body parser
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static("public"));

//database config with mongoose
mongoose.connect("mongodb://localhost/webscrape");
let db = mongoose.connection;
//errors
db.on("error", function(error) {
    console.log("MOngoose ERROR: ", error);
});

//log success message
db.once("open", function() {
    console.log("MONGOOSE CONNECT SUCCESS!")
})

// ============================================
//              ROUTES
// ============================================


app.get("/scrape", function(req, res) {
    request("http://www.echojs.com/", function(error, response, html) {
        let $ = cheerio.load(html);
        //grab h2 in artcile tags and save them as prop of result object
        $("article h2").each(function(i, element) {
            let result = {};
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            let entry = new Article(result);

            entry.save(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(doc);
                }
            }); //end entry.save
        }); //end .EACH
    }); //end request
    res.send("SCRAPE COMPLETED!")
}); //end app.get


//get articles scraped from mongodb
app.get("/articles", function(req, res) {
    Article.find({}, function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        } //end ifelse
    }); //end find
}); //end app.get

app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ "_id": req.params.id })
        // ..and populate all of the notes associated with it
        .populate("note")
        // now, execute our query
        .exec(function(error, doc) {
            // Log any errors
            if (error) {
                console.log(error);
            }
            // Otherwise, send the doc to the browser as a json object
            else {
                res.json(doc);
            }
        });
});

//create a new note or replace existing once
app.post("/articles/:id", function(req, res) {
    let newNote = new Note(req.body);

    newNote.save(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send(doc);
                    }

                }); //end execute
        } //end ifelse
    }); //end newNote.save
}); //end post


//delete notes

//delete articles


//listen on port
app.listen(8000, function() {
    console.log("App running on port 8000!");
});