# Seedance 2.0 AI 制片人系统 Spec

## Why

当前"三合一"项目的短剧平台模块只有前端展示壳，缺少实际可用的后端 Skill 系统。需要构建一个完整的 Trae Skill 插件，实现从剧本输入到 Seedance 2.0 动态视频提示词产出的全流程自动化。该系统采用多 Agent 协同架构（5 Agent + 13 Skill + 4 阶段流水线 + 4 级 Gate 审核），最终对外表现为一个统一的 Trae Skill。

## What Changes

- 在 `E:\PROJECT\` 下新建独立文件夹 `seedance-producer-system/`，作为 Skill 项目根目录
- 创建 Trae Skill 入口文件 `SKILL.md`（使用 Trae 标准 YAML frontmatter + Markdown body 格式）
- 创建 5 个 Agent 定义文件（producer / director / compliance-officer / art-director / storyboard-artist）
- 创建 13 个子 Skill 定义文件（覆盖项目管理、市场洞察、导演讲戏、剧本审核、地区合规、文化敏感性、品牌安全、美术设计、视觉标准、美术审核、分镜提示词、提示词审核、音效配乐）
- 创建 10 个产出物模板文件（覆盖 Phase 0-3 全部产出和合规报告）
- 创建 `package.json` 元数据文件
- 所有 Skill 内容基于 Seedance 2.0 真实提示词语法（六步公式、@引用系统、时间线提示词、8种标准运镜）

## Impact

- Affected specs: 新增能力，不影响现有功能
- Affected code: 无现有代码被修改，纯新增文件
- Affected systems: 三合一前端短剧页面（未来可对接展示）

## ADDED Requirements

### Requirement: Skill 入口与路由系统

系统 SHALL 提供一个统一的 Trae Skill 入口，能够根据用户意图自动路由到对应的 Agent。

#### Scenario: 用户输入新剧本
- **WHEN** 用户输入原始剧本或创作需求
- **THEN** 系统路由到 Producer Agent，启动 Phase 0 项目立项流程

#### Scenario: 用户请求剧本分析
- **WHEN** Gate 0 已通过，用户请求剧本分析
- **THEN** 系统路由到 Director Agent，启动 Phase 1 剧情拆解流程

#### Scenario: 用户请求视觉设计
- **WHEN** Gate 1 已通过，用户请求视觉设计
- **THEN** 系统路由到 Art Director Agent，启动 Phase 2 视觉基准生成流程

#### Scenario: 用户请求分镜提示词
- **WHEN** Gate 2 已通过，用户请求分镜提示词
- **THEN** 系统路由到 Storyboard Artist Agent，启动 Phase 3 动态视频提示词编写流程

#### Scenario: 用户请求合规审核
- **WHEN** 存在待审核的产出文件
- **THEN** 系统路由到 Compliance Officer Agent，执行对应 Gate 的合规审核

### Requirement: 多层级 Agent 协同

系统 SHALL 实现 L1/L2/L3 三层 Agent 架构，上层控制下层，下层向上汇报。

#### Scenario: Producer 调度 Director
- **WHEN** Phase 0 完成且 Gate 0 通过
- **THEN** Producer 将项目简报传递给 Director，启动 Phase 1

#### Scenario: Director 调度 Art Director 和 Storyboard Artist
- **WHEN** Phase 1 完成且 Gate 1 通过
- **THEN** Director 将导演分析传递给 Art Director，启动 Phase 2

#### Scenario: Compliance Officer 一票否决
- **WHEN** Compliance Officer 在任意 Gate 发现 P0 级违规
- **THEN** 立即否决，终止当前阶段，返回修改

### Requirement: 四阶段流水线

系统 SHALL 实现 Phase 0-3 四阶段流水线，每个阶段有明确的输入、处理步骤和产出物。

#### Scenario: Phase 0 项目立项
- **WHEN** Producer 接收用户需求
- **THEN** 执行需求分析 → 项目简报生成 → 市场分析，产出 `00-project-brief.md`

#### Scenario: Phase 1 剧情拆解
- **WHEN** Director 接收剧本和项目简报
- **THEN** 执行剧本深度分析 → 讲戏指导生成 → 导演讲戏本输出，产出 `01-director-analysis.md`

#### Scenario: Phase 2 视觉基准
- **WHEN** Art Director 接收导演讲戏本
- **THEN** 执行人物视觉设计 → 场景美术设计 → 视觉参考图提示词输出，产出 `02-character-prompts.md` + `02-scene-prompts.md`

#### Scenario: Phase 3 动态提示词
- **WHEN** Storyboard Artist 接收导演讲戏本和视觉参考图
- **THEN** 执行分镜结构设计 → 台词分配 → 动态提示词编写 → 音效配乐指导，产出 `03-seedance-prompts.md`

### Requirement: Gate 审核机制

系统 SHALL 在每个 Phase 结束后执行业务质量审核 + 合规安全审核。

#### Scenario: Gate 审核通过
- **WHEN** 业务质量审核通过且合规审核通过
- **THEN** 自动路由到下一 Phase

#### Scenario: Gate 审核未通过
- **WHEN** 业务质量审核未通过或合规审核未通过
- **THEN** 返回修改建议，路由到对应 Agent 进行修改

### Requirement: Seedance 2.0 提示词语法

系统产出的 Seedance 提示词 SHALL 遵循 Seedance 2.0 官方提示词规范。

#### Scenario: 六步公式提示词
- **WHEN** Storyboard Artist 编写视频提示词
- **THEN** 提示词包含主体 + 动作 + 环境 + 镜头 + 风格 + 约束六个要素

#### Scenario: @引用系统
- **WHEN** 用户上传参考图片/视频/音频
- **THEN** 提示词使用 `@image1`、`@video1`、`@audio1` 格式引用，并为每个素材分配明确角色

#### Scenario: 时间线提示词
- **WHEN** 需要多镜头叙事
- **THEN** 使用 `[0s]`、`[3s]`、`[6s]` 时间线格式组织镜头

#### Scenario: 标准运镜术语
- **WHEN** 描述镜头运动
- **THEN** 使用 8 种标准运镜术语（推进/拉远/横摇/跟踪/环绕/航拍/手持/固定）

### Requirement: 全球市场合规

系统 SHALL 支持北美、欧洲、东南亚、中东四个目标市场的合规审核。

#### Scenario: 地区合规检查
- **WHEN** Compliance Officer 执行地区合规审核
- **THEN** 根据目标市场检查政治敏感度、暴力标准、色情标准、平台政策

#### Scenario: 文化敏感性检查
- **WHEN** Compliance Officer 执行文化敏感性审核
- **THEN** 检查宗教符号、地域偏见、刻板印象等文化禁忌

#### Scenario: 品牌安全检查
- **WHEN** Compliance Officer 执行品牌安全审核
- **THEN** 检查广告主红线、版权规则、品牌声誉风险

## File Structure

```
E:\PROJECT\seedance-producer-system\
├── SKILL.md                                    # Trae Skill 入口
├── package.json                                # 元数据
├── agents/
│   ├── producer.md                             # L1 制片人
│   ├── director.md                             # L2 导演
│   ├── compliance-officer.md                   # L2 合规官
│   ├── art-director.md                         # L3 美术总监
│   └── storyboard-artist.md                    # L3 分镜师
├── skills/
│   ├── project-management-skill.md             # 项目管理
│   ├── market-intelligence-skill.md            # 市场洞察
│   ├── director-skill.md                       # 导演讲戏
│   ├── script-analysis-review-skill.md         # 剧本审核
│   ├── regional-compliance-skill.md            # 地区合规
│   ├── cultural-sensitivity-skill.md           # 文化敏感性
│   ├── brand-safety-skill.md                   # 品牌安全
│   ├── art-design-skill.md                     # 美术设计
│   ├── visual-standards-skill.md               # 视觉标准
│   ├── art-direction-review-skill.md           # 美术审核
│   ├── seedance-storyboard-skill.md            # 分镜提示词（含 Seedance 2.0 语法）
│   ├── seedance-prompt-review-skill.md         # 提示词审核
│   └── audio-music-skill.md                    # 音效配乐
└── outputs/
    ├── 00-project-brief.md                     # 项目简报模板
    ├── 00-compliance-precheck.md               # 合规预检模板
    ├── 01-director-analysis.md                 # 导演分析模板
    ├── 01-compliance-script-report.md          # 剧本合规报告模板
    ├── 02-character-prompts.md                 # 人物提示词模板
    ├── 02-scene-prompts.md                     # 场景提示词模板
    ├── 02-compliance-visual-report.md          # 视觉合规报告模板
    ├── 03-seedance-prompts.md                  # Seedance 提示词模板
    ├── 03-compliance-storyboard-report.md      # 分镜合规报告模板
    └── 04-compliance-final-report.md           # 最终合规报告模板
```

## Non-Goals

- 不修改三合一前端代码（前端对接是后续任务）
- 不实现真实的 LLM 调用（Skill 是 prompt 指令集，不是可执行代码）
- 不构建 Web API 或后端服务
- 不集成真实的 Seedance 2.0 API
