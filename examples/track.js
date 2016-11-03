(function (modules, root, factory) {
  if (typeof define === "function" && define.amd) {
    define(modules, factory);
  } else if (typeof module === "object" && module.exports) {
    factory.apply(root, modules.map(require));
  } else {
    factory.apply(root, modules.map(function (m) {
      return this[m] || root[m.replace(/^\.{2}/, "mu-track")];
    }, {
        "jquery": root.jQuery,
        "afq": root.afq
      }));
  }
})(["afq", "../filter", "../reduce", "../forward"], this, function (afq, filter, reduce, forward) {
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

  function assign(target, source) {
    var key;

    for (key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }

    return target;
  }

  afq("provide", "track", reduce(forward.call(afq, "track.fb"), forward.call(afq, "track.ga")));

  afq("provide", "track.ga", function (type, data) {
    var pathname = window.location.pathname;
    var re_schools = /^\/schools\/.+/;
    var re_myapplication = /^\/myapplication\/?.+/;

    function send(obj) {
      ga("mu.send", assign({
        "eventLabel": pathname,
        "nonInteraction": true
      }, obj));
    }

    function event(obj) {
      send(assign({
        "hitType": "event"
      }, obj));
    }

    function pageview(obj) {
      send(assign({
        "hitType": "pageview"
      }, obj));
    }

    switch (type) {
      case "pageview":
        pageview({
          "nonInteraction": false
        });

        if (re_schools.test(pathname)) {
          event({
            "eventCategory": "conversion",
            "eventAction": "ViewContent"
          });
        }

        if (re_myapplication.test(pathname)) {
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