const Rx = require('rxjs');
const _ = require('lodash');


Rx.Observable.any = function (val) {

    if (!(val instanceof Rx.Observable)) {
        val = Rx.Observable.of(val);
    }

    return val;

};

function makeObservable(val) {

    return Rx.Observable.create(sub => {

        const to = setTimeout(() => {

            sub.next(++val);
            sub.complete();

        }, 100);

        return function unsubscribe() {
            clearTimeout(to);
        }

    });

}


let obs = makeObservable(0);


Rx.Observable.any([1, 2, 3])
    .map(v => {
        console.log('val => ', v);
        return Rx.Observable.from(v);
    })
    .concatAll()
    .do(function(v){
        console.log(v);
    })
    .subscribe();

Rx.Observable.any('abc')
    .map(v => {
        console.log('val => ', v);
    })
    .subscribe();

Rx.Observable.any(4)
    .map(v => {
        console.log('val => ', v);
    })
    .subscribe();


Rx.Observable.any(Rx.Observable.timer(100))
    .map(v => {
        console.log('val => ', v);
    })
    .subscribe();



Rx.Observable.timer(100)
    .map(v => {
       return Rx.Observable.any
    });



