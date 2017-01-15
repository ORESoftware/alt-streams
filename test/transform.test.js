const Writable = require('../lib/writable');
const Readable = require('../lib/readable');
const Transform = require('../lib/transform');


let i = 0;

const r = new Readable({

    read: function (size, cb) {

        const v = this.shift();
        if (v) {
            cb(null, v);
        }
    }
});


setInterval(function () {
    r.push('frog-' + i++);
}, 100);


const dest1 = new Writable({
    write: function (c, enc, cb) {
        console.log(' => chunk => ', c);
        setTimeout(cb, 1000);
    }
});


const trans1 = new Transform({
    transform: function (chunk, encoding, cb) {
        const c = String(chunk) + 2;
        cb(null, c);
    }
});


const trans2 = new Transform({
    transform: function (chunk, encoding, cb) {
        const c = String(chunk) + 'a';
        cb(null, c);
    }
});


// const dest2 = new Writable({
//     write: function (c, enc, cb) {
//         console.log(' => chunk => ', c);
//         setTimeout(cb, 1000);
//     }
// });
//
// const dest3 = new Writable({
//     write: function (c, enc, cb) {
//         console.log(' => chunk => ', c);
//         setTimeout(cb, 1000);
//     }
// });

r.pipe(trans1).pipe(trans2).pipe(dest1);


setTimeout(function () {

    // console.log('unpiping...');
    // r.unpipe(dest2);

}, 4000);


