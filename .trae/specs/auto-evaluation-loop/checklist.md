# Checklist

## 新增 Agent 文件
- [x] `agents/script-curator.md` 存在且内容完整
- [x] `agents/quality-assessor.md` 存在且内容完整
- [x] Script Curator 角色定义清晰（独立 Agent，辅助服务）
- [x] Quality Assessor 角色定义清晰（独立 Agent，质量守门人）

## 新增 Skill 文件
- [x] `skills/script-sourcing-skill.md` 存在且内容完整
- [x] `skills/quality-scoring-skill.md` 存在且内容完整
- [x] `skills/loop-controller-skill.md` 存在且内容完整
- [x] 每个 Skill 包含：技能定位、触发条件、执行步骤、输出格式

## 剧本获取能力
- [x] Script Curator 支持 WebSearch 搜索热门剧本
- [x] Script Curator 支持 AI 生成测试剧本
- [x] Script Curator 支持用户指定剧本来源
- [x] 剧本初筛标准明确（长度、完整性、可执行性）
- [x] 候选剧本列表格式规范

## 质量评分体系
- [x] Phase 0 评分标准完整（5 维度，满分 100）
- [x] Phase 1 评分标准完整（5 维度，满分 100）
- [x] Phase 2 评分标准完整（4 维度，满分 100）
- [x] Phase 3 评分标准完整（5 维度，满分 100）
- [x] 评分等级定义明确（优秀≥85 / 良好≥70 / 及格≥60 / 不及格<60）
- [x] 扣分项优化建议提取规则明确

## 循环控制能力
- [x] 支持用户指定循环次数（默认 3 轮）
- [x] 单轮循环流程完整（获取剧本 → Phase 0-3 → 评分 → 记录）
- [x] 质量阈值终止条件明确（总分 ≥ 85 标记标杆）
- [x] 连续低分终止条件明确（连续 2 轮 < 60 暂停）
- [x] 反馈应用逻辑明确（读取上轮反馈 → 调整本轮策略）

## 输出模板
- [x] `outputs/05-script-candidates.md` 模板完整
- [x] `outputs/06-quality-report.md` 模板完整
- [x] `outputs/07-loop-summary.md` 模板完整
- [x] 每个模板包含元信息区和内容结构

## 现有文件修改
- [x] SKILL.md 路由规则表新增 3 条路由
- [x] SKILL.md 系统架构图新增 Script Curator 和 Quality Assessor
- [x] SKILL.md 新增"自动循环模式"使用指南
- [x] SKILL.md Agent-Skill 加载规则表已更新
- [x] SKILL.md 文件结构树已更新
- [x] Producer Agent 新增循环模式核心职责
- [x] Producer Agent 新增循环调度工作流程
- [x] Producer Agent 新增循环终止判断逻辑

## 集成验证
- [x] 新增 Agent 不破坏现有 L1-L3 层级关系
- [x] 新增 Skill 不与现有 13 个 Skill 冲突
- [x] 循环模式不影响单次运行模式的正常使用
- [x] 评分系统不影响 Gate 审核机制的正常运行
