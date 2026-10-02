// Key that makes category titles unique per user regardless of case, accents and spacing:
// "Saúde", "saude" and "  SAÚDE " all map to "saude". Symbols are kept, so the key is never empty
// for a non-empty title.
export function toTitleKey(title: string): string {
  return title.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/\s+/g, ' ')
}
