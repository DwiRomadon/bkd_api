const kelasJabatan = require('../model/kelasjabatan');
const { requestResponse } = require('../setup')
const ObjectID = require('mongodb').ObjectID;
exports.create = (body) =>
    new Promise((resolve, reject) => {
        kelasJabatan.create(body)
            .then(() => resolve(requestResponse.common_success))
            .catch(() => reject(requestResponse.common_error));

    });

exports.getKelasJabatan = () =>
    new Promise((resolve, reject) => {
        kelasJabatan.find()
            .then((result) => resolve(requestResponse.common_success_with_data(result)))
            .catch(() => reject(requestResponse.common_error))

    })

exports.updateKelasJabatan = (_id, body) =>
    new Promise((resolve, reject) => {
      body.update_at = new Date().toISOString()
      kelasJabatan.updateOne({_id: ObjectID(_id) }, body)
        .then(() => resolve(requestResponse.common_success))
        .catch(() => reject(requestResponse.common_error))
    })

exports.delete = (_id) =>
  new Promise((resolve, reject) => {
    kelasJabatan.deleteOne({ _id: ObjectID(_id) })
      .then(() => resolve(requestResponse.common_success))
      .catch(() => reject(requestResponse.common_error))
  })