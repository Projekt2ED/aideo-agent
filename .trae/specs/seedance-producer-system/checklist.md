# Checklist

## 项目结构
- [x] `E:\PROJECT\seedance-producer-system\` 目录存在
- [x] `agents/` 子目录存在，包含 5 个 Agent 文件
- [x] `skills/` 子目录存在，包含 13 个 Skill 文件
- [x] `outputs/` 子目录存在，包含 10 个输出模板文件
- [x] `SKILL.md` 入口文件存在且格式正确（YAML frontmatter + Markdown body）
- [x] `package.json` 存在且包含必要元数据

## SKILL.md 入口文件
- [x] YAML frontmatter 包含 name、description、version 字段
- [x] description 包含功能描述和触发条件
- [x] 系统架构总览完整（5 Agent、13 Skill、4 Phase、4 Gate）
- [x] 指令路由规则表完整（6 种用户意图 → Agent 映射）
- [x] 使用指南清晰（启动新项目、查看状态、处理审核失败）
- [x] Agent-Skill 加载规则明确

## Agent 文件完整性
- [x] producer.md：L1 层级定义正确，Phase 0 流程完整，路由逻辑清晰
- [x] director.md：L2 层级定义正确，Phase 1 流程完整，Gate 1 自审标准存在
- [x] compliance-officer.md：L2 层级定义正确，独立于创意流程，一票否决权明确
- [x] art-director.md：L3 层级定义正确，Phase 2 流程完整
- [x] storyboard-artist.md：L3 层级定义正确，Phase 3 流程完整

## Agent 层级关系
- [x] Producer 控制所有 L2/L3 Agent
- [x] Director 被 Producer 控制，控制 L3 执行层
- [x] Compliance Officer 被 Producer 控制，审核所有 L3 产出
- [x] Art Director 被 Director 控制
- [x] Storyboard Artist 被 Director 控制

## Skill 文件完整性
- [x] 每个 Skill 文件包含：技能定位、触发条件、输入、执行步骤、输出格式、质量标准
- [x] project-management-skill.md：项目立项流程完整
- [x] market-intelligence-skill.md：市场分析框架完整
- [x] director-skill.md：剧本分析方法论和讲戏模板完整
- [x] script-analysis-review-skill.md：叙事结构审核清单完整
- [x] regional-compliance-skill.md：4 个目标市场（北美/欧洲/东南亚/中东）合规清单完整
- [x] cultural-sensitivity-skill.md：宗教禁忌、地域偏见检查清单完整
- [x] brand-safety-skill.md：广告主红线、版权规则完整
- [x] art-design-skill.md：人物/场景视觉设计规范完整
- [x] visual-standards-skill.md：色彩、光影、材质规范完整
- [x] art-direction-review-skill.md：视觉一致性审核清单完整
- [x] seedance-storyboard-skill.md：Seedance 2.0 六步公式、@引用系统、时间线提示词、8种运镜术语完整
- [x] seedance-prompt-review-skill.md：提示词质量审核清单完整
- [x] audio-music-skill.md：音效配乐指导规范完整

## Seedance 2.0 语法准确性
- [x] 六步公式（主体 + 动作 + 环境 + 镜头 + 风格 + 约束）描述准确
- [x] @引用系统（@image1、@video1、@audio1）语法正确
- [x] 时间线提示词格式（[0s]、[3s]）描述正确
- [x] 8 种标准运镜术语（推进/拉远/横摇/跟踪/环绕/航拍/手持/固定）含英文术语
- [x] 输入限制描述正确（图片最多9个、视频最多3个、音频最多3个、合计最多12个）
- [x] 万能画质约束模板存在
- [x] 至少 3 个完整示例（纯文本、多模态参考、时间线）

## 输出模板完整性
- [x] 每个模板包含：元信息区、内容结构、填写说明、审核清单
- [x] 00-project-brief.md：覆盖项目概述、目标市场、受众画像、竞品分析、资源需求、风险评估
- [x] 00-compliance-precheck.md：覆盖合规预判检查项
- [x] 01-director-analysis.md：覆盖叙事结构、人物清单、场景清单、情感弧线、镜头规划
- [x] 01-compliance-script-report.md：覆盖剧本合规审核项
- [x] 02-character-prompts.md：覆盖人物造型提示词
- [x] 02-scene-prompts.md：覆盖场景环境提示词
- [x] 02-compliance-visual-report.md：覆盖视觉合规审核项
- [x] 03-seedance-prompts.md：覆盖分镜 Seedance 提示词
- [x] 03-compliance-storyboard-report.md：覆盖分镜合规审核项
- [x] 04-compliance-final-report.md：覆盖最终合规审核项

## Gate 审核机制
- [x] Gate 0：市场分析 + 合规预判，通过条件明确
- [x] Gate 1：叙事结构 + 角色清单，通过条件明确
- [x] Gate 2：风格统一性 + 版权排查，通过条件明确
- [x] Gate 3：动态质量 + 地区合规，通过条件明确
- [x] 风险分级处理（P0/P1/P2）定义清晰

## 全球市场合规
- [x] 北美市场：版权、隐私、政治正确、种族议题覆盖
- [x] 欧洲市场：GDPR、版权法、文化多样性覆盖
- [x] 东南亚市场：宗教、王室形象、地区差异覆盖
- [x] 中东市场：伊斯兰教规范、性别规范覆盖
- [x] 平台政策：YouTube、TikTok、Instagram 社区准则覆盖

## 内容质量
- [x] 所有文件使用中文编写（技术术语保留英文）
- [x] 无虚构数据或虚假承诺
- [x] 内容基于 Seedance 2.0 真实能力和提示词规范
- [x] Agent 指令清晰、可执行，不模糊
- [x] Skill 步骤具体、有操作性，不空泛
