export function Stats({
  total,
  interviews,
  underReview,
  pending,
}: {
  total: number;
  interviews: number;
  underReview: number;
  pending: number;
}) {
  const items = [
    { label: "Total Applications", value: total },
    { label: "Interviews", value: interviews },
    { label: "Under Review", value: underReview },
    { label: "Pending", value: pending },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((i) => (
        <div key={i.label} className="rounded-2xl border border-subtle bg-surface p-5 shadow-elevated">
          <div className="text-3xl font-title font-bold">{i.value}</div>
          <div className="mt-1 text-sm text-main-light-text">{i.label}</div>
        </div>
      ))}
    </div>
  );
}


