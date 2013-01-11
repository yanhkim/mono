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
            level = Obj._level;
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
