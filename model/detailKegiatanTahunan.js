const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	idKegiatan : ObjectID,
	namaKegiatan : String,
	tglSelesai : Date,  
	targetBiaya : String,  
	targetKuantitas : String,  
    hasil : String,
	created_at: {type:String , default:new Date().toISOString()},
	update_at: {type:String , default:new Date().toISOString()}
});
module.exports = mongoose.model('detailKegiatanTahunan', mongoSchema);