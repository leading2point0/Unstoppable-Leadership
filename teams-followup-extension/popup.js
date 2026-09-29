const list = document.getElementById("list");
const empty = document.getElementById("empty");
const showDone = document.getElementById("showDone");

const SECTIONS = [
  ["overdue", "Due now / overdue"],
  ["today", "Due today"],
  ["upcoming", "Upcoming"],
  ["undated", "No date"],
  ["done", "Completed"],
];

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text; // textContent: message text is never parsed as HTML
  return e;
}

function button(label, fn, cls) {
  const b = el("button", cls, label);
  b.addEventListener("click", fn);
  return b;
}

function snoozeSelect(flag) {
  const s = el("select");
  s.setAttribute("aria-label", "Snooze");
  s.appendChild(new Option("Snooze…", ""));
  FU.presets().forEach((p, i) => p.due && s.appendChild(new Option(p.label, String(i))));
  s.addEventListener("change", async () => {
    const p = FU.presets()[Number(s.value)];
    if (p) await FU.save({ ...flag, due: p.due, done: false });
  });
  return s;
}

function card(f, bucket) {
  const c = el("div", "item" + (bucket === "overdue" ? " overdue-item" : "") + (f.done ? " done-item" : ""));
  const top = el("div", "top");
  top.append(el("span", "who", f.author || "Unknown sender"), el("span", "due", FU.formatDue(f.due)));
  c.append(top, el("div", "where", f.where || ""));
  if (f.note) c.append(el("div", "note", f.note));
  if (f.preview) c.append(el("div", "prev", f.preview));

  const acts = el("div", "acts");
  acts.append(button("Open chat", () => chrome.tabs.create({ url: f.url }), "open"));
  if (f.done) {
    acts.append(button("Reopen", () => FU.save({ ...f, done: false })));
  } else {
    acts.append(button("Done", () => FU.save({ ...f, done: true })), snoozeSelect(f));
  }
  acts.append(button("Delete", () => FU.remove(f.id)));
  c.append(acts);
  return c;
}

async function render() {
  const flags = await FU.all();
  const now = new Date();
  const groups = {};
  for (const f of flags) (groups[FU.bucket(f, now)] ||= []).push(f);

  list.textContent = "";
  let shown = 0;
  for (const [key, title] of SECTIONS) {
    if (key === "done" && !showDone.checked) continue;
    const items = groups[key];
    if (!items || !items.length) continue;
    items.sort((a, b) => (a.due || Infinity) - (b.due || Infinity));
    list.append(el("h2", key === "overdue" ? "overdue" : "", `${title} (${items.length})`));
    items.forEach((f) => list.append(card(f, key)));
    shown += items.length;
  }
  empty.hidden = shown > 0;
}

showDone.addEventListener("change", render);
chrome.storage.onChanged.addListener(render);
render();
