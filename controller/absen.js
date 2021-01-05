const absen = require("../model/absen");
const user = require("../model/user_model");
const { requestResponse } = require("../setup");
const mongoose = require("mongoose");
const ObjectID = require("mongodb").ObjectID;
exports.createabsen = (body) =>
  new Promise((resolve, reject) => {
    body.created_at = new Date().toISOString();
    body.location = JSON.parse(body.location);
    console.log(new Date().getHours());
    if (new Date().getHours() >= 6) {
      if (body.status == "Hadir") {
        if (new Date().getHours() >= 7) {
          if (new Date().getMinutes() >= 15) {
            body.keterangan = "Terlambat";
          } else {
            body.keterangan = "Tepat Waktu";
          }
        } else {
          body.keterangan = "Tepat Waktu";
        }
      } else {
        body.keterangan = "-";
      }
      const newData = new absen(body);
      newData
        .save()
        .then(() => resolve(requestResponse.common_success))
        .catch((err) => {
          reject(requestResponse.common_error);
        });
    } else {
      reject(requestResponse.common_absen_error);
    }
  });

exports.createAbsenByAdmin = (body) =>
  new Promise((resolve, reject) => {
    absen.create(body)
      .then(() => resolve(requestResponse.common_success))
      .catch(() => reject(requestResponse.common_error))
  })

exports.listAbsen = (body) =>
  new Promise((resolve, reject) => {
    // user.aggregate([
    //   {
    //     $match: {
    //       unitKerja: ObjectID(body.unitKerja),
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "absens",
    //       localField: "username",
    //       foreignField: "username",
    //       as: "absen",
    //     },
    //   },
    //   {
    //     $unwind: '$absen'
    //   },
    //   {
    //     $match: {
    //       'absen.created_at': {
    //         $gte: new Date(body.tglMulai)
    //       }
    //     }
    //   },
    //   // { $replaceRoot: { newRoot: "$all" } },
    //   { "$group": {
    //       "_id": "$_id",
    //       doc: {'$first': '$$ROOT'},
    //       "a": { "$push": "$absen" },
    //       count: { $sum: 1 }
    //     }
    //   },
    //   {
    //     "$replaceRoot": {
    //       "newRoot": { $mergeObjects: [{ total: "$count"}, '$doc']} }
    //   }
    // ]).then(res => {
    //   console.log(res)
    //   resolve(requestResponse.common_success_with_data(res))
    // })
    try {
      const newDate = new Date(body.tglSelesai)
      const tglSelesai = new Date(newDate.setDate(newDate.getDate() + 1))
      user
      .aggregate([
        {
          $match: {
            unitKerja: ObjectID(body.unitKerja),
          },
        },
        {
          $lookup: {
            from: "absens",
            localField: "username",
            foreignField: "username",
            as: "absen",
          },
        },
        {
          $project: {
            data: "$$ROOT",
            absen: {
              $filter: {
                input: "$absen",
                as: "absens",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$absens.created_at",
                        new Date(body.tglMulai),
                      ],
                    },
                    {
                      $lte: [
                        "$$absens.created_at",
                        tglSelesai,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      ])
      .then((result) => {
        resolve(requestResponse.common_success_with_data(result));
      })
      .catch((err) => {
        console.log(err);
        reject(requestResponse.common_error);
      });
    } catch (err) {
      console.log(err);
    }
  });

exports.listAbsenByid = (body) =>
  new Promise((resolve, reject) => {
    const newDate = new Date(body.tglSelesai)
    const tglSelesai = new Date(newDate.setDate(newDate.getDate() + 1))
    try {
      user
      .aggregate([
        {
          $match: { username: body.username },
        },
        {
          $lookup: {
            from: "absens",
            localField: "username",
            foreignField: "username",
            as: "absen",
          },
        },
        {
          $lookup: {
            from: "unitkerjas",
            localField: "unitKerja",
            foreignField: "_id",
            as: "unitKerjas",
          },
        },
        {$unwind: '$unitKerjas'},
        {
          $lookup: {
            from: "jabatans",
            localField: "jabatan",
            foreignField: "_id",
            as: "jabatans",
          },
        },
        {$unwind: '$unitKerjas'},
        {$unwind: '$jabatans'},
        {
          $project: {
            data: "$$ROOT",
            absen: {
              $filter: {
                input: "$absen",
                as: "absens",
                cond: {
                  $and: [
                    {
                      $gte: [
                        "$$absens.created_at",
                        new Date(body.tglMulai),
                      ],
                    },
                    {
                      $lte: [
                        "$$absens.created_at",
                        tglSelesai,
                      ],
                    },
                  ],
                },
              },
            },
          },
        }
      ])
      .then((result) =>
        {
          console.log(result)
          resolve(requestResponse.common_success_with_data(result[0].data))
        }
      )
      .catch((err) => {
        console.log(err);
        reject(requestResponse.common_error)
      });
    } catch (err) {
      console.log(err)
    }
  });

exports.updateAbsen = (_id, body) =>
  new Promise((resolve, reject) => {
    body.created_at = new Date(body.created_at);
    if (body.created_at.getHours() >= 6) {
      if (body.status == "Hadir") {
        if (body.created_at.getHours() >= 7) {
          if (body.created_at.getMinutes() >= 15) {
            body.keterangan = "Terlambat";
          } else {
            body.keterangan = "Tepat Waktu";
          }
        } else {
          body.keterangan = "Tepat Waktu";
        }
      } else {
        body.keterangan = "-";
      }
      body.created_at = new Date(body.created_at).toISOString();
      body.update_at = new Date().toISOString();
      absen
        .updateOne({ _id: ObjectID(_id) }, body)
        .then((result) => resolve(requestResponse.common_success))
        .catch((err) => {
          console.log(err);
          reject(requestResponse.common_error);
        });
    } else {
      reject(requestResponse.common_absen_error);
    }
  });

exports.deleteAbsen = (_id) =>
  new Promise((resolve, reject) => {
    absen
      .deleteOne({ _id: ObjectID(_id) })
      .then((result) => resolve(requestResponse.common_success))
      .catch((err) => {
        console.log(err);
        reject(requestResponse.common_error);
      });
  });
