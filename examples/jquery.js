(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    factory.apply(root, modules.map(require));
  } else {
    factory.apply(root, modules.map(function (m) {
      return this[m] || root[m.replace(/^\./, "mu-track")];
    }, {
        "jquery": root.jQuery,
        "afq": root.afq
      }));
  }
})(["jquery", "afq", "./handler"], this, function (jQuery, afq, handler) {
  var slice = Array.prototype.slice;
  var root = this;

  jQuery(function ($) {
    $(document)
      .on("track.tracking", handler(afq))
      .on("tracking", function ($event) {
        $($event.target).trigger("track.tracking", slice.call(arguments, 1));
      })
      .on("click", "[data-tracking]", function ($event) {
        var $target = $($event.target);
        $target.trigger("track.tracking", $target.attr("data-tracking"));
      });

    afq("track", "pageready");
  });
});