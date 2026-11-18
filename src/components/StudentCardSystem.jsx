import { useState, useEffect, useRef, useMemo } from "react";
import { StudentCard } from "./card";
import StudentForm from "./StudentForm";
import Roster from "./Roster";
import CardScannerModal from "./CardScannerModal";
import { useStudents } from "../hooks/useStudents";
import { useCollegeName } from "../hooks/useCollegeName";
import { DEPTS } from "../data/departments";

export default function StudentCardSystem({
  students: propStudents,
  setStudents: propSetStudents,
  collegeName: propCollegeName,
  setCollegeName: propSetCollegeName,
}) {
  const [internalStudents, internalSetStudents] = useStudents();
  const [internalCollegeName, internalSetCollegeName] = useCollegeName();

  const students = propStudents !== undefined ? propStudents : internalStudents;
  const setStudents = propSetStudents !== undefined ? propSetStudents : internalSetStudents;
  const collegeName = propCollegeName !== undefined ? propCollegeName : internalCollegeName;
  const setCollegeName = propSetCollegeName !== undefined ? propSetCollegeName : internalSetCollegeName;

  const [sel, setSel] = useState(0);
  const [isEditingCollege, setIsEditingCollege] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [previewMenu, setPreviewMenu] = useState(null);
  const previewMenuRef = useRef(null);
  const current = students[sel];

  // Quick stats calculation
  const activeCount = useMemo(
    () => students.filter((s) => new Date(s.until) >= new Date()).length,
    [students]
  );
  const expiredCount = students.length - activeCount;

  // Close preview context menu on outside click or Escape
  useEffect(() => {
    if (!previewMenu) return;

    const handlePointerDown = (e) => {
      if (previewMenuRef.current && !previewMenuRef.current.contains(e.target)) {
        setPreviewMenu(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setPreviewMenu(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [previewMenu]);

  const update = (next) =>
    setStudents((list) => list.map((s, i) => (i === sel ? next : s)));

  const add = () => {
    const n = Math.floor(Math.random() * 9000 + 1000);
    setStudents((list) => [
      ...list,
      {
        id: `26-CS-${n}`,
        name: "New student",
        program: "Programme name",
        dept: "Computing",
        sem: 0,
        until: "2030-06-30",
        bloodGroup: "O+",
        phone: "",
        address: "",
        dob: "",
      },
    ]);
    setSel(students.length);
  };

  const removeIndex = (indexToRemove) => {
    setStudents((list) => list.filter((_, i) => i !== indexToRemove));
    setSel((prevSel) => {
      if (prevSel === indexToRemove) {
        return Math.max(0, Math.min(prevSel, students.length - 2));
      }
      if (prevSel > indexToRemove) {
        return prevSel - 1;
      }
      return prevSel;
    });
    setPreviewMenu(null);
  };

  const remove = () => {
    removeIndex(sel);
  };

  const punch = () => {
    if (current && current.sem < 8) update({ ...current, sem: current.sem + 1 });
  };

  const handlePreviewContextMenu = (e) => {
    if (!current) return;
    e.preventDefault();
    e.stopPropagation();

    const menuWidth = 180;
    const menuHeight = 120;
    const x = Math.max(10, Math.min(e.clientX, window.innerWidth - menuWidth - 10));
    const y = Math.max(10, Math.min(e.clientY, window.innerHeight - menuHeight - 10));

    setPreviewMenu({ x, y });
  };

  const handleScannerSelect = (studentId) => {
    const idx = students.findIndex((s) => s.id === studentId);
    if (idx !== -1) {
      setSel(idx);
    }
  };

  return (
    <div className="sc-desk-root">
      {/* Desk Page Header */}
      <div className="sc-desk-header">
        <div>
          <h1>Registrar & Staff Desk</h1>
          <p className="sc-sub">
            Manage academic credentials, card issuing, and department rosters with live scannable passes.
          </p>
        </div>

        {/* Quick Summary Stats & Scanner Launch Action */}
        <div className="sc-desk-actions-bar">
          <div className="sc-stats-bar">
            <div className="sc-stat-card">
              <span className="sc-stat-val">{students.length}</span>
              <span className="sc-stat-lbl">Enrolled</span>
            </div>
            <div className="sc-stat-card">
              <span className="sc-stat-val good">{activeCount}</span>
              <span className="sc-stat-lbl">Active</span>
            </div>
            <div className="sc-stat-card">
              <span className="sc-stat-val bad">{expiredCount}</span>
              <span className="sc-stat-lbl">Expired</span>
            </div>
            <div className="sc-stat-card">
              <span className="sc-stat-val">{Object.keys(DEPTS).length}</span>
              <span className="sc-stat-lbl">Faculties</span>
            </div>
          </div>

          {/* Launch Scanner Button */}
          <button
            type="button"
            className="sc-scanner-trigger-btn"
            onClick={() => setIsScannerOpen(true)}
            title="Open Campus Gate & Library Barcode/QR Scanner"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
              <line x1="7" y1="12" x2="17" y2="12" strokeWidth="2.5" />
            </svg>
            <span>Scan Student Card</span>
          </button>
        </div>
      </div>

      {/* College / Institution Setting Bar */}
      <div className="sc-college-bar">
        <div className="sc-college-info">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="sc-college-label">College / University Name:</span>

          {isEditingCollege ? (
            <form
              className="sc-college-edit-form"
              onSubmit={(e) => {
                e.preventDefault();
                setIsEditingCollege(false);
              }}
            >
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="Enter college or university name"
                autoFocus
              />
              <button type="submit" className="sc-btn-sm primary">
                Save
              </button>
            </form>
          ) : (
            <div className="sc-college-display">
              <strong className="sc-college-text">{collegeName}</strong>
              <button
                type="button"
                className="sc-btn-sm"
                onClick={() => setIsEditingCollege(true)}
                title="Edit common college name"
              >
                ✏️ Edit name
              </button>
            </div>
          )}
        </div>
        <small className="sc-college-hint">Common across all student cards</small>
      </div>

      {/* Main Editing Stage: Preview & Form */}
      <section className="sc-stage">
        {/* Preview Panel */}
        <div className="sc-panel sc-preview">
          <div className="sc-preview-top-bar">
            <span className="sc-preview-tag">LIVE PASS PREVIEW</span>
            <span className="sc-preview-flip-hint">Click card to flip 🔄</span>
          </div>

          {current ? (
            <>
              <StudentCard
                student={current}
                collegeName={collegeName}
                onContextMenu={handlePreviewContextMenu}
              />
              <div className="sc-punch-wrap">
                <button
                  type="button"
                  className="sc-punch-btn"
                  onClick={punch}
                  disabled={current.sem >= 8}
                >
                  <span className="sc-punch-btn-title">🎟️ Punch Next Semester</span>
                  <span className="sc-punch-btn-sub">
                    {current.sem >= 8 ? "All 8 Terms Complete" : `Progress: Term ${current.sem}/8 completed`}
                  </span>
                </button>
              </div>
            </>
          ) : (
            <div className="sc-no-sel">
              <p>No student selected.</p>
              <small>Click any card in the roster or click "+ Add student".</small>
            </div>
          )}
        </div>

        {/* Editor Form Panel */}
        <div className="sc-panel sc-editor-panel">
          <div className="sc-editor-top-bar">
            <h2>Card Editor</h2>
            {current && <span className="sc-editor-id-pill">{current.id}</span>}
          </div>
          <StudentForm student={current} onChange={update} onAdd={add} onRemove={remove} />
        </div>
      </section>

      {/* Right Click Context Menu on Preview Card */}
      {previewMenu && current && (
        <div
          ref={previewMenuRef}
          className="sc-ctx-menu"
          style={{ left: previewMenu.x, top: previewMenu.y }}
          role="menu"
          aria-label={`Actions for ${current.name}`}
        >
          <div className="sc-ctx-header">{current.name}</div>
          <button
            type="button"
            className="sc-ctx-item danger"
            role="menuitem"
            onClick={() => removeIndex(sel)}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
            </svg>
            Delete student
          </button>
          <button
            type="button"
            className="sc-ctx-item"
            role="menuitem"
            disabled={current.sem >= 8}
            onClick={() => {
              punch();
              setPreviewMenu(null);
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Punch semester
          </button>
        </div>
      )}

      {/* Department-wise Roster Grid */}
      <Roster
        students={students}
        collegeName={collegeName}
        sel={sel}
        onSelect={setSel}
        onDelete={removeIndex}
      />

      {/* Interactive Campus Card Scanner Modal */}
      <CardScannerModal
        students={students}
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onSelectStudent={handleScannerSelect}
      />
    </div>
  );
}

export { StudentCardSystem as StaffPage };
