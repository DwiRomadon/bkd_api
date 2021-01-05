const model = require("../model/kegiatanBulanan");
const { requestResponse } = require("../setup");
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
exports.createKegiatan = (body) =>
  new Promise((resolve, reject) => {
    const newData = new model(body);
    newData
      .save()
      .then(() => resolve(requestResponse.common_success))
      .catch((err) => {
        reject(requestResponse.common_error);
      });
  });

exports.listKegiatan = (_id) =>
  new Promise((resolve, reject) => {
    model
      .aggregate([
        { $match: { idKegiatan: ObjectID(_id) } },
        {
          $lookup: {
            from: "users",
            localField: "idPegawai",
            foreignField: "_id",
            as: "pegawai",
          },
        },
        { $unwind: "$pegawai" },
        // { $unwind: "$pemberiTugas" },
      ])
      .then((result) => resolve(result))
      .catch((err) => {
        reject(requestResponse.common_error);
      });
  });

exports.updateKegiatan = (_id, body) =>
  new Promise((resolve, reject) => {
    body.update_at = new Date().toISOString();
    model
      .updateOne({ _id: ObjectID(_id) }, body)
      .then((result) => resolve(requestResponse.common_success))
      .catch((err) => {
        console.log(err);
        reject(requestResponse.common_error);
      });
  });

exports.deleteKegiatan = (_id) =>
  new Promise((resolve, reject) => {
    model
      .deleteOne({ _id: ObjectID(_id) })
      .then((result) => resolve(requestResponse.common_success))
      .catch((err) => {
        console.log(err);
        reject(requestResponse.common_error);
      });
  });
