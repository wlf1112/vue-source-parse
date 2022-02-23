(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    var ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*'; // 标签名

    var qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; // <aa:xxx></aa:xxx>

    var startTagOpen = new RegExp("^<" + qnameCapture); // 匹配开始标签

    var startTagClose = /^\s*(\/?)>/; // 匹配标签关闭 </div>

    var endTag = new RegExp("^<\\/" + qnameCapture + "[^>]*>"); // 匹配闭合标签

    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    // html字符串解析成dom 对应的脚本触发 tokens

    function start(tagName, attributes) {
      console.log('start', tagName, attributes);
    }

    function end(tagName) {
      console.log('end', tagName);
    }

    function chars(text) {
      console.log('chars', text);
    }

    function parserHTML(html) {
      function advance(len) {
        html = html.substring(len);
      }

      function parseStartTag() {
        var start = html.match(startTagOpen);

        if (start) {
          var match = {
            tagName: start[1],
            attrs: []
          };
          advance(start[0].length);

          var _end; // 如果没有遇到标签结尾就不停的解析


          var attr;

          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
            advance(attr[0].length);
          }

          if (_end) {
            advance(_end[0].length);
          }

          return match;
        }

        return false; // 不是开始标签
      }

      while (html) {
        // 看要解析的内容是都存在，如果存在就不停的解析
        var textEnd = html.indexOf('<'); // 当前解析的开头

        if (textEnd == 0) {
          var startTagMatch = parseStartTag(); // 解析开始标签

          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          }

          var endTagMatch = html.match(endTag); // 解析结束标签

          if (endTagMatch) {
            end(endTagMatch[1]);
            advance(endTagMatch[0].length);
          }
        }

        var text = void 0;

        if (textEnd > 0) {
          text = html.substring(0, textEnd);
        }

        if (text) {
          chars(text);
          advance(text.length);
        }
      }
    }

    function compilerFunction(template) {
      parserHTML(template);
    }

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

    var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
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

    // 如果是数组，会劫持数组的方法，并对数组中不是基本数据类型的进行监测
    // 类监测数据的变化，类有类型；对象无类型

    var Observe = /*#__PURE__*/function () {
      function Observe(data) {
        _classCallCheck(this, Observe);

        // 对对象中的所有属性进行劫持
        Object.defineProperty(data, '__ob__', {
          value: this,
          enumerable: false // 不可枚举

        }); //data.__ob__ = this; //所有被劫持过的属性都有__ob__属性

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

      data = vm._data = isFunction(data) ? data.call(vm) : data; // vm.xxx===vm._data.xxx

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
        vm.$options = options; // 用户的选项都放到了当前实例
        // 对数据进行初始化 watch computed props data ...

        initState(vm);

        if (vm.$options.el) {
          // 将数据挂载到这个模版上
          vm.$mount(vm.$options.el);
        }
      };

      Vue.prototype.$mount = function (el) {
        var vm = this;
        var options = vm.$options;
        el = document.querySelector(el); // 把模版转换成对应的渲染函数 -> 虚拟dom概念vnode -> diff算法更新虚拟
        // dom -> 产生真实节点，更新

        if (!vm.$options.render) {
          // 没有render用template
          var template = options.template;

          if (!template && el) {
            // 用户也没有传递template，获取el的内容作为模板
            template = el.outerHTML;
            var render = compilerFunction(template);
            options.render = render; // 生成渲染函数
          }
        }
      };
    }

    function Vue(options) {
      // options为用户传入的选项
      this._init(options); // 初始化操作，将_init方法放在原型上，是为了组件可以调用

    } // 扩展原型


    initMixin(Vue);

    return Vue;

}));
//# sourceMappingURL=vue.js.map
