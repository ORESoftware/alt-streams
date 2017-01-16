//import RxJS5
const Rx = require('rxjs');

// Observable provider
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


makeObservable(0)
    .flatMap(val => makeObservable(val))
    .flatMap(val => makeObservable(val))
    .flatMap(val => makeObservable(val))
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


// subscriber creation number 1
const subscriber1 = new Rx.Subscriber();

subscriber1.next = function (v) {
    console.log('next => ', v);
};

subscriber1.error = function (e) {
    console.error(e.stack || e);
};

subscriber1.complete = function () {
    console.log('complete');
};

makeObservable(0)
// the above could have been be simplified to
    .flatMap(makeObservable)
    .flatMap(makeObservable)
    .flatMap(makeObservable)
    .subscribe(subscriber1);


// subscriber creation number 2
const subscriber2 = new Rx.Subscriber(v => {
    console.log('next => ', v);
}, e => {
    console.error(e.stack || e);
}, () => {
    console.log('complete');
});

makeObservable(0)
    .flatMap(makeObservable)
    .flatMap(makeObservable)
    .flatMap(makeObservable)
    .subscribe(subscriber2);


// subscriber creation number 3
const subscriber3 = {
    next: v => {
        console.log('next => ', v);
    },
    error: e => {
        console.error(e.stack || e);
    },
    complete: () => {
        console.log('complete');
    }
};

makeObservable(0)
    .flatMap(makeObservable)
    .flatMap(makeObservable)
    .flatMap(makeObservable)
    .subscribe(subscriber3);


// subscriber creation number 3
const subscriber4 = Rx.Subscriber.create(
    v => {
        console.log('next => ', v);
    },
    e => {
        console.error(e.stack || e);
    },
    () => {
        console.log('complete');
    }
);

makeObservable(0)
    .flatMap(makeObservable)
    .flatMap(makeObservable)
    .flatMap(makeObservable)
    .subscribe(subscriber4);