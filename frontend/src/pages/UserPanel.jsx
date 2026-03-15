import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  downloadUserHistoryReport,
  downloadUserReport,
  getToken,
  getUserHistory,
  logoutUser,
} from "../services/auth.js";
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
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
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

  const riskFactorLabels = {
    diabetes: "Diabetes",
    hypertension: "Hypertension",
    smoking: "Smoking",
    alcohol: "Alcohol use",
    family_heart_disease: "Family heart disease",
    recent_infection: "Recent infection",
    pregnancy: "Pregnancy",
    chronic_disease: "Chronic disease",
  };

  const riskFactorKeys = Object.keys(riskFactorLabels);
  const selectedRiskFactors = selectedEntry?.risk_factors;
  const riskFactorSet = new Set(
    Array.isArray(selectedRiskFactors) ? selectedRiskFactors : [],
  );

  const handleDownloadSelected = async () => {
    if (!selectedEntry) {
      setDownloadError("Select a diagnosis entry to download.");
      return;
    }
    setDownloadError("");
    setIsDownloading(true);
    try {
      await downloadUserReport(selectedEntry.id);
    } catch (err) {
      setDownloadError("Unable to download the report.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadAll = async () => {
    setDownloadError("");
    setIsDownloading(true);
    try {
      await downloadUserHistoryReport();
    } catch (err) {
      setDownloadError("Unable to download the history report.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="space-y-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="eyebrow">Patient portal</p>
          <h1 className="mt-2 font-display text-3xl text-slate-900">
            User Health Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Track your recent diagnoses, health insights, and AI prediction
            history in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card p-6">
            <p className="eyebrow">Total diagnoses</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {isLoading ? "--" : totalDiagnoses}
            </p>
          </div>
          <div className="card p-6">
            <p className="eyebrow">Last diagnosis date</p>
            <p className="mt-3 text-sm text-slate-700">
              {latestEntry
                ? new Date(latestEntry.created_at).toLocaleString()
                : "No records yet"}
            </p>
          </div>
          <div className="card p-6">
            <p className="eyebrow">Top predicted condition</p>
            <p className="mt-3 text-sm text-slate-700">
              {latestEntry?.top_prediction ?? "No predictions"}
            </p>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Diagnoses</h2>
            {error ? (
              <p className="mt-3 text-sm text-rose-600">{error}</p>
            ) : history.length > 0 ? (
              <div className="mt-4 max-h-[520px] space-y-4 overflow-y-auto pr-2">
                {history.map((entry, index) => {
                  const isActive = entry.id === selectedId;
                  return (
                    <button
                      key={`${entry.created_at}-${index}`}
                      className={`w-full rounded-xl border bg-white p-4 text-left text-sm shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl ${
                        isActive
                          ? "border-teal-300 ring-2 ring-teal-100"
                          : "border-slate-200"
                      }`}
                      type="button"
                      onClick={() => setSelectedId(entry.id)}
                    >
                      <p className="text-xs uppercase tracking-widest text-teal-600">
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
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900">Selected Diagnosis</h2>
              {selectedEntry ? (
                <div className="mt-3 space-y-3 text-sm text-slate-700">
                  <p className="text-xs uppercase tracking-widest text-teal-600">
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
                  <div>
                    <span className="font-medium text-slate-900">
                      Risk factors:
                    </span>
                    <div className="mt-2 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                      {riskFactorKeys.map((key) => {
                        const isActive =
                          typeof selectedRiskFactors === "object" &&
                          !Array.isArray(selectedRiskFactors) &&
                          selectedRiskFactors !== null
                            ? Boolean(selectedRiskFactors[key])
                            : riskFactorSet.has(key);
                        return (
                          <div
                            key={key}
                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2"
                          >
                            <span>{riskFactorLabels[key]}</span>
                            <span
                              className={
                                isActive
                                  ? "font-semibold text-emerald-700"
                                  : "text-slate-400"
                              }
                            >
                              {isActive ? "Yes" : "No"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      Age, sex, BMI, blood pressure, and blood sugar are treated as
                      parameters and not shown as risk factors.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleDownloadSelected}
                      className="btn-secondary"
                      disabled={isDownloading}
                    >
                      {isDownloading
                        ? "Preparing..."
                        : "Download Selected Report"}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadAll}
                      className="btn-secondary"
                      disabled={isDownloading}
                    >
                      Download Full History
                    </button>
                    {downloadError ? (
                      <span className="text-sm text-rose-600">
                        {downloadError}
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600">
                  Select a diagnosis entry to view details.
                </p>
              )}
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Prediction Confidence Chart
              </h2>
              {predictions.length > 0 ? (
                <div className="mt-4 h-64 rounded-lg border border-slate-200 bg-white p-4">
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
                      <Bar dataKey="probability" fill="#0f766e" />
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
