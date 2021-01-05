const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	username : {type:String , default:''} ,
	ID_Peg : String ,
	namaPeg : String ,
    atasan : {
		nama : String,
		ID_Peg : String
	} ,
	nama : String,
	deskripsi : String,
    idPoinKegiatan : ObjectID,
	idKegiatanBulanan: ObjectID,
	file : [{
		filename : String
	}] ,
	status : {
		label : String ,
		ket : String
	},
	location : {
		lat : String,
		lng : String,
	},
	angkaKredit : String ,
	created_at: {type:Date , default: new moment().toISOString()},
	update_at: {type:Date , default: new moment().toISOString()}
});
module.exports = mongoose.model('newKegiatanHarian', mongoSchema);
