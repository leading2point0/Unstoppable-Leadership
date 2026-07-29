import { describe, expect, it } from "vitest";
import { buildIcsFile, recurrenceToRRule } from "@/lib/ics";

describe("buildIcsFile", () => {
  it("produces a valid single-event ICS structure", () => {
    const ics = buildIcsFile({
      uid: "abc-123",
      title: "Complete a courage action",
      description: "Take the smallest version of the action this week.",
      start: new Date("2026-08-01T13:00:00Z"),
      durationMinutes: 30,
    });

    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("UID:abc-123");
    expect(ics).toContain("SUMMARY:Complete a courage action");
    expect(ics).toContain("DTSTART:20260801T130000Z");
    expect(ics).toContain("DTEND:20260801T133000Z");
    expect(ics).toContain("END:VEVENT");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("escapes special characters in text fields", () => {
    const ics = buildIcsFile({
      uid: "1",
      title: "Call John; discuss, review\nnotes",
      start: new Date("2026-08-01T13:00:00Z"),
      durationMinutes: 15,
    });
    expect(ics).toContain("SUMMARY:Call John\\; discuss\\, review\\nnotes");
  });

  it("includes an RRULE only when a recurrence rule is provided", () => {
    const withRule = buildIcsFile({
      uid: "1",
      title: "Daily walk",
      start: new Date("2026-08-01T13:00:00Z"),
      durationMinutes: 20,
      recurrenceRule: "FREQ=DAILY",
    });
    expect(withRule).toContain("RRULE:FREQ=DAILY");

    const withoutRule = buildIcsFile({
      uid: "2",
      title: "One-time task",
      start: new Date("2026-08-01T13:00:00Z"),
      durationMinutes: 20,
    });
    expect(withoutRule).not.toContain("RRULE");
  });
});

describe("recurrenceToRRule", () => {
  it("maps known recurrence values", () => {
    expect(recurrenceToRRule("daily")).toBe("FREQ=DAILY");
    expect(recurrenceToRRule("weekly")).toBe("FREQ=WEEKLY");
    expect(recurrenceToRRule("biweekly")).toBe("FREQ=WEEKLY;INTERVAL=2");
    expect(recurrenceToRRule("monthly")).toBe("FREQ=MONTHLY");
    expect(recurrenceToRRule("weekdays")).toBe("FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR");
  });

  it("returns undefined for a one-time (none) recurrence", () => {
    expect(recurrenceToRRule("none")).toBeUndefined();
  });
});
