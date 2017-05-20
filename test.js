/*spa.initModule();

var urlL = function() {
    console.log("URL CHANGED");
}

spa.shell.registerEventListener(EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE, urlL);
spa.shell.changeUrlQuery({});
console.log(spa.shell.eventListeners);
spa.shell.removeEventListener(EVENT_TYPE_CONST.EVENT_TYPE_URL_CHANGE, urlL);
console.log(spa.shell.eventListeners);*/

var promiseFunc = function(resolve, reject) {
    window.setTimeout(function() {
        console.log("from inside promise.");
        var i = 2;
        if (i % 2 == 0) {
            resolve("ok, it is divided by 2");
        } else {
            reject("bad number");
        }
    }, 1000);
};

function testPromise() {
    console.log("before promise");
    var p = new Promise(promiseFunc);
    p.then(function(val) {
        console.log("THEN " + val);
    }).catch(function(reason) {
        console.log("CATCH " + reason);
    });
    console.log("after promise");
}

testPromise();
