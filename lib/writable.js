const assert = require('assert');
const EE = require('events');


function Writable(opts) {

    EE.call(this);
    this.endedCount = 0;
    this.sourceCount = 0;
    this.write = opts.write;

}

Writable.prototype = Object.create(EE.prototype);


Writable.prototype.create = function(opts){
    return new Writable(opts);
};


Writable.prototype._write = function () {
    this.write.apply(this, arguments);
};

Writable.prototype.end = function(){

    if(this.isEnded){
        return;
    }

    this.endedCount++;

    console.log(' => ended => ', this.endedCount, this.sourceCount);
    if(this.endedCount === this.sourceCount){
        this.isEnded = true;
    }

};

module.exports = Writable;