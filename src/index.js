import { initMixin } from "./init";

function Vue(options) {
    // options为用户传入的选项
    this._init(options); // 初始化操作  
}

// 扩展原型
initMixin(Vue);

export default Vue;