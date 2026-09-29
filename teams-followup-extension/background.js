importScripts("lib.js");

// Every 5 minutes: notify about newly due flags and refresh the badge count.
const CHECK = "fu-check";
const NOTIFIED = "notified"; // stored per device so each device alerts once

chrome.runtime.onInstalled.addListener(schedule);
chrome.runtime.onStartup.addListener(schedule);
chrome.storage.onChanged.addListener((_c, area) => area === "sync" && check());
chrome.alarms.onAlarm.addListener((a) => a.name === CHECK && check());

function schedule() {
  chrome.alarms.create(CHECK, { periodInMinutes: 5, delayInMinutes: 0.1 });
}

async function check() {
  const flags = await FU.all();
  const now = new Date();
  const due = flags.filter((f) => ["overdue"].includes(FU.bucket(f, now)));

  chrome.action.setBadgeBackgroundColor({ color: "#b45309" });
  chrome.action.setBadgeText({ text: due.length ? String(due.length) : "" });

  const seen = (await chrome.storage.local.get(NOTIFIED))[NOTIFIED] || {};
  const next = {};
  for (const f of due) {
    // Re-alert if the due date was changed (e.g. snoozed) since last alert.
    next[f.id] = f.due;
    if (seen[f.id] === f.due) continue;
    chrome.notifications.create("fu:" + f.id, {
      type: "basic",
      iconUrl: "icons/128.png",
      title: "Follow up: " + (f.author || f.where || "Teams message"),
      message: f.note || f.preview || "A flagged Teams message is due.",
      priority: 1,
    });
  }
  await chrome.storage.local.set({ [NOTIFIED]: next });
}

chrome.notifications.onClicked.addListener(async (nid) => {
  const f = await FU.get(nid.replace(/^fu:/, ""));
  if (f && f.url) chrome.tabs.create({ url: f.url });
  chrome.notifications.clear(nid);
});
