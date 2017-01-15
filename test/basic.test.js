

const Writable = require('../lib/writable');
const Readable = require('../lib/readable');

let i = 0;

const r = new Readable({

    read: function (size, cb) {

        const v = this.shift();
        if (v) {
            cb(null, v);
        }
        // else {
        //
        //     this.once('data1', (val) => {
        //
        //         console.log('rando val => ', val);
        //         const d = this.shift();
        //         console.log('internal data => ', this.incoming);
        //         console.log('length => ', this.listeners.length);
        //         if (!d) {
        //             throw 'wow';
        //         }
        //         cb(null, d);
        //     });
        // }
    }
});

// const r = new Readable({
//     read: function (size, cb) {
//         setTimeout(function () {
//             cb(null, i++);
//         });
//     }
// });


setInterval(function () {
    r.push('frog-' + i++);
}, 1000);


const dest1 = new Writable({
    write: function (c, enc, cb) {
        console.log(' => chunk => ', c);
        setTimeout(cb, 1000);
    }
});


const dest2 = new Writable({
    write: function (c, enc, cb) {
        console.log(' => chunk => ', c);
        setTimeout(cb, 1000);
    }
});

const dest3 = new Writable({
    write: function (c, enc, cb) {
        console.log(' => chunk => ', c);
        setTimeout(cb, 1000);
    }
});

r.pipe(dest1);
r.pipe(dest2);
r.pipe(dest3);


setTimeout(function () {

    console.log('unpiping...');
    r.unpipe(dest2);

}, 4000);


setTimeout(function () {

    console.log('unpiping...');
    r.unpipe(dest3);

}, 6000);

setTimeout(function () {

    console.log('unpiping...');
    r.unpipe(dest1);

}, 7000);