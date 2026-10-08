# 📝 my UI：组件收藏库与项目原型

一个由本地文件维护的 UI 收藏库。收藏组件独立存放，统一页面负责查找和预览；项目原型使用组件副本。

## 📝 基底结构

```text
components/
  ids.json              # 已分配及注销编号，不复用
  C007/
    meta.json           # 编号、分类、标签、说明、来源、许可
    index.tsx           # 可复用实现
    styles.module.css   # 局部样式
    Preview.tsx         # 展示与交互示例
catalog/                # 元数据索引、搜索、筛选、收藏、详情
prototypes/
  项目名/
    meta.json           # 原型及组件来源记录
    App.tsx             # 原型组装入口
    components/         # 收藏组件的独立副本
scripts/                # 本地编号分配、组件复制、检查
tests/                  # 文件流程与浏览器验收
```

收藏库与原型共用 React、TypeScript、Vite 等基础依赖，但不互相引用组件实现。预览通过独立 iframe 加载；展示页的全局样式不载入组件预览页面。iframe 提供页面和样式隔离，不是运行恶意代码的安全沙箱，收集来的代码必须先审查后再接入。

## 📝 本地运行

```sh
npm ci
npm run dev
```

开发服务默认只监听 `127.0.0.1:5178`。

```sh
npm run build
npm run preview
```

`preview` 用于短时查看构建产物，停止后页面不可访问；本项目尚未配置常驻进程或重启恢复。改变文件后，开发模式自动刷新；构建预览需要重新构建。

## 📝 添加组件

```sh
npm run component:new -- "日期选择器" "表单"
```

命令会自动分配下一个编号并生成组件目录。随后填写 `index.tsx`、`Preview.tsx`、局部样式和 `meta.json`；无需手工修改展示页索引。

- 编号稳定；分类、名称与标签可修改。
- 标签是字符串数组，展示页多个标签按“同时包含”筛选；搜索多个空格分隔关键词时要求全部匹配。
- 修改或收藏不会改变编号。浏览器收藏只保存在当前设备的 localStorage，不跨设备同步。
- 删除组件时先将编号加入 `components/ids.json` 的 `retired`，保留 `allocated` 中的记录，再删除该目录。
- 检查拒绝组件目录外的相对导入；复杂动态导入、样式资源与非相对别名仍需代码审查，不把静态检查视为完整的依赖分析。
- 来源与许可必须如实填写；仓库未指定对外开源许可，示例不代表外部组件授权。

## 📝 创建项目原型

```sh
npm run prototype:new -- P002 C008
```

原型默认以 `P001`、`P002`……编号命名；命令也兼容小写字母、数字和连字符的旧项目名。命令将整个组件目录复制到 `prototypes/P002/components/`，记录来源编号，并生成初始 `App.tsx`。在该入口继续组装；复制后的组件修改可在原型元数据中记录 `modified: true` 与说明。

展示页自动发现原型入口。可以在“项目原型”中打开，也可使用同源地址 `/?preview=prototype&id=my-project`。原型目前共享基础运行环境，尚未生成独立部署工程；初始示例原型已按用户要求移除。

### 📝 P001 工作台原型

入口为 `/?preview=prototype&id=P001`，代码在 `prototypes/P001/App.tsx`。默认浅色，全窗口左右布局：左侧为紧凑的 C008 侧栏副本，右侧白色工作台不放置任何内容。

📝 侧栏依次展示带加号图标的“新建项目”、`Projects` 标题及三个预设项目（项目 01、项目 02、项目 03），搜索入口已移除。点击新建会在当前会话追加项目并选中；刷新后恢复三个预设项目。支持项目选中、收起展开和主题切换，右侧工作区继续留空。适配修改限于原型目录，收藏库中的 C008 保持原样。运行方式沿用本文本地与私有预览命令，不新增常驻服务。

### 📝 P002 财务仪表盘原型

入口为 `/?preview=prototype&id=P002`，独立代码在 `prototypes/P002/`，依据 HeroUI Finances 公开首页的 DOM、样式与六周期 SVG 状态复刻。提供资产概览、持仓、交易活动、周期切换、侧栏开关和本地演示操作；复刻范围及来源差异见 [P002 说明](prototypes/P002/README.md)。不连接钱包或执行真实交易。已安装 web-shader-extractor，但页面没有 Canvas / Shader 目标，未使用该技能进行普通 DOM 复制。

### 📝 P002 拆分组件索引

在收藏页搜索 `P002`，或筛选 `P002` / `HeroUI` 标签，可集中查看本批 15 个组件。每个目录有独立实现、CSS Modules、元数据、预览及所需本地资产；不导入其他收藏组件或原型实现。P002 保留原运行代码，提取编号单独记录，避免把来源关系误记为运行依赖。

| 编号 | 组件 | 用途 |
| --- | --- | --- |
| C010 | FinanceSidebar | 用户资料、财务导航和账户操作 |
| C011 | FinanceTopbar | 欢迎标题、导航开关与操作区 |
| C012 | MetricCard | 可配置余额、涨跌等指标卡 |
| C013 | TrendChip | 上升、下降和中性趋势标签 |
| C014 | TimeRangeSelector | 六周期选择与回调 |
| C015 | PortfolioChart | 余额、周期与原始 SVG 图表组合卡 |
| C016 | HoldingsList | 持仓列表及查看全部回调 |
| C017 | TransactionTable | 交易表格、排序与行选择 |
| C018 | FinanceActionDialog | 独立操作弹窗、表单和自定义内容 |
| C019 | AssetAvatar | 资产缩写头像 |
| C020 | ActionButton | 图标操作按钮及原生按钮属性 |
| C021 | FinanceLayout | 侧栏、顶部栏、内容插槽和收起状态 |
| C022 | HoldingRow | 单条资产余额和趋势展示 |
| C023 | TransactionTypeBadge | 交易类型图标与文字 |
| C024 | UserProfile | 用户头像、名称和邮箱 |

接口参数在各目录 `index.tsx` 的 TypeScript 类型中；复制整个目录即可组装原型。C015 延续原型的六个 SVG 快照，不包含实时图表数据或悬停提示；弹窗表单保持本地演示用途。外部设计与资产授权按 HeroUI 来源条款保留。

## 📝 当前组件

- `C007 · Upload dropzone`：Bencho 的上传拖拽动画，分类为“表单”，标签包括上传、拖拽、动画和模拟交互。
- 实现在 `components/C007/UploadDropzone.tsx`，支持命名导出与默认导出；`index.tsx` 提供统一入口。
- 原始注释与模拟上传行为保留；内置 `mood.png` 模拟上传，`demo.mp4` 超过 5 MB 时被拒绝，不读取桌面文件或发送文件。
- 使用 `framer-motion` 与 `lucide-react`；CSS Modules 隔离样式，设计变量限定在组件根节点，信号色与成功色沿用项目绿色强调色。
- 许可为 [Bencho MIT License](https://bencho.dev/licence)，版权及完整许可保存在 `components/C007/LICENSE`；复制组件时保留该文件。
- `C001–C006` 已注销，不再展示、不复用；历史实现可在 Git 历史中查看。
- 📝 `C008 · Dashboard Sidebar Navigation`：来自用户指定的 Figma 节点 `429:783`，提供深浅主题、展开收起、五项导航、菜单搜索及退出回调。节点图标、头像均保存在组件自身 `assets/` 中，Open Sans 通过基础依赖在本地加载。
- 📝 `C008` 导出 `SidebarNavigation`。支持 `theme` / `defaultTheme`、`collapsed` / `defaultCollapsed`、`activeId` / `defaultActiveId`，以及 `items`、`profile`、`height` 和 `onThemeChange`、`onCollapsedChange`、`onNavigate`、`onSearch`、`onLogout`。导航和退出的业务行为由消费项目通过回调实现；原设计与资产许可按来源条款处理，不沿用 `C007` 的 MIT 声明。
- 📝 `C009 · Modern Navbar`：来自 Figma 节点 `1:14`，提供 Home、Work、Awards、Team、Prices 胶囊导航及 Contact 按钮，默认选中 Awards。通过 `items`、`activeId` / `defaultActiveId`、`onNavigate`、`contactLabel`、`onContact` 配置内容和业务回调；使用 CSS Modules 和本地 Inter 500 字体。深色展示背景仅位于 `Preview.tsx`，不会强制消费项目背景。

## 📝 验证

```sh
npm run build
npm test
# 先启动 preview；首次使用安装测试浏览器
npx playwright install chromium
npm run test:browser
```

验证包含编号扩展、不复用、组件相对导入边界、原型副本独立性、重复创建拒绝、搜索、分类与标签组合、收藏持久化、预览交互、键盘关闭详情及移动布局。

### 📝 默认仅做代码验收

按用户 2026-10-08 的明确要求，默认不做图片、截图或视觉检查。`npm run build` 检查类型、登记和构建，`npm test` 检查文件流程、搜索逻辑及资产非空；`npm run test:browser` 默认只执行不生成截图的 DOM / 事件逻辑测试。

历史截图测试仍保留，只有用户明确要求视觉验收时才使用 `UI_VISUAL_CHECK=1 npm run test:browser`；不默认运行，不读取截图检查。

## 📝 Mac mini 私有预览

本机部署地址不写进业务代码。外部主机名通过 `UI_ALLOWED_HOST` 注入，Vite 仅允许明确的主机名，保持宿主监听回环地址。私有入口使用已有 Tailscale Serve；按目标端口添加或关闭，不重置其他项目入口。参见 [Vite 主机限制](https://vite.dev/config/server-options#server-allowedhosts) 与 [Tailscale Serve](https://tailscale.com/docs/reference/tailscale-cli/serve)。

本次分配本地端口 `5178` 与独立私有 HTTPS 端口 `9446`。实际 URL、运行与验证状态记录在仓库外 `/Users/feiyuzi/.config/macmini-services/my-ui.json`。

启动短时私有预览：

```sh
npm run build
UI_ALLOWED_HOST="$(tailscale status --json | node -e 'let data="";process.stdin.on("data",value=>data+=value);process.stdin.on("end",()=>process.stdout.write(JSON.parse(data).Self.DNSName.replace(/\.$/,"")))')" npm run preview
# 在另一终端添加本项目入口
tailscale serve --bg --https=9446 http://127.0.0.1:5178
```

停止时在预览终端按 `Ctrl+C`，并仅关闭本项目入口：

```sh
tailscale serve --https=9446 off
```

重启采用同样的启动步骤；日志在前台终端，失败时修复构建或端口冲突后重启。没有配置登录恢复、开机启动或休眠唤醒保证。`serve --bg` 仅保存代理，不保活应用。

当前网页只提供展示和浏览器本地收藏，没有执行命令、读写宿主文件、操作 Agent 或在线修改组件的 API。访问授权依赖当前 tailnet 规则，不能视为仅本人；加入敏感管理能力前须先实现应用认证和授权。

第二设备验收：在已授权设备启用 Tailscale，打开登记中的 HTTPS URL；确认分类搜索、详情交互、收藏和示例原型，并检查浏览器没有证书或资源加载错误。

## 📝 建设记录

- 2026-10-08：搭建文件驱动的收藏库基底、六个独立原创示例、自动编号与原型复制命令、统一浏览页面及工作室概览原型；私有服务和浏览器验收结果以本机登记为准。
- 📝 2026-10-08 验收：构建、四项文件流程测试与四项浏览器测试通过；私有 HTTPS 下重复的浏览器检查通过且未忽略证书错误。本机默认 DNS 无法解析自身 Tailscale 域名，HTTPS 验证使用显式 DNS 映射；未进行第二设备验收。现有 Serve 入口未变，未启用 Funnel。
- 📝 2026-10-08 组件替换：按用户要求删除六个初始组件与示例原型，注销原编号，接入用户提供的 Bencho Upload dropzone，编号为 `C007`；保留原注释并补齐许可，新增组件交互验收。
- 📝 2026-10-08 Figma 接入：新增 `C008` Sidebar Navigation，保留 `C007`；节点上下文排除截图，原始资产本地化，使用局部 CSS Modules 和回调实现交互。构建、六项逻辑测试和两项无截图 DOM 测试通过；私有 HTTPS 入口本机响应 200，第二设备尚未验收。
- 📝 2026-10-08 原型创建：新增编号原型 P001，以 C008 副本实现默认浅色的左右工作台，右侧留空；构建、七项逻辑测试及五项无截图 DOM 测试通过，私有 HTTPS 本机响应 200，第二设备尚未验收。
- 📝 2026-10-08 组件新增：接入 C009 Modern Navbar，保留现有组件及 P001；读取 Figma 结构与样式时排除截图，按代码和事件逻辑验收。
- 📝 2026-10-08 P001 调整：移除侧栏搜索，添加带小图标的新建项目操作、Projects 标题与三个预设项目；新建可追加会话内项目，右侧工作区保持空白。
- 📝 2026-10-08 P002 创建：安装 web-shader-extractor 并核查适用范围，新增 HeroUI Finances 仪表盘首页原型；使用本地来源资产，不请求或读取截图，按代码和事件逻辑验收。
- 📝 2026-10-08 P002 拆分：新增 C010–C024 共十五个独立收藏组件；原型运行代码保持原样。构建、组件导入边界、独立预览、主要回调与原型回归按代码和无截图事件测试验收。
