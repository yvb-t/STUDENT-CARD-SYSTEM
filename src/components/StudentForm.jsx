import { useRef } from "react";
import { DEPTS } from "../data/departments";

const BLOOD_GROUPS = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];

export default function StudentForm({ student, onChange, onAdd, onRemove }) {
  const fileInputRef = useRef(null);

  const set = (key, isNumber) => (e) =>
    onChange({ ...student, [key]: isNumber ? Number(e.target.value) : e.target.value });

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Optimize to max 320x320 for ultra-efficient localStorage persistence
        const maxDim = 320;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.88);
        onChange({ ...student, photo: optimizedDataUrl });
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);

    // Reset so same file can be selected again
    e.target.value = "";
  };

  const removePhoto = () => {
    onChange({ ...student, photo: null });
  };

  return (
    <form className="sc-form" onSubmit={(e) => e.preventDefault()}>
      {student ? (
        <>
          {/* Photo Upload Section */}
          <div className="sc-photo-field">
            <label className="sc-photo-label">Student Photo</label>
            <div className="sc-photo-upload-row">
              <div className="sc-form-thumb">
                {student.photo ? (
                  <img src={student.photo} alt={student.name} />
                ) : (
                  <div className="sc-thumb-placeholder">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="sc-photo-actions">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: "none" }}
                  id="sc-photo-input"
                />
                <div className="sc-photo-btn-group">
                  <button
                    type="button"
                    className="sc-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷 {student.photo ? "Change Photo" : "Upload Photo"}
                  </button>
                  {student.photo && (
                    <button
                      type="button"
                      className="sc-remove-photo-btn"
                      onClick={removePhoto}
                      title="Remove photo and use pattern"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <small className="sc-photo-hint">
                  {student.photo
                    ? "Photo active on ID card"
                    : "Upload JPG, PNG or WEBP (generative pattern used if none)"}
                </small>
              </div>
            </div>
          </div>

          <label>
            Full name
            <input value={student.name || ""} onChange={set("name")} />
          </label>

          <div className="sc-two">
            <label>
              Student ID
              <input value={student.id || ""} onChange={set("id")} />
            </label>
            <label>
              Department
              <select value={student.dept} onChange={set("dept")}>
                {Object.keys(DEPTS).map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Programme
            <input value={student.program || ""} onChange={set("program")} />
          </label>

          <div className="sc-two">
            <label>
              Semesters punched (0 to 8)
              <input
                type="number"
                min="0"
                max="8"
                value={student.sem ?? 0}
                onChange={set("sem", true)}
              />
            </label>
            <label>
              Valid until
              <input type="date" value={student.until || ""} onChange={set("until")} />
            </label>
          </div>

          {/* Blood Group and Date of Birth */}
          <div className="sc-two">
            <label>
              Blood group
              <select
                value={student.bloodGroup || ""}
                onChange={set("bloodGroup")}
              >
                <option value="">Not specified</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date of birth
              <input type="date" value={student.dob || ""} onChange={set("dob")} />
            </label>
          </div>

          {/* Emergency Phone & Residential Address */}
          <label>
            Emergency contact / Phone
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={student.phone || ""}
              onChange={set("phone")}
            />
          </label>

          <label>
            Residential address
            <textarea
              rows="2"
              placeholder="Street, City, State/Province, Postal Code"
              value={student.address || ""}
              onChange={set("address")}
            />
          </label>
        </>
      ) : (
        <p className="sc-hint">No students yet. Add one to start.</p>
      )}

      <div className="sc-btns">
        <button type="button" className="primary" onClick={onAdd}>
          Add student
        </button>
        {student && (
          <button type="button" className="danger" onClick={onRemove}>
            Delete student
          </button>
        )}
      </div>
    </form>
  );
}
