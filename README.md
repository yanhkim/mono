mono
====

yet another log library for browser

Setup
-----

Just include mono.js

```html
<script type="text/javascript" src="mono.js"></script>
```

or require it as _AMD module_.

```javascript
define(['mono'], function(Mono) {
    // your code with mono
});
```

Usage
-----

```javascript
// You can get a simple log by call Mono.(l|i|d|w|e)();
// format: [date] - [level] - [domain] - [message]

Mono.l('foo');
// > Dec 14 2012 17:58:35,516 - LOG - root - foo

// default domain is 'root'. You can seperate log domain by
// make a Mono instance.

var m = new Mono('other.module');
m.i('bar');
// > Dec 14 2012 18:02:30,770 - INFO - other.module - bar

// You can set a log level by calling .setLevel() function
// When you call this to *Mono* factory, this changes the
// default log level. Initially default sets to Mono.LOG
// (the lowest: every log shown) if .setLevel() called with
// Mono instance, log level affects only to that instance.

Mono.setLevel(Mono.WARNING);
Mono.i('baz');
// > --*-- nothing happened --*--

var m2 = new Mono('another.module');
m2.i('qux');
// > --*-- nothing happened --*--

m2.setLevel(Mono.INFO);
m2.i('qux');
// > Dec 14 2012 18:11:04,494 - INFO - another.module - qux

// You can totally turn off (or turn on) by calling
// Mono.off() (or Mono.on()).

Mono.off();
m2.e('corge');
// > --*-- nothing happened --*--

Mono.on();
m2.e('corge');
// > Dec 14 2012 18:14:11,413 - ERROR - another.module - corge
```

Compatability
-------------

Works great in chrome. HAHA!

Test
----

mono was fully tested by hand!

License
-------

MIT.
