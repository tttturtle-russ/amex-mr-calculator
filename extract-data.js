/* 零依赖：从 index.html 抽出 DATA / REDEMPTIONS / I18N 三个纯字面量，供 test.js / maintain.js 共用。
   这些是纯数据/文案字面量（I18N 含箭头函数，但无外部调用），用 Function 求值安全。 */
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

// 按花括号配平截取 `const NAME = { ... }` 的对象字面量
function extractLiteral(src, name) {
  const start = src.indexOf("const " + name + " =");
  if (start < 0) throw new Error("找不到 " + name);
  const open = src.indexOf("{", start);
  let depth = 0, inStr = null, esc = false;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (esc) { esc = false; }
      else if (ch === "\\") esc = true;
      else if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") { inStr = ch; continue; }
    if (ch === "{") depth++;
    else if (ch === "}") { depth--; if (depth === 0) return src.slice(open, i + 1); }
  }
  throw new Error(name + " 花括号未配平");
}
const evalLiteral = name => new Function("return (" + extractLiteral(html, name) + ")")();

module.exports = {
  html,
  extractLiteral,
  DATA: evalLiteral("DATA"),
  REDEMPTIONS: evalLiteral("REDEMPTIONS"),
  I18N: evalLiteral("I18N"),
};
