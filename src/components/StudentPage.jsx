import { StudentCard } from "./card";
import { fmtFull, isExpired } from "../utils/dates";

export default function StudentPage({ student, collegeName }) {
  if (!student) {
    return (
      <section className="sc-panel sc-notfound">
        <h1>Record not found</h1>
        <p className="sc-sub">
          Your record was changed or removed. Sign out and sign in again, or ask the registrar office.
        </p>
      </section>
    );
  }

  const expired = isExpired(student);
  const rows = [
    ["Institution", collegeName || "Campus University"],
    ["Full name", student.name],
    ["Student ID", student.id],
    ["Department", student.dept],
    ["Programme", student.program],
    ["Semesters completed", `${student.sem} of 8`],
    ["Valid until", fmtFull(student.until)],
    student.bloodGroup ? ["Blood group", student.bloodGroup] : null,
    student.dob ? ["Date of birth", student.dob] : null,
    student.phone ? ["Emergency contact", student.phone] : null,
    student.address ? ["Address", student.address] : null,
    ["Card status", expired ? "Expired" : "Active"],
  ].filter(Boolean);

  return (
    <>
      <h1>Your student card</h1>
      <p className="sc-sub">Click the card to flip it. These details are read only.</p>
      <section className="sc-stage">
        <div className="sc-panel sc-preview">
          <StudentCard student={student} collegeName={collegeName} />
        </div>
        <div className="sc-panel">
          <dl className="sc-dl">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="sc-hint sc-lock">
            Only staff can change these details. Contact the registrar office to request a correction.
          </p>
        </div>
      </section>
    </>
  );
}
