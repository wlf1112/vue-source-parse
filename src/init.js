
export function initMixin(Vue) { // 表示在vue的基础上做一次混合操作
    Vue.prototype._init = function (options) {
        // el.data
        const vm = this;
        vm.$options = options;
    }
}