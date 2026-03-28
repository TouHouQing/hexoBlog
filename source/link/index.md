---
title: link
date: 2025-07-22 22:39:13
type: "link"
top_img: false
---

<style>
  .page.type-link #content-inner {
    margin-top: 0;
  }

  .page.type-link #article-container .flink {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    align-items: start;
  }

  .page.type-link #article-container .flink-group {
    min-width: 0;
    padding: 1.4rem;
    border-radius: 24px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
    box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08);
  }

  .page.type-link #article-container .flink-group h2 {
    display: none;
  }

  .page.type-link #article-container .flink-group .flink-desc {
    display: none;
  }

  .page.type-link #article-container .flink-group .flink-list {
    overflow: visible;
    padding: 0;
    text-align: left;
  }

  .page.type-link #article-container .flink-group .flink-list > .flink-list-item {
    float: none;
    width: 100% !important;
    height: auto;
    min-height: 112px;
    margin: 0;
    border-radius: 18px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: none;
  }

  .page.type-link #article-container .flink-group .flink-list > .flink-list-item + .flink-list-item {
    margin-top: 14px;
  }

  .page.type-link #article-container .flink-group .flink-list > .flink-list-item::before {
    background: linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(37, 99, 235, 0.08));
  }

  .page.type-link #article-container .flink-group .flink-list > .flink-list-item:hover .flink-item-icon {
    margin-left: 0;
    width: 72px;
  }

  .page.type-link #article-container .flink-group .flink-list > .flink-list-item a {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr);
    grid-template-rows: auto auto;
    column-gap: 1rem;
    align-items: center;
    padding: 1rem 1.05rem;
    min-height: 112px;
  }

  .page.type-link #article-container .flink-group .flink-list > .flink-list-item a .flink-item-icon {
    grid-row: 1 / span 2;
    grid-column: 1;
    float: none;
    margin: 0;
    width: 72px;
    height: 72px;
    border-radius: 16px;
  }

  .page.type-link #article-container .flink-group .flink-list > .flink-list-item a .flink-item-name {
    grid-column: 2;
    align-self: end;
    padding: 0;
    height: auto;
    color: #1e293b;
    font-size: 1.25rem;
    line-height: 1.3;
  }

  .page.type-link #article-container .flink-group .flink-list > .flink-list-item a .flink-item-desc {
    grid-column: 2;
    align-self: start;
    padding: 0;
    height: auto;
    color: #64748b;
    font-size: 0.96rem;
    line-height: 1.65;
  }

  [data-theme="dark"] .page.type-link #article-container .flink-group {
    border-color: rgba(71, 85, 105, 0.42);
    background: rgba(15, 23, 42, 0.9);
    box-shadow: none;
  }

  [data-theme="dark"] .page.type-link #article-container .flink-group h2,
  [data-theme="dark"] .page.type-link #article-container .flink-group .flink-list > .flink-list-item a .flink-item-name {
    color: #f8fafc;
  }

  [data-theme="dark"] .page.type-link #article-container .flink-group .flink-desc,
  [data-theme="dark"] .page.type-link #article-container .flink-group .flink-list > .flink-list-item a .flink-item-desc {
    color: #cbd5e1;
  }

  [data-theme="dark"] .page.type-link #article-container .flink-group .flink-list > .flink-list-item {
    border-color: rgba(71, 85, 105, 0.36);
    background: rgba(30, 41, 59, 0.88);
  }

  [data-theme="dark"] .page.type-link #article-container .flink-group .flink-list > .flink-list-item::before {
    background: linear-gradient(135deg, rgba(45, 212, 191, 0.12), rgba(59, 130, 246, 0.12));
  }

  @media (max-width: 900px) {
    .page.type-link #article-container .flink {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .page.type-link #article-container .flink-group {
      padding: 1.1rem;
    }

    .page.type-link #article-container .flink-group .flink-list > .flink-list-item a {
      grid-template-columns: 60px minmax(0, 1fr);
      min-height: 96px;
      padding: 0.9rem;
    }

    .page.type-link #article-container .flink-group .flink-list > .flink-list-item a .flink-item-icon,
    .page.type-link #article-container .flink-group .flink-list > .flink-list-item:hover .flink-item-icon {
      width: 60px;
      height: 60px;
    }

    .page.type-link #article-container .flink-group .flink-list > .flink-list-item a .flink-item-name {
      font-size: 1.1rem;
    }
  }
</style>
