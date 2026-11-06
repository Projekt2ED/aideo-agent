# Art Design Skill - 美术设计技能

**版本：1.0**
**角色：Art Director（美术总监）**
**层级：执行层**

---

## 1. 技能定位

负责人物造型和场景美术的视觉设计，产出 Seedance 可用的图片提示词。

本技能是视觉创意的核心执行单元，将 Director 的视觉指导转化为具体的、可执行的提示词，为后续 Seedance 分镜提供统一的视觉素材参考。

---

## 2. 触发条件

- Gate 1（导演分析审核）通过后
- Director 发来视觉指导文档（`outputs/01-director-analysis.md` 中的视觉风格部分）
- 角色清单和场景清单已确认

---

## 3. 输入

| 输入项 | 来源 | 格式 |
|--------|------|------|
| Director 视觉指导 | `outputs/01-director-analysis.md` | Markdown |
| 角色清单 | Director 分析中的角色设定 | 列表 |
| 场景清单 | Director 分析中的场景设定 | 列表 |
| 视觉风格标准 | `skills/visual-standards-skill.md` | 参考文档 |

---

## 4. 执行步骤

### Step 1: 人物视觉设计

为每个主要角色设计造型提示词，包含以下维度：

#### 1.1 面部特征设计
```
面部特征提示词要素：
- 年龄段：young / middle-aged / elderly
- 面部轮廓：angular jaw / soft features / high cheekbones
- 眼睛：piercing eyes / gentle gaze / determined look
- 发型：flowing hair / slicked back / messy bun / short cropped
- 特征标记：freckles / beauty mark / scar / glasses
```

#### 1.2 服装设计
```
服装提示词要素：
- 服装类型：casual wear / formal suit / traditional dress / armor
- 颜色方案：muted tones / vibrant colors / monochrome / earth tones
- 材质质感：silk / leather / denim / cotton / metallic
- 配饰：jewelry / watch / hat / scarf / gloves
- 风格标签：modern / vintage / futuristic / bohemian / minimalist
```

#### 1.3 道具设计
```
道具提示词要素：
- 功能性道具：laptop / phone / weapon / tool / book
- 标志性道具：signature item / personal artifact / symbol
- 状态：pristine / weathered / glowing / broken
```

#### 1.4 气质与表情
```
气质提示词要素：
- 基础气质：confident / mysterious / approachable / intimidating
- 默认表情：slight smile / serious / contemplative / fierce
- 肢体语言：relaxed posture / tense / elegant / powerful
```

#### 1.5 完整人物提示词模板
```
[Age] [Gender] with [facial features], wearing [clothing description] in [color scheme], 
[accessories], holding/with [props], [expression], [posture], [lighting style], 
[background context], photorealistic, cinematic, high detail
```

#### 1.6 输出要求：整合式纯中文

**每个人物只输出一个完整的中文提示词，不再拆分为面部/服装/道具/气质单独输出。**

输出格式：
```
**[角色名] — [状态描述]**

[完整的中文提示词，包含面部+服装+道具+气质+光影+风格+约束，一段话]
```

示例：
```
**顾北 — 赘婿状态**

一位二十多岁的中国年轻男子，棱角分明的下颌线，深邃的眼眸中透着冷厉的锋芒，黑色短发微微遮住额头。身穿略显宽大的旧灰色西装外套，内搭褪色的白色衬衫。气质沉稳内敛却暗藏锋芒，双手交叠安静地站立。柔和的室内灯光，电影构图，照片级写实，高细节，4K。
```

---

### Step 2: 场景美术设计

为每个关键场景设计环境提示词：

#### 2.1 环境基础
```
环境提示词要素：
- 地点类型：indoor / outdoor / underground / aerial
- 空间尺度：intimate / medium / vast / epic
- 建筑风格：modern / classical / industrial / organic / futuristic
- 自然元素：vegetation / water / rock / sky / clouds
```

#### 2.2 光影设计
```
光影提示词要素：
- 主光源：natural sunlight / artificial light / mixed lighting
- 光线方向：front lighting / side lighting / back lighting / top lighting
- 光线质量：soft diffused / hard directional / dappled / volumetric
- 阴影：deep shadows / soft shadows / dramatic contrast
```

#### 2.3 氛围营造
```
氛围提示词要素：
- 天气：clear sky / overcast / rainy / foggy / stormy
- 时间感：dawn / morning / noon / afternoon / dusk / night
- 情绪基调：serene / tense / mysterious / warm / cold / dramatic
- 粒子效果：dust particles / mist / rain drops / snow / sparks
```

#### 2.4 完整场景提示词模板
```
[Location type] [specific place], [architectural/natural features], 
[lighting description with direction and quality], [atmospheric effects], 
[time of day], [weather], [mood], [color palette], 
photorealistic, cinematic composition, depth of field, high detail
```

#### 2.5 输出要求：整合式纯中文

**每个场景只输出一个完整的中文提示词，不再拆分为环境/光影/氛围单独输出。**

输出格式：
```
**[场景名] — [氛围描述]**

[完整的中文提示词，包含环境+光影+氛围+镜头+风格+约束，一段话]
```

---

### Step 3: 视觉风格统一

确保所有设计遵循统一标准：

#### 3.1 风格一致性检查
- [ ] 所有角色遵循相同的美术风格（写实/半写实/卡通）
- [ ] 色彩方案在场景间保持协调
- [ ] 光影处理风格统一
- [ ] 材质渲染标准一致

#### 3.2 色调统一
- 确定项目的主色调（暖色/冷色/中性）
- 为不同情绪场景定义色彩变体
- 确保角色服装与场景色调协调

#### 3.3 参考 visual-standards-skill
- 使用标准化的色彩、光影、材质术语
- 确保提示词符合 Seedance 2.0 的最佳实践

---

### Step 4: 输出人物提示词和场景提示词

按规范格式输出：

#### 4.1 人物提示词输出
- 文件：`outputs/02-character-prompts.md`
- 包含：每个角色的完整提示词、分解提示词、参考风格说明

#### 4.2 场景提示词输出
- 文件：`outputs/02-scene-prompts.md`
- 包含：每个场景的完整提示词、光影方案、氛围说明

---

## 5. 输出格式

### 输出文件
| 文件 | 内容 | 用途 |
|------|------|------|
| `outputs/02-character-prompts.md` | 人物造型提示词 | Seedance 图片生成参考 |
| `outputs/02-scene-prompts.md` | 场景美术提示词 | Seedance 图片生成参考 |

### 输出规范
- 提示词使用纯中文
- 每个提示词是一个完整的段落，不拆分
- 提示词长度控制在 50-100 字
- 只提供完整版格式，不提供分解版

---

## 6. 质量标准

### 6.1 提示词质量
- [ ] 提示词具体、明确，无歧义
- [ ] 可直接复制到 Seedance 使用
- [ ] 包含足够的视觉细节
- [ ] 长度适中（50-100词）

### 6.2 风格一致性
- [ ] 所有角色风格统一
- [ ] 所有场景风格统一
- [ ] 角色与场景风格协调
- [ ] 色彩方案一致

### 6.3 角色辨识度
- [ ] 每个角色有独特的视觉标识
- [ ] 角色间造型差异明显
- [ ] 标志性道具/配饰突出

### 6.4 可执行性
- [ ] 提示词可直接用于 Seedance 图片生成
- [ ] 无需额外解释即可理解
- [ ] 符合 Seedance 2.0 提示词规范

---

## 7. Gate 2 审核清单

完成设计后，必须通过以下审核：

- [ ] 所有主要角色均有完整提示词
- [ ] 所有关键场景均有完整提示词
- [ ] 提示词可直接用于 Seedance
- [ ] 视觉风格统一
- [ ] 角色造型有辨识度
- [ ] 与 Director 视觉指导一致
- [ ] 输出文件格式规范

---

## 8. 工作流程

```
接收 Director 视觉指导
    ↓
分析角色清单和场景清单
    ↓
参考 visual-standards-skill
    ↓
设计人物造型提示词
    ↓
设计场景美术提示词
    ↓
统一视觉风格
    ↓
输出 02-character-prompts.md
    ↓
输出 02-scene-prompts.md
    ↓
Gate 2 审核
    ↓
通过 → 进入 Phase 3
不通过 → 修正后重新审核
```

---

## 9. 常见问题处理

### Q1: 角色描述过于抽象怎么办？
A: 将抽象描述转化为具体视觉元素。例如"神秘感"→"深色斗篷、阴影遮面、低饱和度色调"

### Q2: 场景设定模糊怎么办？
A: 参考同类影视作品的场景风格，补充具体细节

### Q3: 多个角色风格冲突怎么办？
A: 以主角风格为基准，其他角色在其基础上做差异化调整

---

## 10. 参考资源

- `skills/visual-standards-skill.md` - 视觉标准参考
- `skills/seedance-storyboard-skill.md` - Seedance 提示词规范
- `outputs/01-director-analysis.md` - Director 视觉指导
