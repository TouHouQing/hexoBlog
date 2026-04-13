---
title: css学习笔记（快速了解版）
date: 2025-04-22 14:53:37
updated: 2025-04-22 14:57:19
categories:
  - Wiki
tags:
  - 笔记
wiki: true
top_img: false
permalink: 'wiki/css-quick-notes/'
---
#### 一、CSS 选择器

CSS 选择器用于选择 HTML 元素，以便为其应用样式。以下是常见的选择器类型：

1. **标签选择器**
    
    - 通过 HTML 标签名来选择元素。例如，`p` 选择器会选中页面中所有的 `<p>` 标签元素。
    
    ```css
    p {
        color: blue;
    }
    ```
    
2. **类选择器**
    
    - 以点号 `.` 开头，后面跟类名。HTML 元素可以通过 `class` 属性来使用这个类。
    
    ```html
    <p class="highlight">这是一个有高亮样式的段落。</p>
    ```
    
    
    ```css
    .highlight {
        background-color: yellow;
    }
    ```
    
    
3. **ID 选择器**
    
    - 以井号 `#` 开头，后面跟 ID 名。每个 HTML 元素的 `id` 属性值应该是唯一的。
    
    ```html
    <div id="header">这是页面头部。</div>
    ```
    
    
    ```css
    #header {
        height: 100px;
    }
    ```

4. **组合选择器**
    
    - **并集选择器**：用逗号分隔多个选择器，同时选择多个元素。
    
    ```css
    h1, h2, h3 {
        font-family: Arial;
    }
    ```    
    - **交集选择器**：将多个选择器连写在一起，选择同时满足这些条件的元素。
    
    ```css
    p.highlight {
        color: red;
    }
    ```
    
    - **后代选择器**：用空格分隔，选择某个元素的后代元素。
    
    ```html
    <div class="container">
        <p>这是容器内的段落。</p>
    </div>
    ```
    
    
    ```css
    .container p {
        font-size: 14px;
    }
    ```
    - **子选择器**：用大于号 `>` 分隔，只选择某个元素的直接子元素。
    ```html
    <ul>
        <li>直接子元素</li>
        <li>
            <ul>
                <li>非直接子元素</li>
            </ul>
        </li>
    </ul>
    ```
    
    
    ```css
    ul > li {
        list-style-type: square;
    }
    ```
    
#### 二、盒模型

盒模型是 CSS 中一个重要的概念，它描述了元素在页面中所占的空间大小。一个元素的盒模型由内容区（Content）、内边距（Padding）、边框（Border）和外边距（Margin）组成。

1. **内容区（Content）**
    - 元素实际包含的内容，如文本、图片等。可以通过 `width` 和 `height` 属性来设置内容区的大小。
2. **内边距（Padding）**
    
    - 内容区与边框之间的距离。可以使用 `padding-top`、`padding-right`、`padding-bottom`、`padding-left` 分别设置四个方向的内边距，也可以使用简写形式。
    
    ```css
    div {
        padding: 10px; /* 四个方向内边距都是 10px */
        padding: 10px 20px; /* 上下 10px，左右 20px */
        padding: 10px 20px 30px; /* 上 10px，左右 20px，下 30px */
        padding: 10px 20px 30px 40px; /* 上 10px，右 20px，下 30px，左 40px */
    }
    ```
    
    
3. **边框（Border）**
    
    - 围绕内容区和内边距的线条。可以使用 `border-width`、`border-style`、`border-color` 分别设置边框的宽度、样式和颜色，也可以使用简写形式。
    
    ```css
    div {
        border: 1px solid black;
    }
    ```
    
4. **外边距（Margin）**
    
    - 元素与其他元素之间的距离。和内边距类似，也有四个方向的外边距属性，同样可以使用简写形式。
    
    ```css
    div {
        margin: 10px;
    }
    ```
    
5. **box-sizing 属性**
    
    - 默认值是 `content-box`，此时元素的宽度和高度只包含内容区的大小，不包含内边距和边框。
    - `border-box` 值会让元素的宽度和高度包含内容区、内边距和边框，但不包含外边距。
    
    ```css
    div {
        box-sizing: border-box;
    }
    ```
    
#### 三、布局基础

1. **文档流**
    - 文档流是 HTML 元素在页面中默认的排列方式。块级元素（如 `<div>`、`<p>` 等）会独占一行，从上到下依次排列；内联元素（如 `<span>`、`<a>` 等）会在一行内依次排列，直到行满换行。
2. **浮动（float）**
    
    - `float` 属性可以让元素脱离文档流，向左或向右浮动。常见的值有 `left` 和 `right`。
    ```html
    <div class="left">向左浮动</div>
    <div class="right">向右浮动</div>
    ```
    
    
    ```css
    .left {
        float: left;
    }
    .right {
        float: right;
    }
    ```
    
      
    - 浮动元素会对周围元素产生影响，可能导致父元素高度塌陷。
3. **清除浮动（clear）**
    
    - 为了避免浮动带来的影响，可以使用 `clear` 属性。常见的值有 `left`、`right` 和 `both`。
    
    ```html
    <div class="clearfix">
        <div class="left">向左浮动</div>
        <div class="right">向右浮动</div>
    </div>
    ```
    
    
    ```css
    .clearfix::after {
        content: "";
        display: block;
        clear: both;
    }
    ```
    
4. **弹性布局（Flexbox）**
    
    - Flexbox 是一种一维布局模型，用于为盒状模型提供最大的灵活性。使用 `display: flex` 或 `display: inline-flex` 将元素设置为弹性容器。
    
    ```html
    <div class="flex-container">
        <div class="flex-item">项目 1</div>
        <div class="flex-item">项目 2</div>
        <div class="flex-item">项目 3</div>
    </div>
    ```
    
    ```css
    .flex-container {
        display: flex;
        justify-content: space-between; /* 主轴上的对齐方式 */
        align-items: center; /* 交叉轴上的对齐方式 */
    }
    .flex-item {
        width: 100px;
    }
    ```
    
5. **网格布局（Grid）**
    
    - 网格布局是一种二维布局模型，可以将页面划分为行和列的网格。使用 `display: grid` 将元素设置为网格容器。
    
    ```html
    <div class="grid-container">
        <div class="grid-item">项目 1</div>
        <div class="grid-item">项目 2</div>
        <div class="grid-item">项目 3</div>
    </div>
    ```
    
    
    ```css
    .grid-container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr; /* 定义列 */
        grid-template-rows: auto; /* 定义行 */
        gap: 10px; /* 网格间隙 */
    }
    ```
    
#### 四、常见样式属性

1. **文本样式**
    
    - **color**：设置文本的颜色。
    ```css
    p {
        color: green;
    }
    ```
    
    - **font-size**：设置字体的大小。
    ```css
    h1 {
        font-size: 24px;
    }
    ```
    
    - **line-height**：设置行高。
    
    ```css
    p {
        line-height: 1.5;
    }
    ```
    
2. **背景（background）**
    
    - 可以使用 `background-color` 设置背景颜色，`background-image` 设置背景图片，还可以使用简写形式。
    
    ```css
    div {
        background: url('image.jpg') no-repeat center center;
        background-size: cover;
    }
    ```
    
3. **边框（border）**
    
    - 前面已经介绍过，这里再补充一些样式。
    ```css
    div {
        border: 2px dotted red;
    }
    ```
    
4. **圆角（border-radius）**
    
    - 用于设置元素的圆角效果。
    
    ```css
    button {
        border-radius: 5px;
    }
    ```
    
5. **定位（position）**
    
    - **static**：默认值，元素按照文档流正常排列。
    - **relative**：相对定位，元素相对于其正常位置进行偏移。
    ```css
    div {
        position: relative;
        left: 20px;
        top: 10px;
    }
    ```
    - **absolute**：绝对定位，元素相对于最近的已定位祖先元素进行定位，如果没有已定位的祖先元素，则相对于文档的初始包含块。
    
    ```html
    <div class="parent">
        <div class="child">绝对定位元素</div>
    </div>
    ```
        
    ```css
    .parent {
        position: relative;
    }
    .child {
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
    ```
    
    - **fixed**：固定定位，元素相对于浏览器窗口进行定位，滚动页面时元素位置不变。
    
    ```css
    nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
    }
    ```    
#### 五、响应式基础

1. **媒体查询（@media）**
    
    - 媒体查询用于根据不同的设备屏幕尺寸应用不同的样式。
    ```css
    /* 当屏幕宽度小于 768px 时应用以下样式 */
    @media (max-width: 768px) {
        body {
            font-size: 14px;
        }
    }
    ```
    
2. **CSS 变量（var ()）**
    
    - CSS 变量可以在文档中定义一个值，然后在多个地方引用。
    ```css
    :root {
        --primary-color: #007bff;
    }
    h1 {
        color: var(--primary-color);
    }
    ```