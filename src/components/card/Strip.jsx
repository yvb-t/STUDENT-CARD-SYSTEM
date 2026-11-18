export default function Strip({ sem }) {
  return (
    <div className="sc-stripwrap">
      <small>Term {sem}/8</small>
      <div className="sc-punch">
        {Array.from({ length: 8 }, (_, i) => (
          <i key={`${i}-${i === sem - 1}`} className={i < sem ? (i === sem - 1 ? "on last" : "on") : ""} />
        ))}
      </div>
    </div>
  );
}
