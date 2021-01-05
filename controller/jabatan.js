const jabatan = require('../model/jabatan');
const { requestResponse } = require('../setup')
const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;
exports.createjabatan = (body) =>
  new Promise((resolve, reject) => {

    const newUser = new jabatan(
      body
    );
    newUser.save()
      .then(() => resolve(requestResponse.common_success))
      .catch(err => {
        reject(requestResponse.common_error);
      });

  });

exports.listjabatan = () =>
  new Promise((resolve, reject) => {
    jabatan.aggregate([
      {
        $lookup: {
          from: "kelasjabatans",
          localField: "kelas",
          foreignField: "_id",
          as: "kelasJabatan",
        }
      },
      {$unwind: '$kelasJabatan'}
    ])
      .then((result) => resolve(requestResponse.common_success_with_data(result)))
      .catch(err => {
        reject(requestResponse.common_error);
      });

  });

exports.updatejabatan = (_id, body) =>
  new Promise((resolve, reject) => {

    body.update_at = new Date().toISOString()
    jabatan.updateOne({ _id: ObjectID(_id) }, body)
      .then((result) => resolve(requestResponse.common_success))
      .catch(err => {
        console.log(err)
        reject(requestResponse.common_error);
      });

  });

exports.deletejabatan = (_id) =>
  new Promise((resolve, reject) => {
    jabatan.deleteOne({ _id: ObjectID(_id) })
      .then((result) => resolve(requestResponse.common_success))
      .catch(err => {
        console.log(err)
        reject(requestResponse.common_error);
      });
  });