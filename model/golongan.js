const mongoose = require('mongoose')
const mongoSchema = mongoose.Schema({
  golongan: String,
	nama : String,
})
module.exports = mongoose.model('golongan', mongoSchema)