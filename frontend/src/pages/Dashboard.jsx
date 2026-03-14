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
    <section className="fade-in space-y-8">
      <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
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

      <section className="space-y-4 rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="text-lg font-semibold">Diagnosis History</h2>
        {history.length > 0 ? (
          <div className="space-y-3">
            {history.map((entry, index) => (
              <div
                key={`${entry.timestamp}-${index}`}
                className="rounded-xl border border-white/30 bg-white/60 p-4 text-sm shadow-md backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
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
