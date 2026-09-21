/**
 * Redirect helpers shared by the admin Server Actions.
 *
 * Not in a 'use server' file: those may only export async functions, and both
 * of these are plain synchronous string helpers.
 */

/**
 * Where an admin action sends the browser back to.
 *
 * The list pages carry filters and a page number in the query string; without
 * this, marking one order shipped would bounce the team back to page 1 of an
 * unfiltered list every time.
 */
export function returnPath(formData: FormData, fallback: string): string {
  const value = formData.get('returnTo')
  if (typeof value !== 'string' || !value.startsWith('/admin')) return fallback
  if (value.includes('//') || value.includes('\\')) return fallback
  return value
}

/** Appends a short outcome note the list page renders once. */
export function withNote(path: string, note: string): string {
  return `${path}${path.includes('?') ? '&' : '?'}note=${note}`
}
