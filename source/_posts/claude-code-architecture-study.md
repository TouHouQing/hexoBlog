---
title: Claude Code 架构学习：从启动入口、查询引擎到工具链与远程桥接
date: 2026-03-31 22:30:00
categories:
  - [AI]
tags:
  - Claude Code
  - AI Coding
  - 架构设计
  - Agent
  - CLI
description: 基于 Claude Code v2.1.88 技术文档与公开研究快照，系统梳理 Claude Code 的启动流程、工具系统、命令系统、查询引擎、状态管理、权限安全、Bridge 通信、UI 与插件技能架构。
postDesc: 从 CLI 入口到 QueryEngine，再到权限、Bridge、UI 和技能体系，一次看懂 Claude Code 为什么不是“带几个工具的聊天壳”。
---
原封不动的源码仓库：https://github.com/TouHouQing/claude-code

**Claude Code 到底是怎么被设计出来的？**

如果只把它当成“终端里的大模型”，会很容易低估它。  
Claude Code 是一个 **面向软件工程任务的 Agent Runtime**：

- 它有多入口启动链，而不是单一 `main()`。
- 它有明确的工具协议，而不是把命令执行硬编码在提示词里。
- 它有独立的查询引擎，负责流式消息、预算、重试、成本和工具循环。
- 它有一整套权限、安全、远程 Bridge、状态管理和扩展系统。

也就是说，**模型只是中间的一层**。真正让 Claude Code 可用、可控、可扩展的，是外围这套工程化基础设施。

## 先说结论

如果要用一句话概括 Claude Code 的架构，我的判断是：

**它把“AI 编程助手”拆成了一个分层运行时：入口层负责拉起环境，QueryEngine 负责驱动模型循环，工具和命令作为能力平面，状态管理与权限系统提供控制边界，Bridge/MCP/插件/技能再把它扩展成一个可分布、可治理的平台。**

从这个视角看，Claude Code 不是一个“会调用 Bash 的聊天框”，而是一个小型操作系统式的 Agent CLI。

```text
CLI Entrypoints
  -> init / config / shutdown / remote settings
  -> REPL / MCP Server / Bridge / Agent SDK
  -> App + Providers + StatusLine + Message List
  -> QueryEngine
  -> Tools + Commands + Services
  -> State + Permission Context
  -> Bridge / Plugins / Skills / Tasks / MCP
```

## 一、架构与设计：Claude Code 的核心设计思想

在我看来，Claude Code 的设计不是“功能越多越好”，而是围绕三个工程问题展开的：

1. **如何把大模型接成一个可持续运行的循环**
2. **如何把高风险能力收进权限与策略边界**
3. **如何在不破坏主循环的情况下，持续扩展工具、技能、插件和远程端点**

所以它做了几件很关键的事。

### 1. 编译时裁剪，而不是运行时堆分支

很多功能在构建期就可以被完全裁掉。比如 `BRIDGE`、`VOICE_MODE`、`MONITOR_TOOL`、`WORKFLOWS` 这类能力，未启用时连代码都不会进入最终产物。

这背后的收益很直接：

- 启动更快
- 包体更小
- 风险面更小
- 终端场景下的复杂功能不会无条件拖慢冷启动

这也是一个很典型的“工程化 Agent”思路：**先控制二进制复杂度，再扩展功能复杂度。**

### 2. 运行时 Feature Gate 与远程配置并存

仅有编译时 Feature Flag 还不够，Claude Code 还叠加了 GrowthBook 这类运行时开关。  
也就是说，系统既可以在构建期裁剪整块能力，也可以在运行期通过远程设置控制某些特性是否真的向用户开放。

这是一种双层门禁：

- 第一层是“代码是否存在”
- 第二层是“功能是否开放”

对于企业场景、实验功能、灰度发布和远程配置来说，这种做法非常合理。

### 3. 把消息流做成 `AsyncGenerator`

这一点我觉得是 Claude Code 架构里非常关键、也非常漂亮的一部分。

它不是一次性等模型返回完整结果，而是把整个查询过程设计成 `AsyncGenerator`：

- `submitMessage()` 产出 `SDKMessage`
- `query()` 产出 `StreamEvent`
- 工具执行过程中还能持续产出进度消息

这样做的结果是：

- UI 能流式更新
- 工具进度能实时展示
- 中断、预算检查、重试、权限拒绝都可以插入中途
- Bridge 和远程端可以复用同一套消息协议

换句话说，Claude Code 的主循环天然就是“事件流架构”，而不是同步 RPC。

### 4. 用不可变状态保证主流程稳定，用可变容器承接高频任务

 `AppState` 大量使用 `DeepImmutable<T>`，但同时保留 `tasks`、`agentNameRegistry` 这类可变容器。

这说明它不是为了“函数式而函数式”，而是很务实地分了两类状态：

- **业务主状态**：尽量不可变，便于推导、订阅、调试
- **高频任务容器**：允许可变，减少频繁拷贝的代价

这种混合策略，比一刀切地追求绝对不可变更适合 CLI Agent。

## 二、架构概览：它到底分成了哪几层


| 层次 | 代表路径 | 主要职责 |
| --- | --- | --- |
| 入口层 | `src/entrypoints/*`, `src/main.tsx` | 启动路由、模式选择、初始化链 |
| 屏幕层 | `src/screens/*` | REPL、Doctor、Resume 等交互界面 |
| 组件层 | `src/components/*` | App、StatusLine、消息列表、工具渲染 |
| 引擎层 | `src/QueryEngine.ts`, `src/query/*` | 对话主循环、流式消息、预算、重试、成本 |
| 工具层 | `src/Tool.ts`, `src/tools.ts`, `src/tools/*` | 文件、Shell、搜索、Web、Agent、Skill、MCP |
| 命令层 | `src/commands.ts`, `src/commands/*` | 斜杠命令注册与加载 |
| 服务层 | `src/services/*` | API、MCP、OAuth、LSP、Feature Flags、策略与记忆 |
| 状态层 | `src/state/*` | Store、AppState、selectors、副作用监听 |
| 基础设施层 | `src/bridge/*`, `src/plugins/*`, `src/skills/*`, `src/tasks/*` | 远程通信、扩展、技能、任务与协作 |

如果再压缩一下，这套系统其实可以读成一句话：

**Entrypoint 拉起 Runtime，Runtime 驱动 QueryEngine，QueryEngine 调用 Tool/Command/Service，State 和 Permission 负责约束，Bridge/Plugin/Skill 负责把系统延展出去。**

## 三、启动流程与入口：为什么 Claude Code 有多个入口

### 1. 入口不是一个，而是一组

Claude Code 至少有几个关键入口：

- `src/entrypoints/cli.tsx`：主 CLI 入口，覆盖交互式 REPL、非交互式和管道模式
- `src/entrypoints/init.ts`：共享初始化链
- `src/entrypoints/mcp.ts`：作为 MCP Server 运行时的入口
- `src/entrypoints/agentSdkTypes.ts`：面向 Agent SDK 集成的类型和会话管理

这说明 Claude Code 从一开始就不是“只给人用的终端程序”，而是面向多运行模式设计的：

- 给人直接在终端里用
- 给别的系统当 MCP Server 用
- 给远程 Bridge / Session 用
- 给 SDK 嵌入式场景用

### 2. CLI 入口先走“快速路径”

`--version` 检查发生在所有重模块加载之前。

也就是说，像版本号这类请求不需要把 REPL、QueryEngine、UI 都拉起来，直接返回即可。  
这种“先走无依赖快路径”的思路，在大型 CLI 里非常重要。

### 3. 再按 Feature Gate 进入不同模式

`cli.tsx` 不是线性启动，而是先判断 Feature Flag，再路由到不同工作模式：

- `DAEMON_WORKER`
- `BRIDGE`
- `TMUX`
- 默认 REPL 路径

这套路由让我觉得很像一个微型调度器：**入口层并不关心后面业务细节，它只决定把当前进程送到哪条运行轨道。**

### 4. `init()` 是真正的公共启动链

1. 配置验证
2. 安全环境变量设置
3. 优雅关闭注册
4. 远程设置获取
5. mTLS 配置
6. 代理配置
7. LSP 遗留进程清理

这个顺序很有意思，因为它体现出 Claude Code 对“可信运行环境”的优先级：

- 先确保配置和环境安全
- 再建立远程设置和企业网络能力
- 最后清理旧状态，保证本次运行的边界干净

另外，遥测初始化还是 **after trust** 的，也就是用户信任确认后才启用第三方遥测。这一点很加分。

### 5. 启动之后还保留 Bootstrap 全局状态

`bootstrap/state.ts` 暴露了全局 getter/setter，例如：

- `getSessionId()`
- `getProjectRoot()`
- `getConfigDir()`
- `getCwd()`
- `getIsRemoteSession()`
- `getIsBridgeSession()`
- `getEntrypoint()`

这说明 Claude Code 虽然是模块化设计，但它承认有些“进程级真相”必须集中保存。  
对 CLI 来说，这是一种很实用的折中。

## 四、工具系统：Claude Code 的真正能力平面

如果 QueryEngine 是大脑，那么 Tool System 更像是 Claude Code 的“手脚和传感器”。

### 1. 工具不是函数，而是一套完整协议

`Tool<Input, Output, P>` 不是简单的 `call()` 接口，而是一整套工具合约，包含：

- 输入 Schema / JSON Schema
- 输出 Schema
- `isReadOnly` / `isDestructive` / `isConcurrencySafe`
- `checkPermissions()`
- `validateInput()`
- `description()` / `prompt()`
- `renderToolUseMessage()` / `renderToolResultMessage()`

这说明 Claude Code 里的工具，既是执行单元，也是：

- 权限对象
- UI 对象
- 提示词对象
- 类型对象

这比“注册一个函数给模型调用”成熟得多。

### 2. `buildTool()` 负责把样板逻辑统一收口

 `buildTool()` 会给所有工具打上默认行为，比如：

- 默认启用
- 默认非并发安全
- 默认非只读
- 默认非破坏性
- 默认权限行为

这能避免每个工具都重复写大量样板代码，也让工具作者只需要关注差异化实现。

这是一个很标准但很重要的框架化设计：  
**工具不是“写出来就能用”，而是“先进入统一工厂，再接入统一运行时”。**

### 3. ToolUseContext 把工具和整个系统绑在一起

工具调用上下文里不仅有文件缓存和 `AbortController`，还有：

- `getAppState()` / `setAppState()`
- `setToolJSX`
- `appendSystemMessage()`
- `addNotification()`
- `sendOSNotification()`

也就是说，工具不是一个纯后端动作。它可以：

- 改状态
- 改上下文
- 改 UI
- 发系统消息
- 触发通知

这就是为什么 Claude Code 的工具系统不是传统 CLI 里的“子命令集合”，而是 **Runtime 内的能力节点**。

### 4. 工具池是动态组装出来的

比较完整的工具装配链：

1. 先拿到基础内置工具
2. 根据 Feature Flag 决定是否加载条件工具
3. 根据 deny 规则过滤
4. 经过 `isEnabled()` 再过滤
5. 做 REPL 专属隐藏
6. 再与 MCP 工具合并
7. 按名称排序并 `uniqBy(name)` 去重

这里有两个很值得注意的点：

- **内置工具优先于同名 MCP 工具**
- **排序是为了 prompt cache 稳定**

第二点非常关键。很多 Agent 系统做不好缓存，是因为工具列表顺序不稳定，导致系统提示词哈希变化。Claude Code 显然考虑到了这一层。

### 5. 工具结果不只是“返回值”

`ToolResult<T>` 除了 `data`，还可以带：

- `newMessages`
- `contextModifier`
- `mcpMeta.structuredContent`

这意味着工具执行完以后，不只是把结果吐给模型，还可以直接：

- 注入新消息
- 修改后续上下文
- 携带结构化元数据

从架构上说，这等于允许工具影响“后续推理地形”。

### 6. 工具种类基本覆盖了一个 Agent CLI 的主要操作面

核心工具包括但不限于：

- `BashTool`
- `FileReadTool`
- `FileEditTool`
- `FileWriteTool`
- `GlobTool`
- `GrepTool`
- `WebFetchTool`
- `WebSearchTool`
- `AgentTool`
- `SkillTool`
- `MCPTool`
- `LSPTool`
- `TaskCreateTool` / `TaskListTool`
- `SendMessageTool`

其中 `AgentTool`、`SkillTool`、`Task*`、`SendMessageTool` 这类工具尤其说明一件事：

**Claude Code 的工具系统不只处理“文件和 Shell”，还直接承载协作、编排和工作流。**

## 五、命令系统：用户接口层，不等于工具层

很多人会把 Slash Command 和 Tool 混在一起，但 Claude Code 明显把这两者分开了。

### 1. 命令是“用户面向”的，工具是“模型面向”的

命令系统定义为 `/` 前缀的用户命令，典型如：

- `/help`
- `/clear`
- `/compact`
- `/config`
- `/commit`
- `/review`
- `/cost`
- `/vim`
- `/theme`
- `/resume`

这些命令不一定都直接映射到一个底层工具。  
有些是本地控制逻辑，有些是 UI 命令，有些会进一步转成 Prompt 或工作流。

### 2. 命令分成三种变体

这是命令系统里我觉得最重要的设计之一。

Claude Code 的命令至少分成三类：

- `prompt`：提示型命令，适合技能/工作流类能力
- `local`：本地逻辑命令
- `local-jsx`：本地 JSX 命令，可以直接渲染 React Node

这相当于把命令层拆成了三个执行模型：

- 让模型继续思考
- 让本地逻辑直接执行
- 让本地交互 UI 接管

这比“所有命令都是字符串替换 Prompt”明显高级。

### 3. Prompt 命令本质上是“技能命令”

`PromptCommand` 支持很多扩展字段：

- `allowedTools`
- `model`
- `hooks`
- `skillRoot`
- `context: 'inline' | 'fork'`
- `argNames`

也就是说，一个命令不只是“别名”，它还带着：

- 可用工具边界
- 指定模型
- 执行上下文
- 参数协议

这已经很接近一个轻量级工作流定义了。

### 4. 命令加载有明确优先级

命令来源优先级是：

1. `bundled-skills`
2. `builtin-plugin-skills`
3. `skill-dir-commands`
4. `workflow-commands`
5. `plugin-commands`
6. `built-in-commands`

这很反直觉，因为我们通常会以为内置命令优先级最高。  
Claude Code 反而把“更接近技能和工作流层”的东西放得更高。

我的理解是：

**它希望命令系统优先承载“可扩展的专家流程”，而不是死板的内建控制项。**

### 5. Remote / Bridge 场景下还会再做命令裁剪

 `REMOTE_SAFE_COMMANDS` 一类集合，说明远程模式下并不是所有命令都开放。

这意味着命令系统本身也是安全边界的一部分。  
Bridge 并不是简单地把本地 REPL 全量暴露给远端，而是再套了一层“安全命令子集”。

## 六、查询引擎：Claude Code 的中枢神经系统

如果只允许我选一个最核心的模块，那一定是 `QueryEngine.ts`。

### 1. QueryEngine 是“有状态”的对话引擎

它不只是包一层 API Client，而是持有：

- 消息历史
- 文件缓存
- 会话配置
- 模型配置
- thinking 配置
- 状态 getter/setter
- 中断控制

这使得 QueryEngine 既知道“之前说了什么”，也知道“当前环境允许做什么”。

### 2. `submitMessage()` 不是一次请求，而是一整套循环

主流程可以概括成：

1. 处理用户输入
2. 组装系统提示词
3. 用 `wrappedCanUseTool()` 包住工具权限
4. 进入 `query()` 循环
5. 流式产出 `assistant / user / progress / attachment / stream_event`
6. 做轮次、预算、结构化输出重试检查
7. 记录 transcript，必要时 flush

这说明 Claude Code 把“一轮请求”拆成了多个责任点：

- Prompt 预处理
- Tool 权限包装
- API 请求构造
- 事件流消费
- 预算守卫
- 历史恢复能力

这就是它为什么能同时支持：

- 流式输出
- 工具调用
- 会话恢复
- 成本追踪
- 可中断执行

### 3. API 层不是裸调 SDK，而是有自己的查询抽象

 `src/services/api/claude.ts` 为 500+ 行的模型查询逻辑，并且 `query()` 本身也是 `AsyncGenerator<StreamEvent>`。

这层负责：

- 把消息、工具、系统提示词组装成 API 请求
- 把工具的 Zod Schema 转换成 API 可接受的 JSON Schema
- 处理 thinking / effort / cache 等高级参数

这里最重要的不是“怎么调 SDK”，而是 **Claude Code 自己定义了一层稳定的查询协议**，让上层不直接耦合到底层 SDK 细节。

### 4. 重试逻辑非常重

 `withRetry.ts` 有 700+ 行，并区分了多种策略：

- 前台策略
- 后台策略
- 快速模式后备
- `CLAUDE_CODE_UNATTENDED_RETRY` 持久重试

错误分类也很细：

- Auth 错误：不重试
- Connection 错误：指数退避
- Capacity 错误：退避重试 + 快速模式后备
- 其他错误：有限重试

这说明 Claude Code 并没有把“调用模型”当成一个稳定外设，而是假设它会：

- 失败
- 超时
- 被限流
- 临时过载

所以 QueryEngine 其实是一层 **容错调度器**。

### 5. Token 预算和递减收益检测很实用

两种预算保护：

- 当使用量接近上限的 `90%` 时触发检查
- 连续 3 次增量都小于 `500 token` 时触发递减收益检测

第二条很有意思。它不是只看“花了多少”，而是在判断模型是否开始进入低收益循环。  
这比单纯的 token 限额更像一个运行时健康检测。

### 6. 成本跟踪直接内建进核心循环

`StoredCostState` 里不仅有 `totalCostUSD`，还有：

- API 总耗时
- 不含重试的 API 耗时
- 工具执行总耗时
- 新增/删除代码行数
- 按模型统计的使用量

这表明 Claude Code 把“成本”当成一等系统指标，而不是外部报表。

## 七、核心系统之一：状态管理

### 1. 自研 Store，而不是上重型状态库

Claude Code 的 Store 很简单：

- `getState()`
- `setState()`
- `subscribe()`

React 侧通过 `useSyncExternalStore` 接上。

它没有引入大而重的全家桶，这对终端环境是合理的：

- 实现极简
- 不依赖浏览器 DOM 语义
- 方便在 CLI 与非 CLI 场景复用
- React 18+ 原生就支持外部 Store 订阅

### 2. `AppState` 是真正的系统总线

`AppState` 有 50+ 字段，大致分成：

- 会话状态：`messages`, `mainLoopModel`, `settings`
- MCP 与插件状态：`mcp`, `plugins`, `fileHistory`
- 工具与权限状态：`toolPermissionContext`, `currentTool`, `toolResults`
- 任务状态：`tasks`, `agentNameRegistry`
- UI 状态：`theme`, `statusLine`, `isInputFocused`, `scrollOffset`

这意味着 Claude Code 的状态管理不是“只给 UI 用”，而是把：

- 运行态
- 工具态
- 权限态
- 扩展态
- 任务态

统一放进一个总线上。

### 3. Selector 和变更监听把“读状态”和“副作用”拆开

`selectors.ts` 负责做纯派生，比如：

- 当前查看的队友任务
- 当前活跃输入代理

`onChangeAppState.ts` 负责监听重要字段变化并触发副作用，比如：

- 权限模式变化 -> 更新工具列表 / 命令列表 / UI 提示
- 模型变化 -> 更新系统提示词 / 重新计算 Token 预算
- 视图模式变化 -> 重新渲染消息列表 / 更新虚拟滚动范围

这套分工很清楚：

- Selector 只读
- Listener 只处理副作用

对大状态系统来说，这是很重要的边界。

## 八、权限与安全系统：Claude Code 为什么敢开这么多能力

Claude Code 的权限系统是我认为最值得研究的部分之一，因为它解决的是 Agent 产品的核心难题：

**如何在给模型足够行动能力的同时，不把用户机器直接交出去。**

### 1. 权限模式不是二元开关，而是多级策略

权限模式包括：

- `default`
- `acceptEdits`
- `bypassPermissions`
- `plan`
- `dontAsk`
- `auto`
- `bubble`

其中：

- `plan` 只允许只读操作
- `dontAsk` 会静默拒绝高风险动作
- `acceptEdits` 自动接受编辑，但 Shell 仍可能要求确认
- `bypassPermissions` 则几乎全放开
- `auto` 交给分类器判断

这套模式矩阵说明 Claude Code 的权限设计目标不是“要么安全，要么可用”，而是 **让不同信任等级有不同运行姿态**。

### 2. 规则来源是分层的

权限规则来源包括：

- `policySettings`
- `flagSettings`
- `cliArg`
- `localSettings`
- `projectSettings`
- `userSettings`
- `session`
- `command`

而且企业策略是最高优先级。

这说明权限不是单点配置，而是一套 **分层叠加的治理体系**。  
对于团队和企业场景，这几乎是必需的。

### 3. 每个工具都要经过 `checkPermissions()`

权限检查流程大致是：

1. 工具自己的内置权限逻辑先执行
2. 返回 `PermissionResult`
3. 再进入统一规则匹配
4. 按 `alwaysDeny` > `alwaysAllow` > `alwaysAsk` > `PermissionMode` 的优先级做最终决策

这就形成了两层防线：

- 工具内自检
- 系统级策略裁决

典型例子：

- `BashTool` 关注命令危险性
- `FileEditTool` / `FileWriteTool` 关注路径
- `AgentTool` 关注代理权限

### 4. `auto` 模式用 YOLO Classifier 做自动裁决

它不是一个简单的正则，而是两阶段判断：

- 快速阶段：用规则快速判断明显安全/危险模式
- thinking 阶段：当规则无法确定时，再调用模型分析上下文

如果上下文太长或者服务不可用，则降级成 `ask`。

这其实是在用一个“小裁判模型/策略层”去保护“大执行模型”。  
从架构角度说，这是一个很典型的 **policy model in front of capability model** 设计。

### 5. Hook 安全系统能中途拦截

Hook 结果里不仅有消息，还有：

- `blockingError`
- `preventContinuation`
- `permissionBehavior`
- `stopReason`

也就是说，安全系统不只是“执行前审核”，还可以在流程中间把某一步拦下来。

这类 Hook 能力对于：

- 企业合规
- 审计
- 自定义安全策略

都很重要。

### 6. 企业策略层才是最后兜底

企业策略可以控制：

- 工具拒绝列表
- MCP Server allowlist / denylist
- 特定 Feature Flag 禁用
- 审计日志

并且还能剥离用户自定义的危险规则。

这说明 Claude Code 的安全设计不是“相信用户会配对规则”，而是承认：

**用户配置本身也可能是不安全输入。**

## 九、Bridge 远程通信：把本地 CLI 变成可桥接的分布式端点

### 1. Bridge 不是 WebSocket 推送，而是轮询式远程控制

Bridge 图很清楚：本地 CLI 和远程 Bridge API 之间通过 HTTP 轮询连接，远端维护：

- Work Queue
- Session Store
- Heartbeat Monitor

这是一种很务实的设计。  
它不追求最炫的实时协议，而是优先考虑：

- 网络兼容性
- 简单部署
- 会话可恢复
- 对 CLI 环境更友好

### 2. `bridgeMain()` 本身就是一个工作循环

它的主流程基本是：

1. 初始化配置
2. 创建 BridgeApiClient
3. 注册会话
4. 启动心跳
5. 进入工作轮询循环

循环内部会：

- `getWork()`
- 有工作就创建/恢复会话并执行
- 没工作就指数退避
- 收到工作后重置轮询间隔

这一套设计和 QueryEngine 很一致：  
**也是一个“流式任务循环”，只是对象从消息换成了远程工作项。**

### 3. Bridge 自己有完整的会话协议

核心类型包括：

- `WorkData`
- `WorkResponse`
- `BridgeConfig`
- `BridgeApiClient`
- `SessionDoneStatus`

BridgeApiClient 暴露的方法也很完整：

- `getWork()`
- `submitResult()`
- `sendHeartbeat()`
- `registerSession()`
- `unregisterSession()`
- `getSessionStatus()`
- `sendMessage()`
- `getMessages()`

这说明 Bridge 并不是“把 stdin/stdout 暴露出去”，而是设计了一套明确的远程会话协议。

### 4. 去重、唤醒、JWT、可信设备都做了

Bridge 里很有几个值得注意的点：

- `BoundedUUIDSet`：用 FIFO 环形缓冲做消息去重
- `capacityWake.ts`：容量恢复时唤醒等待客户端
- `jwtUtils.ts`：用 JWT 做 Bridge 认证
- `trustedDevice.ts`：设备信任管理
- `workSecret.ts`：敏感数据加密

这里可以看出它已经不是“临时远控功能”，而是一套认真做过的远程会话基础设施。

### 5. Bridge 仍然受安全边界约束

- Bridge 只允许 `BRIDGE_SAFE_COMMANDS`
- 远程权限会注入 `ToolPermissionContext`
- 它还会和 `AppState`、`CostTracker`、`QueryEngine` 交互

所以 Bridge 不是绕过本地安全系统的后门，而是接入主运行时之后的一个远程端口。

## 十、UI 与组件系统：终端 UI 也被当成产品系统来设计

很多 CLI 工具的 UI 只是输出文本，但 Claude Code 明显不是。

### 1. 它把终端当成真正的 React 渲染目标

技术栈上，它用的是：

- React
- Ink
- Yoga
- React Compiler Runtime

还有自定义 Ink 渲染器、60 FPS、双缓冲、FPS 计量。  
这已经不是“打印日志”的思路，而是完整的实时终端 UI。

### 2. App 根组件是多 Provider 组合

`App.tsx` 的骨架是：

- `FpsMetricsProvider`
- `StatsProvider`
- `AppStateProvider`
- `REPLContent`

这说明 UI 层并不是孤立的，它和：

- 性能统计
- 运行时状态
- 主交互循环

是一起组织的。

### 3. StatusLine 和 VirtualMessageList 体现了产品成熟度

`StatusLine.tsx` 会显示：

- 当前模型
- 权限模式
- 成本统计
- 会话时长
- Token 使用量

并且为了避免高频重渲染，还用了：

- 300ms debounce
- Ref 缓存
- 条件重算

`VirtualMessageList.tsx` 则支持：

- 仅渲染视口可见消息
- 动态加载/卸载
- 搜索高亮
- 编程式跳转

这说明 Claude Code 的终端 UI 设计目标已经接近桌面聊天/IDE 面板，而不是传统命令行输出。

### 4. 输入系统也非常重

`useTextInput` 支持的内容包括：

- 完整光标模型
- Emacs 键绑定
- Kill Ring
- SSH 适配
- Bracketed Paste
- 历史导航
- 自动完成

这意味着 Claude Code 不是借用一个现成 Input Box，而是认真把终端输入体验做成了一套子系统。

### 5. UI 里甚至还有 Buddy 系统

- `companion.ts`
- `CompanionSprite.tsx`
- `prompt.ts`
- `sprites.ts`

这类模块的存在说明 Claude Code 不只是强调“能用”，它还在追求明显的产品感和陪伴式交互。

## 十一、插件与技能系统：Claude Code 的扩展不是附属能力，而是一级架构

### 1. 扩展体系是分层的

1. 内置插件
2. 打包技能
3. 技能目录
4. MCP 技能
5. 外部插件

这个层次很重要，因为它表达了一种优先级顺序：

- 官方内置能力
- 随安装包分发的官方技能
- 用户本地技能
- 通过协议接入的外部技能
- 完整第三方插件

这比单纯的“插件市场”更可控。

### 2. 技能本质上被映射成命令

内置插件可以直接提供 skill commands。  
技能目录里的技能也会转换成命令。  
`SkillTool` 最终调用的其实也是可被选中的技能命令集合。

换句话说，Claude Code 并没有把“技能”做成一套完全独立的执行系统，而是让它落到命令模型上，再通过 QueryEngine 注入对话循环。

这是非常聪明的做法，因为它复用了：

- 命令注册
- 参数解析
- 优先级覆盖
- 上下文模式
- 可用工具边界

### 3. 打包技能采用懒提取 + 安全文件标志

这一段我很喜欢。  
打包技能不是安装时全部落地，而是在首次使用时提取，并且显式使用：

- `O_NOFOLLOW`
- `O_EXCL`

这主要是为了防：

- 符号链接注入
- TOCTOU 竞争问题

也就是说，连“解包技能文件”这种看似不起眼的动作，它都按安全敏感路径来处理。

### 4. 技能目录支持结构化配置

`skill.json` 里可以配：

- `name`
- `description`
- `version`
- `allowedTools`
- `model`
- `context`
- `argNames`
- `paths`
- `whenToUse`

这意味着一个技能既是 Prompt 资产，也是一个小型执行契约。

### 5. `getSkills()` 做统一加载和错误隔离

`getSkills(cwd)` 会统一收集：

- 技能目录命令
- 插件技能
- 打包技能
- 内置插件技能

并且每个来源独立捕获错误，不影响其他来源。  
这是扩展系统非常标准、也非常必要的隔离策略。

### 6. SkillTool 的本质是“把技能 Prompt 注入主循环”

`SkillTool.call({ skillName, args })` 的流程大致是：

1. 拿到可用技能命令
2. 按名字查找技能
3. 调用 `getPromptForCommand(args, context)`
4. 把技能提示作为新消息注入
5. 继续 QueryEngine 循环

这个设计的好处是：

- 技能不需要自己实现完整执行器
- 主循环不需要为每个技能写特例
- 技能天然继承工具、权限、消息流和上下文能力

本质上，**技能就是可组合的 Prompt Runtime 扩展。**

### 7. 插件是更高一级的扩展容器

`PluginManifest` 可以声明：

- `skills`
- `tools`
- `hooks`

也就是说，插件不是只加几个命令，而是可以同时扩展：

- 能力
- 规则
- 工作流

这也是 Claude Code 扩展系统和传统 CLI 插件最大的区别之一：  
**它扩展的不只是 UI 命令，而是整个 Agent Runtime。**

## 十二、我对 Claude Code 架构的几个判断

看完之后，我对 Claude Code 有几个很明确的判断。

### 1. 它的核心不是 Prompt，而是 Runtime

真正难的部分不是“系统提示词怎么写”，而是：

- 消息如何流动
- 工具如何受控
- 权限如何裁决
- 状态如何同步
- 远程如何桥接
- 扩展如何不把主循环搞乱

Claude Code 的价值，更多在这套 Runtime，而不只是模型接入。

### 2. 它已经非常接近“Agent 操作系统”

如果把比喻说得更激进一点：

- QueryEngine 像调度器
- Tool 像系统调用
- Command 像用户态命令
- AppState 像运行时状态总线
- Bridge 像远程会话协议
- Plugin/Skill 像扩展模块机制

这也是为什么 Claude Code 会比“IDE 里一个聊天面板”重得多。

### 3. 安全系统不是补丁，而是基础骨架

Claude Code 并不是先做强能力，再补权限。  
权限和工具几乎是共同设计的。

这类系统如果没有：

- 多权限模式
- 规则优先级
- 自动分类器
- Hook 拦截
- 企业策略层

很难真的把编辑、Shell、Web、代理协作这些能力开放出来。

### 4. 扩展系统比很多产品成熟得多

很多 AI 工具说自己支持“插件”，本质上只是注册几个外部 API。  
Claude Code 这里的扩展是成体系的：

- 命令能扩
- 工具能扩
- 技能能扩
- Hook 能扩
- MCP 能接
- Bridge 能远程化

这意味着它不是围绕单一产品形态设计，而是围绕平台形态设计。

## 结语

如果你只是把 Claude Code 看成“Claude 的 CLI 壳”，那你会很难理解它为什么会这么复杂。  
但如果你把它看成一个 **软件工程 Agent Runtime**，很多设计就都说得通了。

它真正解决的问题不是“把模型放进终端”，而是：

- 如何让模型稳定进入工程任务循环
- 如何让高风险能力可治理
- 如何让本地、远程、MCP、技能、插件共存
- 如何把体验做成产品，而不是 demo

所以我觉得，Claude Code 最值得学的不是某一个工具实现，而是它的分层方法：

**入口、引擎、能力、状态、安全、远程、扩展，各自独立，但都围绕同一个 Query Runtime 收敛。**

这套思路，对任何想做 AI Agent CLI、IDE Agent、企业编码助手，甚至多代理开发平台的人，都很有参考价值。
