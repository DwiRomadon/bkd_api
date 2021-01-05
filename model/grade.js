const mongoose = require('mongoose');
const moment = require('moment');
const ObjectID = require("mongodb").ObjectID;
const mongoSchema = mongoose.Schema({
	unitKerja : ObjectID,
	jabatan : ObjectID,
	tunjangan: Number
});
module.exports = mongoose.model('grade', mongoSchema);