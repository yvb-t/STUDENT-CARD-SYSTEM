export default function Field({ label, value }) {
  return (
    <div className="sc-fld">
      <small>{label}</small>
      <b>{value}</b>
    </div>
  );
}
