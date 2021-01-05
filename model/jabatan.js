const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	nama : String,
	nilai: Number,
	kelas: ObjectID
});
module.exports = mongoose.model('jabatan', mongoSchema);