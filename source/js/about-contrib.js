(function () {
  const DATA_URL = "/data/github-contributions.json";
  const SECTION_ID = "about-contrib";
  const palette = [
    { top: "#ebedf0", side: "#ebedf0", front: "#ebedf0" },
    { top: "#9be9a8", side: "#9be9a8", front: "#9be9a8" },
    { top: "#40c463", side: "#40c463", front: "#40c463" },
    { top: "#30a14e", side: "#30a14e", front: "#30a14e" },
    { top: "#216e39", side: "#216e39", front: "#216e39" }
  ];

  const numberFormatter = new Intl.NumberFormat("en-US");
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  });
  const syncFormatter = new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  });

  const balanceMonthLabels = (monthsContainer) => {
    if (!monthsContainer) return;

    const labels = Array.from(monthsContainer.querySelectorAll(".about-contrib__month"));
    let lastVisible = null;

    labels.forEach((label) => {
      label.classList.remove("is-hidden");
      label.removeAttribute("aria-hidden");
    });

    labels.forEach((label) => {
      const left = label.offsetLeft;
      const right = left + label.offsetWidth;

      if (!lastVisible) {
        lastVisible = { label, right };
        return;
      }

      if (left < lastVisible.right + 4) {
        lastVisible.label.classList.add("is-hidden");
        lastVisible.label.setAttribute("aria-hidden", "true");
      }

      lastVisible = { label, right };
    });
  };

  const renderMonths = (monthsContainer, months, weeks) => {
    monthsContainer.style.setProperty("--contrib-weeks", weeks);
    monthsContainer.innerHTML = months
      .map(
        (month) => `
          <span class="about-contrib__month" style="grid-column:${month.weekIndex + 1}">
            ${month.label}
          </span>
        `
      )
      .join("");

    requestAnimationFrame(() => balanceMonthLabels(monthsContainer));

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => balanceMonthLabels(monthsContainer)).catch(() => {});
    }
  };

  const renderHeatmap = (heatmapContainer, days, weeks) => {
    heatmapContainer.style.setProperty("--contrib-weeks", weeks);
    heatmapContainer.innerHTML = days
      .map((day) => {
        const tone = palette[Math.max(0, Math.min(day.level, palette.length - 1))];
        const depth = `${2 + day.level * 2}px`;
        const countLabel =
          day.count === 0
            ? "No contributions"
            : `${numberFormatter.format(day.count)} contribution${day.count > 1 ? "s" : ""}`;
        const dateLabel = dateFormatter.format(new Date(`${day.date}T00:00:00Z`));

        return `
          <button
            type="button"
            class="about-contrib__cell"
            style="
              grid-column:${day.weekIndex + 1};
              grid-row:${day.dayOfWeek + 1};
              --cell-depth:${depth};
              --cell-top:${tone.top};
              --cell-side:${tone.side};
              --cell-front:${tone.front};
            "
            aria-label="${countLabel} on ${dateLabel}"
            title="${countLabel} on ${dateLabel}"
          >
            <span class="about-contrib__cell-core"></span>
          </button>
        `;
      })
      .join("");
  };

  const renderLegend = (legendContainer) => {
    legendContainer.innerHTML = `
      <span class="about-contrib__legend-text">Less</span>
      <span class="about-contrib__legend-cell level-0"></span>
      <span class="about-contrib__legend-cell level-1"></span>
      <span class="about-contrib__legend-cell level-2"></span>
      <span class="about-contrib__legend-cell level-3"></span>
      <span class="about-contrib__legend-cell level-4"></span>
      <span class="about-contrib__legend-text">More</span>
    `;
  };

  const renderEmptyState = (section, message) => {
    const summary = section.querySelector('[data-role="summary"]');
    const months = section.querySelector('[data-role="months"]');
    const heatmap = section.querySelector('[data-role="heatmap"]');

    if (summary) summary.textContent = message;
    if (months) months.innerHTML = "";
    if (heatmap) heatmap.innerHTML = "";
  };

  const fetchData = async () => {
    const version = new Date().toISOString().slice(0, 10);
    const response = await fetch(`${DATA_URL}?v=${version}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`Failed to load contributions data: ${response.status}`);
    }

    return response.json();
  };

  const mountSection = async (section) => {
    if (!section || section.dataset.loading === "1") return;

    const title = section.querySelector('[data-role="title"]');
    const summary = section.querySelector('[data-role="summary"]');
    const link = section.querySelector('[data-role="link"]');
    const months = section.querySelector('[data-role="months"]');
    const heatmap = section.querySelector('[data-role="heatmap"]');
    const legend = section.querySelector('[data-role="legend"]');

    section.dataset.loading = "1";

    try {
      const data = await fetchData();
      if (!Array.isArray(data.days) || data.days.length === 0) {
        renderEmptyState(section, "GitHub contributions 正在等待首次同步，稍后刷新页面查看。");
        return;
      }

      if (title) title.textContent = "GitHub Contributions";
      if (summary) {
        summary.innerHTML = `
          过去一年累计 <strong>${numberFormatter.format(data.summary.totalContributions)}</strong> 次贡献，
          当前连续 <strong>${data.summary.currentStreak}</strong> 天活跃，
          最近同步于 ${syncFormatter.format(new Date(data.generatedAt))}。
        `;
      }
      if (link) {
        link.href = data.profileUrl;
        link.textContent = `@${data.username}`;
      }
      if (months) renderMonths(months, data.months, data.weeks);
      if (heatmap) renderHeatmap(heatmap, data.days, data.weeks);
      if (legend) renderLegend(legend);
    } catch (error) {
      renderEmptyState(section, "GitHub contributions 数据加载失败，稍后刷新页面再试。");
      console.error("[about-contrib]", error);
    } finally {
      section.dataset.loading = "0";
    }
  };

  const boot = () => {
    const section = document.getElementById(SECTION_ID);
    if (!section) return;
    mountSection(section);
  };

  document.addEventListener("DOMContentLoaded", boot);
  document.addEventListener("pjax:complete", boot);

  if (document.readyState !== "loading") {
    boot();
  }
})();
