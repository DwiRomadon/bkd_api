const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	idKegiatan : ObjectID,
	bulan : String,
	namaKegiatan : String,
	targetKuantitas : String,
	capaianKuantitas : String,
	hasil : String,  
	targetBiaya : String,  
	biaya : String, 
	idPegawai : ObjectID ,
	pemberiTugas : ObjectID ,
	created_at: {type:String , default:new Date().toISOString()},
	update_at: {type:String , default:new Date().toISOString()}
});
module.exports = mongoose.model('kegiatanBulanan', mongoSchema);