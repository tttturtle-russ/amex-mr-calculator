#!/usr/bin/env node
/* 数据维护检查（零依赖）：按"今天"的日期，提醒哪些数据该动手了。
   - 转点比例本身无公开 API、无法可靠自动抓取（需用 AI 复核工作流人工确认）；
     这个脚本负责"时效跟踪"——把容易忘的日期变成主动提醒。
   检查项：
     1) lastVerified 距今多久（≥6 个月 → 该全面复核）
     2) alerts 里 kind:remove 的伙伴：已过期且仍在 transfers（过 30 天宽限期 → 该清理）/ 临近下线
     3) recheck 维护日历到期项
   退出码：有"该动手"的警告 → 1（CI 会变红提醒），否则 0。
   跑法：node maintain.js */
const { DATA } = require("./extract-data");

const now = new Date(); now.setHours(0, 0, 0, 0);
const pad = n => String(n).padStart(2, "0");
const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;  // 本地日期（不用 UTC，避免差一天）
const L = x => (x && typeof x === "object" && "zh" in x) ? x.zh : x;
const daysUntil = ymd => {
  const t = Date.parse(ymd + "T00:00:00");
  return isNaN(t) ? null : Math.round((t - now.getTime()) / 86400000);
};
const monthsSince = ym => {
  const m = /^(\d{4})-(\d{1,2})$/.exec(ym || ""); if (!m) return null;
  return (now.getFullYear() - +m[1]) * 12 + (now.getMonth() + 1 - +m[2]);
};

const warn = [], info = [];

// 1) lastVerified 时效
const age = monthsSince(DATA.lastVerified);
if (age == null) warn.push(`lastVerified 格式异常：${DATA.lastVerified}`);
else if (age >= 6) warn.push(`数据 lastVerified=${DATA.lastVerified}，已约 ${age} 个月，建议全面复核`);
else info.push(`lastVerified=${DATA.lastVerified}（约 ${age} 个月前）`);

// 2) 下线类预警：过期清理 / 临近提醒
for (const [rk, arr] of Object.entries(DATA.alerts || {})) {
  for (const a of arr) {
    if (a.kind !== "remove" || !a.date) continue;
    const d = daysUntil(a.date);
    const inTransfers = DATA.regions[rk] && DATA.regions[rk].transfers && (a.p in DATA.regions[rk].transfers);
    if (d == null) continue;
    if (d < 0) {
      if (inTransfers && d < -30) warn.push(`[${rk}] ${a.p} 已于 ${a.date} 下线 ${-d} 天，仍在 transfers —— 请从 DATA.regions.${rk}.transfers 移除`);
      else if (inTransfers) info.push(`[${rk}] ${a.p} 已于 ${a.date} 下线（${-d} 天，过渡期内 UI 显示「已下线」）`);
    } else if (d <= 30) {
      info.push(`[${rk}] ${a.p} 将于 ${a.date} 下线（${d} 天后）`);
    }
  }
}

// 3) recheck 维护日历
for (const r of DATA.recheck || []) {
  const d = daysUntil(r.date);
  if (d == null) { warn.push(`recheck 日期异常：${r.date}`); continue; }
  if (d <= 0) warn.push(`复核到期（${r.date}，${-d} 天前）：${L(r.what)}`);
  else if (d <= 60) info.push(`复核临近（${r.date}，${d} 天后）：${L(r.what)}`);
}

// 报告
console.log(`📅 数据维护检查 · 今天 ${todayStr}`);
if (info.length) { console.log("\nℹ️  提示："); for (const s of info) console.log("   · " + s); }
if (warn.length) {
  console.log("\n⚠️  需处理：");
  for (const s of warn) console.log("   · " + s);
  console.log(`\n共 ${warn.length} 项待处理。改完跑 node test.js 自检。`);
  process.exit(1);
}
console.log("\n✓ 暂无需要立刻处理的维护项。");
