const model = require("../model/newKegiatanHarian");
const newAbsen = require("../model/newAbsen");
const moment = require("moment");
const { requestResponse } = require("../setup");
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
exports.createKegiatan = (body) =>
  new Promise((resolve, reject) => {
      try {
          Object.assign(body, {
              created_at: new moment().toLocaleString()
          })
          model
            .create(body)
            .then(() => resolve(requestResponse.common_success))
            .catch((err) => {
              reject(requestResponse.common_error);
            });
      } catch (e) {
          console.log(e)
      }
  });

exports.listKegiatan = (_id, tgl) =>
  new Promise((resolve, reject) => {
    model
      .aggregate([
        {
          $match: {
            ID_Peg: _id,
            created_at : { "$gte" : new Date(tgl) }
          },
        },
        {
          $lookup: {
            from: "point_kegiatans",
            localField: "idPoinKegiatan",
            foreignField: "_id",
            as: "kegiatan",
          },
        },
      ]).sort({_id : -1 })
      .then((result) => {
        resolve(requestResponse.common_success_with_data(result));
      })
      .catch((err) => {
        reject(requestResponse.common_error);
      });
  });

  exports.listKegiatanBawahan = (_id, tgl) =>
  new Promise((resolve, reject) => {
    model.find({"atasan.ID_Peg" : _id, created_at : {"$gte": new Date(tgl)}})
    .sort({_id : -1})
      .then((result) => {
        resolve(requestResponse.common_success_with_data(result));
      })
      .catch((err) => {
        reject(requestResponse.common_error);
      });
  });

exports.updateKegiatan = (_id, body) =>
  new Promise((resolve, reject) => {
    body.update_at = new Date().toISOString();
    model
      .updateOne({ _id: ObjectID(_id) }, body)
      .then((result) => {
        resolve(requestResponse.common_success);
      })
      .catch((err) => {
        console.log(err);
        reject(requestResponse.common_error);
      });
  });

exports.approveKegiatan = (_id, body) =>
  new Promise((resolve, reject) => {
    body.update_at = new Date().toISOString();
    var location = body.location;
    // console.log(moment(body.created_at).format("YYYY-MM-DD"))
    console.log(location)
    model
      .updateOne({ _id: ObjectID(_id) }, body)
      .then((result) => {
        console.log(body.username);
        newAbsen
          .updateOne(
            {
              username: body.username,
              created_at: moment(body.created_at).format("YYYY-MM-DD"),
            },{
            $set : {
                username: body.username,
                filename: "" ,
                keterangan : "" ,
                location: location,
                status: "Hadir",
                created_at: moment(body.created_at).format("YYYY-MM-DD"),
                update_at: new Date().toISOString()

            }},
            { upsert: true }
          )
          .then((results) => {
            // console.log(results);
            resolve(requestResponse.common_success);
          })
          .catch((err) => {
            console.log(err);
            reject(requestResponse.common_error);
          });
      })
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
