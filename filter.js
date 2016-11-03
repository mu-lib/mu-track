(function (modules, factory) {
  var root = this;
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.call(root);
  } else {
    root["mu-track/filter"] = factory.call(root);
  }
})([], function () {
  var toString = Object.prototype.toString;

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