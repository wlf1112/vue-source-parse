import { popTarget, pushTarget } from "./dep";

let id=0;
class Watcher{
    // new Watcher(vm,updateComponent,()=>{
    //     console.log('更新视图了');
    // },true);
    constructor(vm,exprOrFn,cb,options){
        this.vm=vm;
        this.exprOrFn=exprOrFn;
        this.cb=cb;
        this.options=options;
        this.id=id++;

        // 默认应该让exprOrFn执行 exprOrFn方法做了什么？render（去vm上取值）
        this.getter=exprOrFn; 
        this.deps=[];
        this.depsId=new Set();

        this.get(); //默认初始化，要取值

    }
    get(){// 稍后用户更新时，可以重新调用getter方法
        // defineProperty.get 每个属性都可以收集自己的watcher
        // 希望一个属性可以对应多个watcher,同时一个watcher可以对应多个属性
        pushTarget(this); //Dep.target=watcher
        this.getter(); // render()方法会去vm上取值
        popTarget(); //Dep.target=null 如果Dep.target有值，说明这个变量在模板中使用了
    }
    update(){
        this.get();
    }
    addDep(dep){
        let id=dep.id;
        if(!this.depsId.has(id)){
            this.depsId.add(id);
            this.deps.push(dep);
            dep.addSub(this);
        }
    }
}

export default Watcher;