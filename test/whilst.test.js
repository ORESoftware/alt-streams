/**
 * Created by oleg on 1/15/17.
 */


const async = require('async');
const fs = require('fs');
const path = require('path');


function read(fd, position, cb) {

    let isByteRead = null;
    let ret = new Buffer(0);

    async.whilst(
        function () {
            return isByteRead !== false;
        },
        function (cb) {
            readOneCharFromFile(fd, position++, function (err, bytesRead, buffer) {

                if(err){
                    return cb(err);
                }

                isByteRead = !!bytesRead;
                if(isByteRead){
                    ret = Buffer.concat([ret,buffer]);
                }

                cb(null);
            });
        },
        function (err) {
            cb(err, ret);
        }
    );

}


function readOneCharFromFile(fd, position, cb) {

    // only need to store one byte (one character)
    const b = new Buffer(1);
    fs.read(fd, b, 0, 1, position, cb);

}


const file = path.resolve(__dirname + '/fixtures/abc.txt');
const fd = fs.openSync(file, 'r');

read(fd, 0, function (err, data) {
    if (err) {
        console.error(err.stack || err);
    }
    else {
        console.log('data => ', String(data));
        fs.closeSync(fd);
    }
});