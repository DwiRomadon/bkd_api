const { requestResponse } = require('../setup')
const tpp = require('../controller/tpp')
module.exports = router => {
	router.post('/tpp', (req, res) => {
    tpp.getTppPerorangan(req.body)
      .then(result => {
        res.json(result)
      }).catch(err => res.json(err))
  })
}