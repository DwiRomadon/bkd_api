const user = require("../model/user_model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const knex = require("knex");
const config = require("../config/config.json");
const { requestResponse, SQLconnection, knex } = require("../setup");
const ObjectID = require("mongodb").ObjectID;

exports.aktivasiUser = (nip) =>
  new Promise((resolve, reject) => {
    // 19810901 201001 1 009
    const parseNIP = `${nip.substring(0, 8)} ${nip.substring(
      8,
      14
    )} ${nip.substring(14, 15)} ${nip.substring(15, 18)}`;
    const query = `SELECT * FROM lap_dukpns WHERE NIP_baru='${parseNIP}' AND KDuduk='1' AND KLokasi='2'`;
    SQLconnection.query(query, (err, result) => {
      if (err) {
        reject(requestResponse.common_error);
      } else {
        if (result.length > 0) {
          const password = "12345678";
          const salt = bcrypt.genSaltSync(10);
          const data = {
            username: nip,
            role: "Karyawan",
            hashed_password: bcrypt.hashSync(password, salt),
            idPegawai: result[0].ID_Peg,
          };
          user
            .findOne({
              username: nip,
            })
            .then((dataUser) => {
              if (dataUser) {
                reject(requestResponse.errorCustomMsg("Akun Sudah Diaktivasi"));
              } else {
                user
                  .create(data)
                  .then(() => resolve(requestResponse.common_success))
                  .catch(() => reject(requestResponse.common_error));
              }
            })
            .catch(() => reject(requestResponse.common_error));
        } else {
          resolve(requestResponse.errorCustomMsg("NIP Tidak Ditemukan"));
        }
      }
    });
  });

exports.getProfileMySQL = (idPegawai) =>
  new Promise((resolve, reject) => {
    const query = `SELECT * FROM lap_dukpns WHERE ID_Peg='${idPegawai}' AND KDuduk='1' AND KLokasi='2'`;
    SQLconnection.query(query, (err, result) => {
      if (err) {
        reject(requestResponse.common_error);
      } else {
        resolve(
          requestResponse.common_success_with_data(
            result.length > 0 ? result[0] : []
          )
        );
      }
    });
  });

exports.loginUser = (username, password) =>
  new Promise((resolve, reject) => {
    user.findOne({ username: username })
      .then((dataUser) => {
        if (dataUser) {
          const hashed_password = dataUser.hashed_password;
          if (bcrypt.compareSync(password, hashed_password)) {
            resolve({ message: username });
          } else {
            reject(requestResponse.account_not_found);
          }
        } else {
          reject(requestResponse.account_not_found);
        }
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.registerUser = (body) =>
  new Promise((resolve, reject) => {
    const username = body.username;
    const password = "12345678";
    const salt = bcrypt.genSaltSync(10);
    body.hashed_password = bcrypt.hashSync(password, salt);
    user
      .find({ username: username })
      .then((users) => {
        if (users.length > 0) {
          reject(requestResponse.common_username_already_use);
        } else {
          const newUser = new user(body);
          newUser
            .save()
            .then(() => resolve(requestResponse.common_success))
            .catch((err) => {
              reject(requestResponse.common_error);
            });
          return users[0];
        }
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.updateUser = (username, body) =>
  new Promise((resolve, reject) => {
    console.log(body);
    const nama = body.nama;
    const email = body.email;
    const jabatan = body.jabatan;
    const bagian = body.bagian;
    // const salt = bcrypt.genSaltSync(10);
    body.update_at = new Date().toISOString();
    // body.hash = bcrypt.hashSync(password, salt);
    user.updateOne({ username: username }, body).then((data) => {
      resolve(requestResponse.common_success);
    });
  });

exports.updateToken = (username, token) =>
  new Promise((resolve, reject) => {
    user
      .updateOne({ username: username }, { token: token })
      .then((result) => resolve(result))
      .catch((err) => reject(requestResponse.common_error));
  });

exports.checkToken = (nik, token) =>
  new Promise((resolve, reject) => {
    user
      .find({ nik: nik })
      .then((users) => {
        if (users.length == 0) {
          reject(requestResponse.token_invalid);
        } else {
          return users[0];
        }
      })
      .then((user) => {
        const user_token = user.token;
        if (user_token == token) {
          resolve(requestResponse.common_success_with_data(user));
        } else {
          reject(requestResponse.token_invalid);
        }
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.getProfile = (username) =>
  new Promise((resolve, reject) => {
    // user.aggregate([
    //   { $match: { username: username } },
    //   {
    //     $lookup: {
    //       from: "jabatans",
    //       localField: "jabatan",
    //       foreignField: "_id",
    //       as: "jabatan",
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "unitkerjas",
    //       localField: "unitKerja",
    //       foreignField: "_id",
    //       as: "unitKerja",
    //     },
    //   },
    //   {$unwind : "$jabatan"},
    //   {$unwind : "$unitKerja"},
    // ])
    user
      .findOne({ username: username })
      .select("-hashed_password")
      .then((users) => {
        // let respMsg = Object.assign(requestResponse.common_success)
        // respMsg['result'] = users[0]
        resolve(users);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.hapusUser = (username) =>
  new Promise((resolve, reject) => {
    user
      .deleteOne({ username: username })
      .then((users) => {
        resolve(requestResponse.common_success);
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.getUsers = () =>
  new Promise((resolve, reject) => {
    user
      .aggregate([
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
        { $unwind: "$jabatan" },
        { $unwind: "$golongan" },
        { $unwind: "$unitKerja" },
      ])
      .then((users) => {
        resolve(requestResponse.common_success_with_data(users));
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.listUserByUnitKerja = (unitKerja) =>
  new Promise((resolve, reject) => {
    console.log(unitKerja);
    user
      .find({ unitKerja: ObjectID(unitKerja) })
      .select("-hashed_password")
      .select("-token")
      .then((users) => {
        resolve(requestResponse.common_success_with_data(users));
      })
      .catch((err) => reject(requestResponse.common_error));
  });

exports.getAtasan = (idPegawai) =>
  new Promise((resolve, reject) => {
    // SQLconnection.query(query, (err, result) => {
    //   let idEselon = result[0].KESelon

    //   console.log(idEselon)
    //   if (idEselon == "41" || idEselon == "42") {
    //     let T_Kunker_Bag = result[0].T_Kunker_Bag
    //     let T_KUnker = result[0].T_KUnker
    //     const atasan = `SELECT * FROM jakhir JOIN lap_dukpns ON jakhir.ID_Peg = lap_dukpns.ID_Peg WHERE jakhir.T_Kunker_Bag = '${T_Kunker_Bag}'   AND jakhir.T_KUnker = '${T_KUnker}'  AND (jakhir.KESelon = "31" OR jakhir.KESelon = "32") AND
    // jakhir.KDuduk = "1" AND jakhir.KJPeg = "4" AND jakhir.KLokasi = "2" AND jakhir.KInsInd = "46" `;
    //     SQLconnection.query(atasan, (err, result) => {
    //       resolve(requestResponse.common_success_with_data(result[0]))
    //     })
    //   }

    // })
    knex.from('jakhir')
      .where({ ID_Peg: idPegawai })
      .then((result) => {
        let idEselon = result[0].KESelon
        let T_KUnker = result[0].T_KUnker
        let T_Kunker_Bag = result[0].T_Kunker_Bag
        let T_Kunker_SBag = result[0].T_Kunker_SBag
        console.log(idEselon)
        if (idEselon == "41" || idEselon == "42") {
          knex.from('jakhir').join('lap_dukpns', 'jakhir.ID_Peg', 'lap_dukpns.ID_Peg')
            .where({ 'jakhir.T_Kunker_Bag': T_Kunker_Bag })
            .andWhere('jakhir.KESelon', '>=', '31')
            .andWhere('jakhir.KESelon', '<=', '32')
            .andWhere({ 'jakhir.T_KUnker': T_KUnker })
            .andWhere({ 'jakhir.KDuduk': "1" })
            .andWhere({ 'jakhir.KJPeg': "4" })
            .andWhere({ 'jakhir.KLokasi': "2" })
            .andWhere({ 'jakhir.KInsInd': "46" })
            .then(results => resolve(results))
            .catch((err) => {
              console.log(err)
              reject(requestResponse.common_error)
            });
        } else if (idEselon == "31" || idEselon == "32") {
          knex.from('jakhir').join('lap_dukpns', 'jakhir.ID_Peg', 'lap_dukpns.ID_Peg')
            .where('jakhir.T_KUnker', T_KUnker)
            .andWhere('jakhir.KESelon', '>=', '21')
            .andWhere('jakhir.KESelon', '<=', '22')
            .andWhere('jakhir.KJPeg', "4")
            .andWhere('jakhir.KLokasi', "2")
            .andWhere('jakhir.KInsInd', "46")
            .andWhere('jakhir.KDuduk', "1")
            .then(results => resolve(results))
            .catch((err) => {
              console.log(err)
              reject(requestResponse.common_error)
            });
        } else if (idEselon == "21" || idEselon == "22") {
          knex.from('jakhir').join('lap_dukpns', 'jakhir.ID_Peg', 'lap_dukpns.ID_Peg')
            .where('jakhir.KESelon', '12')
            .andWhere('jakhir.KJPeg', "4")
            .andWhere('jakhir.KLokasi', "2")
            .andWhere('jakhir.KInsInd', "46")
            .andWhere('jakhir.KDuduk', "1")
            .then(results => resolve(results))
            .catch((err) => {
              console.log(err)
              reject(requestResponse.common_error)
            });
        }
        else if (idEselon == "99") {
          knex.from('jakhir').join('lap_dukpns', 'jakhir.ID_Peg', 'lap_dukpns.ID_Peg')
            .where('jakhir.KESelon', '>=', '41')
            .andWhere('jakhir.KESelon', '<=', '42')
            .andWhere('jakhir.T_Kunker_SBag', T_Kunker_SBag)
            .andWhere('jakhir.T_KUnker', T_KUnker)
            .andWhere('jakhir.KJPeg', "4")
            .andWhere('jakhir.KLokasi', "2")
            .andWhere('jakhir.KInsInd', "46")
            .andWhere('jakhir.KDuduk', "1")
            .then(results => resolve(results))
            .catch((err) => {
              console.log(err)
              reject(requestResponse.common_error)
            });

        }

      })
      .catch((err) => {
        console.log(err)
        reject(requestResponse.common_error)
      });
  });

exports.getBawahan = (idPegawai) =>
  new Promise((resolve, reject) => {
    knex.from('jakhir')
      .where({ ID_Peg: idPegawai })
      .then((result) => {
        let idEselon = result[0].KESelon
        let T_KUnker = result[0].T_KUnker
        let T_Kunker_Bag = result[0].T_Kunker_Bag
        let T_Kunker_SBag = result[0].T_Kunker_SBag
        console.log(idEselon)
        if (idEselon == "41" || idEselon == "42") {
          knex.from('jakhir').join('lap_dukpns', 'jakhir.ID_Peg', 'lap_dukpns.ID_Peg')
            .where({ 'jakhir.T_Kunker_Bag': T_Kunker_Bag })
            .andWhere('jakhir.KESelon', '99')
            .andWhere({ 'jakhir.T_KUnker': T_KUnker })
            .andWhere({ 'jakhir.KDuduk': "1" })
            .andWhere({ 'jakhir.KJPeg': "4" })
            .andWhere({ 'jakhir.KLokasi': "2" })
            .andWhere({ 'jakhir.KInsInd': "46" })
            .then(results => resolve(results))
            .catch((err) => {
              console.log(err)
              reject(requestResponse.common_error)
            });
        } else if (idEselon == "31" || idEselon == "32") {
          knex.from('jakhir').join('lap_dukpns', 'jakhir.ID_Peg', 'lap_dukpns.ID_Peg')
            .where('jakhir.T_KUnker', T_KUnker)
            .andWhere('jakhir.KESelon', '>=', '41')
            .andWhere('jakhir.KESelon', '<=', '42')
            .andWhere('jakhir.KJPeg', "4")
            .andWhere('jakhir.KLokasi', "2")
            .andWhere('jakhir.KInsInd', "46")
            .andWhere('jakhir.KDuduk', "1")
            .then(results => resolve(results))
            .catch((err) => {
              console.log(err)
              reject(requestResponse.common_error)
            });
        } else if (idEselon == "21" || idEselon == "22") {
          knex.from('jakhir').join('lap_dukpns', 'jakhir.ID_Peg', 'lap_dukpns.ID_Peg')
            .where('jakhir.KESelon', '>=', '31')
            .andWhere('jakhir.KESelon', '<=', '32')
            .andWhere('jakhir.KJPeg', "4")
            .andWhere('jakhir.KLokasi', "2")
            .andWhere('jakhir.KInsInd', "46")
            .andWhere('jakhir.KDuduk', "1")
            .then(results => resolve(results))
            .catch((err) => {
              console.log(err)
              reject(requestResponse.common_error)
            });
        }
        else if (idEselon == "99") {
         resolve ([])

        }


      })
      .catch((err) => {
        console.log(err)
        reject(requestResponse.common_error)
      });

  });

exports.getAtasanDanBawahan = (idPegawai) =>
  new Promise((resolve, reject) => {
    this.getAtasan(idPegawai)
      .then((atasan) => {
        this.getBawahan(idPegawai)
          .then((bawahan) => {
            console.log(bawahan)
            if(atasan.length === 0){
                atasan = []
                resolve(requestResponse.common_message_atasan_bawahan(atasan , bawahan));
            }else {
                resolve(requestResponse.common_message_atasan_bawahan(atasan , bawahan));
            }
          })
          .catch((err) => reject(requestResponse.common_error));
      })
      .catch((err) => reject(requestResponse.common_error));
  });
  // SELECT * FROM `jakhir`JOIN lap_dukpns ON jakhir.ID_Peg = lap_dukpns.ID_Peg WHERE jakhir.T_Kunker_Bag = "1006040500" AND jakhir.T_KUnker = "1006040000" AND (jakhir.KESelon = "31" OR jakhir.KESelon = "32") AND jakhir.KDuduk = "1" AND jakhir.KJPeg = "4" AND jakhir.KLokasi = "2" AND jakhir.KInsInd = "46"
