const quantitas = require('../model/quantitas');
const { requestResponse } = require('../setup')
const mongoose = require("mongoose");
const ObjectID = require('mongodb').ObjectID;
exports.createquantitas = (body) =>
    new Promise((resolve, reject) => {
       
        const newUser = new quantitas(
            body
        );
        newUser.save()
            .then(() => resolve(requestResponse.common_success))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.listquantitas = () =>
    new Promise((resolve, reject) => {
        quantitas.find()
            .then((result) => resolve(requestResponse.common_success_with_data(result)))
            .catch(err => {
                reject(requestResponse.common_error);
            });

    });

exports.updatequantitas = (_id, body) =>
    new Promise((resolve, reject) => {
       
        body.update_at = new Date().toISOString()
        quantitas.updateOne({ _id: ObjectID(_id) }, body)
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                console.log(err)
                reject(requestResponse.common_error);
            });

    });

exports.deletequantitas = (_id) =>
    new Promise((resolve, reject) => {
        quantitas.deleteOne({ _id: ObjectID(_id) })
            .then((result) => resolve(requestResponse.common_success))
            .catch(err => {
                reject(requestResponse.common_error);
            });
    });