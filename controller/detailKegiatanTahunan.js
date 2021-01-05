const model = require('../model/detailKegiatanTahunan');
const { requestResponse } = require('../setup')
const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;
exports.createKegiatan = (body) =>
    new Promise((resolve, reject) => {
        const newData = new model(
            body
        );
        newData.save()
            .then(() => resolve(requestResponse.common_success))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.listKegiatan = (idKegiatan) =>
    new Promise((resolve, reject) => {
        model.find({idKegiatan : idKegiatan})
            .then((result) => {
                
				resolve(requestResponse.common_success_with_data(result))
            })
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.getKegiatanByid = (_id) =>
    new Promise((resolve, reject) => {
        model.findOne({ _id: ObjectID(_id) })
            .then((result) => {
                var respMsg = Object.assign(requestResponse.common_success)
                respMsg['result'] = result
                console.log(respMsg)
				resolve(respMsg)
            })
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.updateKegiatan = (_id, body) =>
    new Promise((resolve, reject) => {
        body.update_at = new Date().toISOString()
        model.updateOne({ _id: ObjectID(_id) }, body)
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });

    });

exports.deleteKegiatan = (_id) =>
    new Promise((resolve, reject) => {
        model.deleteOne({ _id: ObjectID(_id) })
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });
    });