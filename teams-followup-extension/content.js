// Runs inside Teams (web). Shows a flag button when hovering a message and
// lets the user pick a follow-up date. Teams' page markup is not a public API
// and changes over time: if flagging stops working, the selectors below are
// the only things that should need updating.
(() => {
  const SEL = {
    message: [
      '[data-tid="chat-pane-message"]',
      '[data-tid="channel-pane-message"]',
      '[data-tid="channel-replies-pane-message"]',
    ].join(","),
    author: '[data-tid="message-author-name"]',
    body: '[data-tid="message-body"], [id^="content-"]',
    chatTitle: '[data-tid="chat-title"], [data-tid="thread-header-title"], h1',
  };

  const container = (el) => el.closest("[data-mid]") || el;
  const hash = (s) => {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  };

  function describe(msgEl) {
    const c = container(msgEl);
    const bodyEl = c.querySelector(SEL.body) || c;
    const preview = (bodyEl.innerText || "").trim().replace(/\s+/g, " ").slice(0, FU.PREVIEW_MAX);

    // Consecutive messages from one person omit the name, so fall back to the
    // closest author label that appears earlier on the page.
    let author = (c.querySelector(SEL.author) || {}).innerText || "";
    if (!author) {
      const all = [...document.querySelectorAll(SEL.author)];
      const before = all.filter((a) => a.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING);
      author = before.length ? before[before.length - 1].innerText : "";
    }
    author = author.trim();

    const time = c.querySelector("time");
    const sent = time ? time.getAttribute("datetime") || time.innerText : "";
    const mid = c.getAttribute("data-mid") || msgEl.getAttribute("data-mid") || hash(author + sent + preview);
    const titleEl = document.querySelector(SEL.chatTitle);
    const where = ((titleEl && titleEl.innerText) || document.title || "Teams").trim().slice(0, 120);
    return { id: mid, author, preview, sent, where, url: location.href };
  }

  // ---- flagged-message highlight ------------------------------------------
  const style = document.createElement("style");
  style.textContent = "[data-fu-flagged]{box-shadow: inset 4px 0 0 #d97706 !important; background: rgba(217,119,6,.07) !important;}";
  document.head.appendChild(style);

  let flaggedIds = new Set();
  async function refreshFlagged() {
    flaggedIds = new Set((await FU.all()).filter((f) => !f.done).map((f) => f.id));
    markAll();
  }
  function markAll() {
    document.querySelectorAll(SEL.message).forEach((m) => {
      const c = container(m);
      const mid = c.getAttribute("data-mid") || m.getAttribute("data-mid");
      const on = mid && flaggedIds.has(mid);
      // Hash-based ids are checked lazily when the popover opens.
      m.toggleAttribute("data-fu-flagged", !!on);
    });
  }
  let t;
  new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(markAll, 400);
  }).observe(document.body, { childList: true, subtree: true });
  chrome.storage.onChanged.addListener((_c, area) => area === "sync" && refreshFlagged());
  refreshFlagged();

  // ---- UI (shadow DOM keeps Teams' CSS from affecting it) -----------------
  const host = document.createElement("div");
  host.style.cssText = "position:fixed;z-index:2147483647;top:0;left:0;width:0;height:0;";
  const root = host.attachShadow({ mode: "open" });
  root.innerHTML = `
    <style>
      *{box-sizing:border-box;font-family:Segoe UI,system-ui,sans-serif}
      button{cursor:pointer}
      .flag{position:fixed;display:none;width:30px;height:30px;border:1px solid #c7c7c7;border-radius:6px;
        background:#fff;font-size:15px;line-height:1;box-shadow:0 1px 4px rgba(0,0,0,.25)}
      .flag:hover,.flag:focus-visible{background:#fff4e0;border-color:#d97706;outline:none}
      .pop{position:fixed;display:none;width:320px;background:#fff;color:#222;border:1px solid #c7c7c7;
        border-radius:8px;padding:12px;box-shadow:0 6px 24px rgba(0,0,0,.3);font-size:13px}
      .pop h3{margin:0 0 4px;font-size:14px}
      .snip{color:#555;margin:0 0 8px;max-height:48px;overflow:hidden}
      .chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
      .chips button{border:1px solid #bbb;background:#f5f5f5;border-radius:14px;padding:4px 10px;font-size:12px}
      .chips button:hover,.chips button:focus-visible{border-color:#d97706;background:#fff4e0}
      label{display:block;font-weight:600;margin:6px 0 2px}
      input,textarea{width:100%;border:1px solid #bbb;border-radius:4px;padding:5px;font-size:13px}
      .row{display:flex;gap:8px;margin-top:10px;justify-content:flex-end}
      .row .save{background:#b45309;color:#fff;border:0;border-radius:4px;padding:6px 14px}
      .row .ghost{background:none;border:1px solid #bbb;border-radius:4px;padding:6px 12px}
      .row .del{margin-right:auto;background:none;border:0;color:#b91c1c;text-decoration:underline}
      @media (prefers-color-scheme:dark){
        .pop{background:#2b2b2b;color:#eee;border-color:#555}.snip{color:#bbb}
        input,textarea{background:#1f1f1f;color:#eee;border-color:#666}
        .chips button,.row .ghost{background:#3a3a3a;color:#eee;border-color:#666}
        .flag{background:#2b2b2b;color:#eee;border-color:#666}
      }
    </style>
    <button class="flag" title="Flag for follow up" aria-label="Flag this message for follow up">&#9873;</button>
    <div class="pop" role="dialog" aria-label="Flag for follow up">
      <h3>Flag for follow up</h3>
      <p class="snip"></p>
      <div class="chips"></div>
      <label for="due">Follow-up date and time</label>
      <input id="due" type="datetime-local">
      <label for="note">Note (optional)</label>
      <textarea id="note" rows="2" maxlength="300" placeholder="What do you need to do?"></textarea>
      <div class="row">
        <button class="del" hidden>Remove flag</button>
        <button class="ghost cancel">Cancel</button>
        <button class="save">Save</button>
      </div>
    </div>`;
  document.body.appendChild(host);

  const $ = (s) => root.querySelector(s);
  const flagBtn = $(".flag");
  const pop = $(".pop");
  let hovered = null;
  let current = null; // message details being flagged
  let hideTimer;

  document.addEventListener("mouseover", (e) => {
    if (e.composedPath().includes(host)) return clearTimeout(hideTimer);
    const m = e.target.closest && e.target.closest(SEL.message);
    if (!m) return;
    clearTimeout(hideTimer);
    hovered = m;
    const r = m.getBoundingClientRect();
    flagBtn.style.top = Math.max(r.top + 4, 4) + "px";
    flagBtn.style.left = Math.max(r.right - 44, 4) + "px";
    flagBtn.style.display = "block";
  });
  document.addEventListener("mouseout", () => {
    hideTimer = setTimeout(() => (flagBtn.style.display = "none"), 600);
  });
  document.addEventListener("scroll", () => (flagBtn.style.display = "none"), true);
  document.addEventListener("keydown", (e) => e.key === "Escape" && closePop());

  flagBtn.addEventListener("click", async () => {
    if (!hovered) return;
    current = describe(hovered);
    const existing = await FU.get(current.id);
    $(".snip").textContent = (current.author ? current.author + ": " : "") + current.preview;
    $("#due").value = FU.toInputValue(existing ? existing.due : null);
    $("#note").value = existing ? existing.note || "" : "";
    $(".del").hidden = !existing;

    const chips = $(".chips");
    chips.textContent = "";
    for (const p of FU.presets()) {
      const b = document.createElement("button");
      b.textContent = p.label;
      b.addEventListener("click", () => save(p.due));
      chips.appendChild(b);
    }

    const r = flagBtn.getBoundingClientRect();
    pop.style.display = "block";
    pop.style.left = Math.max(Math.min(r.right - 320, innerWidth - 330), 8) + "px";
    pop.style.top = Math.min(r.bottom + 6, innerHeight - pop.offsetHeight - 8) + "px";
    $("#due").focus();
  });

  function closePop() {
    pop.style.display = "none";
    current = null;
  }

  async function save(due) {
    if (!current) return;
    if (due === undefined) {
      const v = $("#due").value;
      due = v ? new Date(v).getTime() : null;
    }
    await FU.save({
      ...current,
      due,
      note: $("#note").value.trim(),
      flaggedAt: Date.now(),
      done: false,
    });
    closePop();
  }

  $(".save").addEventListener("click", () => save());
  $(".cancel").addEventListener("click", closePop);
  $(".del").addEventListener("click", async () => {
    if (current) await FU.remove(current.id);
    closePop();
  });
})();
