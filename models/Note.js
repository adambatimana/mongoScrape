var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Create the Note schema
var NoteSchema = new Schema({
  title: {
    type: String
  },
  body: {
    type: String
  }
});

// Remember, Mongoose will automatically save the ObjectIds of the notes
// These ids are referred to in the Article model

// Create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
