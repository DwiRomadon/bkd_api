'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router({ mergeParams: true });
const port 	   = process.env.PORT || 9068;
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const setUp = require('./setup');
const moment = require('moment-timezone');
const fs = require("fs");
const cors = require('cors')
const baseDir = "uploads/";
require('./routes/users')(router);
require('./routes/pointKegiatan')(router);
require('./routes/absen')(router);
require('./routes/kegiatanTahunan')(router);
require('./routes/detailKegiatanTahunan')(router);
require('./routes/kegiatanBulanan')(router);
require('./routes/kegiatanHarian')(router);
require('./routes/quantitas')(router);
require('./routes/jabatan')(router);
require('./routes/unitKerja')(router);
require('./routes/grade')(router);
require('./routes/tpp')(router);
require('./routes/kelasjabatan')(router);
require('./routes/golongan')(router);
require('./routes/newKegiatanHarian')(router);
const directory = path.join(__dirname, '/uploads')
app.use('/uploads', express.static(directory));
app.use(cors())
app.options('*',cors())
app.use(bodyParser.urlencoded({
  enableTypes:['json', 'form'],extended: true
}))

app.use(bodyParser.json({
  extended: true
}))

app.use(express.static('public'));
// app.use('/uploads', express.static('uploads'));
app.use(logger('dev'))
//setUp.dbConnect()

app.use('/', router)


server.listen(port)
server.on('listening', onListening)

//app.time(100)
//console.log(`App Runs on ${port}`);

async function onListening() {
  try {
    console.log('try to listen...')
    if (!fs.existsSync(baseDir)){
      fs.mkdirSync(baseDir);
    }
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    setUp.dbConnect()
    //app.database = database
    console.log('Listening on ' + bind)
    //debug('Listening on ' + bind);
  } catch (error) {
    console.log(error)
    console.log('listen failed, try to reconnect in 5 secs...')
    setTimeout(function () {
      onListening()
    }, 5000);
  }
}
