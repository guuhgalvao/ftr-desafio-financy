// Key that makes category titles unique per user regardless of case, accents and spacing:
// "Saúde", "saude" and "  SAÚDE " all map to "saude".
export function toTitleKey(title: string): string {
  return title.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/\s+/g, ' ')
}
