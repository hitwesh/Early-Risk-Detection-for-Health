const AdminPanel = () => {
  const stats = [
    { label: "Total Diagnoses Run", value: "12,450" },
    { label: "Active Users", value: "1,240" },
    { label: "Average Diagnosis Time", value: "4.2s" },
    { label: "AI Model Accuracy", value: "94.8%" },
  ];

  const activity = [
    { timestamp: "Today 09:15", user: "Demo User", disease: "Pneumonia" },
    { timestamp: "Today 08:42", user: "Demo User", disease: "Flu" },
    { timestamp: "Yesterday 19:30", user: "Demo User", disease: "Migraine" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            System Monitoring Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Monitor system health, model performance, and recent diagnosis
            activity.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-900">
              System Statistics
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Live operational metrics and AI performance indicators.
            </p>
          </div>
          <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Model Performance
            </h2>
            <p className="mt-3 text-sm text-slate-600">
              Review accuracy, confidence scores, and model drift alerts.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Diagnosis Activity
          </h2>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            {activity.map((row, index) => (
              <div
                key={`${row.timestamp}-${index}`}
                className="flex flex-col justify-between gap-2 rounded-xl border border-white/30 bg-white/60 p-4 shadow-md backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl md:flex-row md:items-center"
              >
                <span className="text-xs uppercase tracking-widest text-rose-500">
                  {row.timestamp}
                </span>
                <span className="font-medium text-slate-900">{row.user}</span>
                <span>{row.disease}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
