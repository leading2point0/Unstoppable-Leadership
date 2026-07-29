import { describe, expect, it } from "vitest";
import { canDisplayQuotePublicly } from "@/services/quotes";

describe("canDisplayQuotePublicly", () => {
  it("blocks unverified quotes from public display", () => {
    expect(canDisplayQuotePublicly({ verifiedByOwner: false })).toBe(false);
  });

  it("allows owner-verified quotes to display publicly", () => {
    expect(canDisplayQuotePublicly({ verifiedByOwner: true })).toBe(true);
  });
});
