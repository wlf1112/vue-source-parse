let oldArrayPrototype = Array.prototype;
export let arrayMethods = Object.create(oldArrayPrototype);
// arrayMethods.__proto__=Array.prototype 继承

let methods = [
    'push',
    'shift',
    'unshift',
    'pop',
    'sort',
    'splice'
]

methods.forEach(method => {
    // 用户调用的如果是以上七个方法，会用自己重写的方法，否则用原来的数组方法
    arrayMethods[method] = function (...args) {
        oldArrayPrototype[method].call(this, ...args);
        
        // arr.push({a:1},{b:1})
        // arr.splice(0,1,xxx);
        let inserted;
        let ob = this.__ob__; // 根据当前数组获取到Observe实例
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args;//就是新增的内容
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }
        // 如果有新增的内内容要进行继续劫持，需要观测数组中的每一项，而不是数组
        if (inserted) {
            ob.observeArray(inserted);
        }
    }
})