import { useState } from "react";
import { DEPTS } from "../../data/departments";
import { fmtDate, isExpired } from "../../utils/dates";
import Avatar from "./Avatar";
import Barcode from "./Barcode";
import Field from "./Field";
import Strip from "./Strip";
import "./card.css";

export default function StudentCard({
  student,
  collegeName = "CAMPUS UNIVERSITY",
  selected = false,
  onClick,
  onContextMenu,
  onDeptClick,
}) {
  const [flipped, setFlipped] = useState(false);

  const expired = isExpired(student);
  const deptInfo = DEPTS[student.dept] || { color: "#0E7C86", code: "CS" };
  const { color, code } = deptInfo;

  const toggle = () => {
    setFlipped((f) => !f);
    onClick?.();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
    }
  };

  const handleContextMenu = (e) => {
    if (onContextMenu) {
      e.preventDefault();
      onContextMenu(e, student);
    }
  };

  const cls = [
    "sc-card",
    flipped && "flipped",
    expired && "expired",
    selected && "sel",
  ]
    .filter(Boolean)
    .join(" ");

  const displayCollege = collegeName && collegeName.trim() ? collegeName.trim() : "CAMPUS UNIVERSITY";

  return (
    <div
      className={cls}
      style={{ "--dept": color }}
      role="button"
      tabIndex={0}
      aria-label={`Student card for ${student.name}. Press to flip.`}
      onClick={toggle}
      onKeyDown={onKeyDown}
      onContextMenu={handleContextMenu}
    >
      <div className="sc-inner">
        {/* ==================== FRONT FACE ==================== */}
        <div className="sc-face sc-front">
          {/* Lanyard Cutout Slot */}
          <div className="sc-lanyard-slot" aria-hidden="true">
            <span className="sc-lanyard-hole" />
          </div>

          {/* Department Code Watermark */}
          <div className="sc-mono" aria-hidden="true">{code}</div>

          {/* Main Card Content */}
          <div className="sc-main">
            {/* University Top Header */}
            <div className="sc-univ-header">
              <div className="sc-univ-brand">
                <svg className="sc-crest" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path
                    d="M12 2L4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3z"
                    fill={color}
                    fillOpacity="0.18"
                    stroke={color}
                  />
                  <path d="M8 9h8M8 12h5" stroke={color} strokeLinecap="round" />
                  <circle cx="12" cy="6" r="1" fill={color} />
                </svg>
                <div className="sc-univ-text">
                  <span className="sc-univ-name">{displayCollege}</span>
                  <span className="sc-univ-sub">STUDENT IDENTITY CARD</span>
                </div>
              </div>
              <span
                className="sc-dept-badge"
                onClick={(e) => {
                  if (onDeptClick) {
                    e.stopPropagation();
                    onDeptClick(student.dept);
                  }
                }}
                title={`Click to show all ${student.dept} cards`}
              >
                {student.dept}
              </span>
            </div>

            {/* Profile & Student Info Row */}
            <div className="sc-student-body">
              <div className="sc-photo-box">
                <Avatar student={student} />
                <span className="sc-role-tag">STUDENT</span>
              </div>

              <div className="sc-details-col">
                <p className="sc-name">{student.name || "Unnamed student"}</p>
                <p className="sc-prog">{student.program}</p>

                <div className="sc-meta-row">
                  <Field label="Student ID" value={student.id} />
                  <Field label="Valid Until" value={fmtDate(student.until)} />
                  {student.bloodGroup && (
                    <Field label="Blood Group" value={student.bloodGroup} />
                  )}
                </div>

                {/* Academic Privileges */}
                <div className="sc-perks-row" aria-label="Campus privileges">
                  <span className="sc-perk-pill">📚 Library</span>
                  <span className="sc-perk-pill">🏛️ Campus</span>
                  <span className="sc-perk-pill">🚌 Transit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Punch Notches */}
          <div className="sc-notch top" />
          <div className="sc-notch bot" />

          {/* Semester Punch Strip Stub */}
          <div className="sc-stub">
            <Strip sem={student.sem} />
          </div>
        </div>

        {/* ==================== BACK FACE ==================== */}
        <div className="sc-face sc-back">
          {/* Lanyard Cutout Slot */}
          <div className="sc-lanyard-slot" aria-hidden="true">
            <span className="sc-lanyard-hole" />
          </div>

          <div className="sc-back-content">
            {/* Back Header */}
            <div className="sc-back-head">
              <div>
                <b className="sc-back-institution">{displayCollege}</b>
                <span
                  className="sc-back-dept"
                  onClick={(e) => {
                    if (onDeptClick) {
                      e.stopPropagation();
                      onDeptClick(student.dept);
                    }
                  }}
                  title={`Click to show all ${student.dept} cards`}
                >
                  {student.dept} Division
                </span>
              </div>
              <span className={`sc-badge${expired ? " bad" : ""}`}>
                {expired ? "Expired" : "Active Pass"}
              </span>
            </div>

            {/* Cardholder Regulations */}
            <div className="sc-rules-box">
              <p>
                This credential is the property of the University. It is non-transferable and must be
                presented upon request for campus access, examination entry, and library services.
              </p>
            </div>

            {/* Personal Details: Blood Group, Emergency Contact, Address */}
            {(student.bloodGroup || student.phone || student.address || student.dob) && (
              <div className="sc-back-personal">
                <div className="sc-back-meta-row">
                  {student.bloodGroup && (
                    <div className="sc-back-fld">
                      <small>BLOOD GROUP</small>
                      <b>{student.bloodGroup}</b>
                    </div>
                  )}
                  {student.dob && (
                    <div className="sc-back-fld">
                      <small>DOB</small>
                      <b>{student.dob}</b>
                    </div>
                  )}
                  {student.phone && (
                    <div className="sc-back-fld">
                      <small>EMERGENCY CONTACT</small>
                      <b>{student.phone}</b>
                    </div>
                  )}
                </div>
                {student.address && (
                  <div className="sc-back-address">
                    <small>ADDRESS</small>
                    <p>{student.address}</p>
                  </div>
                )}
              </div>
            )}

            {/* Turnstile / Library Barcode & QR Code */}
            <div className="sc-white">
              <Barcode id={student.id} />
              <p className="sc-idline">*{student.id}*</p>
            </div>

            {/* Registrar Signature & Help Footer */}
            <div className="sc-back-foot">
              <div className="sc-foot-desk">
                <small>CAMPUS DESK & HELP</small>
                <span>registrar@campus.edu • Ext. 4400</span>
              </div>
              <div className="sc-foot-sign">
                <span className="sc-sign-script">Office of Academic Affairs</span>
                <small>AUTHORIZED REGISTRAR</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
