// 各畫面的渲染函式。畫面規格見 AGENTS.md 第 4 節。

import { setBreadcrumb } from "./app.js";
import {
  getDepartments, getDepartment, getCatalog, getCourseInfo, getCourse,
  CATEGORIES, categoryLabel, esc,
} from "./data.js";

/* ---------- 共用小元件 ---------- */

const empty = (msg) => `<div class="empty">${esc(msg)}</div>`;

function folderRow({ icon, title, meta, href, action }) {
  return `
    <div class="folder-row">
      <span class="folder-icon" aria-hidden="true">${icon}</span>
      <div class="folder-text">
        <div class="folder-title">${esc(title)}</div>
        ${meta ? `<div class="folder-meta">${esc(meta)}</div>` : ""}
      </div>
      <a class="btn-primary" href="${href}">${esc(action)}</a>
    </div>`;
}

export function renderError(app, msg) {
  setBreadcrumb([{ label: "錯誤" }]);
  app.innerHTML = `
    <section class="page">
      <div class="empty error">${esc(msg)}</div>
      <p class="center"><a class="btn-primary" href="#/">回主畫面</a></p>
    </section>`;
}

/* ---------- 主畫面：系所選擇 ---------- */

export async function renderHome(app) {
  setBreadcrumb([]);
  const depts = await getDepartments();
  app.innerHTML = `
    <section class="page">
      <div class="hero">
        <h1>選擇你的系所</h1>
        <p class="muted">課程筆記重點整理與歷屆試題 AI 解析</p>
      </div>
      <div class="grid">
        ${depts.map((d) => `
          <a class="card card-link" href="#/${esc(d.id)}">
            <span class="card-kicker">${esc(d.id.toUpperCase())}</span>
            <span class="card-title">${esc(d.short)}</span>
            <span class="card-sub">${esc(d.name)}</span>
          </a>`).join("")}
      </div>
    </section>`;
}

/* ---------- 系所頁：類別篩選 + 搜尋 ---------- */

export async function renderDepartment(app, deptId, query) {
  const [dept, catalog] = await Promise.all([getDepartment(deptId), getCatalog(deptId)]);
  const cat = CATEGORIES.some((c) => c.id === query.cat)
    ? query.cat : catalog.defaultCategory;

  setBreadcrumb([{ label: dept.short, href: `#/${deptId}` }]);

  app.innerHTML = `
    <section class="page">
      <div class="toolbar">
        <div class="dropdown" id="catDropdown">
          <button class="btn-ghost dropdown-toggle" id="catBtn"
                  aria-haspopup="true" aria-expanded="false">
            類別：<strong>${categoryLabel(cat)}</strong> ▾
          </button>
          <div class="dropdown-menu" id="catMenu" role="menu" hidden>
            ${CATEGORIES.map((c) => `
              <a role="menuitem" class="dropdown-item ${c.id === cat ? "active" : ""}"
                 href="#/${esc(deptId)}?cat=${c.id}">${c.label}</a>`).join("")}
          </div>
        </div>
        <h1 class="toolbar-title">${esc(dept.name)}</h1>
        <input class="search" id="search" type="search"
               placeholder="🔍 搜尋課程…" aria-label="搜尋課程" autocomplete="off">
      </div>
      <p class="muted" id="listHint"></p>
      <div class="grid" id="courseGrid"></div>
    </section>`;

  // 類別下拉選單
  const btn = document.getElementById("catBtn");
  const menu = document.getElementById("catMenu");
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.hidden = !menu.hidden;
    btn.setAttribute("aria-expanded", String(!menu.hidden));
  });
  const closeMenu = () => {
    if (!document.body.contains(menu)) {
      document.removeEventListener("click", closeMenu); // 已離開此頁
      return;
    }
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };
  document.addEventListener("click", closeMenu);

  // 課程列表（搜尋時忽略類別篩選）
  const grid = document.getElementById("courseGrid");
  const hint = document.getElementById("listHint");
  const search = document.getElementById("search");

  const draw = () => {
    const q = search.value.trim().toLowerCase();
    let list;
    if (q) {
      list = catalog.courses.filter((c) =>
        [c.name, c.en, ...(c.keywords || [])].join(" ").toLowerCase().includes(q));
      hint.textContent = `搜尋「${search.value.trim()}」：找到 ${list.length} 門課程（全部類別）`;
    } else {
      list = catalog.courses.filter((c) => c.category === cat);
      hint.textContent = `${categoryLabel(cat)}課程`;
    }
    grid.innerHTML = list.length
      ? list.map((c) => `
          <a class="card card-link" href="#/${esc(deptId)}/${esc(c.id)}">
            <span class="card-kicker">${categoryLabel(c.category)}</span>
            <span class="card-title">${esc(c.name)}</span>
            <span class="card-sub">${esc(c.en)}</span>
          </a>`).join("")
      : empty(q ? "找不到符合的課程" : "此類別尚無課程");
  };
  search.addEventListener("input", draw);
  draw();
}

/* ---------- 課程頁：兩個入口 ---------- */

export async function renderCourse(app, deptId, courseId) {
  const [dept, info, course] = await Promise.all([
    getDepartment(deptId), getCourseInfo(deptId, courseId), getCourse(deptId, courseId),
  ]);
  const base = `#/${deptId}/${courseId}`;
  const examCount = course.exams.midterm.length + course.exams.final.length;

  setBreadcrumb([
    { label: dept.short, href: `#/${deptId}?cat=${info.category}` },
    { label: info.name },
  ]);

  app.innerHTML = `
    <section class="page">
      <div class="hero">
        <span class="card-kicker">${categoryLabel(info.category)}</span>
        <h1>${esc(info.name)}</h1>
        <p class="muted">${esc(info.en)}</p>
      </div>
      <div class="big-buttons">
        <a class="big-btn" href="${base}/exams">
          <span class="big-icon">📝</span>
          <span class="big-title">歷屆試題</span>
          <span class="big-sub">期中考／期末考 AI 解析 · ${examCount} 份</span>
        </a>
        <a class="big-btn" href="${base}/notes">
          <span class="big-icon">📚</span>
          <span class="big-title">課程筆記整理</span>
          <span class="big-sub">各章講義重點整理 · ${course.notes.length} 份</span>
        </a>
      </div>
    </section>`;
}

/* ---------- 歷屆試題：期中／期末各半 ---------- */

export async function renderExams(app, deptId, courseId) {
  const [dept, info, course] = await Promise.all([
    getDepartment(deptId), getCourseInfo(deptId, courseId), getCourse(deptId, courseId),
  ]);
  const base = `#/${deptId}/${courseId}`;

  setBreadcrumb([
    { label: dept.short, href: `#/${deptId}?cat=${info.category}` },
    { label: info.name, href: base },
    { label: "歷屆試題" },
  ]);

  const column = (title, items) => `
    <div class="exam-col">
      <h2 class="col-title">📁 ${title}</h2>
      <div class="folder-list">
        ${items.length
          ? items.map((e) => folderRow({
              icon: "📄", title: e.title, meta: `更新：${e.updated}`,
              href: `${base}/view/exams/${encodeURIComponent(e.id)}`, action: "AI 解析",
            })).join("")
          : empty("尚無試題")}
      </div>
    </div>`;

  app.innerHTML = `
    <section class="page">
      <h1 class="page-title">${esc(info.name)}｜歷屆試題</h1>
      <div class="exam-split">
        ${column("期中考", course.exams.midterm)}
        ${column("期末考", course.exams.final)}
      </div>
    </section>`;
}

/* ---------- 課程筆記整理：資料夾列表 ---------- */

export async function renderNotes(app, deptId, courseId) {
  const [dept, info, course] = await Promise.all([
    getDepartment(deptId), getCourseInfo(deptId, courseId), getCourse(deptId, courseId),
  ]);
  const base = `#/${deptId}/${courseId}`;
  const notes = [...course.notes].sort((a, b) => a.order - b.order);

  setBreadcrumb([
    { label: dept.short, href: `#/${deptId}?cat=${info.category}` },
    { label: info.name, href: base },
    { label: "課程筆記整理" },
  ]);

  app.innerHTML = `
    <section class="page">
      <h1 class="page-title">${esc(info.name)}｜課程筆記整理</h1>
      <div class="folder-list">
        ${notes.length
          ? notes.map((n) => folderRow({
              icon: "📁", title: n.title, meta: `更新：${n.updated}`,
              href: `${base}/view/notes/${encodeURIComponent(n.id)}`, action: "重點整理",
            })).join("")
          : empty("尚無講義整理")}
      </div>
    </section>`;
}
