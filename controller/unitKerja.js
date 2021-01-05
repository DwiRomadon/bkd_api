const unitKerja = require('../model/unitKerja');
const { requestResponse } = require('../setup')
const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;
exports.createunitKerja = (body) =>
    new Promise((resolve, reject) => {
       
        const newUser = new unitKerja(
            body
        );
        newUser.save()
            .then(() => resolve(requestResponse.common_success))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.listunitKerja = () =>
    new Promise((resolve, reject) => {
        unitKerja.find()
            .then((result) => resolve(requestResponse.common_success_with_data(result)))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.updateunitKerja = (_id, body) =>
    new Promise((resolve, reject) => {
       
        body.update_at = new Date().toISOString()
        unitKerja.updateOne({ _id: ObjectID(_id) }, body)
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });

    });

exports.deleteunitKerja = (_id) =>
    new Promise((resolve, reject) => {
        unitKerja.deleteOne({ _id: ObjectID(_id) })
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });
    });