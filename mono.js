(function(g, factory) {
    // this conditional AMD module define code is ripped off from [github.com/ggozad/underi18n]
    if (typeof define === 'function' && define.amd) {
       define([], function() {
           return (g.Mono = factory());
       });
    } else {
       g.Mono = factory();
    }
})(this, function() {
    function timetag() {
        // format: Fri Dec 14 2012 15:02:39 GMT+0900 (KST)
        var d = new Date(),
            ds = d.toLocaleString(),
            re = /\w+ (\w+ \d+ \d+ \S+)/,
            time = re.exec(ds)[1],
            mil = d.getMilliseconds();

        return time + ',' + mil;
    }

    function logger(domain) {
        domain = domain || 'root';
        function binder(fn, level) {
            return function() {
                // logging format: Dec 14 2012 15:42:41,453 - LOG - root - [your message here] 
                var prefix = [timetag(), level, domain].join(' - ') + ' -';
                fn.apply(console, [prefix].concat([].slice.call(arguments, 0)));
            };
        }
        return {
            l: binder(console.log, 'LOG'),
            d: binder(console.debug, 'DEBUG'),
            i: binder(console.info, 'INFO'),
            w: binder(console.warn, 'WARNING'),
            e: binder(console.error, 'ERROR')
        };
    }

    function defineProperties(o, props) {
        for (var key in props) {
            o[key] = props[key];
        }
    }

    var Mono = function(domain) {
        defineProperties(this, logger(domain));
    };

    defineProperties(Mono, {
        LOG: 1,
        DEBUG: 2,
        INFO: 3,
        WARNING: 4,
        ERROR: 5
    });

    // setup default logger
    defineProperties(Mono, logger());

    return Mono;
});
