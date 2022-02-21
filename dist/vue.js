(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function isFunction(val) {
    return typeof val === 'function';
  }
  function isObject(val) {
    return _typeof(val) === 'object' && val !== null;
  }

  var oldArrayPrototype = Array.prototype;
  var arrayMethods = Object.create(oldArrayPrototype); // arrayMethods.__proto__=Array.prototype 继承

  var methods = ['push', 'shift', 'unshift', 'pop', 'sort', 'splice'];
  methods.forEach(function (method) {
    // 用户调用的如果是以上七个方法，会用自己重写的方法，否则用原来的数组方法
    arrayMethods[method] = function () {
      var _oldArrayPrototype$me;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_oldArrayPrototype$me = oldArrayPrototype[method]).call.apply(_oldArrayPrototype$me, [this].concat(args)); // arr.push({a:1},{b:1})
      // arr.splice(0,1,xxx);


      var inserted;
      var ob = this.__ob__; // 根据当前数组获取到Observe实例

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args; //就是新增的内容

          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      } // 如果有新增的内内容要进行继续劫持，需要观测数组中的每一项，而不是数组


      if (inserted) {
        ob.observeArray(inserted);
      }
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);

      // 对对象中的所有属性进行劫持
      data.__ob__ = this; //所有被劫持过的属性都有__ob__属性

      if (Array.isArray(data)) {
        // 数组的劫持逻辑
        // 对数组原来的方法进行改写，切片编程 高阶函数
        data.__proto__ = arrayMethods; // 如果数组中的数据是对象类型，需要监控对象的变化

        this.observeArray(data);
      } else {
        this.walk(data); // 对象的劫持逻辑
      }
    }

    _createClass(Observe, [{
      key: "observeArray",
      value: function observeArray(data) {
        // 对数组中的数组 和数组中的对象再次劫持，递归
        data.forEach(function (item) {
          observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observe;
  }(); // vue2会对对象进行遍历，将每个属性用defineProperty重新进行定义，性能差


  function defineReactive(data, key, value) {
    // value有可能是对象
    observe(value); // 本身用户默认值是对象套对象，需要递归处理（性能差）

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newV) {
        observe(newV); //如果用户赋值一个新对象，需要将这个对象进行劫持

        value = newV;
      }
    });
  }

  function observe(data) {
    // 如果是对象才监测
    if (!isObject(data)) {
      return;
    }

    if (data.__ob__) {
      return;
    } // 默认最外层的data必须是一个对象


    return new Observe(data);
  }

  function initState(vm) {
    // 状态的初始化
    var opts = vm.$options; // if (opts.props) {
    //     initProps();
    // }

    if (opts.data) {
      initData(vm);
    } // if (opts.computed) {
    //     initComputed();
    // }
    // if (opts.watch) {
    //     initWatch();
    // }

  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }

  function initData(vm) {
    var data = vm.$options.data; //vue内部会对属性检测，如果是以$开头，不会进行代理
    // vue2中会将data中的所有数据，进行数据劫持 Object.defineProperty
    // 此时vm和data没有关系，通过vm._data进行关联

    data = vm._data = isFunction(data) ? data.call(vm) : data;

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data);
  }

  function initMixin(Vue) {
    // 表示在vue的基础上做一次混合操作
    Vue.prototype._init = function (options) {
      // el.data
      var vm = this;
      vm.$options = options; // 见用户的选项都放到了当前实例
      // 对数据进行初始化 watch computed props data ...

      initState(vm);
    };
  }

  function Vue(options) {
    // options为用户传入的选项
    this._init(options); // 初始化操作  

  } // 扩展原型


  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
