//core
const assert = require('assert');
const EE = require('events');

//npm
const async = require('async');


// readable events come from two places - the data source and the data receiver
// if we forward a chunk of data, we wait for all receivers to fire a callback before sending the next chunk out to
// anyone

function Readable(opts) {

    EE.call(this);

    this.isEnded = false;
    this.readable = true;
    this.writableListeners = [];
    const inc = this.incoming = opts.incoming || [];
    assert(Array.isArray(this.incoming), ' => "incoming" must be an array.');

    this.load = opts.load;
    this.read = opts.read;

    this.push = function (val) {
        const z = inc.push(val);
        this.emit('data', val);
        return z;
    };

    this.shift = function () {
        return inc.shift();
    };

    this.on('data', function(){
        // the user may call this.push as well, so this handles that
        this.__read();
    });

}


Readable.prototype = Object.create(EE.prototype);


Readable.prototype.create = function(opts){
    return new Readable(opts);
};


Readable.prototype.end = function () {

    if (this.isEnded) {
        //end can only be called once
        return;
    }

    this.isEnded = true;
    this.readable = false;

    this.writableListeners.forEach(function (wl) {
        wl.end();
    });

};


Readable.prototype._load = function () {

    console.log('loading...');
    this.load('size',(err, chunk) => {
        if (err) {
            this.emit('error', err);
        }
        else {
            console.log('pushing chunk');
            this.push(chunk);
        }
    });
};


Readable.prototype.__internalRead = function (size) {

    this.readable = false;

    process.nextTick(() => {
        // load one chunk of new data ahead of time
        this._load();
    });

    this.read(size, (err, data) => {

        if (err) {
            this.emit('error', err);
            return;
        }

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


    if (this.isEnded === true || this.readable === false) {
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

    if (this.writableListeners.indexOf(dest) >= 0) {
        console.error(' => Warning you already piped this readable stream to the given writable stream.');
        return;
    }

    const source = this;

    this.writableListeners.push(dest);
    dest.sourceCount++;

    process.nextTick(() => {
        console.log('reading');
        // this.__read(100);
        this._load();
    });


    return dest;

};

Readable.prototype.unpipe = function (dest, opts) {


    const index =
        this.writableListeners.indexOf(dest);

    if (index >= 0) {
        this.writableListeners.splice(index, 1);
    }

    return dest;

};

module.exports = Readable;