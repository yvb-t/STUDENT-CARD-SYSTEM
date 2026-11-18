import { useState, useEffect } from "react";

export const COLLEGE_STORE_KEY = "scs-college-name-v1";
export const DEFAULT_COLLEGE_NAME = "CAMPUS UNIVERSITY";

export function useCollegeName() {
  const [collegeName, setCollegeName] = useState(() => {
    try {
      const stored = localStorage.getItem(COLLEGE_STORE_KEY);
      if (stored) return stored;
    } catch (e) {
      /* ignore */
    }
    return DEFAULT_COLLEGE_NAME;
  });

  useEffect(() => {
    try {
      localStorage.setItem(COLLEGE_STORE_KEY, collegeName);
    } catch (e) {
      /* ignore */
    }
  }, [collegeName]);

  return [collegeName, setCollegeName];
}
