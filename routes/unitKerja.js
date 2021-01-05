'use strict'

const jwt = require('jsonwebtoken');
const unitKerja = require('../controller/unitKerja');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/unitKerja', (req, res) => {
		unitKerja.createunitKerja(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/unitKerja', (req, res) => {
		unitKerja.listunitKerja()
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/unitKerja/:_id', (req, res) => {
		unitKerja.updateunitKerja(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/unitKerja/:_id', (req, res) => {
		unitKerja.deleteunitKerja(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
