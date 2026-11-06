# Tasks

## Batch 1: 新增 Agent 和 Skill 文件

- [x] Task 1: 创建 Script Curator Agent（剧本策展人）
  - [x] SubTask 1.1: 编写角色定义（独立 Agent，不属于 L1-L3 层级，作为辅助服务）
  - [x] SubTask 1.2: 编写核心职责（网络搜索剧本、AI 生成剧本、整理候选列表）
  - [x] SubTask 1.3: 编写剧本获取策略（WebSearch 关键词组合、题材分类、爆款公式）
  - [x] SubTask 1.4: 编写剧本质量初筛标准（长度、完整性、可执行性）
  - [x] SubTask 1.5: 编写输出格式（候选剧本列表 + 推荐理由）

- [x] Task 2: 创建 Quality Assessor Agent（质量评估师）
  - [x] SubTask 2.1: 编写角色定义（独立 Agent，作为质量守门人）
  - [x] SubTask 2.2: 编写 Phase 0 评分标准（5 维度，每项 20 分，满分 100）
  - [x] SubTask 2.3: 编写 Phase 1 评分标准（5 维度，满分 100）
  - [x] SubTask 2.4: 编写 Phase 2 评分标准（4 维度，满分 100）
  - [x] SubTask 2.5: 编写 Phase 3 评分标准（5 维度，满分 100）
  - [x] SubTask 2.6: 编写评分等级定义（优秀≥85 / 良好≥70 / 及格≥60 / 不及格<60）
  - [x] SubTask 2.7: 编写扣分项优化建议提取规则

- [x] Task 3: 创建剧本获取 Skill
  - [x] SubTask 3.1: 编写技能定位与触发条件
  - [x] SubTask 3.2: 编写 WebSearch 搜索策略（关键词模板、题材分类、平台定向）
  - [x] SubTask 3.3: 编写 AI 剧本生成指南（爆款公式、题材模板、长度规范）
  - [x] SubTask 3.4: 编写剧本初筛标准
  - [x] SubTask 3.5: 编写候选剧本整理格式

- [x] Task 4: 创建质量打分 Skill
  - [x] SubTask 4.1: 编写技能定位与触发条件
  - [x] SubTask 4.2: 编写通用评分流程（读取产出 → 逐维度打分 → 计算总分 → 提取建议）
  - [x] SubTask 4.3: 编写每个维度的评分细则（具体扣分条件和加分条件）
  - [x] SubTask 4.4: 编写评分报告格式
  - [x] SubTask 4.5: 编写反馈日志格式（扣分项 → 优化建议 → 优先级）

- [x] Task 5: 创建循环控制 Skill
  - [x] SubTask 5.1: 编写技能定位与触发条件
  - [x] SubTask 5.2: 编写循环启动流程（初始化参数、设置循环次数、设置质量阈值）
  - [x] SubTask 5.3: 编写单轮循环流程（获取剧本 → Phase 0-3 → 评分 → 记录）
  - [x] SubTask 5.4: 编写循环终止条件（次数达标 / 连续低分 / 用户中断）
  - [x] SubTask 5.5: 编写反馈应用逻辑（读取上轮反馈 → 调整本轮策略）
  - [x] SubTask 5.6: 编写汇总报告生成逻辑

## Batch 2: 输出模板

- [x] Task 6: 创建候选剧本库模板
  - [x] SubTask 6.1: 编写元信息区（搜索时间、搜索关键词、结果数量）
  - [x] SubTask 6.2: 编写候选剧本列表格式（序号、标题、题材、来源、摘要、推荐理由、评分）
  - [x] SubTask 6.3: 编写选中剧本的详细信息区

- [x] Task 7: 创建质量评估报告模板
  - [x] SubTask 7.1: 编写元信息区（项目名称、Phase、评估时间、总分）
  - [x] SubTask 7.2: 编写各维度评分明细表
  - [x] SubTask 7.3: 编写扣分项详细说明
  - [x] SubTask 7.4: 编写优化建议列表（按优先级排序）
  - [x] SubTask 7.5: 编写评分等级判定

- [x] Task 8: 创建循环汇总报告模板
  - [x] SubTask 8.1: 编写元信息区（循环次数、开始时间、结束时间）
  - [x] SubTask 8.2: 编写每轮评分对比表（轮次、总分、各 Phase 分数、剧本标题）
  - [x] SubTask 8.3: 编写最佳案例区（最高分轮次的完整产出摘要）
  - [x] SubTask 8.4: 编写共性问题区（多轮反复出现的扣分项）
  - [x] SubTask 8.5: 编写改进建议区（系统级优化建议）

## Batch 3: 修改现有文件

- [x] Task 9: 修改 SKILL.md — 扩展路由规则和架构
  - [x] SubTask 9.1: 在指令路由规则表中新增 3 条路由（自动循环/搜索剧本/质量评分）
  - [x] SubTask 9.2: 在系统架构图中新增 Script Curator 和 Quality Assessor
  - [x] SubTask 9.3: 新增"自动循环模式"使用指南章节
  - [x] SubTask 9.4: 更新 Agent-Skill 加载规则表
  - [x] SubTask 9.5: 更新文件结构树

- [x] Task 10: 修改 Producer Agent — 新增循环调度逻辑
  - [x] SubTask 10.1: 新增"循环模式"核心职责
  - [x] SubTask 10.2: 新增循环调度工作流程（Step 1-7）
  - [x] SubTask 10.3: 新增对 Script Curator 和 Quality Assessor 的调度逻辑
  - [x] SubTask 10.4: 新增循环终止判断逻辑

# Task Dependencies

- Tasks 1-5（新增 Agent 和 Skill）互相独立，可并行
- Tasks 6-8（输出模板）互相独立，可并行
- Task 9（修改 SKILL.md）依赖 Tasks 1-5（需要知道新增的 Agent 和 Skill 名称）
- Task 10（修改 Producer）依赖 Tasks 1-2（需要知道新增 Agent 的接口）

# Parallelization Plan

**Wave 1**: Tasks 1-8（全部并行）
**Wave 2**: Tasks 9-10（依赖 Wave 1 完成）
