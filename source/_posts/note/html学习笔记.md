---
title: html学习笔记
date: 2025-04-21 14:00:53
updated: 2025-04-21 14:14:13
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/html-notes/'
---
## 一、HTML 基础：构建网页骨架

### 1.1 HTML 基本结构


```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>我的第一个HTML页面</title>
  </head>
  <body>
    <!-- 页面内容 -->
  </body>
</html>
```

- **关键标签解析**：
    - `<!DOCTYPE html>`：声明 HTML5 文档类型
    - `<html lang="zh-CN">`：定义网页语言（有助于 SEO 和屏幕阅读器）
    - `<meta charset="UTF-8">`：设置字符编码（避免乱码）
    - `<meta name="viewport">`：响应式设计必备，控制视口缩放

### 1.2 文本与排版标签

#### 标题标签（语义化层级）


```html
<h1>主标题（最大层级）</h1>
<h2>副标题</h2>
...
<h6>最小标题</h6>
```

- 建议：一个页面仅使用 1 个`<h1>`，层级需连续（避免 h1→h3 跳跃）

#### 段落与换行

```html
<p>这是一个段落，段落内文本会自动换行<br>如需强制换行使用br标签</p>
```
#### 强调与格式化

| 标签         | 语义       | 示例                    |
| ---------- | -------- | --------------------- |
| `<strong>` | 重要内容（加粗） | <strong>重点</strong>   |
| `<em>`     | 强调语气（斜体） | <em>强调</em>           |
| `<code>`   | 代码片段     | <code>let a=1;</code> |
| `<mark>`   | 高亮文本     | <mark>高亮</mark>       |

## 二、HTML 核心标签：丰富页面内容

### 2.1 媒体元素

#### 图片标签（关键属性）

```html
<img 
  src="cat.jpg"        <!-- 图片路径 -->
  alt="可爱猫咪"       <!-- 替代文本（无障碍必备） -->
  width="300"          <!-- 宽度（建议用CSS控制） -->
  loading="lazy"       <!-- 懒加载（优化性能） -->
  title="点击查看大图"  <!-- 提示文本 -->
>
```

- 最佳实践：使用 WebP 格式图片，配合`<picture>`标签实现响应式图片

#### 视频与音频

```html
<video controls width="640" poster="preview.jpg">
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频播放
</video>

<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
</audio>
```

### 2.2 超链接与导航

#### 基础链接


```html
<a 
  href="https://example.com"   <!-- 目标URL -->
  target="_blank"              <!-- 新窗口打开 -->
  rel="noopener noreferrer"     <!-- 安全属性 -->
>跳转至示例网站</a>
```

#### 锚点链接（页面内导航）

```html
<a href="#section2">跳转到第二节</a>

<h2 id="section2">第二节内容</h2>
```

### 2.3 列表系统

#### 无序列表（项目符号）

```html
<ul>
  <li>列表项1</li>
  <li>列表项2</li>
</ul>
```

#### 有序列表（编号列表）

```html
<ol type="A"> <!-- 可选类型: 1/A/a/i/I -->
  <li>第一项</li>
  <li>第二项</li>
</ol>
```

#### 自定义列表


```html
<dl>
  <dt>术语</dt>
  <dd>定义内容</dd>
</dl>
```

## 三、HTML 表单：交互核心

### 3.1 表单基础结构


```html
<form 
  action="/submit"       <!-- 提交地址 -->
  method="POST"          <!-- 提交方法 -->
  enctype="multipart/form-data" <!-- 文件上传需设置 -->
  autocomplete="on"      <!-- 自动填充 -->
>
  <!-- 表单控件 -->
</form>
```

### 3.2 常用表单控件

#### 输入框


```html
<!-- 单行文本 -->
<input 
  type="text" 
  name="username" 
  placeholder="请输入用户名" 
  required       <!-- 必填项 -->
  pattern="^[a-z0-9]{6,}$" <!-- 正则验证 -->
>

<!-- 密码框 -->
<input type="password" name="password">

<!-- 复选框 -->
<input type="checkbox" name="hobby" value="reading" checked> 阅读

<!-- 单选按钮（需同一name值） -->
<input type="radio" name="gender" value="male"> 男
```

#### 下拉菜单


```html
<select name="country" multiple> <!-- multiple允许多选 -->
  <option value="cn" selected>中国</option>
  <option value="us">美国</option>
</select>
```

#### 文本域


```html
<textarea 
  name="feedback" 
  rows="5" 
  cols="30" 
  placeholder="请输入反馈内容"
></textarea>
```

### 3.3 无障碍优化

- 使用`<label>`标签关联表单控件（点击文本可激活输入框）

```html
<label for="email">邮箱地址：</label>
<input type="email" id="email" name="email">
```

- 为必填项添加`required`属性
- 提供实时验证提示（配合 JavaScript）

## 四、HTML5 语义化：提升可访问性

### 4.1 语义化布局标签

|标签|用途描述|
|---|---|
|`<header>`|页面头部（导航、标题）|
|`<nav>`|导航菜单区域|
|`<main>`|主内容区域（唯一）|
|`<section>`|独立章节（可重复使用）|
|`<article>`|独立文章 / 内容块|
|`<aside>`|侧边栏（相关但非核心）|
|`<footer>`|页面底部（版权信息）|


**示例结构**：

```html
<header>
  <nav>
    <ul>
      <li><a href="#home">首页</a></li>
    </ul>
  </nav>
</header>

<main>
  <section>
    <article>
      <h2>文章标题</h2>
      <p>正文内容</p>
    </article>
  </section>
</main>

<footer>版权所有 © 2025</footer>
```

### 4.2 增强可访问性

- 为多媒体添加`<figcaption>`图文说明

```html
<figure>
  <img src="graph.png" alt="数据图表">
  <figcaption>2024年销售趋势图</figcaption>
</figure>
```

- 使用`<abbr>`标签定义缩写

```html
<abbr title="超文本标记语言">HTML</abbr>
```

## 五、实战项目：猫咪相册应用（参考 FreeCodeCamp 课程）

### 项目结构规划

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <title>猫咪相册</title>
    <style>
      /* 后续添加CSS样式 */
    </style>
  </head>
  <body>
    <header>
      <h1>可爱猫咪合集</h1>
    </header>

    <main>
      <section class="gallery">
        <figure>
          <img src="cat1.jpg" alt="短毛猫玩耍">
          <figcaption>活泼的短毛猫</figcaption>
        </figure>
        <!-- 重复添加更多figure标签 -->
      </section>
    </main>
  </body>
</html>
```

### 关键知识点应用

1. 使用语义化标签构建页面结构
2. 图片标签的`alt`属性确保无障碍
3. 通过`<figure>`+`<figcaption>`实现图文分组
4. 为后续 CSS 布局预留类名（如`.gallery`）

## 六、开发工具与最佳实践

### 6.1 推荐工具

- 代码编辑器：VSCode（安装 Live Server 插件实时预览）
- 调试工具：浏览器开发者工具（F12）
- 验证工具：W3C HTML 验证器

### 6.2 最佳实践

1. 始终使用小写标签名（HTML5 不区分大小写，但统一小写更规范）
2. 为标签添加闭合符（即使空标签如`<img>`也需自闭合）
3. 避免使用过时标签（如`<center>`，改用 CSS 实现布局）
4. 定期清理无效注释和冗余代码

## 七、常见问题与解决方案

|问题现象|可能原因|解决方案|
|---|---|---|
|图片无法显示|路径错误 / 文件缺失|检查`src`路径是否正确|
|表单提交失败|`action`地址错误 / 方法不匹配|确认后端接口地址和`method`类型|
|文字乱码|字符编码错误|确保`<meta charset>`设置正确|
|页面不响应式|缺少视口元标签|添加`<meta name="viewport">`标签|