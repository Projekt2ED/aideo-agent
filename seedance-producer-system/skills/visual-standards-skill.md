# Visual Standards Skill - 视觉标准技能

**版本：1.0**
**类型：参考文档**
**被引用：art-design-skill.md**

---

## 1. 技能定位

定义视觉设计的色彩、光影、材质标准，为 Art Director 提供统一的视觉语言规范。

本技能是视觉设计的基础设施，确保所有视觉元素在风格、质量、表达上保持一致。

---

## 2. 触发条件

- Art Director 进行视觉设计时调用
- 需要统一色彩、光影、材质术语时参考
- Seedance 提示词编写时作为标准参考

---

## 3. 色彩规范

### 3.1 色调分类

#### 暖色调 (Warm Tones)
```
适用场景：温馨、亲密、怀旧、浪漫
提示词模板：
- warm color palette, golden tones, amber highlights
- soft warm lighting, cozy atmosphere
- honey-colored, sun-kissed, warm earth tones

具体色值参考：
- 金色系：golden, amber, honey, wheat, sand
- 橙色系：tangerine, copper, rust, terracotta, burnt orange
- 红色系：crimson, scarlet, burgundy, wine, rose
- 黄色系：marigold, saffron, mustard, champagne, cream
```

#### 冷色调 (Cool Tones)
```
适用场景：科技、神秘、紧张、未来感
提示词模板：
- cool color palette, blue tones, silver highlights
- cool lighting, atmospheric, moody
- steel blue, icy, frost, cool shadows

具体色值参考：
- 蓝色系：sapphire, cobalt, navy, cerulean, azure
- 紫色系：violet, lavender, plum, mauve, indigo
- 绿色系：emerald, jade, teal, mint, seafoam
- 灰色系：slate, pewter, ash, charcoal, graphite
```

#### 中性色调 (Neutral Tones)
```
适用场景：经典、优雅、专业、百搭
提示词模板：
- neutral color palette, balanced tones, understated elegance
- muted colors, desaturated, sophisticated
- earthy, natural, organic tones

具体色值参考：
- 米色系：beige, ivory, cream, ecru, linen
- 棕色系：tan, camel, chocolate, espresso, mahogany
- 灰色系：taupe, stone, pewter, dove, silver
- 黑白系：jet black, charcoal, off-white, pearl, snow
```

### 3.2 色温标准

| 色温类型 | 数值范围 | 视觉效果 | Seedance 提示词 |
|----------|----------|----------|-----------------|
| 极暖 | 2000-3000K | 烛光、日落 | very warm, candlelight, golden hour |
| 暖色 | 3000-4500K | 白炽灯、晨光 | warm tones, soft warm light |
| 中性 | 4500-5500K | 日光、荧光灯 | neutral lighting, balanced |
| 冷色 | 5500-7000K | 阴天、阴影 | cool tones, overcast light |
| 极冷 | 7000-10000K | 蓝调时刻 | very cool, blue hour, icy |

### 3.3 对比度标准

| 对比度级别 | 描述 | 适用场景 | 提示词 |
|------------|------|----------|--------|
| 低对比 | 柔和、梦幻 | 梦境、回忆、浪漫 | soft contrast, dreamy, low contrast |
| 中对比 | 自然、平衡 | 日常、对话、叙事 | balanced contrast, natural |
| 高对比 | 戏剧、强烈 | 冲突、高潮、悬疑 | high contrast, dramatic, stark |
| 极高对比 | 电影级 | 动作、惊悚、黑色电影 | cinematic contrast, film noir |

### 3.4 饱和度指南

| 饱和度级别 | 描述 | 情绪表达 | 提示词 |
|------------|------|----------|--------|
| 低饱和 | 灰调、旧照片 | 怀旧、忧郁、复古 | desaturated, muted, vintage |
| 中饱和 | 自然色彩 | 真实、平衡 | natural colors, balanced saturation |
| 高饱和 | 鲜艳、生动 | 活力、欢乐、童趣 | vibrant, saturated, vivid |
| 极高饱和 | 超现实 | 梦幻、奇幻、艺术 | hyper-saturated, psychedelic |

---

## 4. 光影体系

### 4.1 自然光 (Natural Lighting)

#### Golden Hour（黄金时刻）
```
时间：日出后/日落前 1 小时
特征：低角度、长阴影、暖色调、柔和光线
Seedance 提示词：
- golden hour lighting, warm sunlight, long shadows
- soft golden glow, hour before sunset
- dramatic low-angle sunlight, amber tones
```

#### Blue Hour（蓝色时刻）
```
时间：日出前/日落后 30 分钟
特征：深蓝色调、柔和漫射、神秘氛围
Seedance 提示词：
- blue hour, twilight lighting, deep blue tones
- pre-dawn atmosphere, soft diffused light
- twilight glow, dusky, ethereal blue
```

#### Overcast（阴天）
```
特征：均匀柔光、无硬阴影、色彩饱和
Seedance 提示词：
- overcast sky, soft diffused lighting
- even illumination, no harsh shadows
- cloudy sky, natural softbox effect
```

#### Direct Sunlight（直射阳光）
```
特征：强烈对比、硬阴影、高亮度
Seedance 提示词：
- bright sunlight, harsh shadows, high contrast
- direct sunlight, strong directional light
- midday sun, exposed highlights, deep shadows
```

### 4.2 人工光 (Artificial Lighting)

#### Neon Light（霓虹灯）
```
特征：彩色光源、反射强烈、赛博朋克
Seedance 提示词：
- neon lighting, colorful neon glow
- neon reflections, cyberpunk atmosphere
- vibrant neon signs, urban night scene
```

#### Candlelight（烛光）
```
特征：暖色调、闪烁、亲密氛围
Seedance 提示词：
- candlelight, flickering warm glow
- soft candle illumination, intimate atmosphere
- warm candlelight, gentle dancing shadows
```

#### Studio Light（影室灯）
```
特征：可控、专业、均匀
Seedance 提示词：
- studio lighting, professional illumination
- controlled light setup, even lighting
- three-point lighting, studio quality
```

#### Streetlight（路灯）
```
特征：暖黄光、局部照明、城市夜景
Seedance 提示词：
- streetlight glow, urban night lighting
- warm streetlamp, pool of light
- city lights, nocturnal atmosphere
```

### 4.3 氛围光 (Atmospheric Lighting)

#### Volumetric Light（体积光）
```
特征：可见光束、穿透感、戏剧性
Seedance 提示词：
- volumetric lighting, god rays, light beams
- visible light shafts, atmospheric haze
- dramatic light rays, dusty atmosphere
```

#### Rim Light（轮廓光）
```
特征：边缘发光、主体分离、立体感
Seedance 提示词：
- rim lighting, backlit silhouette
- edge lighting, subject separation
- glowing outline, halo effect
```

#### Backlight（逆光）
```
特征：剪影效果、光晕、情绪感
Seedance 提示词：
- backlighting, sun flare, lens flare
- backlit scene, glowing edges
- silhouette lighting, dramatic backlight
```

#### Practical Light（实景光源）
```
特征：场景内置光源、自然、真实
Seedance 提示词：
- practical lighting, in-scene light source
- lamp light, screen glow, window light
- motivated lighting, realistic illumination
```

---

## 5. 材质标准

### 5.1 皮肤质感

#### 写实皮肤
```
Seedance 提示词：
- realistic skin texture, natural pores, subtle blemishes
- lifelike skin, detailed skin texture, natural skin tone
- high-resolution skin detail, realistic complexion
```

#### 完美皮肤
```
Seedance 提示词：
- flawless skin, smooth complexion, porcelain skin
- perfect skin texture, airbrushed look
- luminous skin, dewy complexion
```

#### 粗糙皮肤
```
Seedance 提示词：
- weathered skin, rough texture, sun-damaged
- aged skin, wrinkles, character lines
- rugged complexion, textured skin
```

### 5.2 布料质感

#### 丝绸 (Silk)
```
Seedance 提示词：
- silk fabric, smooth sheen, flowing drape
- lustrous silk, elegant texture, light-catching
- silk material, gentle folds, soft reflections
```

#### 皮革 (Leather)
```
Seedance 提示词：
- leather texture, supple grain, subtle sheen
- genuine leather, detailed stitching, aged patina
- leather material, rich texture, tactile quality
```

#### 牛仔布 (Denim)
```
Seedance 提示词：
- denim fabric, visible weave, casual texture
- blue jeans material, rugged cotton, faded wash
- denim texture, sturdy fabric, classic look
```

#### 棉布 (Cotton)
```
Seedance 提示词：
- cotton fabric, soft texture, natural fiber
- woven cotton, breathable material, matte finish
- cotton weave, comfortable texture, organic feel
```

#### 金属丝织物 (Metallic Fabric)
```
Seedance 提示词：
- metallic fabric, shimmering texture, futuristic
- woven metal threads, reflective surface
- metallic cloth, iridescent, high-tech material
```

### 5.3 金属质感

#### 抛光金属 (Polished Metal)
```
Seedance 提示词：
- polished chrome, mirror-like surface, high reflection
- gleaming metal, flawless finish, reflective
- shiny metallic surface, perfect reflections
```

#### 哑光金属 (Matte Metal)
```
Seedance 提示词：
- matte metal finish, brushed texture, subtle sheen
- satin metal, low reflection, industrial
- matte metallic, soft finish, modern look
```

#### 锈蚀金属 (Rusted Metal)
```
Seedance 提示词：
- rusted metal, oxidized surface, aged patina
- corroded metal, weathered texture, decay
- rusted iron, patina, vintage metal
```

#### 拉丝金属 (Brushed Metal)
```
Seedance 提示词：
- brushed steel, directional texture, industrial
- brushed aluminum, fine lines, modern
- satin brushed metal, subtle grain, professional
```

### 5.4 玻璃质感

#### 透明玻璃 (Clear Glass)
```
Seedance 提示词：
- clear glass, transparent, clean reflections
- crystal clear, pure transparency, pristine
- glass surface, visible through, sharp clarity
```

#### 磨砂玻璃 (Frosted Glass)
```
Seedance 提示词：
- frosted glass, translucent, diffused light
- etched glass, privacy glass, soft blur
- frosted surface, light diffusion, subtle opacity
```

#### 彩色玻璃 (Stained Glass)
```
Seedance 提示词：
- stained glass, colorful panels, light filtering
- cathedral glass, leaded glass, vibrant colors
- decorative glass, patterned light, artistic
```

#### 破碎玻璃 (Broken Glass)
```
Seedance 提示词：
- shattered glass, cracked surface, fragments
- broken glass shards, splintered, fractured
- glass debris, cracked pattern, destructive
```

### 5.5 木质质感

#### 光滑木材 (Smooth Wood)
```
Seedance 提示词：
- polished wood, smooth grain, warm tones
- finished wood surface, refined texture, elegant
- lacquered wood, glossy finish, rich color
```

#### 粗糙木材 (Rough Wood)
```
Seedance 提示词：
- rough hewn wood, visible grain, natural
- raw timber, bark texture, rustic
- weathered wood, splintered, aged
```

#### 旧木材 (Aged Wood)
```
Seedance 提示词：
- aged wood, worn texture, patina
- antique wood, faded grain, character
- vintage timber, distressed, historical
```

---

## 6. 使用指南

### 6.1 如何使用本标准

1. **选择色调**：根据情绪和场景选择合适的色调分类
2. **确定光影**：根据时间和氛围选择光影方案
3. **指定材质**：根据物体特性选择材质提示词
4. **组合使用**：将色彩、光影、材质组合成完整提示词

### 6.2 提示词组合示例

```
场景：黄昏时分的咖啡馆内部

色彩：暖色调
光影：Golden Hour + 实景光源（咖啡馆灯光）
材质：木质桌面、陶瓷杯、棉布衣物

组合提示词：
Interior of a cozy café at golden hour, warm amber lighting 
streaming through large windows, polished wooden tables with 
natural grain, ceramic coffee cups, cotton napkins, soft 
practical lighting from hanging lamps, intimate atmosphere, 
warm color palette, cinematic, photorealistic
```

### 6.3 一致性检查清单

- [ ] 色温在场景内保持一致
- [ ] 光影方向在连续镜头中保持一致
- [ ] 材质渲染质量统一
- [ ] 对比度和饱和度符合情绪基调
- [ ] 色彩方案与整体风格协调

---

## 7. 与其他技能的关系

| 技能 | 关系 | 引用方式 |
|------|------|----------|
| art-design-skill | 被引用 | 色彩、光影、材质标准 |
| seedance-storyboard-skill | 被引用 | 提示词质量标准 |
| audio-music-skill | 无直接关系 | - |
