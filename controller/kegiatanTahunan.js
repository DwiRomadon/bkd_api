const model = require("../model/kegiatanTahunan");
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

exports.listKegiatan = () =>
  new Promise((resolve, reject) => {
    model
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "pejabatPenilai",
            foreignField: "_id",
            as: "pejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "atasanPejabatPenilai",
            foreignField: "_id",
            as: "atasanPejabatPenilai",
          },
        },
      ])
      .then((result) => {
        // resolve(result)

        resolve(requestResponse.common_success_with_data(result));
      })
      .catch((err) => {
        reject(requestResponse.common_error);
      });
  });

exports.getKegiatanByid = (_id) =>
  new Promise((resolve, reject) => {
    model
      .aggregate([
        { $match: { _id: ObjectID(_id) } },
        {
          $lookup: {
            from: "users",
            localField: "pejabatPenilai",
            foreignField: "_id",
            as: "pejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "atasanPejabatPenilai",
            foreignField: "_id",
            as: "atasanPejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "detailkegiatantahunans",
            localField: "_id",
            foreignField: "idKegiatan",
            as: "detailKegiatan",
          },
        },
        {
          $lookup: {
            from: "kegiatanbulanans",
            localField: "detailKegiatan._id",
            foreignField: "idKegiatan",
            as: "kegiatanBulanan",
          },
        },
        {
          $lookup: {
            from: "kegiatanharians",
            localField: "kegiatanbulanan._id",
            foreignField: "idKegiatan",
            as: "kegiatanHarian",
          },
        },
       
        {$unwind : {"path":"$pejabatPenilai", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$detailKegiatan", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$atasanPejabatPenilai", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$kegiatanbulanan", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$kegiatanHarian", "preserveNullAndEmptyArrays": true } },
        
      ])
      .then((result) =>
        resolve(requestResponse.common_success_with_data(result))
      )
      .catch((err) => {
        reject(requestResponse.common_error);
      });
  });

exports.listKegiatanByPejabatPenilai = (idPejabatPenilai) =>
  new Promise((resolve, reject) => {
    model
      .aggregate([
        {
          $match: {
            pejabatPenilai: ObjectID(idPejabatPenilai),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "pejabatPenilai",
            foreignField: "_id",
            as: "pejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "atasanPejabatPenilai",
            foreignField: "_id",
            as: "atasanPejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "username",
            foreignField: "username",
            as: "bawahan",
          },
        },

        { $unwind: "$pejabatPenilai" },
        { $unwind: "$bawahan" },
        { $unwind: "$atasanPejabatPenilai" },
      ])
      .then((result) => {
        // resolve(result)

        resolve(requestResponse.common_success_with_data(result));
      })
      .catch((err) => {
        reject(requestResponse.common_error);
      });
  });

exports.getKegiatanByUser = (unitKerja, username) =>
  new Promise((resolve, reject) => {
    model
      .aggregate([
        {
          $match: {
            $and: [{ "username": username }, { unitKerja: ObjectID(unitKerja) }],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "username",
            foreignField: "username",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "pejabatPenilai",
            foreignField: "_id",
            as: "pejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "atasanPejabatPenilai",
            foreignField: "_id",
            as: "atasanPejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "detailkegiatantahunans",
            localField: "_id",
            foreignField: "idKegiatan",
            as: "detailKegiatan",
          },
        },
        {
          $lookup: {
            from: "jabatans",
            localField: "user.jabatan",
            foreignField: "_id",
            as: "jabatanUser",
          },
        },
        {
          $lookup: {
            from: "unitkerjas",
            localField: "user.unitKerja",
            foreignField: "_id",
            as: "unitKerjaUser",
          },
        },
        {
          $lookup: {
            from: "jabatans",
            localField: "pejabatPenilai.jabatan",
            foreignField: "_id",
            as: "jabatanPejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "unitkerjas",
            localField: "pejabatPenilai.unitKerja",
            foreignField: "_id",
            as: "unitKerjaPejabatPenilai",
          },
        },

        {
          $lookup: {
            from: "jabatans",
            localField: "atasanPejabatPenilai.jabatan",
            foreignField: "_id",
            as: "jabatanAtasanPejabatPenilai",
          },
        },
        {
          $lookup: {
            from: "unitkerjas",
            localField: "atasanPejabatPenilai.unitKerja",
            foreignField: "_id",
            as: "unitKerjaAtasanPejabatPenilai",
          },
        },
    
        {$unwind : {"path":"$pejabatPenilai", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$atasanPejabatPenilai", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$user", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$jabatanUser", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$unitKerjaUser", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$jabatanPejabatPenilai", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$unitKerjaPejabatPenilai", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$jabatanAtasanPejabatPenilai", "preserveNullAndEmptyArrays": true } },
        {$unwind : {"path":"$unitKerjaAtasanPejabatPenilai", "preserveNullAndEmptyArrays": true } }
       
      ])
      .then((result) =>
        resolve(requestResponse.common_success_with_data(result))
      )
      .catch((err) => {
        console.log(err);
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
