# Tasks

## Batch 1: 项目骨架与核心链路（Phase 0 → Phase 1）

- [x] Task 1: 创建项目目录结构与 package.json
  - [x] SubTask 1.1: 创建 `E:\PROJECT\seedance-producer-system\` 目录及子目录 `agents/`、`skills/`、`outputs/`
  - [x] SubTask 1.2: 创建 `package.json`（name: seedance-producer-system, version: 1.0.0, description 等元数据）

- [x] Task 2: 创建 SKILL.md 入口文件
  - [x] SubTask 2.1: 编写 YAML frontmatter（name、description 触发条件、version）
  - [x] SubTask 2.2: 编写系统架构总览（5 Agent、13 Skill、4 Phase、4 Gate）
  - [x] SubTask 2.3: 编写指令路由规则表（用户意图 → Agent 映射 + 前置条件）
  - [x] SubTask 2.4: 编写三阶段流水线概要说明
  - [x] SubTask 2.5: 编写使用指南（启动新项目、查看状态、处理审核失败）
  - [x] SubTask 2.6: 编写 Agent-Skill 加载规则（启动时加载 Producer，按需加载其他）

- [x] Task 3: 创建 Producer Agent（L1 制片人）
  - [x] SubTask 3.1: 编写角色定义（层级 L1、控制关系、汇报关系）
  - [x] SubTask 3.2: 编写核心职责（项目立项、资源分配、市场分析、进度追踪、风险管控、质量确认）
  - [x] SubTask 3.3: 编写 Phase 0 工作流程详细步骤
  - [x] SubTask 3.4: 编写指令路由逻辑（如何判断用户意图并路由到对应 Agent）
  - [x] SubTask 3.5: 编写行为约束（不越权、不修改其他 Agent 产出、决策优先级：合规 > 质量 > 效率 > 成本）

- [x] Task 4: 创建 Director Agent（L2 导演）
  - [x] SubTask 4.1: 编写角色定义（层级 L2、被 Producer 控制、控制 L3 执行层）
  - [x] SubTask 4.2: 编写核心职责（剧本深度解析、叙事结构设计、讲戏指导输出、镜头语言设计）
  - [x] SubTask 4.3: 编写 Phase 1 工作流程详细步骤
  - [x] SubTask 4.4: 编写对 Art Director 和 Storyboard Artist 的指导输出格式
  - [x] SubTask 4.5: 编写 Gate 1 自审标准

- [x] Task 5: 创建项目管理 Skill
  - [x] SubTask 5.1: 编写技能定位与触发条件
  - [x] SubTask 5.2: 编写项目立项执行步骤（需求分析、项目类型识别、目标市场确定）
  - [x] SubTask 5.3: 编写资源分配指南
  - [x] SubTask 5.4: 编写进度追踪方法
  - [x] SubTask 5.5: 编写输出格式要求

- [x] Task 6: 创建导演讲戏 Skill
  - [x] SubTask 6.1: 编写技能定位与触发条件
  - [x] SubTask 6.2: 编写剧本分析方法论（提取核心叙事、人物清单、场景清单、情感弧线）
  - [x] SubTask 6.3: 编写讲戏模板（如何向演员传达角色内心和表演指导）
  - [x] SubTask 6.4: 编写镜头语言设计指南（景别选择、运镜规划、节奏控制）
  - [x] SubTask 6.5: 编写对 L3 执行层的指导输出格式

- [x] Task 7: 创建项目简报输出模板
  - [x] SubTask 7.1: 编写元信息区（项目名称、Phase、Gate、负责 Agent、生成时间）
  - [x] SubTask 7.2: 编写内容结构（项目概述、目标市场、受众画像、竞品分析、资源需求、风险评估、时间线）
  - [x] SubTask 7.3: 编写填写说明
  - [x] SubTask 7.4: 编写 Gate 0 审核清单

- [x] Task 8: 创建导演分析输出模板
  - [x] SubTask 8.1: 编写元信息区
  - [x] SubTask 8.2: 编写内容结构（叙事结构、人物清单、场景清单、情感弧线、镜头规划、节奏设计）
  - [x] SubTask 8.3: 编写填写说明
  - [x] SubTask 8.4: 编写 Gate 1 审核清单

## Batch 2: 执行层（Phase 2 → Phase 3）

- [x] Task 9: 创建 Art Director Agent（L3 美术总监）
  - [x] SubTask 9.1: 编写角色定义（层级 L3、被 Director 控制）
  - [x] SubTask 9.2: 编写核心职责（人物视觉设计、场景美术设计、视觉风格统一、素材版权排查）
  - [x] SubTask 9.3: 编写 Phase 2 工作流程详细步骤
  - [x] SubTask 9.4: 编写 Seedance 出图提示词格式规范

- [x] Task 10: 创建 Storyboard Artist Agent（L3 分镜师）
  - [x] SubTask 10.1: 编写角色定义（层级 L3、被 Director 控制）
  - [x] SubTask 10.2: 编写核心职责（分镜结构设计、动态提示词编写、台词分配、镜头语言转化、音效配乐指导）
  - [x] SubTask 10.3: 编写 Phase 3 工作流程详细步骤
  - [x] SubTask 10.4: 编写 Seedance 2.0 提示词产出规范

- [x] Task 11: 创建美术设计 Skill
  - [x] SubTask 11.1: 编写人物视觉设计规范（造型、服装、道具、面部特征的提示词模板）
  - [x] SubTask 11.2: 编写场景美术设计规范（环境、光影、氛围的提示词模板）
  - [x] SubTask 11.3: 编写出图提示词格式（Seedance 图片生成提示词结构）

- [x] Task 12: 创建视觉标准 Skill
  - [x] SubTask 12.1: 编写色彩规范（色调、色温、对比度标准）
  - [x] SubTask 12.2: 编写光影体系（自然光、人工光、氛围光的描述词汇表）
  - [x] SubTask 12.3: 编写材质标准（皮肤、布料、金属、玻璃等材质的提示词）

- [x] Task 13: 创建分镜提示词 Skill（核心 Skill，含 Seedance 2.0 完整语法）
  - [x] SubTask 13.1: 编写 Seedance 2.0 六步公式详解（主体 + 动作 + 环境 + 镜头 + 风格 + 约束）
  - [x] SubTask 13.2: 编写 @引用系统语法（@image、@video、@audio 的使用规范和角色分配）
  - [x] SubTask 13.3: 编写时间线提示词语法（[0s]、[3s] 格式的多镜头组织）
  - [x] SubTask 13.4: 编写 8 种标准运镜术语表（推进/拉远/横摇/跟踪/环绕/航拍/手持/固定，含英文术语和使用场景）
  - [x] SubTask 13.5: 编写分镜结构设计方法（4×15s 分镜节拍、起承转合结构）
  - [x] SubTask 13.6: 编写台词分配指南（语速预算、台词密度控制）
  - [x] SubTask 13.7: 编写万能画质约束模板（Photorealistic, cinematic composition...）
  - [x] SubTask 13.8: 编写最佳实践（DO / DON'T 清单）
  - [x] SubTask 13.9: 编写 3 个完整示例（纯文本生成、多模态参考生成、时间线提示词）

- [x] Task 14: 创建音效配乐 Skill
  - [x] SubTask 14.1: 编写音效设计指南（环境音、动作音效、情绪音效的分类和描述）
  - [x] SubTask 14.2: 编写配乐指导（BGM 风格选择、节奏匹配、情绪曲线）
  - [x] SubTask 14.3: 编写 Seedance 音频提示词格式（@audio 引用和音频描述）

- [x] Task 15: 创建人物提示词输出模板
  - [x] SubTask 15.1: 编写元信息区
  - [x] SubTask 15.2: 编写内容结构（人物列表、每个人物的造型提示词、服装提示词、面部特征提示词）
  - [x] SubTask 15.3: 编写 Gate 2 审核清单

- [x] Task 16: 创建场景提示词输出模板
  - [x] SubTask 16.1: 编写元信息区
  - [x] SubTask 16.2: 编写内容结构（场景列表、每个场景的环境提示词、光影提示词、氛围提示词）
  - [x] SubTask 16.3: 编写 Gate 2 审核清单

- [x] Task 17: 创建 Seedance 提示词输出模板
  - [x] SubTask 17.1: 编写元信息区
  - [x] SubTask 17.2: 编写内容结构（分镜列表、每个分镜的 Seedance 提示词、@引用素材、时间线、音效配乐指导）
  - [x] SubTask 17.3: 编写 Gate 3 审核清单

## Batch 3: 合规层与审核机制

- [x] Task 18: 创建 Compliance Officer Agent（L2 合规官）
  - [x] SubTask 18.1: 编写角色定义（层级 L2、独立于创意流程、拥有一票否决权）
  - [x] SubTask 18.2: 编写核心职责（全球法规追踪、文化敏感性评估、品牌安全把控）
  - [x] SubTask 18.3: 编写风险分级处理（P0 立即否决 / P1 修改否则否决 / P2 可协商）
  - [x] SubTask 18.4: 编写 Gate 0-3 各阶段的合规审核流程

- [x] Task 19: 创建地区合规 Skill
  - [x] SubTask 19.1: 编写北美市场合规清单（版权、隐私、政治正确、种族议题）
  - [x] SubTask 19.2: 编写欧洲市场合规清单（GDPR、版权法、文化多样性）
  - [x] SubTask 19.3: 编写东南亚市场合规清单（宗教、王室形象、地区差异）
  - [x] SubTask 19.4: 编写中东市场合规清单（伊斯兰教规范、性别规范）
  - [x] SubTask 19.5: 编写平台政策合规（YouTube、TikTok、Instagram 社区准则）

- [x] Task 20: 创建文化敏感性 Skill
  - [x] SubTask 20.1: 编写宗教禁忌清单（佛教、伊斯兰教、印度教等）
  - [x] SubTask 20.2: 编写地域偏见与刻板印象检查清单
  - [x] SubTask 20.3: 编写文化符号使用规范

- [x] Task 21: 创建品牌安全 Skill
  - [x] SubTask 21.1: 编写广告主红线清单
  - [x] SubTask 21.2: 编写版权规则（音乐、图片、视频素材的版权检查）
  - [x] SubTask 21.3: 编写品牌声誉风险评估标准

- [x] Task 22: 创建剧本审核 Skill
  - [x] SubTask 22.1: 编写叙事结构审核清单（完整性、连贯性、节奏感）
  - [x] SubTask 22.2: 编写角色一致性检查（人物行为逻辑、性格连贯）
  - [x] SubTask 22.3: 编写审核报告格式

- [x] Task 23: 创建美术审核 Skill
  - [x] SubTask 23.1: 编写视觉一致性审核清单（色调统一、风格连贯）
  - [x] SubTask 23.2: 编写版权排查清单
  - [x] SubTask 23.3: 编写审核报告格式

- [x] Task 24: 创建提示词审核 Skill
  - [x] SubTask 24.1: 编写 Seedance 提示词质量审核清单（六步公式完整性、运镜合理性、约束充分性）
  - [x] SubTask 24.2: 编写动态质量审核标准（运动流畅性、物理准确性、面部稳定性）
  - [x] SubTask 24.3: 编写审核报告格式

- [x] Task 25: 创建市场洞察 Skill
  - [x] SubTask 25.1: 编写目标市场分析框架（受众画像、内容偏好、平台特征）
  - [x] SubTask 25.2: 编写竞品对标方法
  - [x] SubTask 25.3: 编写趋势预测指南

- [x] Task 26: 创建合规相关输出模板（5 个）
  - [x] SubTask 26.1: 创建 `00-compliance-precheck.md`（Gate 0 合规预检）
  - [x] SubTask 26.2: 创建 `01-compliance-script-report.md`（Gate 1 剧本合规报告）
  - [x] SubTask 26.3: 创建 `02-compliance-visual-report.md`（Gate 2 视觉合规报告）
  - [x] SubTask 26.4: 创建 `03-compliance-storyboard-report.md`（Gate 3 分镜合规报告）
  - [x] SubTask 26.5: 创建 `04-compliance-final-report.md`（最终合规报告）

# Task Dependencies

- Task 2 (SKILL.md) depends on Task 1 (目录结构)
- Task 3 (Producer) depends on Task 2 (SKILL.md)
- Task 4 (Director) depends on Task 3 (Producer)
- Task 5 (项目管理 Skill) depends on Task 1 (目录结构)
- Task 6 (导演讲戏 Skill) depends on Task 1 (目录结构)
- Task 7 (项目简报模板) depends on Task 1 (目录结构)
- Task 8 (导演分析模板) depends on Task 1 (目录结构)
- Tasks 5-8 can be parallelized with Tasks 3-4
- Task 9 (Art Director) depends on Task 4 (Director)
- Task 10 (Storyboard Artist) depends on Task 4 (Director)
- Tasks 11-14 (执行层 Skills) depend on Task 1 (目录结构)，可并行
- Tasks 15-17 (执行层模板) depend on Task 1 (目录结构)，可并行
- Task 18 (Compliance Officer) depends on Task 3 (Producer)
- Tasks 19-21 (合规 Skills) depend on Task 1 (目录结构)，可并行
- Tasks 22-25 (审核 Skills + 市场洞察) depend on Task 1 (目录结构)，可并行
- Task 26 (合规模板) depend on Task 1 (目录结构)

# Parallelization Plan

**Wave 1** (先执行): Task 1 (目录结构)
**Wave 2** (并行): Task 2 (SKILL.md) + Tasks 5-8 (Phase 0-1 Skills 和模板)
**Wave 3** (并行): Task 3 (Producer) + Task 4 (Director) + Tasks 11-17 (执行层 Skills 和模板) + Tasks 18-26 (合规层全部)
**Wave 4**: Task 9 (Art Director) + Task 10 (Storyboard Artist)
