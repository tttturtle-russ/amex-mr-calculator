#!/usr/bin/env node
/* 数据自检（零依赖）：从 index.html 抽出 DATA / REDEMPTIONS / I18N 三个纯字面量，
   校验它们彼此一致。比例数据靠手工维护，这层测试能在改错时立刻报错。
   跑法：node test.js  （CI 也跑这个） */
const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");

// 从源码里截取 `const NAME = { ... }` 的对象字面量（按花括号配平）
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
function evalLiteral(src, name) {
  // 纯数据/文案字面量（I18N 含箭头函数，但无外部调用），eval 安全
  return new Function("return (" + extractLiteral(src, name) + ")")();
}

const DATA = evalLiteral(html, "DATA");
const REDEMPTIONS = evalLiteral(html, "REDEMPTIONS");
const I18N = evalLiteral(html, "I18N");

const errs = [];
const ok = (cond, msg) => { if (!cond) errs.push(msg); };
const isBilingual = x => x && typeof x === "object" && typeof x.zh === "string" && typeof x.en === "string";

const CABINS = ["econ", "biz", "first", "hotel"];
const KINDS = ["remove", "deval", "suspend", "improve"];

// --- partners ---
for (const [pk, p] of Object.entries(DATA.partners)) {
  ok(isBilingual(p.name), `partner ${pk}: name 不是双语`);
  ok(p.type === "air" || p.type === "hotel", `partner ${pk}: type 非法 (${p.type})`);
}

// --- currencies / regions ---
for (const [rk, r] of Object.entries(DATA.regions)) {
  ok(isBilingual(r.name), `region ${rk}: name 不是双语`);
  ok(DATA.currencyOf[rk] && DATA.currencyOf[rk] in DATA.currencies,
    `region ${rk}: currencyOf 缺失或不在 currencies`);
  if (r.tiers) ok(Array.isArray(r.tiers.list) && r.tiers.default && r.tiers.list.includes(r.tiers.default),
    `region ${rk}: tiers 结构不完整`);
  if (r.cap) ok(DATA.partners[r.cap.partner], `region ${rk}: cap.partner 未知 (${r.cap.partner})`);
  for (const [pk, e] of Object.entries(r.transfers)) {
    ok(DATA.partners[pk], `region ${rk}: transfers 含未知 partner ${pk}`);
    const vals = (e == null || typeof e === "number") ? [e] : Object.values(e);
    for (const v of vals) ok(v == null || (typeof v === "number" && v > 0),
      `region ${rk}/${pk}: ratio 非法 (${v})`);
  }
}

// --- alerts ---
for (const [rk, arr] of Object.entries(DATA.alerts || {})) {
  ok(DATA.regions[rk], `alerts: 未知 region ${rk}`);
  arr.forEach((a, i) => {
    ok(KINDS.includes(a.kind), `alerts ${rk}[${i}]: kind 非法 (${a.kind})`);
    ok(isBilingual(a.note), `alerts ${rk}[${i}]: note 不是双语`);
    if (a.p) ok(DATA.partners[a.p], `alerts ${rk}[${i}]: 未知 partner ${a.p}`);
    if (a.date) ok(/^\d{4}-\d{2}-\d{2}$/.test(a.date) && !isNaN(Date.parse(a.date)),
      `alerts ${rk}[${i}]: date 非法 (${a.date})`);
  });
}

// --- redemptions ---
for (const [pk, list] of Object.entries(REDEMPTIONS)) {
  ok(DATA.partners[pk], `redemptions: 未知 partner ${pk}`);
  ok(Object.values(DATA.regions).some(r => r.transfers[pk] !== undefined),
    `redemptions ${pk}: 没有任何地区支持该计划`);
  ok(Array.isArray(list) && list.length > 0, `redemptions ${pk}: 空列表`);
  list.forEach((x, i) => {
    ok(isBilingual(x.r), `redemptions ${pk}[${i}]: r 不是双语`);
    ok(typeof x.m === "number" && x.m > 0, `redemptions ${pk}[${i}]: m 非法 (${x.m})`);
    ok(CABINS.includes(x.c), `redemptions ${pk}[${i}]: c 非法 (${x.c})`);
  });
}

// --- i18n 覆盖：每个用到的 cabin / kind 都要有对应文案键 ---
for (const c of CABINS) ok(I18N["cabin_" + c], `i18n: 缺 cabin_${c}`);
for (const k of KINDS) ok(I18N["kind_" + k], `i18n: 缺 kind_${k}`);
// 每条 I18N 至少要有 zh
for (const [k, v] of Object.entries(I18N)) ok(v && ("zh" in v), `i18n ${k}: 缺 zh`);

// --- 报告 ---
const counts = `${Object.keys(DATA.partners).length} 计划 / ${Object.keys(DATA.regions).length} 地区 / `
  + `${Object.keys(REDEMPTIONS).length} 计划有兑换示例 / ${Object.keys(DATA.alerts || {}).length} 区有预警`;
if (errs.length) {
  console.error("✗ 数据自检失败：\n  - " + errs.join("\n  - "));
  process.exit(1);
}
console.log("✓ 数据自检通过：" + counts);
