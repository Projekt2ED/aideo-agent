# 自动评估循环系统 Spec

## Why

当前 Seedance Producer System 只能被动接收用户输入的剧本，无法自主寻找素材、评估质量、持续迭代。需要新增一个自动循环能力：**搜索剧本 → 自动拆解 → 质量打分 → 反馈优化 → 循环运行**，让系统具备自我进化能力。

## What Changes

- 新增 `Script Curator` Agent（剧本策展人），负责从网络搜索/生成剧本素材
- 新增 `Quality Assessor` Agent（质量评估师），负责对每个 Phase 的产出进行量化打分
- 新增 3 个 Skill：`script-sourcing-skill`（剧本获取）、`quality-scoring-skill`（质量打分）、`loop-controller-skill`（循环控制）
- 新增 2 个输出模板：`outputs/05-script-candidates.md`（候选剧本库）、`outputs/06-quality-report.md`（质量评估报告）
- 修改 `SKILL.md`：新增自动循环模式的路由规则和使用指南
- 修改 `agents/producer.md`：新增循环调度逻辑

## Impact

- Affected specs: seedance-producer-system（现有系统扩展）
- Affected code: `E:\PROJECT\seedance-producer-system\` 下的 SKILL.md、producer.md、新增文件
- Affected systems: 三合一前端短剧展示页（未来可展示循环进度）

## ADDED Requirements

### Requirement: 剧本自动获取

系统 SHALL 能够自主获取剧本素材，无需用户手动输入。

#### Scenario: 从网络搜索热门剧本
- **WHEN** 用户启动自动循环模式
- **THEN** Script Curator Agent 使用 WebSearch 搜索当前热门短剧剧本、爆款选题、热门题材
- **THEN** 提取并整理为候选剧本列表

#### Scenario: AI 生成测试剧本
- **WHEN** 网络搜索结果不足或用户指定题材
- **THEN** Script Curator Agent 根据市场趋势和爆款公式，自动生成符合要求的测试剧本

#### Scenario: 用户指定剧本来源
- **WHEN** 用户提供剧本 URL、文件路径或文本
- **THEN** Script Curator Agent 直接使用用户提供的素材，跳过搜索步骤

### Requirement: 质量量化评估

系统 SHALL 对每个 Phase 的产出进行量化打分（0-100 分）。

#### Scenario: Phase 0 项目简报评分
- **WHEN** Phase 0 完成
- **THEN** Quality Assessor 从 5 个维度评分：定位清晰度(20分)、市场可行性(20分)、受众精准度(20分)、创意差异化(20分)、风险可控性(20分)

#### Scenario: Phase 1 导演分析评分
- **WHEN** Phase 1 完成
- **THEN** Quality Assessor 从 5 个维度评分：叙事完整性(25分)、人物深度(20分)、情感弧线(20分)、镜头规划(20分)、L3指导清晰度(15分)

#### Scenario: Phase 2 视觉基准评分
- **WHEN** Phase 2 完成
- **THEN** Quality Assessor 从 4 个维度评分：角色辨识度(25分)、场景氛围(25分)、风格统一性(25分)、提示词可执行性(25分)

#### Scenario: Phase 3 Seedance 提示词评分
- **WHEN** Phase 3 完成
- **THEN** Quality Assessor 从 5 个维度评分：六步公式完整性(25分)、运镜合理性(20分)、约束充分性(20分)、音画协调性(15分)、创意表现力(20分)

### Requirement: 自动循环控制

系统 SHALL 支持无人值守的自动循环运行模式。

#### Scenario: 启动自动循环
- **WHEN** 用户说"自动循环"、"loop"、"自己跑"
- **THEN** 系统进入自动循环模式，依次执行：搜索剧本 → Phase 0-3 → 评分 → 记录 → 搜索下一个剧本

#### Scenario: 循环终止条件
- **WHEN** 达到用户指定的循环次数（默认 3 轮）
- **THEN** 系统停止循环，输出汇总报告

#### Scenario: 质量阈值终止
- **WHEN** 某轮评分达到优秀阈值（总分 ≥ 85）
- **THEN** 系统标记该轮为"标杆案例"，继续循环但优先参考该轮的策略

#### Scenario: 连续低分终止
- **WHEN** 连续 2 轮评分低于及格阈值（总分 < 60）
- **THEN** 系统暂停循环，向用户报告问题并请求指导

### Requirement: 循环反馈优化

系统 SHALL 在每轮循环后提取经验教训，用于优化下一轮的表现。

#### Scenario: 提取优化建议
- **WHEN** 某轮循环完成并评分
- **THEN** Quality Assessor 从扣分项中提取具体优化建议，写入反馈日志

#### Scenario: 应用反馈到下一轮
- **WHEN** 开始新一轮循环
- **THEN** Producer 读取上一轮的反馈日志，调整本轮的策略（如：加强人物深度、优化镜头规划等）

### Requirement: 汇总报告

系统 SHALL 在循环结束后输出完整的汇总报告。

#### Scenario: 生成汇总报告
- **WHEN** 循环结束
- **THEN** 系统生成 `outputs/07-loop-summary.md`，包含：每轮评分对比、最佳案例、共性问题、改进建议

## File Structure (新增文件)

```
E:\PROJECT\seedance-producer-system\
├── agents/
│   ├── script-curator.md              # 新增：剧本策展人
│   └── quality-assessor.md            # 新增：质量评估师
├── skills/
│   ├── script-sourcing-skill.md       # 新增：剧本获取
│   ├── quality-scoring-skill.md       # 新增：质量打分
│   └── loop-controller-skill.md       # 新增：循环控制
└── outputs/
    ├── 05-script-candidates.md         # 新增：候选剧本库模板
    ├── 06-quality-report.md            # 新增：质量评估报告模板
    └── 07-loop-summary.md              # 新增：循环汇总报告模板
```

## MODIFIED Requirements

### SKILL.md 路由规则扩展

新增路由条目：
| 用户意图 | 关键词 | 路由目标 | 前置条件 |
|---------|-------|---------|---------|
| 自动循环 | "自动循环"、"loop"、"自己跑"、"批量测试" | → Producer (循环模式) | 无 |
| 搜索剧本 | "找剧本"、"搜索剧本"、"有什么好剧本" | → Script Curator | 无 |
| 质量评分 | "评分"、"打分"、"质量怎么样" | → Quality Assessor | 至少完成 1 个 Phase |

### Producer Agent 扩展

新增循环调度逻辑：
1. 接收"自动循环"指令
2. 调用 Script Curator 获取剧本
3. 执行 Phase 0-3 全流程
4. 调用 Quality Assessor 评分
5. 记录反馈
6. 判断是否继续循环
7. 循环结束后生成汇总报告

## Non-Goals

- 不实现真实的网络爬虫（使用 WebSearch 工具代替）
- 不实现机器学习模型训练（反馈机制基于规则而非 ML）
- 不修改现有 Phase 0-3 的核心流程（只在外部包裹循环层）
- 不修改现有 Agent 的核心职责（只新增协调逻辑）
