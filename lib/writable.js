


const assert = require('assert');
const EE = require('events');



function Writable(opts) {

    EE.call(this);
    this.write = opts.write;

}

Writable.prototype = Object.create(EE.prototype);



module.exports = Writable;