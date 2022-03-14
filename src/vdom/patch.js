export function patch(oldVnode,vnode){
    if(oldVnode.nodeType==1){
        //用vnode来生成真实dom替换原来的dom元素
        const parentElem=oldVnode.parentNode;// 找到它的父亲
        let elm=createElm(vnode);
        // 在第一次渲染后是删除节点，下次使用无法获取
        parentElem.insertBefore(elm,oldVnode.nextSibling);
        parentElem.removeChild(oldVnode);

        return elm;
    }
}


function createElm(vnode){
    let {tag,data,children,text,vm}=vnode;
    if(typeof(tag)==='string'){
        vnode.el=document.createElement(tag); // 虚拟节点会有一个el属性，对应真实节点
        children.forEach(child=>{
            vnode.el.appendChild(createElm(child));
        })
    }else{

    }
    return vnode.el;
}