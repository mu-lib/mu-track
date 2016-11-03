(function (umd) {
  var array = Array.prototype;
  var concat = array.concat;
  var slice = array.slice;
  var toString = Object.prototype.toString;

  umd("mu-afq/afq")([], function () {
    var afq = "afq";
    var x = "afqObject";
    var w = this;
    var q = w[afq] && w[afq].q ? slice.call(w[afq].q) : [];

    afq = afq === w[x]
      ? w[afq]
      : w[w[x] = afq] = (function (_q) {
        function _afq(n) {
          _afq[n] ? _afq[n].apply(this, slice.call(arguments, 1)) : (_q[n] = _q[n] || []).push(slice.call(arguments, 1));
        }

        _afq.provide = function (n, f) {
          _afq[n] = f;

          _q[n] && _q[n].forEach(function (a) {
            f.apply(this, a);
          }, this);
        };

        return _afq;
      })({});

    while (q.length) {
      afq.apply(afq, q.shift());
    }

    return afq;
  });

  umd("mu-track/filter")([], function () {
    return function (filter, index, cb) {
      switch (arguments.length) {
        case 2:
          cb = index;
          index = 0;
          break;

        case 1:
          cb = filter;
          break;

        case 0:
          throw new Error("not enough arguments");
      }

      return function () {
        var type = arguments[index];

        switch (toString.call(filter)) {
          case "[object Function]":
            if (filter.apply(this, arguments) !== false) {
              break;
            }

          case "[object RegExp]":
            if (filter.test(type) === true) {
              break;
            }

          case "[object String]":
            if (type === filter) {
              break;
            }

          default:
            return;
        }

        (toString.call(cb) === "[object Function]" ? cb : cb.handler).apply(this, arguments);
      }
    }
  });

  umd("mu-track/forward")([], function () {
    return function (type) {
      var me = this;

      return function () {
        return me.apply(this, concat.apply([type], arguments));
      }
    }
  });

  umd("mu-track/handler")([], function () {
    return function (cb) {
      return function ($event) {
        var args = slice.call(arguments);

        if (toString.call($event) !== "[object String]") {
          args[0] = $event.type;
        }

        cb.apply(this, args);
      }
    }
  });

  umd("mu-track/reduce")([], function () {
    return function () {
      var callbacks = concat.apply(array, arguments);

      return function () {
        var me = this;
        var args = arguments;

        return callbacks.reduce(function (result, callback) {
          var _result = result;

          return result === false || (result = callback.apply(me, args)) === undefined
            ? _result
            : result;
        }, undefined);
      }
    }
  });
})(function (name) {
  var prefix = name.replace(/\/.+$/, "");
  var root = this;

  return function (modules, factory) {
    if (typeof define === "function" && define.amd) {
      define(modules, factory);
    } else if (typeof module === "object" && module.exports) {
      module.exports = factory.apply(root, modules.map(require));
    } else {
      root[name] = factory.apply(root, modules.map(function (m) {
        return root[m.replace(/^\./, prefix)] || m;
      }));
    }
  }
});