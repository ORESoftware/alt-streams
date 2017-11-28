/**
 * Created by oleg on 1/15/17.
 */


const Rx = require('rxjs');

let i = 0;

let $add = Rx.Observable.interval(100)
    .map(() => i++);

$add = $add.share();



$add.subscribe(function(v){
    console.log('v1 => ', v);
});


$add.subscribe(function(v){
    console.log('v2 => ', v);
});