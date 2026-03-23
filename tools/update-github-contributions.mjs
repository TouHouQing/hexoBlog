import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "source", "data");
const outputFile = path.join(outputDir, "github-contributions.json");
const username = process.env.GITHUB_CONTRIB_USERNAME || "touhouqing";
const endpoint = `https://github.com/users/${username}/contributions`;
const dayMs = 24 * 60 * 60 * 1000;
const execFileAsync = promisify(execFile);

const parseCountFromTooltip = (tooltip) => {
  const countMatch = tooltip.match(/([\d,]+)\s+contributions?/i);
  if (!countMatch) return 0;
  return Number.parseInt(countMatch[1].replace(/,/g, ""), 10);
};

const parseTotalContributions = (html) => {
  const totalMatch = html.match(
    /<h2[^>]*>\s*([\d,]+)\s*contributions\s*in the last year\s*<\/h2>/i
  );
  if (!totalMatch) return null;
  return Number.parseInt(totalMatch[1].replace(/,/g, ""), 10);
};

const parseDays = (html) => {
  const cellPattern =
    /<td[^>]*data-date="([^"]+)"[^>]*data-level="(\d)"[^>]*class="ContributionCalendar-day"[^>]*><\/td>\s*<tool-tip[^>]*>([^<]+)<\/tool-tip>/g;
  const days = [];

  for (const match of html.matchAll(cellPattern)) {
    const [, date, level, tooltip] = match;
    days.push({
      date,
      level: Number.parseInt(level, 10),
      count: parseCountFromTooltip(tooltip),
      tooltip: tooltip.trim()
    });
  }

  if (days.length === 0) {
    throw new Error("Unable to parse ContributionCalendar days from GitHub response.");
  }

  days.sort((left, right) => left.date.localeCompare(right.date));
  return days;
};

const getUtcDate = (value) => new Date(`${value}T00:00:00Z`);

const buildMonthLabels = (days) => {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: "UTC"
  });
  const labels = [];
  let previousKey = "";

  for (const day of days) {
    const date = getUtcDate(day.date);
    const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
    if (key === previousKey) continue;

    labels.push({
      label: formatter.format(date),
      weekIndex: day.weekIndex
    });
    previousKey = key;
  }

  return labels;
};

const buildSummary = (days, totalFromHeading) => {
  let activeDays = 0;
  let longestStreak = 0;
  let currentRun = 0;
  let maxDaily = 0;

  for (const day of days) {
    if (day.count > 0) {
      activeDays += 1;
      currentRun += 1;
      longestStreak = Math.max(longestStreak, currentRun);
    } else {
      currentRun = 0;
    }

    maxDaily = Math.max(maxDaily, day.count);
  }

  let currentStreak = 0;
  for (let index = days.length - 1; index >= 0; index -= 1) {
    if (days[index].count === 0) break;
    currentStreak += 1;
  }

  const totalContributions =
    totalFromHeading ?? days.reduce((sum, day) => sum + day.count, 0);

  return {
    totalContributions,
    activeDays,
    currentStreak,
    longestStreak,
    maxDaily
  };
};

const enrichDays = (days) => {
  const firstDate = getUtcDate(days[0].date);
  const startOfGrid = new Date(
    Date.UTC(
      firstDate.getUTCFullYear(),
      firstDate.getUTCMonth(),
      firstDate.getUTCDate() - firstDate.getUTCDay()
    )
  );

  for (const day of days) {
    const date = getUtcDate(day.date);
    day.dayOfWeek = date.getUTCDay();
    day.weekIndex = Math.round((date.getTime() - startOfGrid.getTime()) / dayMs / 7);
  }

  return {
    startOfGrid: startOfGrid.toISOString().slice(0, 10),
    weeks: Math.max(...days.map((day) => day.weekIndex)) + 1
  };
};

const downloadHtml = async () => {
  try {
    const response = await fetch(endpoint, {
      headers: {
        "User-Agent": "TouHouQing-hexoBlog/1.0",
        Accept: "text/html"
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub contributions request failed: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    const { stdout } = await execFileAsync(
      "curl",
      [
        "-fsSL",
        "--connect-timeout",
        "20",
        "--max-time",
        "60",
        "-A",
        "TouHouQing-hexoBlog/1.0",
        "-H",
        "Accept: text/html",
        endpoint
      ],
      {
        cwd: rootDir,
        maxBuffer: 10 * 1024 * 1024
      }
    );

    if (!stdout) {
      throw error;
    }

    return stdout;
  }
};

const run = async () => {
  const html = await downloadHtml();
  const totalFromHeading = parseTotalContributions(html);
  const days = parseDays(html);
  const { startOfGrid, weeks } = enrichDays(days);
  const summary = buildSummary(days, totalFromHeading);
  const payload = {
    username,
    endpoint,
    profileUrl: `https://github.com/${username}`,
    generatedAt: new Date().toISOString(),
    range: {
      from: days[0].date,
      to: days[days.length - 1].date,
      startOfGrid
    },
    weeks,
    months: buildMonthLabels(days),
    summary,
    days: days.map(({ date, level, count, tooltip, weekIndex, dayOfWeek }) => ({
      date,
      level,
      count,
      tooltip,
      weekIndex,
      dayOfWeek
    }))
  };

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`Updated ${path.relative(rootDir, outputFile)} for ${username}`);
  console.log(
    `Range ${payload.range.from} -> ${payload.range.to}, total ${payload.summary.totalContributions}`
  );
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
