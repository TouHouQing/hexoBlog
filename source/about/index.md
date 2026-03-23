---
title: 关于
date: 2026-03-13 15:40:00
type: about
top_img: false
comments: false
aside: false
---

<style>
  .page.type-about #content-inner.layout.hide-aside {
    max-width: 1360px;
  }

  .page.type-about #content-inner.layout.hide-aside > div {
    width: 100% !important;
  }

  .page.type-about #page {
    width: 100%;
    padding: 0;
    background: transparent;
    box-shadow: none;
    border-radius: 0;
  }

  .page.type-about #page .page-title {
    display: none;
  }

  .about-profile {
    display: grid;
    gap: 24px;
    grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
    align-items: start;
  }

  .about-profile__sidebar {
    display: grid;
    gap: 16px;
  }

  .about-profile__panel {
    border: 1px solid rgba(148, 163, 184, 0.18);
    border-radius: 20px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
    box-shadow: 0 14px 36px rgba(15, 23, 42, 0.08);
  }

  .about-profile__identity {
    padding: 1.4rem;
  }

  .about-profile__avatar {
    width: min(100%, 240px);
    aspect-ratio: 1;
    display: block;
    margin-bottom: 1.1rem;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid rgba(255, 255, 255, 0.92);
    box-shadow: 0 20px 40px rgba(15, 23, 42, 0.14);
  }

  .about-profile__identity h1 {
    margin: 0;
    color: #0f172a;
    font-size: clamp(2rem, 4vw, 2.55rem);
    letter-spacing: -0.03em;
  }

  .about-profile__handle {
    margin: 0.22rem 0 0;
    font-size: 1.12rem;
    color: #64748b;
  }

  .about-profile__bio {
    margin: 1rem 0 0;
    color: #334155;
    font-size: 1rem;
    line-height: 1.85;
  }

  .about-profile__actions {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 1.2rem;
  }

  .about-profile__action {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.78rem 1rem;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.22);
    background: #f8fafc;
    color: #0f172a;
    text-decoration: none;
    font-weight: 600;
    transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  }

  .about-profile__action:hover {
    transform: translateY(-1px);
    background: #ffffff;
    border-color: rgba(20, 184, 166, 0.34);
  }

  .about-profile__facts {
    margin-top: 1.2rem;
    display: grid;
    gap: 12px;
  }

  .about-profile__fact {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    color: #475569;
    line-height: 1.6;
  }

  .about-profile__fact i {
    width: 18px;
    color: #64748b;
    text-align: center;
  }

  .about-profile__fact a {
    color: inherit;
    text-decoration: none;
  }

  .about-profile__fact a:hover {
    color: #0f766e;
  }

  .about-profile__quote {
    padding: 1.15rem 1.25rem;
    color: #115e59;
    background: linear-gradient(180deg, #f0fdfa, #ecfeff);
    border: 1px solid rgba(20, 184, 166, 0.18);
    line-height: 1.8;
  }

  .about-profile__quote strong {
    display: block;
    margin-bottom: 0.35rem;
    color: #0f172a;
  }

  .about-profile__main {
    display: grid;
    gap: 18px;
  }

  .about-profile__section {
    padding: 1.2rem;
  }

  .about-profile__section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .about-profile__section-head h2 {
    margin: 0;
    color: #0f172a;
    font-size: 1.25rem;
  }

  .about-profile__section-head a {
    color: #2563eb;
    text-decoration: none;
    font-size: 0.95rem;
  }

  .about-profile__section-head a:hover {
    text-decoration: underline;
  }

  .about-pinned-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  .about-pinned-card {
    display: block;
    height: 100%;
    padding: 1rem 1.05rem;
    border-radius: 16px;
    border: 1px solid rgba(148, 163, 184, 0.2);
    background: #ffffff;
    color: inherit;
    text-decoration: none;
    transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .about-pinned-card:hover {
    transform: translateY(-2px);
    border-color: rgba(37, 99, 235, 0.28);
    box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
  }

  .about-pinned-card__top {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 0.85rem;
    color: #0f172a;
    font-weight: 700;
    font-size: 1.05rem;
  }

  .about-pinned-card__top i {
    color: #64748b;
  }

  .about-pinned-card__badge {
    margin-left: auto;
    padding: 0.16rem 0.52rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 163, 184, 0.32);
    color: #64748b;
    font-size: 0.74rem;
    font-weight: 600;
  }

  .about-pinned-card p {
    margin: 0;
    color: #475569;
    line-height: 1.78;
    min-height: 4.9rem;
  }

  .about-pinned-card__meta {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 1rem;
    color: #64748b;
    font-size: 0.9rem;
  }

  .about-pinned-card__lang {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }

  .about-pinned-card__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: currentColor;
  }

  .about-pinned-card__dot.typescript {
    color: #3178c6;
  }

  .about-pinned-card__dot.java {
    color: #d97706;
  }

  .about-profile__details {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 14px;
  }

  .about-detail-card {
    grid-column: span 12;
    padding: 1.1rem 1rem;
    border-radius: 16px;
    border: 1px solid rgba(148, 163, 184, 0.18);
    background: #ffffff;
  }

  .about-detail-card h3 {
    margin: 0 0 0.7rem;
    color: #0f172a;
    font-size: 1.05rem;
  }

  .about-detail-card p {
    margin: 0.35rem 0;
    color: #475569;
    line-height: 1.8;
  }

  .about-stack-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .about-stack-chip {
    display: inline-flex;
    align-items: center;
    padding: 0.34rem 0.68rem;
    border-radius: 999px;
    background: #f1f5f9;
    color: #0f172a;
    font-size: 0.88rem;
    line-height: 1.2;
  }

  .about-detail-card--contact a {
    font-weight: 600;
    color: #0f766e;
    text-decoration: none;
  }

  .about-detail-card--contact a:hover {
    text-decoration: underline;
  }

  .about-profile__main .about-contrib {
    margin: 0;
    border-radius: 20px;
  }

  [data-theme="dark"] .about-profile__panel,
  [data-theme="dark"] .about-detail-card,
  [data-theme="dark"] .about-pinned-card {
    border-color: rgba(71, 85, 105, 0.42);
    background: rgba(15, 23, 42, 0.92);
    box-shadow: none;
  }

  [data-theme="dark"] .about-profile__identity h1,
  [data-theme="dark"] .about-profile__section-head h2,
  [data-theme="dark"] .about-detail-card h3,
  [data-theme="dark"] .about-pinned-card__top {
    color: #f8fafc;
  }

  [data-theme="dark"] .about-profile__handle,
  [data-theme="dark"] .about-profile__bio,
  [data-theme="dark"] .about-profile__fact,
  [data-theme="dark"] .about-detail-card p,
  [data-theme="dark"] .about-pinned-card p,
  [data-theme="dark"] .about-pinned-card__meta,
  [data-theme="dark"] .about-pinned-card__badge {
    color: #cbd5e1;
  }

  [data-theme="dark"] .about-profile__action {
    border-color: rgba(71, 85, 105, 0.42);
    background: rgba(30, 41, 59, 0.88);
    color: #f8fafc;
  }

  [data-theme="dark"] .about-profile__action:hover {
    background: rgba(51, 65, 85, 0.9);
    border-color: rgba(45, 212, 191, 0.34);
  }

  [data-theme="dark"] .about-profile__fact i {
    color: #94a3b8;
  }

  [data-theme="dark"] .about-profile__quote {
    color: #ccfbf1;
    background: linear-gradient(180deg, rgba(15, 118, 110, 0.18), rgba(15, 23, 42, 0.92));
    border-color: rgba(45, 212, 191, 0.24);
  }

  [data-theme="dark"] .about-profile__quote strong {
    color: #f8fafc;
  }

  [data-theme="dark"] .about-stack-chip {
    background: rgba(30, 41, 59, 0.9);
    color: #e2e8f0;
  }

  @media (min-width: 860px) {
    .about-detail-card.col-7 {
      grid-column: span 7;
    }

    .about-detail-card.col-5 {
      grid-column: span 5;
    }
  }

  @media (max-width: 1100px) {
    .page.type-about #content-inner.layout.hide-aside {
      max-width: 1000px;
    }

    .about-profile {
      grid-template-columns: 1fr;
    }

    .about-profile__sidebar {
      position: static;
    }
  }

  @media (max-width: 820px) {
    .about-pinned-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .about-profile__identity {
      padding: 1.1rem;
    }

    .about-profile__actions {
      grid-template-columns: 1fr;
    }

    .about-profile__section {
      padding: 1rem;
    }

    .about-profile__section-head {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
<section class="about-profile">
<aside class="about-profile__sidebar">
<div class="about-profile__panel about-profile__identity">
<img class="about-profile__avatar" src="/img/logo.jpg" alt="TouHouQing avatar">
<h1>TouHouQing</h1>
<p class="about-profile__handle">@touhouqing</p>
<p class="about-profile__bio">持续折腾、持续输出的开发者，长期关注 AI Agent、工具链和高质量工程实践。</p>
<div class="about-profile__actions">
<a class="about-profile__action" href="/" target="_self"><i class="fa-solid fa-house"></i><span>博客首页</span></a>
<a class="about-profile__action" href="https://github.com/touhouqing" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i><span>GitHub</span></a>
</div>
<div class="about-profile__facts">
<div class="about-profile__fact"><i class="fa-regular fa-pen-to-square"></i><span>Master programming and algorithms, and you'll fear no challenge anywhere in the world.</span></div>
<div class="about-profile__fact"><i class="fa-solid fa-link"></i><a href="https://tohoqing.com/" target="_blank" rel="noopener">https://tohoqing.com/</a></div>
<div class="about-profile__fact"><i class="fa-solid fa-laptop-code"></i><span>AI Agent / TypeScript / Java / Spring AI Alibaba</span></div>
</div>
</div>
<div class="about-profile__panel about-profile__quote">
<strong>关于我</strong>
<span>我相信好的技术不是炫技，而是能持续创造价值、降低摩擦、让人愿意重复使用。</span>
</div>
</aside>
<div class="about-profile__main">
<section class="about-profile__panel about-profile__section">
<div class="about-profile__section-head">
<h2>Pinned Projects</h2>
<a href="https://github.com/touhouqing?tab=repositories" target="_blank" rel="noopener">查看全部仓库</a>
</div>
<div class="about-pinned-grid">
<a class="about-pinned-card" href="https://github.com/TouHouQing/alicization" target="_blank" rel="noopener">
<div class="about-pinned-card__top"><i class="fa-regular fa-folder-open"></i><span>alicization</span><span class="about-pinned-card__badge">Public</span></div>
<p>一个 local-first 的数字生命体实验，聚焦记忆、人格、多模态感知、主动对话与可审计执行。</p>
<div class="about-pinned-card__meta"><span class="about-pinned-card__lang"><span class="about-pinned-card__dot typescript"></span>TypeScript</span><span>AI / Local-first</span></div>
</a>
<a class="about-pinned-card" href="https://github.com/TouHouQing/DataSentry" target="_blank" rel="noopener">
<div class="about-pinned-card__top"><i class="fa-regular fa-folder-open"></i><span>DataSentry</span><span class="about-pinned-card__badge">Public</span></div>
<p>面向企业数据治理的 AI Agent 平台，支持敏感数据识别、拦截与清洗流程，强调实战可落地。</p>
<div class="about-pinned-card__meta"><span class="about-pinned-card__lang"><span class="about-pinned-card__dot java"></span>Java</span><span>Data Governance</span></div>
</a>
</div>
</section>
<section class="about-contrib" id="about-contrib">
<div class="about-contrib__header">
<div>
<h2 data-role="title">GitHub Contributions</h2>
<p class="about-contrib__summary" data-role="summary">正在同步 touhouqing 的官方 contributions 数据。</p>
</div>
<a class="about-contrib__link" data-role="link" href="https://github.com/touhouqing" target="_blank" rel="noopener">@touhouqing</a>
</div>
<div class="about-contrib__viz">
<div class="about-contrib__board-shell">
<div class="about-contrib__day-rail" aria-hidden="true"><span></span><span>Mon</span><span>Wed</span><span>Fri</span></div>
<div class="about-contrib__board-scroll">
<div class="about-contrib__board-width">
<div class="about-contrib__months" data-role="months"></div>
<div class="about-contrib__heatmap" data-role="heatmap"></div>
</div>
</div>
</div>
<div class="about-contrib__legend-row"><div class="about-contrib__legend" data-role="legend"><span class="about-contrib__legend-text">Less</span><span class="about-contrib__legend-cell level-0"></span><span class="about-contrib__legend-cell level-1"></span><span class="about-contrib__legend-cell level-2"></span><span class="about-contrib__legend-cell level-3"></span><span class="about-contrib__legend-cell level-4"></span><span class="about-contrib__legend-text">More</span></div></div>
</div>
</section>
<section class="about-profile__panel about-profile__section">
<div class="about-profile__details">
<article class="about-detail-card col-7">
<h3>我在做什么</h3>
<p>最近主要在做 AI Agent 相关实践，沉淀具备自主性的 Agent 系统与可复用工程能力。</p>
<p>这里会记录编程、工具链、效率系统以及长期主义成长过程中的思考和实践。</p>
</article>
<article class="about-detail-card col-5">
<h3>技术栈</h3>
<div class="about-stack-list">
<span class="about-stack-chip">JavaScript / TypeScript</span>
<span class="about-stack-chip">Java</span>
<span class="about-stack-chip">SpringBoot</span>
<span class="about-stack-chip">SpringCloud</span>
<span class="about-stack-chip">MySQL</span>
<span class="about-stack-chip">Spring AI Alibaba</span>
</div>
</article>
<article class="about-detail-card col-7">
<h3>你会在这个博客看到</h3>
<p>1. 实战型技术文章：不讲空话，强调可复现步骤。</p>
<p>2. 工具与效率方法：聚焦可直接应用的 vibe coding 工具。</p>
<p>3. 持续迭代记录：包括踩坑、修复与优化思路。</p>
</article>
<article class="about-detail-card col-5 about-detail-card--contact">
<h3>联系与合作</h3>
<p>如果你对技术交流、工具实践或内容合作感兴趣，欢迎通过友链页联系我。</p>
<p>Vibe Coding 工具购买入口：<a href="https://faka.tohoqing.com" target="_blank" rel="noopener">faka.tohoqing.com</a></p>
</article>
</div>
</section>
</div>
</section>
