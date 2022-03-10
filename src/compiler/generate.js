const defaultTagRE = /\{((?:.|\r?\n)+?)\}\}/g; //{{}}

// html字符串->_c('div', {id:'app'},'hello')

function genProps(attrs) { // [{name:'xxx',value:'xxxx'}]
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            let styleObj = {};
            attr.value.replace(/([^;:]+)\:([^;:]+)/g, function () {
                styleObj[arguments[1]] = arguments[2];
            })
            attr.value = styleObj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`;

    }
    return `{${str.slice(0, -1)}}`;
}

function gen(el) {
    if (el.type == 1) {
        return generate(el);
    } else {
        let text = el.text;
        if (!defaultTagRE.test(text)) {
            return `_v('${text}')`;
        } else {
            let tokens = [];
            let match;
            let lastIndex = defaultTagRE.lastIndex = 0;
            while (match = defaultTagRE.exec(text)) {
                let index = match.index;  // 开始索引
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text.slice(lastIndex, index)));
                }
                tokens.push(`_s(${match[1].trim()})`);
                lastIndex = index + match[0].length;
            }
            if (lastIndex < text.leneth) {
                tokens.push(JSON.stringify(text.slice(lastIndex)));
            }

            return `_v('${tokens.join('+')}')`;
        }
        
    }
}

function genChildren(el) {
    let children = el.children;
    if (children) {
        return children.map(c=>gen(c)).join(',');
    }
}

export function generate(el) {
    console.log('---------');

    // 遍历树，将树拼接成字符串
    let children = genChildren(el);
    let code = `_c('${el.tag}',${el.attrs.length ? genProps(el.attrs) : 'undefined'
        })${
        children?`,${children}`:''
        }`;

    console.log(code);
    return code;
}