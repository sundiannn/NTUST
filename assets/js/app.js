// 路由與初始化：解析網址 hash，呼叫對應的畫面。
// 新增內容不需要修改這個檔案（見 AGENTS.md 第 10 節）。

import {
  renderHome, renderDepartment, renderCourse,
  renderExams, renderNotes, renderError,
} from "./views.js";
import { renderViewer } from "./viewer.js";

const app = document.getElementById("app");
const crumbEl = document.getElementById("breadcrumb");

/** 解析 hash：#/ee/machinery/notes?cat=required → { parts, query } */
export function parseHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  const [path, qs = ""] = raw.split("?");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const query = Object.fromEntries(new URLSearchParams(qs));
  return { parts, query };
}

/** 麵包屑：[{label, href}]，最後一項不加連結 */
export function setBreadcrumb(items) {
  const all = [{ label: "主畫面", href: "#/" }, ...items];
  crumbEl.innerHTML = all
    .map((it, i) =>
      i === all.length - 1
        ? `<span class="crumb current">${it.label}</span>`
        : `<a class="crumb" href="${it.href}">${it.label}</a>`)
    .join('<span class="crumb-sep">›</span>');
}

async function route() {
  const { parts, query } = parseHash();
  const [dept, course, section, kind, itemId] = parts;
  window.scrollTo(0, 0);

  try {
    if (!dept) return await renderHome(app);
    if (!course) return await renderDepartment(app, dept, query);
    if (!section) return await renderCourse(app, dept, course);
    if (section === "exams") return await renderExams(app, dept, course);
    if (section === "notes") return await renderNotes(app, dept, course);
    if (section === "view" && kind && itemId)
      return await renderViewer(app, dept, course, kind, itemId);
    renderError(app, "找不到這個頁面。");
  } catch (err) {
    console.error(err);
    renderError(app, "資料載入失敗，請確認網址是否正確。");
  }
}

window.addEventListener("hashchange", route);
route();
