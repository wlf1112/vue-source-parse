import { observe } from "./observer/index";
import { isFunction } from "./util";

export function initState(vm) { // 状态的初始化
    const opts = vm.$options;
    // if (opts.props) {
    //     initProps();
    // }
    if (opts.data) {
        initData(vm);
    }
    // if (opts.computed) {
    //     initComputed();
    // }
    // if (opts.watch) {
    //     initWatch();
    // }
}

function proxy(vm,source,key) {
    Object.defineProperty(vm, key, {
        get(){
            return vm[source][key];
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data; //vue内部会对属性检测，如果是以$开头，不会进行代理

    // vue2中会将data中的所有数据，进行数据劫持 Object.defineProperty
    // 此时vm和data没有关系，通过vm._data进行关联
    data=vm._data = isFunction(data) ? data.call(vm) : data;
    
    // vm.xxx===vm._data.xxx
    for (let key in data) {
        proxy(vm, '_data', key);
    }
    observe(data);
}