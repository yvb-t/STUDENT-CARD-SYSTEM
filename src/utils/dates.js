export const fmtDate = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { month: "short", year: "numeric" });

export const fmtFull = (d) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export const isExpired = (student) => new Date(student.until) < new Date();
