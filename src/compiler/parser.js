const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*';  // 标签名
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; // <aa:xxx></aa:xxx>
const startTagOpen = new RegExp(("^<" + qnameCapture)); // 匹配开始标签
const startTagClose = /^\s*(\/?)>/; // 匹配标签关闭 </div>
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>")); // 匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

// ast（语法层面）

// 解析后的结果 组装成一个数结构  需要用到：栈
function createAstElement(tagName, attrs) {
    return {
        tag: tagName,
        type: 1,
        children: [],
        parent: null,
        attrs
    }
}

// html字符串解析成 对应的脚本触发 tokens  <div id="app">{{name}}</div>
let root = null;
let stack = [];
function start(tagName, attributes) {
    console.log('start', tagName, attributes);
    let parent = stack[stack.length - 1];
    let element = createAstElement(tagName, attributes);
    if (!root) {
        root = element;
    }

    if (parent) {
        element.parent = parent;  // 当放入栈中时，记录父亲是谁
        parent.children.push(element);
    }
    stack.push(element);
}
function end(tagName) {
    console.log('end', tagName);
    let last = stack.pop();
    if (last.tag !== tagName) {
        throw new Error('标签有误');
    }
}
function chars(text) {
    console.log('chars', text);
    text = text.replace(/\s/g, "");
    let parent = stack[stack.length - 1];
    if (text) {
        parent.children.push({
            type: 3,
            text
        })
    }
}

export function parserHTML(html) {
    function advance(len) {
        html = html.substring(len);
    }
    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length);

            let end;
            // 如果没有遇到标签结尾就不停的解析
            let attr;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] });
                advance(attr[0].length);
            }
            if (end) {
                advance(end[0].length);
            }
            return match;
        }
        return false; // 不是开始标签
    }

    while (html) { // 看要解析的内容是都存在，如果存在就不停的解析
        let textEnd = html.indexOf('<'); // 当前解析的开头
        if (textEnd == 0) {
            const startTagMatch = parseStartTag(html); // 解析开始标签
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs);
                continue;
            }
            const endTagMatch = html.match(endTag); // 解析结束标签
            if (endTagMatch) {
                end(endTagMatch[1]);
                advance(endTagMatch[0].length);
            }
        }
        let text;
        if (textEnd > 0) {
            text = html.substring(0, textEnd);
        }
        if (text) {
            chars(text);
            advance(text.length);
        }

    }
    return root;
}

// 看一下用户是否传入了render,没传入，可能传入的是tenplate，template如果也没有传入
// 将我们的html->词法解析（开始标签，结束标签，属性，文本）
