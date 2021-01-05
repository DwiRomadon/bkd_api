'use strict'
const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const userController = require('../controller/user_controller');
const password = require('../controller/password');
const config = require('../config/config.json');
const fs = require('fs')
const uploadUtil = require('../utilities/uploadImg')
const token = require('../controller/token')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.get('/', (req, res) => res.end('REST API BKD'));


	router.post('/users/signin', (req, res) => {
		const credentials = auth(req);
		if (!credentials) {
			res.status(400).json({ rm: 'Invalid Request !' });
		} else {
			userController.loginUser(credentials.name, credentials.pass)
				.then(result => {
					const token = jwt.sign(result, config.secret, { expiresIn: 1000000 });
					let username = result.message;
					userController.updateToken(username, token)
						.then((a) => {
							userController.getProfile(username)
								.then(dataUser => {
									res.json(requestResponse.common_success_with_data(dataUser))
								}).catch(err => res.json(err))
						}).catch(err => res.json(err))
				}).catch(err => res.json(err))
		}
	});

	router.get('/users/getprofile/:id', (req, res) => {
		userController.getProfileMySQL(req.params.id)
			.then(result => res.json(result))
			.catch(err => res.json(err))
	})

	var upload_ = uploadUtil.upload.fields([
		{ name: 'user_photo', maxCount: 1 }, { name: 'ktp_photo', maxCount: 1 }, { name: 'kk_photo', maxCount: 1 },
		{ name: 'ijasah_photo', maxCount: 1 }, { name: 'kendaraan_photo', maxCount: 1 }, { name: 'perusahaan_photo', maxCount: 1 }
	])

	router.post('/users/signup', (req, res) => {
		userController.registerUser(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/users/:id', (req, res) => {
		// console.log(req)
		if (token.checkToken(req)) {

			userController.getProfile(req.params.id)

				.then(result => res.json(result))

				.catch(err => res.json(err));

		} else {

			res.json(requestResponse.token_invalid)
		}
	});

	router.delete('/users/:username', (req, res) => {
		// console.log(req)

		userController.hapusUser(req.params.username)

			.then(result => res.json(result))

			.catch(err => res.json(err));


	});

	router.get('/users', (req, res) => {
		
			userController.getUsers()
				.then(result => res.json(result))
				.catch(err => res.json(err));
		
	});

	router.get('/users/list/:unitKerja', (req, res) => {
		
			userController.listUserByUnitKerja(req.params.unitKerja)
				.then(result => res.json(result))
				.catch(err => res.json(err));
		
	});

	router.get('/users/aktivasi/:nip', (req, res) => {
		userController.aktivasiUser(req.params.nip)
		.then(result => res.json(result))
		.catch(err => res.json(err))
	})

	router.put('/users/:id', (req, res) => {

		if (token.checkToken(req)) {

			const oldPassword = req.body.password;
			const newPassword = req.body.newPassword;

			if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

				res.status(400).json({ message: 'Invalid Request !' });

			} else {

				password.changePassword(req.params.id, oldPassword, newPassword)

					.then(result => res.status(result.status).json({ message: result.message }))

					.catch(err => res.status(err.status).json({ message: err.message }));

			}
		} else {

			res.json(requestResponse.token_invalid);
		}
	});

	router.post('/users/:id/password', (req, res) => {

		const email = req.params.id;
		const token = req.body.token;
		const newPassword = req.body.password;

		if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

			password.resetPasswordInit(email)

				.then(result => res.status(result.status).json({ message: result.message }))

				.catch(err => res.status(err.status).json({ message: err.message }));

		} else {

			password.resetPasswordFinish(email, token, newPassword)

				.then(result => res.status(result.status).json({ message: result.message }))

				.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});

	router.post('/users/checkToken', (req, res) => {
		const email = req.body.email;
		const token = req.headers['x-access-token'];
		userController.checkToken(email, token)
			.then(result => {
				res.json(result)
			})
			.catch(err => res.json(err));
	});

	router.put('/users/update/:username', (req, res) => {
		console.log(req.body)
		userController.updateUser(req.params.username, req.body)
			.then(result => {
				//res.setHeader('Location', '/users/'+email);
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/users/getAtasanDanBawahan/:idPegawai', (req, res) => {
		userController.getAtasanDanBawahan(req.params.idPegawai)
			.then(result => {
				//res.setHeader('Location', '/users/'+email);
				res.json(result)	
			})
			.catch(err => {
				res.json(err)
			});

	});
}
