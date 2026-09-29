# Teams Follow-Up Flags (Chrome / Edge extension)

Flag any Microsoft Teams message (chats **and** channels, including channel replies) for follow up, give it a follow-up date, and keep a running list.

## What it does

- **Flag icon on hover** over any message in Teams on the web. Choose a preset (In 2 hours, Tomorrow 9 AM, In 3 days, Next Monday, No date) or pick an exact date and time, and add an optional note.
- **Flagged messages are highlighted** with an amber bar so they stand out when you scroll back.
- **Running list** in the toolbar icon: grouped as Due now / Due today / Upcoming / No date / Completed, with **Open chat**, **Done**, **Snooze** and **Delete**.
- **Reminders**: a desktop notification when a flag comes due (checked every 5 minutes) and a badge count of overdue items on the toolbar icon. Selecting the notification opens the conversation.
- **Syncs across devices** through your Chrome/Edge sign-in (`chrome.storage.sync`), so the list follows you between computers.

## Install (developer mode)

1. Open `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode**.
3. Select **Load unpacked** and choose this `teams-followup-extension` folder.
4. Open Teams in the browser (`teams.microsoft.com` or `teams.cloud.microsoft`), sign in, and hover over a message.
5. Pin the extension to the toolbar to see the follow-up list and badge.

For cross-device use, install it the same way on each computer and make sure browser sync is turned on. Chrome Web Store publishing would remove the developer-mode step; see "Rollout" below.

## Known limits (please read)

- **Web Teams only.** The extension cannot see inside the Windows desktop Teams app. Pinning Teams as a browser app (Chrome menu, Cast/Save/Share, Install Teams) gives a desktop-style window that still runs the extension.
- **Page markup can change.** Microsoft does not publish Teams' page structure. The selectors are grouped at the top of `content.js` (`SEL`); if the flag icon stops appearing after a Teams update, that is the only place that normally needs adjusting. This first version has not yet been tested against a live Teams tenant.
- **Deep links open the conversation, not the exact message.** "Open chat" returns to the chat or channel; the highlighted message is easy to find from there.
- **Storage:** roughly 500 flags of about 8 KB each fit in browser sync. Completing and deleting old flags keeps the list light.
- **Data handling:** flags (sender name, a 280-character preview, your note, the date) are stored only in your own browser profile and its sync account. Nothing is sent to any other server. Because previews come from work messages, confirm this is acceptable under your organization's policy, and note that Microsoft's own Teams "Save message" and Outlook flags are the sanctioned alternatives.

## Rollout

For personal use, developer mode is fine. For a team, IT can package it and force-install it via Chrome/Edge enterprise policy (`ExtensionInstallForcelist`) as a private extension, which also handles updates.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | Manifest V3 configuration and site permissions |
| `content.js` | Flag icon, date picker, highlighting inside Teams |
| `lib.js` | Shared storage, date presets and grouping logic |
| `popup.html/.css/.js` | The running follow-up list |
| `background.js` | Reminders, notifications, badge count |
