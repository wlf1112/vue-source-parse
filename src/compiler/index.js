const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*';  // 标签名
const qnameCapture = "((?:" + ncname + "\\:)?" + ncname + ")"; // <aa:xxx></aa:xxx>
const startTagOpen = new RegExp(("^<" + qnameCapture)); // 匹配开始标签
const startTagClose = /^\s*(\/?)>/; // 匹配标签关闭 </div>
const endTag = new RegExp(("^<\\/" + qnameCapture + "[^>]*>")); // 匹配闭合标签
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; 
const defaultTagRE = /\{((?:.|\r?\n)+?)\}\}/g; //{{}}

// html字符串解析成dom 对应的脚本触发 tokens

function start(tagName,attributes) {
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
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1],
                attrs:[]
            }
            advance(start[0].length);
            
            let end;
            // 如果没有遇到标签结尾就不停的解析
            let attr;
            while (!(end=html.match(startTagClose)) && (attr=html.match(attribute))) {
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
}

export function compilerFunction(template) {
        
    parserHTML(template);
}