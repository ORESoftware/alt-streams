

const Writable = require('../lib/writable');
const Readable = require('../lib/readable');

let i = 0;

const r = new Readable({

    load: function(size, cb){



    },

    read: function (size, cb) {

        const v = this.shift();
        if (v) {
            cb(null, v);
        }
    }
});




setInterval(function () {

    if(i > 40){
        r.end();
    }
    else{
        r.push('frog-' + i++);
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


r.pipe(dest1);

