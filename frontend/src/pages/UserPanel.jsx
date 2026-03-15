import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken, getUserHistory, logoutUser } from "../services/auth.js";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const coercePercent = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return 0;
  }
  if (numeric <= 1) {
    return Math.round(numeric * 1000) / 10;
  }
  return Math.round(numeric * 10) / 10;
};

const UserPanel = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
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
        const entries = Array.isArray(data) ? data : [];
        setHistory(entries);
        if (entries.length > 0) {
          setSelectedId(entries[0].id);
        }
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

  const selectedEntry =
    history.find((entry) => entry.id === selectedId) || history[0];

  const predictions = useMemo(() => {
    if (!selectedEntry) {
      return [];
    }
    if (!Array.isArray(selectedEntry.diseases)) {
      return [];
    }
    return selectedEntry.diseases.map((disease, index) => ({
      disease,
      probability: coercePercent(selectedEntry.probabilities?.[index] ?? 0),
    }));
  }, [selectedEntry]);

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
              <div className="mt-4 max-h-[520px] space-y-4 overflow-y-auto pr-2">
                {history.map((entry, index) => {
                  const isActive = entry.id === selectedId;
                  return (
                    <button
                      key={`${entry.created_at}-${index}`}
                      className={`w-full rounded-xl border bg-white/60 p-4 text-left text-sm shadow-md backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                        isActive
                          ? "border-rose-300 ring-2 ring-rose-200"
                          : "border-white/30"
                      }`}
                      type="button"
                      onClick={() => setSelectedId(entry.id)}
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
                    </button>
                  );
                })}
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
                Selected Diagnosis
              </h2>
              {selectedEntry ? (
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <p className="text-xs uppercase tracking-widest text-rose-500">
                    {new Date(selectedEntry.created_at).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">
                      Top prediction:
                    </span>{" "}
                    {selectedEntry.top_prediction}
                  </p>
                  <p>
                    <span className="font-medium text-slate-900">Symptoms:</span>{" "}
                    {selectedEntry.symptoms.join(", ")}
                  </p>
                  {selectedEntry.risk_factors?.length ? (
                    <p>
                      <span className="font-medium text-slate-900">
                        Risk factors:
                      </span>{" "}
                      {selectedEntry.risk_factors.join(", ")}
                    </p>
                  ) : null}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  Select a diagnosis entry to view details.
                </p>
              )}
            </div>

            <div className="rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
              <h2 className="text-lg font-semibold text-slate-900">
                Prediction Confidence Chart
              </h2>
              {predictions.length > 0 ? (
                <div className="mt-4 h-64 rounded-lg border border-rose-100 bg-rose-50/40 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={predictions} margin={{ left: 0, right: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="disease" tick={{ fontSize: 12 }} />
                      <YAxis
                        domain={[0, 100]}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Probability"]}
                      />
                      <Bar dataKey="probability" fill="#e11d48" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  Select a diagnosis entry to view prediction confidence.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default UserPanel;
