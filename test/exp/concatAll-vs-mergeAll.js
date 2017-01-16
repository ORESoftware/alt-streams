const Rx = require('rxjs');

// var source = Rx.Observable.range(0, 3)
//     .map(function (x) { return Rx.Observable.range(x, 3); })
//     .concatAll();
//
// var subscription = source.subscribe(
//     function (x) {
//         console.log('Next: ' + x);
//     },
//     function (err) {
//         console.log('Error: ' + err);
//     },
//     function () {
//         console.log('Completed');
//     });

var source = Rx.Observable.range(0, 3)
    .map(function (x) {
        return Rx.Observable.range(x, 3);
    })
    .mergeAll();

var subscription = source.subscribe(
    function (x) {
        console.log('Next: ' + x);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });
