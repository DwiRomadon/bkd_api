const config = require("./config/config.json");
const mongodbUri = config["database"]["production"]["uris"];
const configSQL = config.database.sql.production
const client = require("mongoose")
const options = {
  // autoIndex: true, // Don't build indexes
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferCommands : false,
  // bufferTimeoutMS : 1000,
  serverSelectionTimeoutMS : 5000,
  family: 4, // Use IPv4, skip trying IPv6,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  keepAlive: true,
  keepAliveInitialDelay: 300000
};

var knex = require("knex")({
  client: "mysql",
  connection: {
    host: "localhost",
    user: "root",
    password: "",
    database: "db_bkd",
  },
  // connection: {
  //   host: "103.18.117.52",
  //   user: "simpedu_db_other_srv",
  //   password: "diskominfotik@forL4mpung",
  //   database: "ekinerja_51mp9du",
  // },
  pool: { min: 0, max: 20 },
});
const mysql = require('mysql');


function dbConnect() {
  return new Promise((resolve, reject) => {
    client.Promise = global.Promise;
    client.connect(mongodbUri, options, (err, database) => {
      if (err) {
        console.log("Connected to mongodb server failed");
        reject(err);
      } else {
        console.log("mongodb connected");
        knex
        .raw("SELECT 'test connection';")
        .then((message) => {
          console.log("mysql connected");
          // Success / boot rest of app
          db = database;
          resolve(knex);
        }).catch((err) => {
          // Failure / timeout
          console.log(err);
          reject(err);
        });
        // connectToMySQL()
        // console.log("mongodb connected");
        // resolve(database);
      }
    });
  });
}
const SQLconnection = mysql.createConnection(configSQL)
SQLconnection.connect(err => {
  if (err) throw err
  console.log('Connected to MySQL')
})

const requestResponse = {
  common_success_with_data: (data) => {
    return {
      status: true,
      rc: "0000",
      message: "Berhasil Memuat Permintaan",
      result : data
    }
  },

  common_message_atasan_bawahan: (atasan , bawahan) => {
    return {
      status: true,
      rc: "0000",
      message: "Berhasil Memuat Permintaan",
      atasan : atasan,
      bawahan : bawahan
    }
  },
  errorCustomMsg: (msg) => {
    return {
      status: false,
      rc: "0000",
      message: msg
    }
  },
  common_absen_error: {
    status: false,
    rc: "0000",
    message: "Anda bisa mengisi absen pada pukul 06:00 WIB",
  },
  common_username_already_use: {
    status: false,
    rc: "0000",
    message: "Nik Sudah Terdaftar",
  },
  common_success: {
    status: true,
    rc: "0000",
    message: "Berhasil memuat permintaaan",
  },
  account_not_found: {
    status: false,
    rc: "401",
    message: "Cek kembali username / password anda",
  },
  common_error: {
    status: false,
    rc: "5000",
    message:
      "Server tidak merespon, silahkan hubungi call center untuk info lebih lanjut",
  },
  token_invalid: {
    status: false,
    rc: "0030",
    message: "Akses ditolak! Sesi Anda telah berakhir atau tidak valid",
  },
};

// module.exports = { requestResponse, mongodbUri, dbConnect }
module.exports = { requestResponse, mongodbUri, dbConnect,  SQLconnection: SQLconnection , knex}
