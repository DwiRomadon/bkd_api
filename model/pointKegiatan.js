const mongoose = require('mongoose');
const moment = require('moment');
const mongoSchema = mongoose.Schema({
	nama : String,
	deskripsi : String,
	poin : String,  
	created_at: {type:String , default:new Date().toISOString()},
	update_at: {type:String , default:new Date().toISOString()}
});
module.exports = mongoose.model('point_kegiatan', mongoSchema);