import type { FieldHook } from 'payload'

/** Convert Persian (۰-۹) and Arabic-Indic (٠-٩) numerals to Latin digits (0-9). */
const toLatinNumerals = (value: string): string =>
  value
    .replace(/[۰-۹]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x06f0 + 48))
    .replace(/[٠-٩]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x0660 + 48))

/**
 * Field hook: normalizes Persian/Arabic-Indic numerals to Latin digits.
 * Use on phone numbers, time fields, URL fields, etc.
 */
export const normalizeToLatin: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value
  return toLatinNumerals(value)
}

/**
 * Field hook: normalizes numerals + lowercases + strips to URL-safe characters.
 * Use on slug fields.
 */
export const normalizeSlug: FieldHook = ({ value }) => {
  if (typeof value !== 'string') return value
  return toLatinNumerals(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')    // spaces → hyphens
    .replace(/[^a-z0-9-]/g, '') // remove non-slug characters
    .replace(/-+/g, '-')     // collapse multiple hyphens
    .replace(/^-|-$/g, '')   // trim leading/trailing hyphens
}
