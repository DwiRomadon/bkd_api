'use strict'

const jwt = require('jsonwebtoken');
const controller = require('../controller/kegiatanBulanan');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/kegiatanBulanan', (req, res) => {
		controller.createKegiatan(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/kegiatanBulanan/:_id', (req, res) => {
		controller.listKegiatan(req.params._id)
			.then(result => {
				res.json(requestResponse.common_success_with_data(result))
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/kegiatanBulanan/:_id', (req, res) => {
		console.log(req.params._id)
		controller.updateKegiatan(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/kegiatanBulanan/:_id', (req, res) => {
		controller.deleteKegiatan(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
