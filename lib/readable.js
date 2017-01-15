

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


Readable.prototype.__internalRead = function(size){

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
};

Readable.prototype.__read = function (size) {

    this.count++;

    if (this.count >= this.listeners.length) {

        if(this.incoming.length > 0){
            this.readable = true;
            this.__internalRead();
        }
        else if(this.readable !== false){
            this.readable = false;
            this.on('data1', () => {
                this.__internalRead();
            });
        }
    }

};


Readable.prototype.pipe = function (dest, opts) {

    const source = this;

    this.listeners.push(dest);

    process.nextTick(() => {
        this.__read(100);
    });


    return dest;

};

Readable.prototype.unpipe = function (dest, opts) {


    const index = this.listeners.indexOf(dest);
    if (index >= 0) {
        this.listeners.splice(index, 1);
    }

    return dest;

};

module.exports = Readable;