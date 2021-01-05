'use strict'

const jwt = require('jsonwebtoken');
const controller = require('../controller/kegiatanTahunan');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/kegiatanTahunan', (req, res) => {
		controller.createKegiatan(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/kegiatanTahunan', (req, res) => {
		controller.listKegiatan()
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

    });
    
    router.get('/kegiatanTahunan/:_id', (req, res) => {
		controller.getKegiatanByid(req.params._id)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/kegiatanTahunan/:_id', (req, res) => {
		console.log(req.params._id)
		controller.updateKegiatan(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/kegiatanTahunan/:unitKerja/:username', (req, res) => {
		let unitKerja = req.params.unitKerja
		let username = req.params.username
		controller.getKegiatanByUser(unitKerja,username)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/kegiatanByPejabat/:idPejabatPenilai', (req, res) => {
		console.log(req.params.idPejabatPenilai)
		controller.listKegiatanByPejabatPenilai(req.params.idPejabatPenilai)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/kegiatanTahunan/:_id', (req, res) => {
		controller.deleteKegiatan(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
