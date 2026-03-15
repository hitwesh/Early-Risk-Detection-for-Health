import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  downloadUserReport,
  getToken,
} from "../services/auth.js";

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

const normalizePredictions = (raw) => {
  if (!raw) {
    return [];
  }

  const normalizedRaw = raw?.predictions ?? raw;
  const candidates =
    normalizedRaw?.predictions ||
    normalizedRaw?.results ||
    normalizedRaw?.top_predictions ||
    normalizedRaw?.topPredictions;

  if (
    Array.isArray(normalizedRaw?.diseases) &&
    Array.isArray(normalizedRaw?.probabilities)
  ) {
    return normalizedRaw.diseases.map((disease, index) => ({
      disease,
      probability: coercePercent(normalizedRaw.probabilities[index] ?? 0),
    }));
  }

  if (!Array.isArray(candidates)) {
    return [];
  }

  return candidates
    .map((item) => {
      const disease = item.disease || item.label || item.name || "Unknown";
      const probability =
        item.probability ?? item.score ?? item.confidence ?? item.prob;
      return {
        disease,
        probability: coercePercent(probability),
      };
    })
    .filter((item) => item.disease);
};

const extractExplainableSymptoms = (raw) => {
  if (!raw) {
    return [];
  }
  const fromExplainability =
    raw.explainability?.symptoms || raw.explainability?.contributors;
  const fromTopLevel =
    raw.key_symptoms ||
    raw.explainable_symptoms ||
    raw.explainableSymptoms ||
    raw.contributors;
  const symptoms = fromExplainability || fromTopLevel || [];

  if (!Array.isArray(symptoms)) {
    return [];
  }

  return symptoms.filter(Boolean);
};

const Results = () => {
  const [response, setResponse] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [historyId, setHistoryId] = useState(null);
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const predictions = useMemo(() => normalizePredictions(response), [response]);
  const explainableSymptoms = useMemo(
    () => extractExplainableSymptoms(response),
    [response],
  );

  useEffect(() => {
    const storedResponse = sessionStorage.getItem("diagnosisResponse");
    const storedSymptoms = sessionStorage.getItem("diagnosisSymptoms");
    const storedHistoryId = sessionStorage.getItem("diagnosisHistoryId");

    if (storedResponse) {
      setResponse(JSON.parse(storedResponse));
    }
    if (storedSymptoms) {
      setSymptoms(JSON.parse(storedSymptoms));
    }
    if (storedHistoryId) {
      setHistoryId(Number(storedHistoryId));
    }
  }, []);

  const handleDownloadSingle = async () => {
    if (!historyId) {
      setDownloadError("Save a diagnosis before downloading a report.");
      return;
    }
    setIsDownloading(true);
    setDownloadError("");
    try {
      await downloadUserReport(historyId);
    } catch (err) {
      setDownloadError("Unable to download the report.");
    } finally {
      setIsDownloading(false);
    }
  };


  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
          AI Report
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Results</h1>
      </div>
      {symptoms.length > 0 && (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-600 shadow-md">
          Submitted symptoms: {symptoms.join(", ")}
        </div>
      )}
      {response ? (
        <div className="space-y-6">
          {getToken() ? (
            <section className="flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 text-sm text-slate-600 shadow-md">
              <button
                type="button"
                onClick={handleDownloadSingle}
                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 transition duration-200 hover:border-rose-300 hover:bg-rose-100"
                disabled={isDownloading}
              >
                {isDownloading ? "Preparing..." : "Download Report PDF"}
              </button>
              {downloadError ? (
                <span className="text-sm text-rose-600">{downloadError}</span>
              ) : null}
            </section>
          ) : null}
          <section className="space-y-3 rounded-xl bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold">Top Predictions</h2>
            {predictions.length > 0 ? (
              <ul className="space-y-2">
                {predictions.map((item) => (
                  <li
                    key={item.disease}
                    className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50/40 px-4 py-2 text-sm"
                  >
                    <span className="font-medium text-slate-900">
                      {item.disease}
                    </span>
                    <span className="text-slate-600">
                      {item.probability.toFixed(1)}%
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-600">
                No prediction data returned from the backend.
              </p>
            )}
          </section>

          <section className="space-y-3 rounded-xl bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold">
              Prediction Confidence Chart
            </h2>
            {predictions.length > 0 ? (
              <div className="h-64 rounded-lg border border-rose-100 bg-rose-50/40 p-4">
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
              <p className="text-sm text-slate-600">
                Submit symptoms to visualize prediction confidence.
              </p>
            )}
          </section>

          <section className="space-y-3 rounded-xl bg-white p-6 shadow-md">
            <h2 className="text-lg font-semibold">Explainable AI</h2>
            {explainableSymptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {explainableSymptoms.map((symptom, index) => (
                  <span
                    key={`${symptom}-${index}`}
                    className="rounded-full bg-rose-50 px-3 py-1 text-sm text-rose-900"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-600">
                No explainable symptom details were provided by the backend.
              </p>
            )}
          </section>
        </div>
      ) : (
        <div className="rounded-xl bg-white p-4 text-sm text-slate-600 shadow-md">
          No diagnosis data yet. Submit symptoms to see results.
        </div>
      )}
    </section>
  );
};

export default Results;
