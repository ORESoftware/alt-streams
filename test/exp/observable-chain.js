//import RxJS5
const Rx = require('rxjs');

function makeObservable(val) {

    return Rx.Observable.create(sub => {

        const to = setTimeout(() => {

            if(val instanceof Rx.Observable){
                val = val.flatMap
            }
            sub.next(++val);
            sub.complete();

        }, 100);

        return function unsubscribe() {
            clearTimeout(to);
        }

    });

}


makeObservable(0)
    .map(val => makeObservable(val))
    .map(val => makeObservable(val))
    .map(val => makeObservable(val))
    .mergeAll()
    .subscribe(
        function onNext(v) {
            console.log('next => ', v);
        },
        function onError(e) {
            console.error(e.stack || e);
        },
        function onComplete() {
            console.log('complete');
        }
    );

