'use strict'

const jwt = require('jsonwebtoken');
const controller = require('../controller/detailKegiatanTahunan');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/detailKegiatanTahunan', (req, res) => {
		controller.createKegiatan(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/detailKegiatanTahunan/:idKegiatan', (req, res) => {
		controller.listKegiatan(req.params.idKegiatan)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/detailKegiatanTahunans/:_id', (req, res) => {
		console.log(req.params._id);
		controller.getKegiatanByid(req.params._id)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/detailKegiatanTahunan/:_id', (req, res) => {
		console.log(req.params._id)
		controller.updateKegiatan(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/detailKegiatanTahunan/:_id', (req, res) => {
		controller.deleteKegiatan(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
