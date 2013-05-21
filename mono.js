(function(root, factory) {
    if (typeof exports === 'function') {
        // CommonJS
        exports.Mono = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD (require.js)
        define([], function() {
            return (root.Mono = factory());
        });
    } else {
        // browser global
        root.Mono = factory();
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
        // out form(local time): Fri Jan 11 2013 13:33:42,055
        var d = new Date(),
            mtab = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dtab = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            d2 = function(t) { return t < 10 ? '0' + t : '' + t; },
            d3 = function(t) { return t < 10 ? '00' + t : (t < 100 ? '0' + t : '' + t); };

        return [
            dtab[d.getDay()],
            mtab[d.getMonth()],
            d.getDate(),
            d.getFullYear(), [
                d2(d.getHours()),
                d2(d.getMinutes()),
                d2(d.getSeconds()) + ',' + d3(d.getMilliseconds())
            ].join(':')
        ].join(' ');
    }

    function logger(Obj) {
        var domain = Obj._domain,
            level = Obj._level,
            defaultFn = 'log';
        function builder(enabled, fn, level) {
            return enabled ? function() {
                if (off) return;
                // logging format: Dec 14 2012 15:42:41,453 - LOG - root - [your message here]
                var prefix = [timetag(), level, domain].join(' - ') + ' - ',
                    message = [].slice.call(arguments, 0).join(' ');
                fn = console[fn] ? fn : defaultFn;
                console[fn](prefix + message);
            } : new Function();
        }
        return {
            l: builder(levels.LOG     >= level, 'log',    'LOG'),
            d: builder(levels.DEBUG   >= level, 'debug',  'DEBUG'),
            i: builder(levels.INFO    >= level, 'info',   'INFO'),
            w: builder(levels.WARNING >= level, 'warn',   'WARNING'),
            e: builder(levels.ERROR   >= level, 'error',  'ERROR')
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
                if (o._level === l) return o;
                o._level = l;
                defineProperties(o, logger(o));
                return o;
            },
            isEnabled: function(l) { return l >= o._level; }
        };
    }

    var Mono = function(domain, level) {
        this._domain = domain = domain || Mono._domain;
        this._level = level = level || Mono._level;
        defineProperties(this, logger(this));
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

    // altering default domain feature
    defineProperties(Mono, {
        setDomain: function(d) {
            if (d === Mono._domain) return Mono;
            Mono._domain = d;
            defineProperties(Mono, logger(Mono));
            return Mono
        }
    });

    // setup default logger
    defineProperties(Mono, logger(Mono));

    // inject level handlers
    defineProperties(Mono, leveler(Mono));

    return Mono;
});
