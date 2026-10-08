# 📝 P002 · HeroUI Finances 仪表盘原型

来源：[HeroUI Finances Template](https://template-4.heroui.pro/)。本原型复刻该地址的仪表盘首页，通过统一展示服务的 `/?preview=prototype&id=P002` 打开；保留 P001。

## 📝 实现与来源

- `assets/dashboard.html` 保存公开页面的已渲染 DOM，不含远程脚本或账户数据。
- `assets/source.css` 保存原页面样式，使用原站系统 UI 字体；图标使用原页面 SVG。
- 六个周期 SVG 与 `ranges.json` 来自实际页面的 1D、1W、1M、3M、1Y、All 状态，不使用截图作为界面。
- `App.tsx` 提供本地交互适配，`prototype.css` 只处理适配与本地演示对话框。
- 访问原页面的过程只读取公开内容，不采集 Cookie、授权头或私人账户资料。样式与模板的授权仍遵循来源条款；技能仓库的 MIT 许可不授予 HeroUI Pro 模板权益。

## 📝 技能适用性

已按用户要求安装 [web-shader-extractor](https://github.com/lixiaolin94/skills/tree/main/web-shader-extractor)。源码和实际 DOM 核查确认本页无 Canvas，图表采用 SVG/Recharts，属于该技能明确排除的普通 DOM/CSS 页面；未宣称完成 Shader 提取或回放。

本次通过 Product Design URL-to-code 的来源采集方式处理页面，再按本项目已有 React/Vite 原型机制接入。结构、样式与交互证据见 `source-evidence.json`。

## 📝 交互与范围

- 六周期图表及增长率切换、桌面侧栏收起、手机侧栏入口和日期顺序切换。
- Portfolio 与 Transactions 定位到对应首页区域；其他导航项提供本地反馈，没有复制原站的其他路由页面。
- Swap、Receive、Send、通知、设置和持仓入口使用本地演示对话框。没有账户或钱包连接，不发送真实交易。
- 原站 Swap、See all holdings 的测试点击没有产生状态变化；本地对话框属于原型补充交互。
- 图表是采集到的 SVG 状态，尚未重建原站悬停提示、连续动画与实时数据；持仓对话框只展示首页可见的五项持仓，未猜测另外三项。

## 📝 验收方式

按用户偏好不生成、读取或比较截图。执行构建、类型检查和 DOM / 事件测试；没有视觉一致性验收结果。原型使用主仓库短时预览服务，Mac mini 私有入口及第二设备验收状态在仓库外服务登记中维护。

## 📝 组件提取记录

2026-10-08：按用户要求拆分出 C010–C024，共十五个可独立收藏和复制的组件，覆盖页面布局、侧栏、顶部栏、指标卡、趋势标签、周期选择、图表、持仓、交易表格、操作弹窗、头像、按钮、列表行、类型标识及用户资料。

收藏组件不引用 P002，也不互相引用。原型保留原运行代码，`meta.json` 的 `extractedComponents` 仅表示来源提取关系。完整编号表见主仓库 README；在收藏页搜索 `P002` 可查看全部。
