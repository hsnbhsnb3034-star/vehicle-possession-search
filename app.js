const DATA_FILE = "data.json";

const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const statusBox = document.getElementById("status");
const resultsBox = document.getElementById("results");

let records = [];

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function lastSeven(value) {
  const normalized = normalize(value);
  return normalized.length >= 7 ? normalized.slice(-7) : normalized;
}

function setStatus(message, show = true) {
  statusBox.hidden = !show;
  statusBox.textContent = message;
}

function safeUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch (_) {}
  return "";
}

function renderResults(matches) {
  resultsBox.innerHTML = "";

  if (!matches.length) {
    resultsBox.innerHTML = '<div class="empty">لا توجد حيازة مطابقة.</div>';
    return;
  }

  for (const record of matches) {
    const item = document.createElement("article");
    item.className = "result";

    const title = document.createElement("div");
    title.className = "result-title";
    title.textContent = record.title || "حيازة";

    const code = document.createElement("div");
    code.className = "result-code";
    code.textContent = record.code || "";

    item.appendChild(title);
    item.appendChild(code);

    const actions = document.createElement("div");
    actions.className = "actions";

    const url = safeUrl(record.url);

    if (url) {
      const view = document.createElement("a");
      view.className = "action view";
      view.href = url;
      view.target = "_blank";
      view.rel = "noopener noreferrer";
      view.textContent = "فتح الملف";
      actions.appendChild(view);

      const download = document.createElement("a");
      download.className = "action download";
      download.href = url;
      download.target = "_blank";
      download.rel = "noopener noreferrer";
      download.textContent = "فتح / حفظ";
      actions.appendChild(download);
    } else {
      const missing = document.createElement("span");
      missing.className = "hint";
      missing.textContent = "رابط الملف لم تتم إضافته بعد.";
      actions.appendChild(missing);
    }

    item.appendChild(actions);
    resultsBox.appendChild(item);
  }
}

async function loadData() {
  const response = await fetch(DATA_FILE, { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load data.json");
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error("data.json must contain an array");
  return data;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = lastSeven(input.value);
  if (!query) {
    setStatus("اكتب رقم الحيازة أولاً.");
    resultsBox.innerHTML = "";
    return;
  }

  const matches = records.filter(record => {
    const code = normalize(record.code);
    const suffix = lastSeven(code);
    return suffix === query;
  });

  setStatus(`نتيجة البحث عن: ${query}`, true);
  renderResults(matches);
});

(async function init() {
  try {
    records = await loadData();
    setStatus(`تم تحميل ${records.length} سجل.`, true);
  } catch (error) {
    console.error(error);
    setStatus("تعذر تحميل قاعدة البيانات. تأكد أن ملف data.json موجود في نفس المستودع.");
  }
})();
