'use strict'

const jwt = require('jsonwebtoken');
const absen = require('../controller/absen');
const config = require('../config/config.json');
const fs = require('fs')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
const uploadSetting = require("../utilities/uploadImg");
module.exports = router => {
	router.post('/absen',uploadSetting.upload.single('myFile'), (req, res) => {
	
		const file = req.file 
		if (file!=undefined){
			req.body.filename = file.filename
		}
		
		absen.createabsen(req.body)
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
		
		absen.createAbsenByAdmin(req.body)
			.then(result => res.json(result))
			.catch(err => res.json(err))

	});

	router.get('/absen', (req, res) => {
	
		let myObj = new Object()
		myObj.unitKerja = req.query.unitkerja
		myObj.tglMulai = req.query.tglmulai
		myObj.tglSelesai = req.query.tglselesai
		absen.listAbsen(myObj)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});


	router.get('/detailabsen', (req, res) => {
		absen.listAbsenByid(req.query)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/absen/:_id',uploadSetting.upload.single('myFile'), (req, res) => {
		const file = req.file 
		if (file!=undefined){
			req.body.filename = file.filename
		}
		// console.log(req.body)
		absen.updateAbsen(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/absen/:_id', (req, res) => {
		absen.deleteAbsen(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
