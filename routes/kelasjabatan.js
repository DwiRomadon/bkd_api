const kelasJabatan = require('../controller/kelasjabatan')
const { requestResponse } = require('../setup')
module.exports = router => {
	router.post('/kelasjabatan', (req, res) => {
		kelasJabatan.create(req.body)
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.get('/kelasjabatan', (req, res) => {
		kelasJabatan.getKelasJabatan()
			.then(result => {
				res.json(result)
			})
			.catch(err => {
				res.json(err)
			});

	});

	router.put('/kelasjabatan/:_id', (req, res) => {
		kelasJabatan.updateKelasJabatan(req.params._id,req.body)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});

	router.delete('/kelasjabatan/:_id', (req, res) => {
		kelasJabatan.delete(req.params._id)
			.then(result => {
				res.json(result)
			})	
			.catch(err => {
				res.json(err)
			});

	});


}
