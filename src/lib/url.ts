export function sitePath(path = "") {
  const base = "https://chanworks.vercel.app";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return path ? `${base}${normalizedPath}` : base;
}
