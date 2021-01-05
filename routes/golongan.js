const golongan = require('../controller/golongan')
module.exports = router => {
	router.post('/golongan', (req, res) => {
		golongan.create(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/golongan', (req, res) => {
		golongan.getgolongan()
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	})

	router.put('/golongan/:_id', (req, res) => {
		golongan.updategolongan(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/golongan/:_id', (req, res) => {
		golongan.delete(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
