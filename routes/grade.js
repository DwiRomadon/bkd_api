'use strict'

const jwt = require('jsonwebtoken');
const grade = require('../controller/grade');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/grade', (req, res) => {
		grade.creategrade	(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/grade', (req, res) => {
		grade.listgrade()
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/grade/:_id', (req, res) => {
		console.log(req.params._id)
		grade.updategrade(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/grade/:_id', (req, res) => {
		grade.deletegrade(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
