'use strict'

const jwt = require('jsonwebtoken');
const newAbsen = require('../controller/newAbsen');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
const uploadSetting = require("../utilities/uploadImg");
module.exports = router => {
	router.post('/newAbsen',uploadSetting.upload.single('myFile'), (req, res) => {
	
		const file = req.file 
		if (file!=undefined){
			req.body.filename = file.filename
		}
		
		newAbsen.createabsen(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.post('/absenbyadmin',uploadSetting.upload.single('myFile'), (req, res) => {
	
		const file = req.file 
		if (file!=undefined){
			req.body.filename = file.filename
		}
		
		newAbsen.createAbsenByAdmin(req.body)
			.then(result => res.json(result))
			.catch(err => res.json(err))

	});

	router.get('/newAbsen', (req, res) => {
	
		let myObj = new Object()
		myObj.unitKerja = req.query.unitkerja
		myObj.tglMulai = req.query.tglmulai
		myObj.tglSelesai = req.query.tglselesai
		newAbsen.listAbsen(myObj)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});


	router.get('/detailabsen', (req, res) => {
		newAbsen.listAbsenByid(req.query)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/newAbsen/:_id',uploadSetting.upload.single('myFile'), (req, res) => {
		const file = req.file 
		if (file!=undefined){
			req.body.filename = file.filename
		}
		// console.log(req.body)
		newAbsen.updateAbsen(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/newAbsen/:_id', (req, res) => {
		newAbsen.deleteAbsen(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
