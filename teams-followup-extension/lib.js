// Shared helpers used by the content script, background worker and popup.
// Flags are stored one-per-key in chrome.storage.sync so they follow the user
// across every Chrome/Edge profile that is signed in (limit: ~8 KB per flag,
// ~500 flags in total, so previews are truncated).
const FU = {
  PREFIX: "f:",
  PREVIEW_MAX: 280,

  async all() {
    const data = await chrome.storage.sync.get(null);
    return Object.entries(data)
      .filter(([k]) => k.startsWith(FU.PREFIX))
      .map(([, v]) => v);
  },

  async get(id) {
    const k = FU.PREFIX + id;
    return (await chrome.storage.sync.get(k))[k] || null;
  },

  save(flag) {
    return chrome.storage.sync.set({ [FU.PREFIX + flag.id]: flag });
  },

  remove(id) {
    return chrome.storage.sync.remove(FU.PREFIX + id);
  },

  // Quick date choices offered when flagging or snoozing.
  presets(now = new Date()) {
    const at = (d, h) => {
      const x = new Date(d);
      x.setHours(h, 0, 0, 0);
      return x.getTime();
    };
    const plusDays = (n) => {
      const x = new Date(now);
      x.setDate(x.getDate() + n);
      return x;
    };
    const nextMonday = plusDays(((8 - now.getDay()) % 7) || 7);
    return [
      { label: "In 2 hours", due: now.getTime() + 2 * 3600 * 1000 },
      { label: "Tomorrow 9 AM", due: at(plusDays(1), 9) },
      { label: "In 3 days", due: at(plusDays(3), 9) },
      { label: "Next Monday", due: at(nextMonday, 9) },
      { label: "No date", due: null },
    ];
  },

  // overdue | today | upcoming | undated | done
  bucket(flag, now = new Date()) {
    if (flag.done) return "done";
    if (!flag.due) return "undated";
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);
    if (flag.due <= now.getTime()) return "overdue";
    if (flag.due <= endOfToday.getTime()) return "today";
    return "upcoming";
  },

  formatDue(ts) {
    if (!ts) return "No date";
    return new Date(ts).toLocaleString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  },

  // <input type="datetime-local"> wants local time as YYYY-MM-DDTHH:mm.
  toInputValue(ts) {
    const d = new Date(ts || Date.now() + 24 * 3600 * 1000);
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  },
};
