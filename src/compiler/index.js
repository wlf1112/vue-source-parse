import { generate } from "./generate";
import { parserHTML } from "./parser";

export function compilerFunction(template) {
    let root = parserHTML(template);
    
    // 生成代码
    // render(){
    //     return _c('div', {id:'app'},'hello')
    // }
    let code = generate(root);
    
    // html->ast（只能描述语法 语法不存在的属性无法描述）->render函数->虚拟dom（增加额外属性）-> 生成真实dom
}   