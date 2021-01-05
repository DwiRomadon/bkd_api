'use strict'

const jwt = require('jsonwebtoken');
const pointKegiatan = require('../controller/pointKegiatan');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/pointKegiatan', (req, res) => {
		pointKegiatan.createKegiatan	(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/pointKegiatan', (req, res) => {
		pointKegiatan.listKegiatan()
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/pointKegiatan/:_id', (req, res) => {
		console.log(req.params._id)
		pointKegiatan.updateKegiatan(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/pointKegiatan/:_id', (req, res) => {
		pointKegiatan.deleteKegiatan(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
