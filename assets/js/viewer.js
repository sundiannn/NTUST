// 閱讀器：把 .md 渲染在可捲動的「紙張」中，像 PDF 閱讀器。
// 支援 Markdown（marked）、數學公式（KaTeX）、程式碼高亮（highlight.js）。

import { setBreadcrumb } from "./app.js";
import {
  getDepartment, getCourseInfo, getCourse, courseBase, getText, esc,
} from "./data.js";

/** 先把 $$...$$ 與 $...$ 抽出來，避免 marked 把底線、反斜線當成 Markdown 語法 */
function protectMath(md) {
  const store = [];
  const keep = (tex, display) => {
    store.push({ tex, display });
    return `@@MATH${store.length - 1}@@`;
  };
  // 程式碼區塊內的 $ 不處理
  const codeBlocks = [];
  md = md.replace(/```[\s\S]*?```|`[^`\n]+`/g, (m) => {
    codeBlocks.push(m);
    return `@@CODE${codeBlocks.length - 1}@@`;
  });
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => keep(tex, true));
  md = md.replace(/(^|[^\\$])\$([^\n$]+?)\$/g, (_, pre, tex) => pre + keep(tex, false));
  md = md.replace(/@@CODE(\d+)@@/g, (_, i) => codeBlocks[Number(i)]);
  return { md, store };
}

function restoreMath(html, store) {
  return html.replace(/@@MATH(\d+)@@/g, (_, i) => {
    const { tex, display } = store[Number(i)];
    try {
      return katex.renderToString(tex, { displayMode: display, throwOnError: false });
    } catch {
      return `<code>${esc(tex)}</code>`;
    }
  });
}

export function renderMarkdown(md) {
  const { md: safe, store } = protectMath(md);
  const html = marked.parse(safe, { gfm: true });
  return restoreMath(html, store);
}

export async function renderViewer(app, deptId, courseId, kind, itemId) {
  const [dept, info, course] = await Promise.all([
    getDepartment(deptId), getCourseInfo(deptId, courseId), getCourse(deptId, courseId),
  ]);

  const items = kind === "notes"
    ? course.notes
    : [...course.exams.midterm, ...course.exams.final];
  const item = items.find((x) => x.id === itemId);
  if (!item) throw new Error(`unknown item ${itemId}`);

  const base = `#/${deptId}/${courseId}`;
  const listHref = `${base}/${kind}`;
  const listLabel = kind === "notes" ? "課程筆記整理" : "歷屆試題";
  const typeLabel = kind === "notes" ? "重點整理" : "AI 解析";

  setBreadcrumb([
    { label: dept.short, href: `#/${deptId}?cat=${info.category}` },
    { label: info.name, href: base },
    { label: listLabel, href: listHref },
    { label: item.title },
  ]);

  app.innerHTML = `
    <section class="viewer">
      <div class="viewer-bar">
        <a class="btn-ghost" href="${listHref}">← 返回${listLabel}</a>
        <div class="viewer-title">
          <span class="viewer-tag">${typeLabel}</span>
          <span>${esc(item.title)}</span>
        </div>
        <span class="muted viewer-date">更新：${esc(item.updated)}</span>
      </div>
      <div class="viewer-scroll" id="viewerScroll" tabindex="0">
        <article class="paper markdown" id="paper">
          <p class="muted center">載入中…</p>
        </article>
      </div>
    </section>`;

  const paper = document.getElementById("paper");
  const md = await getText(`${courseBase(deptId, courseId)}/${item.path}`);
  paper.innerHTML = renderMarkdown(md);

  // 相對路徑的圖片要以 .md 所在資料夾為基準
  const mdDir = `${courseBase(deptId, courseId)}/${item.path.replace(/[^/]+$/, "")}`;
  paper.querySelectorAll("img").forEach((img) => {
    const src = img.getAttribute("src");
    if (src && !/^(https?:|\/|data:)/.test(src)) img.src = mdDir + src;
  });
  // 外部連結開新分頁
  paper.querySelectorAll('a[href^="http"]').forEach((a) => {
    a.target = "_blank";
    a.rel = "noopener";
  });
  // 表格包一層，讓寬表格可左右捲動
  paper.querySelectorAll("table").forEach((t) => {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    t.replaceWith(wrap);
    wrap.appendChild(t);
  });
  if (window.hljs) paper.querySelectorAll("pre code").forEach((el) => hljs.highlightElement(el));
  document.getElementById("viewerScroll").focus({ preventScroll: true });
}
