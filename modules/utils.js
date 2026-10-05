const fs = require('fs');

class DateUtils {
    getDate() {
        return new Date().toString();
    }
}

class FileUtils {
    appendToFile(fileName, text, callback) {
        fs.appendFile(fileName, `${text}\n`, callback);
    }

    readFile(fileName, callback) {
        fs.readFile(fileName, 'utf8', callback);
    }
}

module.exports = {
    DateUtils,
    FileUtils
};