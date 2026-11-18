export default function Header({ role, collegeName = "Campus University", onSignOut }) {
  return (
    <header className="sc-head">
      <div className="sc-brand-group">
        <div className="sc-brand-crest" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-4z" />
            <path d="M8 11h8M8 14h5" />
          </svg>
        </div>
        <div className="sc-brand-titles">
          <b className="sc-brand">{collegeName}</b>
          <span className="sc-brand-sub">STUDENT IDENTITY DESK</span>
        </div>
      </div>
      <div className="sc-nav">
        <span className={`sc-role ${role}`}>
          <span className="sc-role-dot" />
          {role === "staff" ? "Staff Administrator" : "Student Portal"}
        </span>
        <button type="button" className="sc-signout-btn" onClick={onSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}
