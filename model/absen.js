const mongoose = require('mongoose');
const moment = require('moment');
const mongoSchema = mongoose.Schema({
	username : String,
	location : {
		lat : String,
		lng : String,
	},
	filename : {type:String , default:''},
	status : String , 
	keterangan : {type:String , default:''},
	created_at: Date ,
	// created_at: String ,
	update_at: {type:String , default:new Date().toISOString()}
});
module.exports = mongoose.model('absen', mongoSchema);