export default function StatCard({ title, value, icon, color, hint }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="mt-2 truncate text-2xl font-bold sm:text-3xl">
            {value}
          </h2>
          {hint ? (
            <p className="mt-2 text-sm text-gray-500">{hint}</p>
          ) : null}
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
