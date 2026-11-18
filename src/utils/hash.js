export function hash(str) {
  let x = 2166136261;
  for (const c of str) {
    x ^= c.charCodeAt(0);
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}
