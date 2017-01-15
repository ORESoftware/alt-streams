
//core
const assert = require('assert');
const EE = require('events');

//npm
const async = require('async');


////////////////////////////////////////////////////////////////////////////////////////

function Transform(opts) {

    EE.call(this);
    this.writableListeners = [];

    this.endedCount = 0;
    this.sourceCount = 0;
    this.isEnded = false;
    this.hardEnd = false;

    // if this transform buffers data, then it puts no backpressure on upstream
    this.isBuffer = opts.buffer;

    const buf = this.buffer = [];

    this.transform = opts.transform;

    this.push = function (val) {

        if(this.isEnded){
            console.error(' => Warning, push was called on ended transform stream.');
            return;
        }
        const z = buf.push(val);
        this.emit('data', {
            push: true
        });
        return z;
    };

    this.shift = function () {
        return buf.shift();
    };

    this.on('data', () => {
        this.__read()
    });

}



Transform.prototype = Object.create(EE.prototype);


Transform.prototype.end = function(){

    if(this.isEnded){
        return;
    }

    this.endedCount++;

    if(this.endedCount === this.sourceCount){
        this.isEnded = true;
    }

};


Transform.prototype.__internalRead = function (data) {

    this.writable = false;

    async.each(this.writableListeners, (l, cb) => {

        process.nextTick(function(){
            l._write(data, 'enc', cb);
        });

    }, e => {
        if (e) {
            this.emit('error', e);
        }
        this.writable = true;
        this.__read();
    });


};


Transform.prototype.__read = function () {

    if(this.hardEnd === true || this.writable === false){
        return;
    }

    const d = this.shift();

    if (!d) {
        if(this.isEnded){
            // only want to really end if we have flushed all buffered data
            this.hardEnd = true;
        }
        this.emit('flushed');
    }
    else {
        this.transform(d, 'enc',  (err, val) => {
            if (err) {
                console.error(err.stack || err);
            }
            else {
                this.__internalRead(val);
            }
        });
    }

};


Transform.prototype._write = function (data, encoding, cb) {

    process.nextTick(() => {
        this.push(data);
    });

    this.once('flushed', function(){
        console.log('flushed');
        cb();
    });


};


Transform.prototype.pipe = function (dest) {

    const source = this;

    if(dest === this){
        throw new Error(' => Piping stream into itself, unfortunately not allowed.');
    }

    if(this.writableListeners.indexOf(dest) >= 0){
        throw new Error(' => Already piping to this destination.');
    }

    this.writableListeners.push(dest);

    process.nextTick(() => {
        this.__read(100);
    });


    return dest;


};


Transform.prototype.unpipe = function (dest, opts) {


    const index = this.writableListeners.indexOf(dest);
    if (index >= 0) {
        this.writableListeners.splice(index, 1);
    }

    return dest;

};


module.exports = Transform;