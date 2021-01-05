const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	kelas: Number,
	created_at: {type:String , default:new Date().toISOString()},
	update_at: {type:String , default:new Date().toISOString()}
});
module.exports = mongoose.model('kelasjabatan', mongoSchema)