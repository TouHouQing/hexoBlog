---
title: 关于
date: 2026-03-13 15:40:00
type: about
top_img: false
comments: false
aside: false
---

<style>
  .about-hero {
    position: relative;
    overflow: hidden;
    border-radius: 22px;
    padding: 2rem 1.6rem;
    background: linear-gradient(125deg, #0f172a 0%, #1e293b 38%, #0b3b2e 100%);
    color: #f8fafc;
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.28);
  }

  .about-hero::before {
    content: "";
    position: absolute;
    width: 280px;
    height: 280px;
    right: -80px;
    top: -90px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(20, 184, 166, 0.35), rgba(20, 184, 166, 0));
    pointer-events: none;
  }

  .about-hero h1 {
    margin: 0 0 0.6rem;
    font-size: clamp(1.7rem, 3.4vw, 2.4rem);
    letter-spacing: 0.02em;
    color: #f8fafc;
    text-shadow: 0 6px 20px rgba(15, 23, 42, 0.45);
  }

  .about-hero p {
    margin: 0.45rem 0;
    color: rgba(248, 250, 252, 0.94);
    line-height: 1.85;
  }

  .about-grid {
    margin-top: 1.2rem;
    display: grid;
    gap: 14px;
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .about-card {
    grid-column: span 12;
    border-radius: 18px;
    padding: 1.1rem 1rem;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
    border: 1px solid rgba(148, 163, 184, 0.2);
    box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
  }

  .about-card h2 {
    margin: 0 0 0.75rem;
    font-size: 1.12rem;
    color: #0f172a;
  }

  .about-card p {
    margin: 0.36rem 0;
    color: #334155;
    line-height: 1.82;
  }

  .stack-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 0.2rem;
  }

  .stack-chip {
    display: inline-block;
    padding: 0.32rem 0.68rem;
    border-radius: 999px;
    background: #e2e8f0;
    color: #0f172a;
    font-size: 0.88rem;
    line-height: 1.2;
  }

  .about-highlight {
    margin-top: 0.9rem;
    padding: 0.8rem 0.9rem;
    border-left: 4px solid #14b8a6;
    border-radius: 10px;
    background: #ecfeff;
    color: #115e59;
    line-height: 1.75;
  }

  .about-contact a {
    font-weight: 600;
    text-decoration: none;
    border-bottom: 1px dashed currentColor;
  }

  @media (min-width: 860px) {
    .about-card.col-7 {
      grid-column: span 7;
    }

    .about-card.col-5 {
      grid-column: span 5;
    }
  }
</style>

<section class="about-hero">
  <h1>你好，我是 TouHouQing</h1>
  <p>一名持续折腾、持续输出的开发者，也是一位长期主义的技术博主。</p>
  <p>这里记录我在编程、工具链、效率系统和个人成长中的实践与思考。</p>
</section>

<section class="about-grid">
  <article class="about-card col-7">
    <h2>我在做什么</h2>
    <p>最近主要在做 Ai Agent相关实践，沉淀有自主性的Agent。</p>
    <div class="about-highlight">
      我相信：好的技术不是“炫技”，而是能持续创造价值、降低摩擦、让人愿意重复使用。
    </div>
  </article>

  <article class="about-card col-5">
    <h2>技术栈</h2>
    <div class="stack-list">
      <span class="stack-chip">JavaScript / TypeScript</span>
      <span class="stack-chip">Java</span>
      <span class="stack-chip">SpringBoot</span>
      <span class="stack-chip">SpringCloud</span>
      <span class="stack-chip">mysql</span>
      <span class="stack-chip">Spring ai alibaba</span>
    </div>
  </article>

  <article class="about-card col-12">
    <h2>你会在这个博客看到</h2>
    <p>1. 实战型技术文章：不讲空话，强调可复现步骤。</p>
    <p>2. 工具与效率方法：聚焦可直接应用的vibe coding工具。</p>
    <p>3. 持续迭代记录：包括踩坑、修复与优化思路。</p>
  </article>

  <article class="about-card col-12 about-contact">
    <h2>联系与合作</h2>
    <p>如果你对技术交流、工具实践或内容合作感兴趣，欢迎通过友链页联系我。</p>
    <p>Vibe Coding 工具购买入口：<a href="https://faka.tohoqing.com" target="_blank" rel="noopener">faka.tohoqing.com</a></p>
  </article>
</section>
