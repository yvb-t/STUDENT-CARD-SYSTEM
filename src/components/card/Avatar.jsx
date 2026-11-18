import { useMemo } from "react";
import { DEPTS } from "../../data/departments";
import { hash } from "../../utils/hash";

export default function Avatar({ student }) {
  const deptData = DEPTS[student.dept] || { color: "#0E7C86" };
  const color = deptData.color;

  const cells = useMemo(() => {
    const n = hash(student.id);
    const out = [];
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 3; x++) {
        if ((n >> (y * 3 + x)) & 1) {
          out.push([x, y]);
          if (x !== 2) out.push([4 - x, y]);
        }
      }
    }
    return out;
  }, [student.id]);

  // If a real photo is uploaded, display it
  if (student.photo) {
    return (
      <div className="sc-avatar has-photo">
        <img
          src={student.photo}
          alt={student.name || "Student photo"}
          className="sc-avatar-img"
        />
      </div>
    );
  }

  // Fallback to generative security geometric pattern
  return (
    <div className="sc-avatar">
      <svg viewBox="0 0 5 5" role="img" aria-label={`Pattern for ${student.name}`}>
        <rect width="5" height="5" fill={color} opacity=".16" />
        {cells.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="1" height="1" fill={color} />
        ))}
      </svg>
    </div>
  );
}
