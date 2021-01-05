const mongoose = require('mongoose');
const moment = require('moment');
const mongoSchema = mongoose.Schema({
	nama : String,
	
});
module.exports = mongoose.model('quantitas', mongoSchema);