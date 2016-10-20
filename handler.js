(function (modules, factory) {
  var root = this;
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.call(root);
  } else {
    root["mu-track/handler"] = factory.call(root);
  }
})([], function () {
  var toString = Object.prototype.toString;
  var slice = Array.prototype.slice;

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