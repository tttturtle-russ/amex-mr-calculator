# Amex MR 跨区里程计算器

输入 Amex Membership Rewards (MR) 的发卡地区与积分数量，客观计算这笔分在各个地区能兑换的**里程数量**，并对比 **Global Transfer (GT) 前后**的差异——同样的分，搬到不同地区后还剩多少 MR、能换多少里程。

🔗 **在线使用：** https://tttturtle-russ.github.io/amex-mr-calculator/

## 功能

- **GT 前后对比**：本区直兑（GT 前）vs 跨区搬分后兑换（GT 后），展示完整链路：原始 MR → GT 保留% → GT 后 MR → 可兑里程。
- **全部计划总览**：所有里程/酒店计划一览，本区 vs 最佳区、提升幅度排序，点击切换。
- **实时汇率**：跨区折算按两地货币实时汇率（[open.er-api.com](https://open.er-api.com)），联网失败回退内置值，可手动覆盖。
- **换算假设可切换**：保守（上限 1:1）/ 纯实时汇率（理论值），跨区结果一律标注「估算」。
- 覆盖 9 个地区（HK / US / UK / SG / AU / CA / JP / IN / TW）、~27 个航空/酒店伙伴，数据核对于 2026-06。

## 重要说明

- **只算里程，不折算金额**：里程不能直接套现，不同计划的里程也不可直接比较，故对比始终在同一计划内进行。
- **跨区换算为估算**：Amex 未公开官方跨区换算公式，本工具按汇率近似，最终请致电 Amex 确认；本区直兑为真实结果。
- 手续费（如 HK$400/次）为现金费、不抵扣里程，仅以标签提示。
- 转换比例、汇率与跨区规则随时变动，使用前请向 American Express 核实。**仅供参考，非财务建议。**

## 技术

单文件静态页（`index.html`，原生 HTML/CSS/JS，无构建、无依赖）。本地双击即可打开（`file://` 下浏览器可能拦截实时汇率请求，属正常）。

### 本地修改与更新线上

```bash
# 改完 index.html 后
git add -A && git commit -m "你的说明" && git push
# 推送后约 1 分钟，GitHub Pages 自动更新
```

分享预览图 `og-image.png` 由 `og-image.svg` 生成（macOS）：

```bash
qlmanage -t -s 1200 -o . og-image.svg && mv -f og-image.svg.png og-image.png
sips -c 630 1200 og-image.png   # 居中裁切到 1200×630
```

## License

MIT
