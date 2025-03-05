import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  EnvironmentInjector,
  Injectable,
  Injector,
  ViewEncapsulation,
  createComponent,
  inject,
  setClassMetadata,
  ɵɵdefineComponent,
  ɵɵdefineInjectable
} from "./chunk-6PFVVLMY.js";
import {
  __publicField
} from "./chunk-UQIXM5CJ.js";

// node_modules/@angular/cdk/fesm2022/private.mjs
var appsWithLoaders = /* @__PURE__ */ new WeakMap();
var __CdkPrivateStyleLoader = class __CdkPrivateStyleLoader {
  _appRef;
  _injector = inject(Injector);
  _environmentInjector = inject(EnvironmentInjector);
  /**
   * Loads a set of styles.
   * @param loader Component which will be instantiated to load the styles.
   */
  load(loader) {
    const appRef = this._appRef = this._appRef || this._injector.get(ApplicationRef);
    let data = appsWithLoaders.get(appRef);
    if (!data) {
      data = {
        loaders: /* @__PURE__ */ new Set(),
        refs: []
      };
      appsWithLoaders.set(appRef, data);
      appRef.onDestroy(() => {
        var _a;
        (_a = appsWithLoaders.get(appRef)) == null ? void 0 : _a.refs.forEach((ref) => ref.destroy());
        appsWithLoaders.delete(appRef);
      });
    }
    if (!data.loaders.has(loader)) {
      data.loaders.add(loader);
      data.refs.push(createComponent(loader, {
        environmentInjector: this._environmentInjector
      }));
    }
  }
};
__publicField(__CdkPrivateStyleLoader, "ɵfac", function _CdkPrivateStyleLoader_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || __CdkPrivateStyleLoader)();
});
__publicField(__CdkPrivateStyleLoader, "ɵprov", ɵɵdefineInjectable({
  token: __CdkPrivateStyleLoader,
  factory: __CdkPrivateStyleLoader.ɵfac,
  providedIn: "root"
}));
var _CdkPrivateStyleLoader = __CdkPrivateStyleLoader;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_CdkPrivateStyleLoader, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var __VisuallyHiddenLoader = class __VisuallyHiddenLoader {
};
__publicField(__VisuallyHiddenLoader, "ɵfac", function _VisuallyHiddenLoader_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || __VisuallyHiddenLoader)();
});
__publicField(__VisuallyHiddenLoader, "ɵcmp", ɵɵdefineComponent({
  type: __VisuallyHiddenLoader,
  selectors: [["ng-component"]],
  exportAs: ["cdkVisuallyHidden"],
  decls: 0,
  vars: 0,
  template: function _VisuallyHiddenLoader_Template(rf, ctx) {
  },
  styles: [".cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;outline:0;-webkit-appearance:none;-moz-appearance:none;left:0}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}"],
  encapsulation: 2,
  changeDetection: 0
}));
var _VisuallyHiddenLoader = __VisuallyHiddenLoader;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(_VisuallyHiddenLoader, [{
    type: Component,
    args: [{
      exportAs: "cdkVisuallyHidden",
      encapsulation: ViewEncapsulation.None,
      template: "",
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [".cdk-visually-hidden{border:0;clip:rect(0 0 0 0);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;white-space:nowrap;outline:0;-webkit-appearance:none;-moz-appearance:none;left:0}[dir=rtl] .cdk-visually-hidden{left:auto;right:0}"]
    }]
  }], null, null);
})();

export {
  _CdkPrivateStyleLoader,
  _VisuallyHiddenLoader
};
//# sourceMappingURL=chunk-EZUCNLAN.js.map
