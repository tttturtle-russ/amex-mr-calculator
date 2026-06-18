[![Amex MR 跨区里程计算器](og-image.png)](https://tttturtle-russ.github.io/amex-mr-calculator/)

# Amex MR 跨区里程计算器 · Cross-Region Miles Calculator

[![Live Demo](https://img.shields.io/badge/▶_在线使用-live_demo-7fcabb?style=flat-square)](https://tttturtle-russ.github.io/amex-mr-calculator/)
[![License: MIT](https://img.shields.io/github/license/tttturtle-russ/amex-mr-calculator?style=flat-square&color=888fa1)](LICENSE)
![Vanilla JS](https://img.shields.io/badge/vanilla-JS-f4b89c?style=flat-square)
![Dependencies](https://img.shields.io/badge/dependencies-0-7fcabb?style=flat-square)
![Bilingual](https://img.shields.io/badge/中文-%2FEnglish-7fcabb?style=flat-square)

> 算一笔 Amex Membership Rewards 积分在不同国家/地区的 MR 项目里能换多少里程，以及通过 **Global Transfer (GT，把分搬到另一个地区的账户)** 搬过去之后还剩多少分、能换多少。
>
> See how far your Amex Membership Rewards points go across regions — before vs. after a cross-region **Global Card Transfer**.

**在线版 / Live:** https://tttturtle-russ.github.io/amex-mr-calculator/

---

## 它能做什么

选好发卡地区、积分数量，再挑一个里程或酒店计划，就能看到：

- 这笔分在本区直接兑换能换多少（**GT 前**），以及搬到其他每个地区后各能换多少（**GT 后**）；
- 完整链路：原始 MR → GT 保留比例 → 搬过去剩多少 MR → 最终能兑多少里程/积分；
- 一张总览表列出所有计划，本区对比**里程最多的地区**、按提升排序，能按航空/酒店筛选、点列头排序；
- 跨区折算用**实时汇率**（来自 open.er-api.com，拿不到就用内置值，也可以手动改）；
- 汇率、GT 保留比例、转点奖励 % 都可手动覆盖；任何方案都能生成**分享链接**；
- **中英双语**一键切换，免费、无需登录、无广告、无追踪，纯静态单页，手机可用。

覆盖 **9 个地区**（香港、美国、英国、新加坡、澳洲、加拿大、日本、印度、台湾）和约 **27 个航空/酒店伙伴**，比例数据核对到 2026 年 6 月。

> [!IMPORTANT]
> **跨区数字是汇率估算，不是 Amex 官方公式。** Amex 从未公布跨区换算规则；本工具按两地货币实时汇率近似，并明确标注。Global Card Transfer 是「移居 / 搬家」功能——电话办理、约一年一次、按汇率折算、并非 1:1，更不是免费套利。工具刻意**不替你判断「哪个最划算」、也不做金钱估值**，只客观列出所有路线，由你自己决定。最终请以 American Express 为准。

## What it does (English)

Pick your card's **issuing region** (HK / US / UK / SG / AU / CA / JP / IN / TW), enter an MR amount, and the tool lists — for ~27 airline & hotel transfer partners (Asia Miles, KrisFlyer, Avios, Aeroplan, ANA, Flying Blue, Marriott, Hilton, …) — how many miles/points you'd get in **each region**, comparing **redeeming at home (pre-GT)** vs. **after a cross-region Global Card Transfer (post-GT)**.

Honest by design: the cross-region figures are **FX-based estimates, clearly labeled** (Amex publishes no official formula); it gives **no monetary valuation** and **never picks a "best" option for you** — it enumerates every route so you decide. FX rate, per-route retain ratio, and a transfer-bonus % are all editable.

## 技术 / Tech

单文件 `index.html`，纯 vanilla HTML/CSS/JS，**零依赖、零构建**，字体本地化（无 CDN），托管于 GitHub Pages。Single static file, no framework, no backend, no tracking.

## License

MIT
