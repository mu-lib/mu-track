(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    factory.apply(root, modules.map(require));
  } else {
    root["mu-track/examples/track"] = factory.apply(root, modules.map(function (m) {
      return this[m] || root[m.replace(/^\./, "mu-track")] || m;
    }, {
        "jquery": root.jQuery,
        "afq": root.afq,
      }));
  }
})(["jquery", "afq", "./handler", "./filter", "./reduce", "./forward"], this, function (jQuery, afq, handler, filter, reduce, forward) {
  jQuery(function ($) {
    $(document)
      .on("hit.track", handler(afq))
      .on("click", "[data-tracking]", function ($event) {
        var $target = $($event.target);

        $target.trigger("hit.track", $target.attr("data-tracking"));
      });

    afq("hit", "pageload");
  });

  afq("provide", "hit", reduce(forward.call(afq, "hit.fb"), forward.call(afq, "hit.ga")));

  afq("provide", "hit.ga", function ga_plugin() {
    console.log("ga: %o", arguments);
  });

  afq("provide", "hit.fb", function fb_plugin() {
    console.log("fb: %o", arguments);
  });
});