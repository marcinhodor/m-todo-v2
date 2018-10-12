const mongoose = require('mongoose')

var TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    require: true,
    minlength: 1
  },
  category: {
    type: String,
    require: true,
    minlength: 1
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
})

var Todo = mongoose.model('Todo', TodoSchema)

module.exports = { Todo }
