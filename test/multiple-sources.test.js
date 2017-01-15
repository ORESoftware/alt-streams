

const Writable = require('../lib/writable');
const Readable = require('../lib/readable');

let i = 0;

const r1 = new Readable({
    read: function (size, cb) {
        const v = this.shift();
        if (v) {
            cb(null, v);
        }
    }
});

const r2 = new Readable({
    read: function (size, cb) {
        const v = this.shift();
        if (v) {
            cb(null, v);
        }
    }
});

// const r = new Readable({
//     read: function (size, cb) {
//         setTimeout(function () {
//             cb(null, i++);
//         });
//     }
// });



const interval = setInterval(function () {

    if(i > 40){
        r1.end();
        r2.end();
        clearInterval(interval);
    }
    else{
        r1.push('frog-' + i++);
        r2.push('blah-' + i++);
    }

}, 50);


const dest1 = new Writable({
    write: function (c, enc, cb) {
        console.log(' => chunk => ', c);
        setTimeout(cb, 50);
    }
});


const start = Date.now();


process.once('exit', function(){

    console.log(' => Time when ended => ', Date.now() - start);

});


r1.pipe(dest1);
r2.pipe(dest1);
r2.pipe(dest1);
