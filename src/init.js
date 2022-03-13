import { compilerFunction } from "./compiler/index";
import { mountComponent } from "./lifecycle";
import { initState } from "./state";

export function initMixin(Vue) { // 表示在vue的基础上做一次混合操作
    Vue.prototype._init = function (options) {
        // el.data
        const vm = this;
        vm.$options = options; // 用户的选项都放到了当前实例

        // 对数据进行初始化 watch computed props data ...
        initState(vm);

        if (vm.$options.el) {
            // 将数据挂载到这个模版上
            vm.$mount(vm.$options.el);
        }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const options = vm.$options;
        el = document.querySelector(el);
        vm.$el=el;

        // 把模版转换成对应的渲染函数 -> 虚拟dom概念vnode -> diff算法更新虚拟
        // dom -> 产生真实节点，更新
        if (!vm.$options.render) { // 没有render用template
            let template = options.template;
            if (!template && el) { // 用户也没有传递template，获取el的内容作为模板
                template = el.outerHTML;
                let render = compilerFunction(template);
                options.render = render; // 生成渲染函数
            }
        }
        console.log(options.render); // 调用render方法渲染成真实dom，替换掉页面内容

        mountComponent(vm, el);  // 组件的挂载流程
    }
}