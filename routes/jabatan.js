'use strict'

const jwt = require('jsonwebtoken');
const jabatan = require('../controller/jabatan');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/jabatan', (req, res) => {
		jabatan.createjabatan	(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/jabatan', (req, res) => {
		jabatan.listjabatan()
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/jabatan/:_id', (req, res) => {
		console.log(req.params._id)
		jabatan.updatejabatan(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/jabatan/:_id', (req, res) => {
		jabatan.deletejabatan(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
