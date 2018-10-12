const mongoose = require('mongoose')

var CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 1
  }
})

var Category = mongoose.model('Category', CategorySchema)

module.exports = {
  Category
}