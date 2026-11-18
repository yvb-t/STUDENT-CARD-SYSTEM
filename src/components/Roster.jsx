import { useState, useEffect, useRef, useMemo } from "react";
import { StudentCard } from "./card";
import { DEPTS } from "../data/departments";

export default function Roster({ students, collegeName, sel, onSelect, onDelete }) {
  const [q, setQ] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);

  // Close context menu on outside click, window resize, scroll, or Escape key
  useEffect(() => {
    if (!menu) return;

    const handlePointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(null);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenu(null);
    };

    const handleScrollOrResize = () => setMenu(null);

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [menu]);

  const handleContextMenu = (e, index, student) => {
    e.preventDefault();
    e.stopPropagation();

    const menuWidth = 180;
    const menuHeight = 120;
    const x = Math.max(10, Math.min(e.clientX, window.innerWidth - menuWidth - 10));
    const y = Math.max(10, Math.min(e.clientY, window.innerHeight - menuHeight - 10));

    setMenu({
      x,
      y,
      index,
      student,
    });
  };

  const handleDelete = (index) => {
    if (onDelete) onDelete(index);
    setMenu(null);
  };

  const handleSelect = (index) => {
    if (onSelect) onSelect(index);
    setMenu(null);
  };

  // Filter students by search query
  const searchFiltered = useMemo(() => {
    return students
      .map((s, i) => ({ s, i }))
      .filter(({ s }) => {
        if (!q.trim()) return true;
        const query = q.toLowerCase();
        return (
          (s.name || "").toLowerCase().includes(query) ||
          (s.id || "").toLowerCase().includes(query) ||
          (s.program || "").toLowerCase().includes(query) ||
          (s.dept || "").toLowerCase().includes(query)
        );
      });
  }, [students, q]);

  // Group students by department
  const deptGroups = useMemo(() => {
    const groups = {};
    Object.keys(DEPTS).forEach((dept) => {
      groups[dept] = [];
    });

    searchFiltered.forEach((item) => {
      const dept = item.s.dept;
      if (groups[dept]) {
        groups[dept].push(item);
      } else {
        groups[dept] = [item];
      }
    });

    return groups;
  }, [searchFiltered]);

  const deptsList = Object.keys(DEPTS);

  // Cards to show when a specific department is selected
  const activeDeptStudents = useMemo(() => {
    if (selectedDept === "ALL") return [];
    return deptGroups[selectedDept] || [];
  }, [deptGroups, selectedDept]);

  // Active department configuration
  const activeDeptConfig = selectedDept !== "ALL" ? DEPTS[selectedDept] || { color: "#0E7C86", code: "CS" } : null;

  return (
    <div className="sc-roster-container">
      {/* Roster Controls Toolbar */}
      <div className="sc-roster-toolbar">
        <div className="sc-roster-title-area">
          <div className="sc-roster-heading">
            <h2>Student Roster</h2>
            <span className="sc-counter-badge">{students.length} Total</span>
          </div>


        </div>

        {/* Search & Department Selector Tabs */}
        <div className="sc-roster-filter-row">
          <div className="sc-search-wrap">
            <svg className="sc-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Search by name, ID, or programme..."
              aria-label="Search roster"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="sc-search-input"
            />
            {q && (
              <button
                type="button"
                className="sc-search-clear"
                onClick={() => setQ("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Option Buttons (Click to view all cards in that department) */}
          <div className="sc-dept-tabs" role="tablist" aria-label="Department filter">
            <button
              type="button"
              role="tab"
              aria-selected={selectedDept === "ALL"}
              className={`sc-dept-tab ${selectedDept === "ALL" ? "active" : ""}`}
              onClick={() => setSelectedDept("ALL")}
            >
              All Cards ({students.length})
            </button>
            {deptsList.map((d) => {
              const count = students.filter((s) => s.dept === d).length;
              const { color } = DEPTS[d] || { color: "#0E7C86" };
              return (
                <button
                  key={d}
                  type="button"
                  role="tab"
                  aria-selected={selectedDept === d}
                  className={`sc-dept-tab ${selectedDept === d ? "active" : ""}`}
                  style={{ "--tab-color": color }}
                  onClick={() => setSelectedDept(d)}
                >
                  <span className="sc-tab-dot" style={{ backgroundColor: color }} />
                  {d} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CONDITION 1: A SPECIFIC DEPARTMENT IS SELECTED -> SHOW ALL ITS CARDS IN A FULL GRID
          ========================================================================= */}
      {selectedDept !== "ALL" ? (
        <div className="sc-dept-showcase-view">
          {/* Department Banner Header */}
          <div
            className="sc-dept-showcase-banner"
            style={{ "--dept-accent": activeDeptConfig.color }}
          >
            <div className="sc-showcase-title-area">
              <span className="sc-showcase-code-badge">{activeDeptConfig.code}</span>
              <div>
                <h3 className="sc-showcase-name">{selectedDept} Department</h3>
                <span className="sc-showcase-sub">
                  Showing all {activeDeptStudents.length} cards belonging to {selectedDept}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="sc-showcase-back-btn"
              onClick={() => setSelectedDept("ALL")}
            >
              ← Back to All Cards
            </button>
          </div>

          {/* Grid of ALL Cards in this Department */}
          <div className="sc-grid">
            {activeDeptStudents.length === 0 ? (
              <div className="sc-empty">
                <p>No students found in {selectedDept}.</p>
                {q && <small>Search query "{q}" produced no results in this department.</small>}
              </div>
            ) : (
              activeDeptStudents.map(({ s, i }) => (
                <StudentCard
                  key={s.id || i}
                  student={s}
                  collegeName={collegeName}
                  selected={i === sel}
                  onClick={() => onSelect(i)}
                  onContextMenu={(e) => handleContextMenu(e, i, s)}
                  onDeptClick={(dept) => setSelectedDept(dept)}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* =========================================================================
           CONDITION 2: ALL CARDS -> SINGLE UNIFIED FLAT GRID (no department division)
           ========================================================================= */
        <section className="sc-grid">
          {searchFiltered.length === 0 ? (
            <div className="sc-empty">
              <p>No student cards found.</p>
              {q && <small>Try a different search query.</small>}
            </div>
          ) : (
            searchFiltered.map(({ s, i }) => (
              <StudentCard
                key={s.id || i}
                student={s}
                collegeName={collegeName}
                selected={i === sel}
                onClick={() => onSelect(i)}
                onContextMenu={(e) => handleContextMenu(e, i, s)}
                onDeptClick={(dept) => setSelectedDept(dept)}
              />
            ))
          )}
        </section>
      )}

      {/* Right Click Context Menu */}
      {menu && (
        <div
          ref={menuRef}
          className="sc-ctx-menu"
          style={{ left: menu.x, top: menu.y }}
          role="menu"
          aria-label={`Actions for ${menu.student.name}`}
        >
          <div className="sc-ctx-header">{menu.student.name}</div>
          <button
            type="button"
            className="sc-ctx-item danger"
            role="menuitem"
            onClick={() => handleDelete(menu.index)}
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
            onClick={() => handleSelect(menu.index)}
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
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Select & edit
          </button>
          <button
            type="button"
            className="sc-ctx-item"
            role="menuitem"
            onClick={() => {
              setSelectedDept(menu.student.dept);
              setMenu(null);
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
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Show all {menu.student.dept} cards
          </button>
        </div>
      )}
    </div>
  );
}
