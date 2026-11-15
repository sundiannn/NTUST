// 資料讀取：所有畫面都透過這裡讀 JSON，路徑規則見 AGENTS.md 第 3、5 節。

const cache = new Map();

export async function getJSON(url) {
  if (!cache.has(url)) {
    cache.set(url, fetch(url).then((r) => {
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return r.json();
    }));
  }
  return cache.get(url);
}

export async function getText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.text();
}

export const getDepartments = () => getJSON("data/departments.json");

export async function getDepartment(deptId) {
  const list = await getDepartments();
  const dept = list.find((d) => d.id === deptId);
  if (!dept) throw new Error(`unknown department ${deptId}`);
  return dept;
}

export const getCatalog = (deptId) => getJSON(`content/${deptId}/catalog.json`);

export async function getCourseInfo(deptId, courseId) {
  const catalog = await getCatalog(deptId);
  const info = catalog.courses.find((c) => c.id === courseId);
  if (!info) throw new Error(`unknown course ${courseId}`);
  return info;
}

export const courseBase = (deptId, courseId) => `content/${deptId}/${courseId}`;

export const getCourse = (deptId, courseId) =>
  getJSON(`${courseBase(deptId, courseId)}/course.json`);

export const CATEGORIES = [
  { id: "required", label: "必修" },
  { id: "elective", label: "選修" },
  { id: "other", label: "其他" },
];

export const categoryLabel = (id) =>
  (CATEGORIES.find((c) => c.id === id) || { label: id }).label;

/** HTML 跳脫，所有來自 JSON 的文字輸出前都要經過這裡 */
export function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[ch]));
}
