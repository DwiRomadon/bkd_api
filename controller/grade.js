const grade = require('../model/grade');
const { requestResponse } = require('../setup')
const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;
exports.creategrade = (body) =>
    new Promise((resolve, reject) => {

        grade.create(body)
            .then(() => resolve(requestResponse.common_success))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.listgrade = () =>
    new Promise((resolve, reject) => {
        grade.aggregate([
            {
                $lookup: {
                    from: "unitkerjas",
                    localField: "unitKerja",
                    foreignField: "_id",
                    as: "unitKerja",
                }
            },
            {
                $lookup: {
                    from: "jabatans",
                    localField: "jabatan",
                    foreignField: "_id",
                    as: "jabatan",
                }
            },
            { $unwind: '$unitKerja' },
            { $unwind: '$jabatan' },
            {
                $lookup: {
                    from: "kelasjabatans",
                    localField: "jabatan.kelas",
                    foreignField: "_id",
                    as: "kelasJabatan",
                }
            },
            { $unwind: '$kelasJabatan' }
        ])
            .then((result) => resolve(requestResponse.common_success_with_data(result)))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.updategrade = (_id, body) =>
    new Promise((resolve, reject) => {

        body.update_at = new Date().toISOString()
        console.log(body)
        grade.updateOne({ _id: ObjectID(_id) }, body)
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });

    });

exports.deletegrade = (_id) =>
    new Promise((resolve, reject) => {
        grade.deleteOne({ _id: ObjectID(_id) })
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });
    });