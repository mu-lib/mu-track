(function (modules, factory) {
  var root = this;
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory.call(root);
  } else {
    root["mu-track/forward"] = factory.call(root);
  }
})([], function () {
  var concat = Array.prototype.concat;

  return function (type) {
    var me = this;

    return function () {
      return me.apply(this, concat.apply([type], arguments));
    }
  }
});