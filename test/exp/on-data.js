/**
 * Created by oleg on 1/15/17.
 */


const Readable = require('stream').Readable;

const r = new Readable({
    objectMode: true,
    read: function (n) {
        console.log('is read');
        return null;
    }
});


r.on('data', function (d) {
    console.log(d);
});


setInterval(function(){
    r.push('valid');
},1000);