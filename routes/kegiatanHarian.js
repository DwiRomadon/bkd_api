'use strict'

const jwt = require('jsonwebtoken');
const controller = require('../controller/kegiatanHarian');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
const uploadSetting = require("../utilities/uploadImg");
module.exports = router => {
	router.post('/kegiatanHarian',uploadSetting.upload.single('myFile'), (req, res) => {
		const file = req.file 
		req.body.status = JSON.parse(req.body.status)
		if (file!=undefined){
			req.body.filename = file.filename
		}
		controller.createKegiatan(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/kegiatanHarian/:_id', (req, res) => {
		controller.listKegiatan(req.params._id)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/kegiatanHarian/:_id',uploadSetting.upload.single('myFile') ,(req, res) => {
		const file = req.file 
	
		req.body.status = JSON.parse(req.body.status)
		if (file!=undefined){
			req.body.filename = file.filename
		}
		controller.updateKegiatan(req.params._id, req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/kegiatanHarian/:_id', (req, res) => {
		controller.deleteKegiatan(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
