(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    function initMixin(Vue) {
      // 表示在vue的基础上做一次混合操作
      Vue.prototype._init = function (options) {
        // el.data
        var vm = this;
        vm.$options = options;
      };
    }

    function Vue(options) {
      // options为用户传入的选项
      this._init(options); // 初始化操作  

    }

    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
