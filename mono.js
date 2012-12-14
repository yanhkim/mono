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
    var levels = {
        LOG: 1,
        DEBUG: 2,
        INFO: 3,
        WARNING: 4,
        ERROR: 5
    };

    // global on-off switch
    var off = false;

    function timetag() {
        // format: Fri Dec 14 2012 15:02:39 GMT+0900 (KST)
        var d = new Date(),
            ds = d.toLocaleString(),
            re = /\w+ (\w+ \d+ \d+ \S+)/,
            time = re.exec(ds)[1],
            mil = d.getMilliseconds();

        return time + ',' + mil;
    }

    function logger(domain, level) {
        function binder(enabled, fn, level) {
            return enabled ? function() {
                if (off) return;
                // logging format: Dec 14 2012 15:42:41,453 - LOG - root - [your message here]
                var prefix = [timetag(), level, domain].join(' - ') + ' -';
                fn.apply(console, [prefix].concat([].slice.call(arguments, 0)));
            } : new Function();
        }
        return {
            l: binder(levels.LOG >= level, console.log, 'LOG'),
            d: binder(levels.DEBUG >= level, console.debug, 'DEBUG'),
            i: binder(levels.INFO >= level, console.info, 'INFO'),
            w: binder(levels.WARNING >= level, console.warn, 'WARNING'),
            e: binder(levels.ERROR >= level, console.error, 'ERROR')
        };
    }

    function defineProperties(o, props) {
        for (var key in props) {
            o[key] = props[key];
        }
    }

    function leveler(o) {
        return {
            getLevel: function() { return o._level; },
            setLevel: function(l) {
                if (o._level === l) return;
                o._level = l;
                defineProperties(o, logger(o._domain, o._level));
            },
            isEnabled: function(l) { return l >= o._level; }
        };
    }

    var Mono = function(domain, level) {
        this._domain = domain = domain || Mono._domain;
        this._level = level = level || Mono._level;
        defineProperties(this, logger(domain, level));
        defineProperties(this, leveler(this));
    };

    // set (not) constants
    defineProperties(Mono, levels);

    // set default values
    defineProperties(Mono, {
        _domain: 'root',
        _level: levels.LOG
    });

    // inject on-off functionality
    defineProperties(Mono, {
        off: function() { off = true; return this; },
        on: function() { off = false; return this; }
    });

    // setup default logger
    defineProperties(Mono, logger(Mono._domain, Mono._level));

    // inject level handlers
    defineProperties(Mono, leveler(Mono));

    return Mono;
});
