'use strict'

const jwt = require('jsonwebtoken');
const quantitas = require('../controller/quantitas');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/quantitas', (req, res) => {
		quantitas.createquantitas	(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/quantitas', (req, res) => {
		quantitas.listquantitas()
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/quantitas/:_id', (req, res) => {
		quantitas.updatequantitas(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/quantitas/:_id', (req, res) => {
		quantitas.deletequantitas(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
