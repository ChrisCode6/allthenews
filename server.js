var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.Promise = Promise;

var app = express();

var PORT = process.env.PORT || 3000;


var hbs = exphbs({
    defaultLayout: 'main',
    helpers: {
        section: function(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

app.engine('handlebars', hbs);
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({
  extended: false
}));


app.use(express.static("public"));


mongoose.connect("");
var db = mongoose.connection;


db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});


db.once("open", function() {
  console.log("Mongoose connection successful.");
});


var routes = require('./controllers/articleController.js').Router;
app.use('/', routes);

app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});
