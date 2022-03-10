import { createElement, createTextElement } from "./vdom/index.js";

export function renderMixin(Vue) {
    Vue.prototype._c = function (tag,data,...children) { //createElement
        return createElement(this,...arguments);
    }

    Vue.prototype._v = function (text) { //
        return createTextElement(this,text);
    }

    Vue.prototype._s = function (val) {
        return JSON.stringify(val);
    }
    Vue.prototype._render = function () {
        const vm = this;
        let render = vm.$options.render;  // 就是我们解析出来的render方法，同时也有可能是用户写的
        
        let vnode = render.call(vm);

        return vnode;
    }
}