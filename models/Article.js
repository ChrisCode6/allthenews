
var mongoose = require("mongoose");


var Schema = mongoose.Schema;


var ArticleSchema = new Schema({
  storyId: {
    type: String,
    required: true
  },

  title: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  },
  saved: {
    type: Boolean,
    default: false,
    required: true
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;