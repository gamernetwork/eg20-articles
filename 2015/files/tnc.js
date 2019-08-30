var tnxrand = Math.random()*10000000000000000 + new Date().getTime();
(function () {
    var tnd = function() {
        return new tnlib();
    };
    var tnlib = function() {
        this.version = '1.0';
        this.pv = tnxrand;
    };
    var adslots = [];
    if(!window.tnd) {
        window.tnd = tnd;
    }
})();
