# Ubuntu/KVM Soft Lockup Article Design

## Goal

Rewrite the incident review article into two publishable versions:

- Hexo blog markdown under `source/_posts/ubuntu-kvm-soft-lockup-journald-docker-log-incident-review.md`
- WeChat markdown and converted HTML under `wechat/ubuntu-kvm-soft-lockup-journald-docker-log-incident-review.md` and `.html`

## Positioning

Use a first-person production incident review. The hook is: the AI relay station failed repeatedly, but the evidence did not support a simple "business used too much CPU or memory" explanation.

The article should balance technical credibility with shareability:

- Start with the outage scene and screenshots.
- Explain why `journald` failure is likely a symptom, not the root cause.
- Build a layered evidence chain: kernel soft lockup, ext4/jbd2/fdatasync path, Docker JSON log growth, UFW logging flood, KVM/QEMU virtualized environment, and provider maintenance on the third day.
- List concrete mitigations without claiming a single confirmed root cause.
- End with practical takeaways for other operators.

## Versions

Blog version:

- Full technical detail.
- Hexo frontmatter with categories, tags, description, and `postDesc`.
- Local image references under `/img/posts/`.
- Tables and code blocks are acceptable.

WeChat version:

- Same facts, tighter rhythm.
- Stronger section titles and shorter paragraphs.
- Fewer long tables and code blocks.
- Suitable for conversion with `baoyu-markdown-to-html`.

## Constraints

- Do not overstate causality. Use "更像是", "可能", and "证据更支持" where root cause is not fully proven.
- Keep the title requested by the user.
- Preserve all important incident data supplied by the user.
- Include both provided screenshots as evidence.
