const kegiatan = require('../model/pointKegiatan');
const { requestResponse } = require('../setup')
const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;
exports.createKegiatan = (body) =>
    new Promise((resolve, reject) => {
        const nama = body.nama
        const deskripsi = body.deskripsi
        const poin = body.poin
        const type = body.type
        const newUser = new kegiatan(
            body
        );
        newUser.save()
            .then(() => resolve(requestResponse.common_success))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.listKegiatan = () =>
    new Promise((resolve, reject) => {
        kegiatan.find()
            .then((result) => resolve(requestResponse.common_success_with_data(result)))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.updateKegiatan = (_id, body) =>
    new Promise((resolve, reject) => {
        const nama = body.nama
        const deskripsi = body.deskripsi
        const poin = body.poin
        const type = body.type
        body.update_at = new Date().toISOString()
        console.log(body)
        kegiatan.updateOne({ _id: ObjectID(_id) }, body)
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });

    });

exports.deleteKegiatan = (_id) =>
    new Promise((resolve, reject) => {
        kegiatan.deleteOne({ _id: ObjectID(_id) })
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });
    });