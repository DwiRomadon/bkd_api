const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	tahun : String,
	tglMulai : Date,
	tglSelesai : Date,  
	unitKerja : ObjectID,  
	username : String,  
	pejabatPenilai : ObjectID,  
    atasanPejabatPenilai : ObjectID,
	created_at: {type:String , default:new Date().toISOString()},
	update_at: {type:String , default:new Date().toISOString()}
});
module.exports = mongoose.model('kegiatanTahunan', mongoSchema);