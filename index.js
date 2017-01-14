const assert = require('assert');
const EE = require('events');

function Readable(opts) {

    EE.call(this);
    this.count = 0;
    this.listeners = [];
    const inc = this.incoming = opts.incoming || [];
    assert(Array.isArray(this.incoming));
    this.read = opts.read;

    this.push = function (val) {
        const z = inc.push(val);
        this.emit('data1', val);
        return z;
    };

    this.shift = function () {
        return inc.shift();
    };

}


Readable.prototype = Object.create(EE.prototype);


Readable.prototype.__read = function (size) {
    this.count++;
    console.log(' => count', this.count, ' => size', this.listeners.length);
    if (this.count >= this.listeners.length) {
        console.log('we are of the right size...');
        this.count = 0;
        this.read(size, (err, data) => {
            this.listeners.forEach(l => {
                if (err) {
                    l.emit('error', err);
                }
                else {
                    l.write(data, 'enc', (err) => {
                        if (err) {
                            this.emit('error', err);
                        }

                        this.__read();

                    });
                }

            });
        });
    }

};


Readable.prototype.pipe = function (dest, opts) {

    const source = this;
    this.listeners.push(dest);
    this.__read(100);

    return dest;

};

Readable.prototype.unpipe = function (dest, opts) {


    const index = this.listeners.indexOf(dest);
    if (index >= 0) {
        this.listeners.splice(index, 1);
    }

    return dest;

};


function Writable(opts) {

    EE.call(this);
    this.write = opts.write;

}

Writable.prototype = Object.create(EE.prototype);


let i = 0;

const r = new Readable({

    read: function (size, cb) {

        const v = this.shift();
        if (v) {
            cb(null, v);
        }
        else {
            this.once('data1', (val) => {
                console.log('rando val => ', val);
                const d = this.shift();
                if (!d) {
                    console.log('internal data => ', this.incoming);
                    console.log('length => ', this.listeners.length);
                    throw 'wow';
                }
                cb(null, d);
            });
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


setTimeout(function(){

    console.log('unpiping...');
    r.unpipe(dest2);

},4000);
