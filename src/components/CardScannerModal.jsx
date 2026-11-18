import { useState, useEffect, useRef } from "react";
import { isExpired, fmtDate } from "../utils/dates";
import Avatar from "./card/Avatar";

export default function CardScannerModal({ students, isOpen, onClose, onSelectStudent }) {
  const [scanInput, setScanInput] = useState("");
  const [lastScanned, setLastScanned] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Play auditory feedback on scan
  const playSound = (success) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        // High pleasant two-tone chime for valid card
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        // Low buzzer tone for expired / invalid card
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch (e) {
      /* AudioContext not allowed or not supported */
    }
  };

  // Perform card lookup & validation
  const processScan = (rawId) => {
    if (!rawId || !rawId.trim()) return;
    const cleanId = rawId.trim().toUpperCase().replace(/\*/g, "");

    const matched = students.find(
      (s) => s.id.toUpperCase().replace(/\*/g, "") === cleanId
    );

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    if (matched) {
      const expired = isExpired(matched);
      const result = {
        student: matched,
        status: expired ? "EXPIRED" : "GRANTED",
        time: timeStr,
        rawId: cleanId,
      };

      playSound(!expired);
      setLastScanned(result);
      setScanHistory((prev) => [result, ...prev.slice(0, 9)]);
    } else {
      playSound(false);
      const result = {
        student: null,
        status: "NOT_FOUND",
        time: timeStr,
        rawId: cleanId,
      };
      setLastScanned(result);
      setScanHistory((prev) => [result, ...prev.slice(0, 9)]);
    }

    setScanInput("");
  };

  // Web camera barcode scanner lifecycle
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
      setCameraError("");
      return;
    }

    let intervalId = null;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setCameraError("Camera not supported on this browser.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }

        // If native BarcodeDetector API is available (Chrome / Edge / Android)
        if ("BarcodeDetector" in window) {
          const detector = new window.BarcodeDetector({
            formats: ["qr_code", "code_39", "code_128"],
          });

          intervalId = setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  const val = barcodes[0].rawValue;
                  processScan(val);
                }
              } catch (err) {
                /* Detection error */
              }
            }
          }, 400);
        }
      } catch (err) {
        setCameraError("Camera access denied or unavailable. Use simulation or type ID.");
        setIsCameraActive(false);
      }
    }

    startCamera();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="sc-scanner-overlay" role="dialog" aria-modal="true" aria-label="Campus Card Scanner">
      <div className="sc-scanner-modal">
        {/* Scanner Modal Header */}
        <div className="sc-scanner-head">
          <div className="sc-scanner-title">
            <span className="sc-scanner-live-dot" />
            <h3>Campus Gate & Library Scanner</h3>
          </div>
          <button type="button" className="sc-scanner-close" onClick={onClose} aria-label="Close scanner">
            ✕
          </button>
        </div>

        <div className="sc-scanner-body">
          {/* LEFT: Camera Viewfinder & Laser */}
          <div className="sc-scanner-viewport-wrap">
            <div className="sc-scanner-viewfinder">
              {isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline muted className="sc-camera-video" />
              ) : (
                <div className="sc-camera-fallback">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="16" rx="3" />
                    <circle cx="12" cy="12" r="3.5" />
                    <line x1="8" y1="2" x2="16" y2="2" />
                  </svg>
                  <p>{cameraError || "Camera ready for scanning"}</p>
                  <small>Point card barcode/QR code at camera or use quick-tap below</small>
                </div>
              )}

              {/* Laser Scan Sweep Animation */}
              <div className="sc-scanner-laser" />
              <div className="sc-scanner-reticle" />
            </div>

            {/* Manual Scan Input / Hardware Gun Bar */}
            <form
              className="sc-manual-scan-form"
              onSubmit={(e) => {
                e.preventDefault();
                processScan(scanInput);
              }}
            >
              <input
                type="text"
                placeholder="Scan / Type Student ID (e.g. 24-CS-0417)"
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                autoFocus
              />
              <button type="submit" className="primary">
                Verify
              </button>
            </form>

            {/* Quick Card Tap Simulator */}
            <div className="sc-quick-tap-section">
              <span className="sc-quick-tap-label">Quick Scan Simulator (Tap any card):</span>
              <div className="sc-quick-tap-pills">
                {students.slice(0, 6).map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    className="sc-quick-tap-btn"
                    onClick={() => processScan(s.id)}
                  >
                    <span>{s.name}</span>
                    <small>({s.id})</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Scan Result & Access Verification */}
          <div className="sc-scanner-result-col">
            <h4 className="sc-result-head">Verification Status</h4>

            {lastScanned ? (
              <div
                className={`sc-scan-result-card ${
                  lastScanned.status === "GRANTED"
                    ? "status-granted"
                    : lastScanned.status === "EXPIRED"
                    ? "status-expired"
                    : "status-denied"
                }`}
              >
                {/* Status Banner */}
                <div className="sc-status-banner">
                  {lastScanned.status === "GRANTED" && (
                    <>
                      <span className="sc-status-icon">✓</span>
                      <div>
                        <b>ACCESS GRANTED</b>
                        <small>Valid Campus Pass • {lastScanned.time}</small>
                      </div>
                    </>
                  )}
                  {lastScanned.status === "EXPIRED" && (
                    <>
                      <span className="sc-status-icon">✕</span>
                      <div>
                        <b>ACCESS DENIED (EXPIRED)</b>
                        <small>Pass validity period has ended • {lastScanned.time}</small>
                      </div>
                    </>
                  )}
                  {lastScanned.status === "NOT_FOUND" && (
                    <>
                      <span className="sc-status-icon">!</span>
                      <div>
                        <b>RECORD NOT FOUND</b>
                        <small>Unrecognized ID: {lastScanned.rawId} • {lastScanned.time}</small>
                      </div>
                    </>
                  )}
                </div>

                {/* Scanned Student Profile */}
                {lastScanned.student && (
                  <div className="sc-scanned-profile">
                    <div className="sc-scanned-avatar-row">
                      <Avatar student={lastScanned.student} />
                      <div className="sc-scanned-info">
                        <h4 className="sc-scanned-name">{lastScanned.student.name}</h4>
                        <p className="sc-scanned-prog">{lastScanned.student.program}</p>
                        <span className="sc-scanned-dept-pill">
                          {lastScanned.student.dept}
                        </span>
                      </div>
                    </div>

                    <div className="sc-scanned-meta">
                      <div>
                        <small>STUDENT ID</small>
                        <b>{lastScanned.student.id}</b>
                      </div>
                      <div>
                        <small>VALID UNTIL</small>
                        <b>{fmtDate(lastScanned.student.until)}</b>
                      </div>
                      <div>
                        <small>BLOOD GROUP</small>
                        <b>{lastScanned.student.bloodGroup || "—"}</b>
                      </div>
                      <div>
                        <small>SEMESTER</small>
                        <b>Term {lastScanned.student.sem}/8</b>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="sc-jump-btn"
                      onClick={() => {
                        onSelectStudent(lastScanned.student.id);
                        onClose();
                      }}
                    >
                      ✏️ Open in Card Editor
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="sc-scan-empty-state">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20M2 12h20" />
                </svg>
                <p>Awaiting Card Scan...</p>
                <small>Point card barcode at the camera, scan with laser gun, or tap a student above.</small>
              </div>
            )}

            {/* Live Access Log */}
            <div className="sc-scan-history">
              <span className="sc-history-title">Turnstile Entry Log ({scanHistory.length})</span>
              <div className="sc-history-list">
                {scanHistory.map((item, idx) => (
                  <div key={idx} className="sc-history-row">
                    <span className="sc-history-time">{item.time}</span>
                    <span className="sc-history-name">
                      {item.student ? item.student.name : item.rawId}
                    </span>
                    <span
                      className={`sc-history-tag ${
                        item.status === "GRANTED" ? "granted" : "denied"
                      }`}
                    >
                      {item.status === "GRANTED" ? "PASSED" : "DENIED"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
