import { initState } from "./state";

export function initMixin(Vue) { // 表示在vue的基础上做一次混合操作
    Vue.prototype._init = function (options) {
        // el.data
        const vm = this;
        vm.$options = options; // 见用户的选项都放到了当前实例

        // 对数据进行初始化 watch computed props data ...
        initState(vm);
    }
}