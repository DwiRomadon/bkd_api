const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	username : String,
	// nama : String,
	// email : String,
	// jabatan : ObjectID,
	// unitKerja : ObjectID,
	// bagian : String,
	role : String,
	idPegawai: String,
	// golongan : ObjectID,
	hashed_password	: String,
	token : {type :String , default :''},
	created_at: {type:String , default:new Date().toISOString()},
	update_at: {type:String , default:new Date().toISOString()}
});
module.exports = mongoose.model('user', mongoSchema);