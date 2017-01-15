const assert = require('assert');
const EE = require('events');
const async = require('async');


// readable events come from two places - the data source and the data receiver
// if we forward a chunk of data, we wait for all receivers to fire a callback before sending the next chunk

function Readable(opts) {

    EE.call(this);

    this.readable = true;
    this.writableListeners = [];
    const inc = this.incoming = opts.incoming || [];
    assert(Array.isArray(this.incoming), ' => "incoming" must be an array.');
    this.read = opts.read;

    this.push = function (val) {
        const z = inc.push(val);
        this.emit('data', val);
        return z;
    };

    this.shift = function () {
        return inc.shift();
    };

}


Readable.prototype = Object.create(EE.prototype);


Readable.prototype.end = function () {

    this.readable = false;


};


Readable.prototype.__internalRead = function (size) {

    this.readable = false;

    this.read(size, (err, data) => {

        async.each(this.writableListeners, (wl, cb) => {

            process.nextTick(function () {
                wl._write(data, 'enc', cb);
            });

        }, err => {
            if (err) {
                this.emit('error', err);
            }
            this.readable = true;
            this.__read();
        });


    });
};

Readable.prototype.__read = function (size) {

    if (this.readable === false) {
        return;
    }

    if (this.incoming.length > 0) {
        this.__internalRead();
    }
    else {
        this.once('data', () => {
            this.__internalRead();
        });
    }


};


Readable.prototype.pipe = function (dest, opts) {

    const source = this;

    this.writableListeners.push(dest);

    process.nextTick(() => {
        this.__read(100);
    });


    return dest;

};

Readable.prototype.unpipe = function (dest, opts) {


    const index = this.writableListeners.indexOf(dest);
    if (index >= 0) {
        this.writableListeners.splice(index, 1);
    }

    return dest;

};

module.exports = Readable;