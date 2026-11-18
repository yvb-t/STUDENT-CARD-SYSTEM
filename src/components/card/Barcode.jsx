import { useMemo } from "react";
import { generateQRCodeMatrix } from "../../utils/qr";

// Code 39 standard pattern table (ISO/IEC 16388)
// 9 elements: 5 bars, 4 spaces. '1' = wide (3 units), '0' = narrow (1 unit)
const CODE39_MAP = {
  "0": "000110100",
  "1": "100100001",
  "2": "001100001",
  "3": "101100000",
  "4": "000110001",
  "5": "100110000",
  "6": "001110000",
  "7": "000100101",
  "8": "100100100",
  "9": "001100100",
  "A": "100001001",
  "B": "001001001",
  "C": "101001000",
  "D": "000011001",
  "E": "100011000",
  "F": "001011000",
  "G": "000001101",
  "H": "100001100",
  "I": "001001100",
  "J": "000011100",
  "K": "100000011",
  "L": "001000011",
  "M": "101000010",
  "N": "000010011",
  "O": "100010010",
  "P": "001010010",
  "Q": "000000111",
  "R": "100000110",
  "S": "001000110",
  "T": "000010110",
  "U": "110000001",
  "V": "011000001",
  "W": "111000000",
  "X": "010010001",
  "Y": "110010000",
  "Z": "011010000",
  "-": "010000101",
  ".": "110000100",
  " ": "011000100",
  "$": "010101000",
  "/": "010100010",
  "+": "010001010",
  "%": "000101010",
  "*": "010010100",
};

export default function Barcode({ id, showQR = true }) {
  // Generate authentic Code 39 Barcode
  const { bars, totalWidth } = useMemo(() => {
    const raw = (id || "STUDENT").toUpperCase().replace(/[^0-9A-Z-. $/+%]/g, "");
    const text = `*${raw}*`; // Code 39 requires start/stop asterisks

    const barList = [];
    const narrow = 1;
    const wide = 2.8;
    const gap = 1;
    const quietZone = 8;

    let x = quietZone;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const pattern = CODE39_MAP[char] || CODE39_MAP["-"];

      for (let j = 0; j < 9; j++) {
        const isBar = j % 2 === 0;
        const isWide = pattern[j] === "1";
        const width = isWide ? wide : narrow;

        if (isBar) {
          barList.push({ x, w: width });
        }
        x += width;
      }

      // Inter-character space (gap)
      if (i < text.length - 1) {
        x += gap;
      }
    }

    x += quietZone;
    return { bars: barList, totalWidth: x };
  }, [id]);

  // Generate authentic 25x25 QR Code matrix
  const qrMatrix = useMemo(() => {
    try {
      return generateQRCodeMatrix(id || "ID-0000");
    } catch (e) {
      return null;
    }
  }, [id]);

  return (
    <div className="sc-codes-container">
      {/* 2D Scannable QR Code */}
      {showQR && qrMatrix && (
        <div className="sc-qrcode-wrap" title={`Scan QR Code: ${id}`}>
          <svg
            className="sc-qrcode-svg"
            viewBox="0 0 29 29"
            aria-label={`QR Code for ${id}`}
          >
            <rect width="29" height="29" fill="#ffffff" />
            {qrMatrix.map((row, r) =>
              row.map((cell, c) =>
                cell === 1 ? (
                  <rect
                    key={`${r}-${c}`}
                    x={c + 2}
                    y={r + 2}
                    width="1"
                    height="1"
                    fill="#121826"
                  />
                ) : null
              )
            )}
          </svg>
          <span className="sc-qr-lbl">SCAN PASS</span>
        </div>
      )}

      {/* 1D Scannable Code 39 Barcode */}
      <div className="sc-barcode-wrap">
        <svg
          className="sc-barcode"
          viewBox={`0 0 ${totalWidth} 40`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <rect width={totalWidth} height="40" fill="#ffffff" />
          {bars.map((b, i) => (
            <rect
              key={i}
              x={b.x}
              y="0"
              width={b.w}
              height="40"
              fill="#121826"
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
