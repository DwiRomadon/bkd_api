'use strict'

const jwt = require('jsonwebtoken');
const controller = require('../controller/newKegiatanHarian');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
const uploadSetting = require("../utilities/uploadImg");
module.exports = router => {
	router.post('/newKegiatanHarian', uploadSetting.upload.array('myFile', 20), (req, res) => {
		let myObj = {};
		var data = [] ;
		let index;
		const file = req.files
		req.body.status = JSON.parse(req.body.status)
		req.body.location = JSON.parse(req.body.location)
		req.body.atasan = JSON.parse(req.body.atasan)

		if (file != undefined) {
			for (index in file) {
				delete file[index].fieldname
				delete file[index].originalname
				delete file[index].encoding
				delete file[index].mimetype
				delete file[index].destination
				delete file[index].path
				delete file[index].size
				// console.log(myObj)
				// data.push(file)
			}
			req.body.file = file
			// data.push(obj)
			// req.body.filename = filename
		}
		// console.log(req.body)
		controller.createKegiatan(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/newKegiatanHarian/:_id/:tgl', (req, res) => {
		controller.listKegiatan(req.params._id, req.params.tgl)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});
	router.get('/listKegiatanBawahan/:idatasan/:tgl', (req, res) => {
		controller.listKegiatanBawahan(req.params.idatasan, req.params.tgl)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/newKegiatanHarian/:_id', uploadSetting.upload.array('myFile', 20), (req, res) => {
		let index
		const file = req.files
		let filename = []
		req.body.status = JSON.parse(req.body.status)

		// for (index in file) {
		// 	filename.push(file[index].filename)
		// }

		if (file.length !== 0) {
			// req.body.filename = filename
			for (index in file) {
				delete file[index].fieldname
				delete file[index].originalname
				delete file[index].encoding
				delete file[index].mimetype
				delete file[index].destination
				delete file[index].path
				delete file[index].size
				// console.log(myObj)
				// data.push(file)
			}
			req.body.file = file
		}
		controller.updateKegiatan(req.params._id, req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/approveKegiatan/:_id', uploadSetting.upload.single('myFile'), (req, res) => {
		const file = req.file
		req.body.status = JSON.parse(req.body.status)
		// req.body.location = JSON.parse(req.body.location)
		if (file != undefined) {
			req.body.filename = file.filename
		}
		controller.approveKegiatan(req.params._id, req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/newKegiatanHarian/:_id', (req, res) => {
		controller.deleteKegiatan(req.params._id)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});


}
