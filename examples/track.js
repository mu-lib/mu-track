(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    factory.apply(root, modules.map(require));
  } else {
    factory.apply(root, modules.map(function (m) {
      return this[m] || root[m.replace(/^\./, "mu-track")] || m;
    }, {
        "jquery": root.jQuery,
        "afq": root.afq,
      }));
  }
})(["jquery", "afq", "./handler", "./filter", "./reduce", "./forward"], this, function (jQuery, afq, handler, filter, reduce, forward) {
  var slice = Array.prototype.slice;
  var root = this;

  function q(map, data) {
    return Object
      .keys(map)
      .map(function (key) {
        return data.hasOwnProperty(key)
          ? map[key] + "=" + data[key]
          : map[key] + "=all";
      })
      .join("&");
  }

  jQuery(function ($) {
    $(document)
      .on("hit.track", handler(afq))
      .on("tracking", function ($event) {
        $($event.target).trigger("hit.track", slice.call(arguments, 1));
      })
      .on("click", "[data-tracking]", function ($event) {
        var $target = $($event.target);
        $target.trigger("hit.track", $target.attr("data-tracking"));
      });

    afq("hit", "pageready");
  });

  afq("provide", "hit", reduce(forward.call(afq, "hit.fb"), forward.call(afq, "hit.ga")));

  afq("provide", "hit.ga", function (type, data) {
    var pathname = window.location.pathname;

    function send(obj) {
      ga("mu.send", $.extend({
        "eventLabel": pathname,
        "nonInteraction": true
      }, obj));
    }

    function event(obj) {
      send($.extend({
        "hitType": "event"
      }, obj));
    }

    function pageview(obj) {
      send($.extend({
        "hitType": "pageview"
      }, obj));
    }

    switch (type) {
      case "pageview":
        pageview({
          "nonInteraction": false
        });

        if (/^\/schools\/.+/.test(pathname)) {
          event({
            "eventCategory": "conversion",
            "eventAction": "ViewContent"
          });
        }

        if (/^\/myapplication\/?.+/.test(pathname)) {
          event({
            "eventCategory": "conversion",
            "eventAction": "InitiateCheckout"
          });
        }
        break;

      case "login-success":
        event({
          "eventCategory": "conversion",
          "eventAction": "Login"
        });
        break;

      case "search":
        pageview({
          "page": pathname + "?q=&" + q({
            "COU": "country",
            "PRGLEVEL": "level",
            "DISC": "discipline",
            "LOC": "location"
          }, data || {})
        });

        event({
          "eventCategory": "conversion",
          "eventAction": "Search"
        });
        break;

      case "apply-school":
      case "shortlist-school":
        event({
          "eventCategory": "conversion",
          "eventAction": "AddToCart"
        });
        break;

      case "request-info":
        event({
          "eventCategory": "conversion",
          "eventAction": "AddToWishlist"
        });
        break;

      case "payment-attempt":
        event({
          "eventCategory": "conversion",
          "eventAction": "AddPaymentInfo"
        });
        break;

      case "payment-success":
        event({
          "eventCategory": "conversion",
          "eventAction": "Purchase"
        });
        break;

      case "signup-success":
        event({
          "eventCategory": "conversion",
          "eventAction": "CompleteRegistration"
        });
      case "subscribe-success":
      case "contact-success":
        if (data && data.isLead) {
          event({
            "eventCategory": "conversion",
            "eventAction": "Lead"
          });
        }
        break;

      default:
        console.log(type, data);
    }
  });
});