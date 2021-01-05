const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
exports.checkToken = req =>{

    const token = req.headers['x-access-token'];

    if (token) {

        try {

            var decoded = jwt.verify(token, config.secret);

            return decoded.message === req.headers.username;

        } catch(err) {

            return false;
        }

    } else {

        return false;
    }
}
