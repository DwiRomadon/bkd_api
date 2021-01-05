const golongann = require('../model/golongan');
const { requestResponse } = require('../setup')
const ObjectID = require('mongodb').ObjectID;
exports.create = (body) =>
    new Promise((resolve, reject) => {
        golongann.create(body)
            .then(() => resolve(requestResponse.common_success))
            .catch(() => reject(requestResponse.common_error));

    });

exports.getgolongan = () =>
    new Promise((resolve, reject) => {
        golongann.find()
            .then((result) => resolve(requestResponse.common_success_with_data(result)))
            .catch(() => reject(requestResponse.common_error))

    })

exports.updategolongan = (_id, body) =>
    new Promise((resolve, reject) => {
        body.update_at = new Date().toISOString()
        golongann.updateOne({_id: ObjectID(_id) }, body)
            .then(() => resolve(requestResponse.common_success))
            .catch(() => reject(requestResponse.common_error))
    })

exports.delete = (_id) =>
  new Promise((resolve, reject) => {
    golongann.deleteOne({ _id: ObjectID(_id) })
      .then(() => resolve(requestResponse.common_success))
      .catch(() => reject(requestResponse.common_error))
  })