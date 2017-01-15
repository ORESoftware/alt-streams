const assert = require('assert');
const EE = require('events');


function Transform(opts) {

    EE.call(this);
    this.count = 0;
    this.listeners = [];

    // if this transform buffers data, then it puts no backpressure on upstream
    this.isBuffer = opts.buffer;

    const buf = this.buffer = [];

    this.transform = opts.transform;

    this.push = function (val) {
        const z = buf.push(val);
        this.emit('data1', val);
        return z;
    };

    this.shift = function () {
        return buf.shift();
    };


}


Transform.prototype.__internalRead = function (size) {

    this.count = 0;

    this.listeners.forEach(l => {

        l.write(data, 'enc', (err) => {
            if (err) {
                this.emit('error', err);
            }

            this.__read();

        });

    });

};


Transform.prototype._read = function (data, encoding, cb) {

    var d;
    if (this.buffer.length > 0) {
        d = this.shift();
        this.buffer.push(data);
    }
    else {
        d = String(data);
    }


    if (d) {
        this.transform(d, function (err, val) {
            if (err) {
                console.error(err.stack || err);
            }
            else {
                this.__internalRead()
            }
        });
    }

};


Transform.prototype._write = function (data, encoding, cb) {

    process.nextTick(() => {
        this.push(data);
    });

    this.once('flush', cb);


};


Transform.prototype.pipe = function (dest) {


    const source = this;

    this.listeners.push(dest);

    process.nextTick(() => {
        this.__read(100);
    });


    return dest;


};


Transform.prototype.unpipe = function (dest, opts) {


    const index = this.listeners.indexOf(dest);
    if (index >= 0) {
        this.listeners.splice(index, 1);
    }

    return dest;

};


module.exports = Transform;