const moment = require('moment');
const fs = require('fs');
const fileFormat = 'DD-MM-YYYY';
const textFormat = 'DD-MM-YYYY HH:mm:SS';

const Logger = exports.Logger = {};

const logStream = fs.createWriteStream('logs/'+'indi-'+moment().format(fileFormat)+'.log');

Logger.info = function(msg) {
    const message = 'INFO : '+msg +' ['+moment().format(textFormat)+']'+ "\n";
    logStream.write(message);
};

Logger.debug = function(msg) {
    const message = 'DEBUG : '+msg +' ['+moment().format(textFormat)+']'+ "\n";
    logStream.write(message);
};

Logger.error = function(msg) {
    const message = 'ERROR : '+msg +' ['+moment().format(textFormat)+']'+ "\n";
    logStream.write(message);
};