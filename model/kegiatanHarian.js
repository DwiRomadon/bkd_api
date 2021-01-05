const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	nama : String,
	deskripsi : String,
    idPoinKegiatan : ObjectID,
	idKegiatanBulanan: ObjectID,
	filename : {type:String , default:''}, 
	status : {
		label : String , 
		ket : String
	},
	angkaKredit : String ,
	created_at: {type:String , default:new Date().toISOString()},
	update_at: {type:String , default:new Date().toISOString()}
});
module.exports = mongoose.model('kegiatanHarian', mongoSchema);