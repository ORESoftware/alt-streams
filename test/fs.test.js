const fs = require('fs');
const path = require('path');

const Writable = require('../lib/writable');
const Readable = require('../lib/readable');

let i = 0;

// fs.read(fd, buffer, offset, length, position, callback)#
// Added in: v0.0.2
// fd <Integer>
// buffer <String> | <Buffer> | <Uint8Array>
// offset <Integer>
// length <Integer>
// position <Integer>
// callback <Function>
// Read data from the file specified by fd.
//
//     buffer is the buffer that the data will be written to.
//
//     offset is the offset in the buffer to start writing at.
//
//     length is an integer specifying the number of bytes to read.
//
//     position is an integer specifying where to begin reading from in the file. If position is null, data will be read from the current file position.
//
//     The callback is given the three arguments, (err, bytesRead, buffer).


const fd = fs.openSync(path.resolve(__dirname + '/fixtures/abc.txt'), 'r');

let position = -1;

const r = new Readable({

    load: function (size, cb) {

        position++;
        const b = new Buffer(1);

        fs.read(fd, b, 0, 1, position, function (err, bytesRead, buffer) {
            console.log('data => ', String(buffer));
            cb(err, bytesRead ? String(buffer) : null);
        });
    },

    read: function (size, cb) {

        const v = this.shift();
        if (v) {
            cb(null, v);
        }
    }
});


const dest1 = new Writable({
    write: function (c, enc, cb) {
        console.log(' => chunk => ', c);
        setTimeout(cb, 50);
    }
});


const start = Date.now();


process.once('exit', function () {

    console.log(' => Time when ended => ', Date.now() - start);

});


r.pipe(dest1);

