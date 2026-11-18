import { useState, useEffect } from "react";
import { SAMPLE_STUDENTS } from "../data/sampleStudents";

export const STORE_KEY = "scs-students-v1";

export function loadStudents() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= SAMPLE_STUDENTS.length) {
        return parsed;
      }
      // If user had the initial 4 sample students, merge with new sample students
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existingIds = new Set(parsed.map((s) => s.id));
        const merged = [
          ...parsed,
          ...SAMPLE_STUDENTS.filter((s) => !existingIds.has(s.id)),
        ];
        return merged;
      }
    }
  } catch (e) {
    /* storage unavailable, use samples */
  }
  return SAMPLE_STUDENTS;
}

export function useStudents() {
  const [students, setStudents] = useState(loadStudents);

  useEffect(() => {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(students));
    } catch (e) {
      /* storage unavailable, data stays in memory */
    }
  }, [students]);

  return [students, setStudents];
}
