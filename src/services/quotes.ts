export interface QuoteVerificationLike {
  verifiedByOwner: boolean;
}

/**
 * Single source of truth for "can this quote appear anywhere public."
 * Used both as a defense-in-depth filter in the repository layer (in
 * addition to the SQL WHERE clause) and directly in tests, so the rule
 * can't silently drift between the two.
 */
export function canDisplayQuotePublicly(quote: QuoteVerificationLike): boolean {
  return quote.verifiedByOwner === true;
}
