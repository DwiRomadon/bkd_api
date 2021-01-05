const kegiatanBulanan = require('../model/kegiatanBulanan')
const kegiatanTahunan = require('../model/kegiatanTahunan')
const grade = require('../model/grade')
const absen = require('../model/absen')
const user = require('../model/user_model')
const { requestResponse } = require('../setup')
const ObjectID = require('mongoose').Types.ObjectId

exports.getTppPerorangan = body =>
  new Promise(async(resolve, reject) => {
    
    const data = {
      user: await getDataUser(body.nip),
      totalAbsen: await getAbsen(body).then(),
      dataAtasan: await getAtasan(body).then(),
      kegiatanBulanan: await getKinerjaBulanan(body)
    }
    // console.log(data)
    resolve(requestResponse.common_success_with_data(data))
  })

const getDataUser = (username) =>
  new Promise(async(resolve, reject) => {
    user.aggregate([
      {
        $match: {
          username: username
        }
      },
      {
        $lookup: {
          from: "jabatans",
          localField: "jabatan",
          foreignField: "_id",
          as: "jabatan",
        },
      },
      {
        $lookup: {
          from: "unitkerjas",
          localField: "unitKerja",
          foreignField: "_id",
          as: "unitKerja",
        },
      },
      {
        $lookup: {
          from: "golongans",
          localField: "golongan",
          foreignField: "_id",
          as: "golongan",
        },
      },
      {$unwind : "$jabatan"},
      {
        $lookup: {
          from: "kelasjabatans",
          localField: "jabatan.kelas",
          foreignField: "_id",
          as: "kelasJabatan",
        },
      },
      {$unwind : "$golongan"},
      {$unwind : "$unitKerja"},
      {$unwind : "$kelasJabatan"},
    ]).then(users => {
      const user = users[0]
      grade.findOne({
        jabatan: ObjectID(user.jabatan._id),
        unitKerja: ObjectID(user.unitKerja._id)
      }).then(res => {
        Object.assign(user, {
          tunjangan: res
        })
        resolve(user)
      })
    })
  })

const getAtasan = (body) =>
  new Promise((resolve, reject) => {
    kegiatanTahunan.aggregate([
      {
        $match: {
          username: body.nip,
          tahun: body.year
        }
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
      { $unwind: '$pejabatPenilai' },
      { $unwind: '$atasanPejabatPenilai' }
    ]).then(res => {
      resolve(res[0])
    })
  })

const getAbsen = body =>
  new Promise((resolve, reject) => {
    // absen.find({
    //   username: body.username,
    //   $where: function () { return this.$created_at.getMonth() === 11 }
    // })
    // .countDocuments()
    // .then(res => {
    //   console.log(res)
    //   resolve(res)
    // })
    absen.aggregate([
      {
        $project: {
          username: 1,
          created_at: 1,
          month: {
            $month: '$created_at'
          },
          year: {
            $year: '$created_at'
          }
        }
      },
      {$match: {
        month: Number(body.month),
        year: Number(body.year),
        username: body.nip
      }}
    ])
    // .countDocuments()
    .then(res => {
      resolve(res.length)
    })
  })

const getKinerjaBulanan = body =>
  new Promise((resolve, reject) => {
    kegiatanBulanan.aggregate([
      {
        $lookup: {
          from: "detailkegiatantahunans",
          localField: "idKegiatan",
          foreignField: "_id",
          as: "detailKegiatanTahunan",
        }
      },
      { $unwind: '$detailKegiatanTahunan' },
      {
        $lookup: {
          from: "kegiatantahunans",
          localField: "detailKegiatanTahunan.idKegiatan",
          foreignField: "_id",
          as: "kegiatanTahunan",
        }
      },
      { $unwind: '$kegiatanTahunan' },
      {
        $match: {
          'kegiatanTahunan.tahun': body.year,
          bulan: body.strmonth
        }
      }
    ]).then(res => {
      resolve(res)
    })
  })