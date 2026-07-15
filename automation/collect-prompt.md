# 任务：收集 Amex MR 转点最新信息并更新仓库

你是运行在 `amex-mr-calculate` 仓库里的自动维护代理。今天需要联网核对 Amex Membership Rewards（MR）跨区转点相关信息，并把有效变动写入仓库。请严格按下列步骤执行，全程非交互。

## 背景
- 本仓库是一个「Amex MR 跨区里程计算器」纯静态单页应用，核心数据全部写死在 `index.html` 里的三个字面量：`DATA`（各发卡地区 `regions[].transfers` 转点比例、`alerts` 预警、`recheck` 维护日历、`lastVerified` 时间戳）、`REDEMPTIONS`（兑换档位示例）、`I18N`（中英文案）。
- `extract-data.js` 会从 `index.html` 抽出上述字面量；`node test.js` 做一致性自检；`node maintain.js` 按今天日期给出到期提醒。
- 覆盖 9 个发卡地区（HK/US/UK/SG/AU/CA/JP/IN/TW）和约 28 个航空/酒店伙伴（Asia Miles、KrisFlyer、Avios、Aeroplan、ANA、Flying Blue、Marriott、Hilton 等）。JP/IN/TW 仅作发卡地与 GT 源，不作转入目的地。

## 步骤

### 1. 先摸清现状
- 运行 `node maintain.js` 查看当前到期/临近项，记录输出。
- 读 `index.html` 中的 `DATA` 字面量，弄清现有各区转点比例、alerts、recheck、lastVerified。

### 2. 联网核对（这是核心）
针对以下内容做联网搜索与交叉验证，**优先官方 Amex 各区页面，其次权威里程博客**（pointhacks、headforpoints、milelion、frequentmiler、以及各区官方转点页）：
- **转点比例变动**：各发卡地区 MR → 航司/酒店的转点比例是否有调整。
- **伙伴上下线**：是否有新增转点伙伴，或有伙伴即将/已经下线（如国泰、阿提哈德一类历史先例）。
- **转点奖励活动**：是否有限时 transfer bonus。
- **贬值预警**：航司里程贬值、award chart 调整等对兑换档位的影响。
每条结论都要能追溯到**具体来源 URL**；拿不准或只有单一非官方来源的，标为「待人工确认」，不要写死进数据。

### 3. 更新仓库
- 对**已确认**的变动，谨慎编辑 `index.html` 里对应的 `DATA.regions[].transfers` / `DATA.alerts` / `DATA.recheck` 字面量；如做了全面复核，把 `lastVerified` 更新为当前年月（格式 `YYYY-MM`）。
- 不要改动数据结构与代码逻辑，只改数据值。保持中英双语字段完整。
- 改完必须运行 `node test.js` 自检；若失败，修正到通过为止；再跑 `node maintain.js` 复看。

### 4. 产出报告
在仓库 `automation/reports/` 下新建 `YYYY-MM-DD.md`（用今天日期），包含：
- 本次核对覆盖的地区/伙伴清单；
- 发现的变动（每条附来源 URL 与生效日期）；
- 实际写入 `index.html` 的改动摘要；
- 「待人工确认」清单。

### 5. 提交并推送
- 若有任何文件改动：`git add -A` 后提交，提交信息格式：`chore(auto): weekly MR data sync YYYY-MM-DD`，然后 `git push origin main`。
- 若无实质变动（仅生成报告或完全无变化）：仍提交报告文件，提交信息 `docs(auto): weekly MR check report YYYY-MM-DD`，并推送。
- 推送失败（如鉴权问题）时，把错误记进报告末尾，不要反复重试超过 2 次。

## 约束
- 全程非交互，不要向用户提问。
- 拿不准的比例数据**宁可不写**，只列进「待人工确认」——错误数据比缺失数据更糟。
- 只动数据与报告文件，绝不改 `test.js` / `maintain.js` / `extract-data.js` 的逻辑。
