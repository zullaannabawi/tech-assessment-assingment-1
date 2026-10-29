/**
 * SHARED LIB — Pure presentation helpers.
 *
 * Price formatting lives here so the store never holds formatted strings
 * (refactoring-analysis smell S6) and the en-US convention has one home.
 */

export function formatUsdPrice(value: number): string {
  return '$' + value.toLocaleString('en-US')
}
