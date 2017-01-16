/**
 * Created by oleg on 1/15/17.
 */


const stream = require('stream');

function getReadableStream(fn) {

    return new stream.Readable({
        objectMode: true,
        read: function (n) {
            // when read fires the stream API is telling us
            // consumers (writables) want more data
            // the stream API should take a callback
            // but instead we need to call this.push
            // to push more data onto the readable's buffer
            fn(n, (err, chunk) => {
                this.push(chunk);
            })
        }
    });

}

let items = Buffer.from('abcdefg');

function readLocalBuffer(x) {
    const b = items.slice(0, x);
    items = items.slice(x, items.length);
    return b;
}

let strm = getReadableStream(function (n, cb) {
    // verbosity is for clarity
    // normally we should be reading data from some source outside
    // our program but here we just use a buffer in memory
    process.nextTick(function () {
        const bytes = readLocalBuffer(1);
        const bytesRead = bytes.length;
        cb(null, bytesRead > 0 ? bytes : null);
    });
});


strm
    .on('data', (d) => {
        console.log(' => readable next data => ', String(d));
    })
    .on('readable', () => {
        console.log(' readable stream is readable.');
    })
    .on('close', (e) => {
        console.log(' => readable is closed');
    })
    .on('error', (e) => {
        console.log(' => readable error => ', e.stack || e);
    })
    .on('end', () => {
        console.log(' readable stream all ended here.');
    });


function getTransformStream() {

    return new stream.Transform({
        transform: function (chunk, encoding, cb) {
            setTimeout(function () {
                cb(null, String(chunk) + '-transformed');
            }, 100);
        }
    });

}


strm = strm
    .pipe(getTransformStream());

strm
    .on('data', (d) => {
        console.log(' => transform next data => ', String(d));
    })
    .on('readable', () => {
        console.log(' transform stream is readable.');
    })
    .on('close', (e) => {
        console.log(' => transform is closed');
    })
    .on('error', (e) => {
        console.log(' => transform error => ', e.stack || e);
    })
    .on('end', () => {
        console.log(' transform stream all ended here.');
    })
    .on('finish', () => {
        console.log(' transform is all finished here.');
    });


function getWritable() {
    return new stream.Transform({
        write: function (chunk, encoding, cb) {
            // we don't actually write anything out
            // but this is where you would write some destination
            // and fire the callback when you are done writing
            setTimeout(cb, 100);
        }
    });
}

strm = strm
    .pipe(getWritable());

strm
    .on('drain', (d) => {
        console.log(' => writable is drained => ', String(d));
    })
    .on('close', (d) => {
        console.log(' => writable is closed => ', String(d));
    })
    .on('error', (e) => {
        console.log(' => writable error => ', e.stack || e);
    })
    .on('finish', () => {
        console.log(' writable is all finished here.');
    });

