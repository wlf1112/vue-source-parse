import { generate } from "./generate";
import { parserHTML } from "./parser";

export function compilerFunction(template) {
    let root = parserHTML(template);
    
    // 生成代码
    // render(){
    //     return _c('div', {id:'app'},'hello')
    // }
    let code = generate(root);

    let render = new Function(`with(this){return ${code}}`);  // code中会用到数据  数据在vm上
    return render;

    
    // html->ast（只能描述语法 语法不存在的属性无法描述）->render函数 (with+new Function)->虚拟dom（增加额外属性）-> 生成真实dom
}   