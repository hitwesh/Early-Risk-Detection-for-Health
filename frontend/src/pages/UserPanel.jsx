import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserHistory, logoutUser } from "../services/auth.js";

const UserPanel = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      if (!getToken()) {
        setError("Login required to view your history.");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      setIsLoading(true);
      setError("");
      try {
        const data = await getUserHistory();
        setHistory(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.status === 401) {
          logoutUser();
          setError("Login required to view your history.");
          navigate("/login");
          return;
        }
        setError("Unable to load diagnosis history.");
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, [navigate]);

  const latestEntry = history[0];
  const totalDiagnoses = history.length;

  return (
    <section className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            User Health Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Track your recent diagnoses, health insights, and AI prediction
            history in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
              Total Diagnoses
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {isLoading ? "--" : totalDiagnoses}
            </p>
          </div>
          <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
              Last Diagnosis Date
            </p>
            <p className="mt-3 text-sm text-slate-700">
              {latestEntry
                ? new Date(latestEntry.created_at).toLocaleString()
                : "No records yet"}
            </p>
          </div>
          <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
              Top Predicted Condition
            </p>
            <p className="mt-3 text-sm text-slate-700">
              {latestEntry?.top_prediction ?? "No predictions"}
            </p>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900">
              Recent Diagnoses
            </h2>
            {error ? (
              <p className="mt-3 text-sm text-rose-600">{error}</p>
            ) : history.length > 0 ? (
              <div className="mt-4 space-y-4">
                {history.slice(0, 4).map((entry, index) => (
                  <div
                    key={`${entry.created_at}-${index}`}
                    className="rounded-xl border border-white/30 bg-white/60 p-4 text-sm shadow-md backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
                  >
                    <p className="text-xs uppercase tracking-widest text-rose-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </p>
                    <p className="mt-2 text-slate-700">
                      Symptoms: {entry.symptoms.join(", ")}
                    </p>
                    <p className="mt-1 font-medium text-slate-900">
                      Top prediction: {entry.top_prediction}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                No diagnosis history yet. Submit symptoms to get started.
              </p>
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
              <h2 className="text-lg font-semibold text-slate-900">
                Health Insights
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Monitor shifts in your reported symptoms and track how AI
                predictions evolve across sessions.
              </p>
            </div>
            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
              <h2 className="text-lg font-semibold text-slate-900">
                AI Predictions History
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                Review AI prediction trends and risk signals over time to stay
                informed.
              </p>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserPanel;
