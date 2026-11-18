import { useState } from "react";

const DEFAULT_STAFF_PIN = "staff123";

export default function LoginPage({ students, onStudent, onStaff, staffPin = DEFAULT_STAFF_PIN }) {
  const [role, setRole] = useState("student");
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const switchRole = (r) => {
    setRole(r);
    setValue("");
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (role === "student") {
      const match = students.find((s) => s.id.toLowerCase() === value.trim().toLowerCase());
      if (!match) {
        setError("No student found with that ID. Check the ID on your card.");
        return;
      }
      onStudent(match.id);
    } else {
      if (value !== staffPin) {
        setError("That PIN is not correct. Try again.");
        return;
      }
      onStaff();
    }
  };

  return (
    <div className="sc-loginwrap">
      <div className="sc-logincard">
        <div className="sc-logo" aria-hidden="true">
          <span />
        </div>
        <h1>Campus pass desk</h1>
        <p className="sc-sub">Sign in to continue</p>

        <div className="sc-seg" role="tablist" aria-label="Sign in as">
          <button
            type="button"
            role="tab"
            aria-selected={role === "student"}
            className={role === "student" ? "act" : ""}
            onClick={() => switchRole("student")}
          >
            Student
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "staff"}
            className={role === "staff" ? "act" : ""}
            onClick={() => switchRole("staff")}
          >
            Staff
          </button>
        </div>

        <form className="sc-form" onSubmit={submit}>
          <label>
            {role === "student" ? "Student ID" : "Staff PIN"}
            <input
              key={role}
              type={role === "student" ? "text" : "password"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
              autoFocus
            />
          </label>
          {error && <p className="sc-error" role="alert">{error}</p>}
          <button type="submit" className="primary sc-wide">Sign in</button>
        </form>
      </div>
    </div>
  );
}
