import { useEffect, useState } from "react";

const Dashboard = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("diagnosisHistory");
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (error) {
        setHistory([]);
      }
    }
  }, []);

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
          Patient Overview
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Review your recent diagnosis history and AI predictions.
        </p>
      </div>

      <section className="space-y-3 rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold">Diagnosis History</h2>
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm"
              >
                <p className="text-xs uppercase tracking-widest text-rose-500">
                  {new Date(entry.timestamp).toLocaleString()}
                </p>
                <p className="mt-2 text-slate-700">
                  Symptoms: {entry.symptoms.join(", ")}
                </p>
                <p className="mt-1 font-medium text-slate-900">
                  Top prediction: {entry.topPrediction}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-600">
            No diagnosis history yet. Submit symptoms to get started.
          </p>
        )}
      </section>
    </section>
  );
};

export default Dashboard;
