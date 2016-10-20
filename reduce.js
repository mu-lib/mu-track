(function (modules, factory) {
  var root = this;
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.call(root);
  } else {
    root["mu-track/reduce"] = factory.call(root);
  }
})([], function () {
  var array = Array.prototype;
  var concat = array.concat;

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