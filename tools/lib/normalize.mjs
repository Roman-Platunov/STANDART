/**
 * Path and field normalization for STANDART hybrid classifier.
 */

const SEGMENT_RE = /^[a-z0-9_]+$/;

/**
 * @param {string} path
 * @returns {string}
 */
export function normalizePath(path) {
  if (typeof path !== "string" || path.trim() === "") {
    throw new Error("path must be a non-empty string");
  }
  const normalized = path.trim().toLowerCase();
  const segments = normalized.split(".");
  if (segments.length < 2) {
    throw new Error(`path must have depth >= 2: ${path}`);
  }
  for (const seg of segments) {
    if (!seg || !SEGMENT_RE.test(seg)) {
      throw new Error(`invalid path segment '${seg}' in: ${path}`);
    }
  }
  return segments.join(".");
}

/**
 * @param {string} unit
 * @returns {string}
 */
export function normalizeUnit(unit) {
  if (typeof unit !== "string" || unit.length === 0) {
    throw new Error("unit must be a non-empty string");
  }
  return unit.trim();
}

/**
 * @param {string} kind
 * @returns {string}
 */
export function normalizeKind(kind) {
  if (typeof kind !== "string" || kind.trim() === "") {
    throw new Error("kind must be a non-empty string");
  }
  return kind.trim().toLowerCase();
}
