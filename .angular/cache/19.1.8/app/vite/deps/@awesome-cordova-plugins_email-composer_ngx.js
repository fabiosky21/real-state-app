import {
  Injectable,
  fromEvent,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵgetInheritedFactory
} from "./chunk-6PFVVLMY.js";
import {
  Observable
} from "./chunk-OSNQHB2X.js";
import {
  __decorate,
  __extends
} from "./chunk-N25OJVE5.js";
import "./chunk-UQIXM5CJ.js";

// node_modules/@awesome-cordova-plugins/core/bootstrap.js
function checkReady() {
  if (typeof process === "undefined") {
    var win_1 = typeof window !== "undefined" ? window : {};
    var DEVICE_READY_TIMEOUT_1 = 5e3;
    var before_1 = Date.now();
    var didFireReady_1 = false;
    win_1.document.addEventListener("deviceready", function() {
      console.log("Ionic Native: deviceready event fired after " + (Date.now() - before_1) + " ms");
      didFireReady_1 = true;
    });
    setTimeout(function() {
      if (!didFireReady_1 && win_1.cordova) {
        console.warn("Ionic Native: deviceready did not fire within " + DEVICE_READY_TIMEOUT_1 + "ms. This can happen when plugins are in an inconsistent state. Try removing plugins from plugins/ and reinstalling them.");
      }
    }, DEVICE_READY_TIMEOUT_1);
  }
}

// node_modules/@awesome-cordova-plugins/core/decorators/common.js
var ERR_CORDOVA_NOT_AVAILABLE = {
  error: "cordova_not_available"
};
var ERR_PLUGIN_NOT_INSTALLED = {
  error: "plugin_not_installed"
};
function getPromise(callback) {
  var tryNativePromise = function() {
    if (Promise) {
      return new Promise(function(resolve, reject) {
        callback(resolve, reject);
      });
    } else {
      console.error("No Promise support or polyfill found. To enable Ionic Native support, please add the es6-promise polyfill before this script, or run with a library like Angular or on a recent browser.");
    }
  };
  if (typeof window !== "undefined" && window.angular) {
    var doc = window.document;
    var injector = window.angular.element(doc.querySelector("[ng-app]") || doc.body).injector();
    if (injector) {
      var $q = injector.get("$q");
      return $q(function(resolve, reject) {
        callback(resolve, reject);
      });
    }
    console.warn("Angular 1 was detected but $q couldn't be retrieved. This is usually when the app is not bootstrapped on the html or body tag. Falling back to native promises which won't trigger an automatic digest when promises resolve.");
  }
  return tryNativePromise();
}
function wrapPromise(pluginObj, methodName, args, opts) {
  if (opts === void 0) {
    opts = {};
  }
  var pluginResult, rej;
  var p = getPromise(function(resolve, reject) {
    if (opts.destruct) {
      pluginResult = callCordovaPlugin(pluginObj, methodName, args, opts, function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        return resolve(args2);
      }, function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        return reject(args2);
      });
    } else {
      pluginResult = callCordovaPlugin(pluginObj, methodName, args, opts, resolve, reject);
    }
    rej = reject;
  });
  if (pluginResult && pluginResult.error) {
    p.catch(function() {
    });
    typeof rej === "function" && rej(pluginResult.error);
  }
  return p;
}
function wrapOtherPromise(pluginObj, methodName, args, opts) {
  if (opts === void 0) {
    opts = {};
  }
  return getPromise(function(resolve, reject) {
    var pluginResult = callCordovaPlugin(pluginObj, methodName, args, opts);
    if (pluginResult) {
      if (pluginResult.error) {
        reject(pluginResult.error);
      } else if (pluginResult.then) {
        pluginResult.then(resolve).catch(reject);
      }
    } else {
      reject({
        error: "unexpected_error"
      });
    }
  });
}
function wrapObservable(pluginObj, methodName, args, opts) {
  if (opts === void 0) {
    opts = {};
  }
  return new Observable(function(observer) {
    var pluginResult;
    if (opts.destruct) {
      pluginResult = callCordovaPlugin(pluginObj, methodName, args, opts, function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        return observer.next(args2);
      }, function() {
        var args2 = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args2[_i] = arguments[_i];
        }
        return observer.error(args2);
      });
    } else {
      pluginResult = callCordovaPlugin(pluginObj, methodName, args, opts, observer.next.bind(observer), observer.error.bind(observer));
    }
    if (pluginResult && pluginResult.error) {
      observer.error(pluginResult.error);
      observer.complete();
    }
    return function() {
      try {
        if (opts.clearFunction) {
          if (opts.clearWithArgs) {
            return callCordovaPlugin(pluginObj, opts.clearFunction, args, opts, observer.next.bind(observer), observer.error.bind(observer));
          }
          return callCordovaPlugin(pluginObj, opts.clearFunction, []);
        }
      } catch (e) {
        console.warn("Unable to clear the previous observable watch for", pluginObj.constructor.getPluginName(), methodName);
        console.warn(e);
      }
    };
  });
}
function wrapEventObservable(event, element) {
  element = typeof window !== "undefined" && element ? get(window, element) : element || (typeof window !== "undefined" ? window : {});
  return fromEvent(element, event);
}
function checkAvailability(plugin, methodName, pluginName) {
  var pluginRef, pluginPackage;
  if (typeof plugin === "string") {
    pluginRef = plugin;
  } else {
    pluginRef = plugin.constructor.getPluginRef();
    pluginName = plugin.constructor.getPluginName();
    pluginPackage = plugin.constructor.getPluginInstallName();
  }
  var pluginInstance = getPlugin(pluginRef);
  if (!pluginInstance || !!methodName && typeof pluginInstance[methodName] === "undefined") {
    if (typeof window === "undefined" || !window.cordova) {
      cordovaWarn(pluginName, methodName);
      return ERR_CORDOVA_NOT_AVAILABLE;
    }
    pluginWarn(pluginName, pluginPackage, methodName);
    return ERR_PLUGIN_NOT_INSTALLED;
  }
  return true;
}
function setIndex(args, opts, resolve, reject) {
  if (opts === void 0) {
    opts = {};
  }
  if (opts.sync) {
    return args;
  }
  if (opts.callbackOrder === "reverse") {
    args.unshift(reject);
    args.unshift(resolve);
  } else if (opts.callbackStyle === "node") {
    args.push(function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  } else if (opts.callbackStyle === "object" && opts.successName && opts.errorName) {
    var obj = {};
    obj[opts.successName] = resolve;
    obj[opts.errorName] = reject;
    args.push(obj);
  } else if (typeof opts.successIndex !== "undefined" || typeof opts.errorIndex !== "undefined") {
    var setSuccessIndex = function() {
      if (opts.successIndex > args.length) {
        args[opts.successIndex] = resolve;
      } else {
        args.splice(opts.successIndex, 0, resolve);
      }
    };
    var setErrorIndex = function() {
      if (opts.errorIndex > args.length) {
        args[opts.errorIndex] = reject;
      } else {
        args.splice(opts.errorIndex, 0, reject);
      }
    };
    if (opts.successIndex > opts.errorIndex) {
      setErrorIndex();
      setSuccessIndex();
    } else {
      setSuccessIndex();
      setErrorIndex();
    }
  } else {
    args.push(resolve);
    args.push(reject);
  }
  return args;
}
function callCordovaPlugin(pluginObj, methodName, args, opts, resolve, reject) {
  if (opts === void 0) {
    opts = {};
  }
  args = setIndex(args, opts, resolve, reject);
  var availabilityCheck = checkAvailability(pluginObj, methodName);
  if (availabilityCheck === true) {
    var pluginInstance = getPlugin(pluginObj.constructor.getPluginRef());
    return pluginInstance[methodName].apply(pluginInstance, args);
  } else {
    return availabilityCheck;
  }
}
function getPlugin(pluginRef) {
  if (typeof window !== "undefined") {
    return get(window, pluginRef);
  }
  return null;
}
function get(element, path) {
  var paths = path.split(".");
  var obj = element;
  for (var i = 0; i < paths.length; i++) {
    if (!obj) {
      return null;
    }
    obj = obj[paths[i]];
  }
  return obj;
}
function pluginWarn(pluginName, plugin, method) {
  if (method) {
    console.warn("Native: tried calling " + pluginName + "." + method + ", but the " + pluginName + " plugin is not installed.");
  } else {
    console.warn("Native: tried accessing the " + pluginName + " plugin but it's not installed.");
  }
  if (plugin) {
    console.warn("Install the " + pluginName + " plugin: 'ionic cordova plugin add " + plugin + "'");
  }
}
function cordovaWarn(pluginName, method) {
  if (typeof process === "undefined") {
    if (method) {
      console.warn("Native: tried calling " + pluginName + "." + method + ", but Cordova is not available. Make sure to include cordova.js or run in a device/simulator");
    } else {
      console.warn("Native: tried accessing the " + pluginName + " plugin but Cordova is not available. Make sure to include cordova.js or run in a device/simulator");
    }
  }
}
var wrap = function(pluginObj, methodName, opts) {
  if (opts === void 0) {
    opts = {};
  }
  return function() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (opts.sync) {
      return callCordovaPlugin(pluginObj, methodName, args, opts);
    } else if (opts.observable) {
      return wrapObservable(pluginObj, methodName, args, opts);
    } else if (opts.eventObservable && opts.event) {
      return wrapEventObservable(opts.event, opts.element);
    } else if (opts.otherPromise) {
      return wrapOtherPromise(pluginObj, methodName, args, opts);
    } else {
      return wrapPromise(pluginObj, methodName, args, opts);
    }
  };
};

// node_modules/@awesome-cordova-plugins/core/util.js
function get2(element, path) {
  var paths = path.split(".");
  var obj = element;
  for (var i = 0; i < paths.length; i++) {
    if (!obj) {
      return null;
    }
    obj = obj[paths[i]];
  }
  return obj;
}

// node_modules/@awesome-cordova-plugins/core/awesome-cordova-plugin.js
var AwesomeCordovaNativePlugin = (
  /** @class */
  function() {
    function AwesomeCordovaNativePlugin2() {
    }
    AwesomeCordovaNativePlugin2.installed = function() {
      var isAvailable = checkAvailability(this.pluginRef) === true;
      return isAvailable;
    };
    AwesomeCordovaNativePlugin2.getPlugin = function() {
      if (typeof window !== "undefined") {
        return get2(window, this.pluginRef);
      }
      return null;
    };
    AwesomeCordovaNativePlugin2.getPluginName = function() {
      var pluginName = this.pluginName;
      return pluginName;
    };
    AwesomeCordovaNativePlugin2.getPluginRef = function() {
      var pluginRef = this.pluginRef;
      return pluginRef;
    };
    AwesomeCordovaNativePlugin2.getPluginInstallName = function() {
      var plugin = this.plugin;
      return plugin;
    };
    AwesomeCordovaNativePlugin2.getSupportedPlatforms = function() {
      var platform = this.platforms;
      return platform;
    };
    AwesomeCordovaNativePlugin2.pluginName = "";
    AwesomeCordovaNativePlugin2.pluginRef = "";
    AwesomeCordovaNativePlugin2.plugin = "";
    AwesomeCordovaNativePlugin2.repo = "";
    AwesomeCordovaNativePlugin2.platforms = [];
    AwesomeCordovaNativePlugin2.install = "";
    return AwesomeCordovaNativePlugin2;
  }()
);

// node_modules/@awesome-cordova-plugins/core/decorators/cordova.js
function cordova(pluginObj, methodName, config, args) {
  return wrap(pluginObj, methodName, config).apply(this, args);
}

// node_modules/@awesome-cordova-plugins/core/index.js
checkReady();

// node_modules/@awesome-cordova-plugins/email-composer/ngx/index.js
var EmailComposer = (
  /** @class */
  function(_super) {
    __extends(EmailComposer2, _super);
    function EmailComposer2() {
      return _super !== null && _super.apply(this, arguments) || this;
    }
    EmailComposer2.prototype.hasPermission = function() {
      return cordova(this, "hasPermission", {
        "successIndex": 0,
        "errorIndex": 2
      }, arguments);
    };
    EmailComposer2.prototype.requestPermission = function() {
      return cordova(this, "requestPermission", {
        "successIndex": 0,
        "errorIndex": 2
      }, arguments);
    };
    EmailComposer2.prototype.hasAccount = function() {
      var _this = this;
      return function() {
        if (checkAvailability(_this) === true) {
          return getPromise(function(resolve) {
            EmailComposer2.getPlugin().hasAccount(function(result) {
              if (result) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          });
        }
      }();
    };
    EmailComposer2.prototype.hasClient = function(app) {
      var _this = this;
      return function() {
        if (checkAvailability(_this) === true) {
          return getPromise(function(resolve) {
            if (app) {
              EmailComposer2.getPlugin().hasClient(app, function(result) {
                if (result) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              });
            } else {
              EmailComposer2.getPlugin().getClients(function(apps) {
                resolve(apps && apps.length > 0);
              });
            }
          });
        }
      }();
    };
    EmailComposer2.prototype.getClients = function() {
      var _this = this;
      return function() {
        if (checkAvailability(_this) === true) {
          return getPromise(function(resolve) {
            EmailComposer2.getPlugin().getClients(function(apps) {
              if (Object.prototype.toString.call(apps) === "[object String]") {
                apps = [apps];
              }
              resolve(apps);
            });
          });
        }
      }();
    };
    EmailComposer2.prototype.isAvailable = function(app) {
      var _this = this;
      return function() {
        if (checkAvailability(_this) === true) {
          return getPromise(function(resolve) {
            Promise.all([_this.hasAccount, _this.hasClient(app)]).then(function(results) {
              return resolve(results.length === 2 && results[0] && results[1]);
            });
          });
        }
      }();
    };
    EmailComposer2.prototype.open = function(options, scope) {
      return cordova(this, "open", {
        "successIndex": 1,
        "errorIndex": 3
      }, arguments);
    };
    EmailComposer2.prototype.addAlias = function(alias, packageName) {
      return cordova(this, "addAlias", {}, arguments);
    };
    EmailComposer2.ɵfac = /* @__PURE__ */ (() => {
      let ɵEmailComposer_BaseFactory;
      return function EmailComposer_Factory(__ngFactoryType__) {
        return (ɵEmailComposer_BaseFactory || (ɵEmailComposer_BaseFactory = ɵɵgetInheritedFactory(EmailComposer2)))(__ngFactoryType__ || EmailComposer2);
      };
    })();
    EmailComposer2.ɵprov = ɵɵdefineInjectable({
      token: EmailComposer2,
      factory: EmailComposer2.ɵfac
    });
    EmailComposer2.pluginName = "EmailComposer";
    EmailComposer2.plugin = "cordova-plugin-email-composer";
    EmailComposer2.pluginRef = "cordova.plugins.email";
    EmailComposer2.repo = "https://github.com/katzer/cordova-plugin-email-composer";
    EmailComposer2.platforms = ["Amazon Fire OS", "Android", "Browser", "iOS", "Windows", "macOS"];
    EmailComposer2 = __decorate([], EmailComposer2);
    return EmailComposer2;
  }(AwesomeCordovaNativePlugin)
);
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(EmailComposer, [{
    type: Injectable
  }], null, {
    hasPermission: [],
    requestPermission: [],
    hasAccount: [],
    hasClient: [],
    getClients: [],
    isAvailable: [],
    open: [],
    addAlias: []
  });
})();
export {
  EmailComposer
};
//# sourceMappingURL=@awesome-cordova-plugins_email-composer_ngx.js.map
