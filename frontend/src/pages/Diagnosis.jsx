import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../services/api.js";

const Diagnosis = () => {
  const [formValues, setFormValues] = useState({
    age: "",
    sex: "male",
    bmi: "",
    bloodPressure: "",
    bloodSugar: "",
    diabetesHistory: "no",
    hypertensionHistory: "no",
    smoking: "no",
    alcohol: "no",
    familyHeartDisease: "no",
    recentInfection: "no",
    chronicDisease: "no",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState(null);
  const [remainingCases, setRemainingCases] = useState(null);
  const [engine, setEngine] = useState("");
  const navigate = useNavigate();

  const handleChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const updateProgress = (data) => {
    const remaining = data?.remaining_cases ?? data?.remainingCases;
    if (Number.isFinite(remaining)) {
      setRemainingCases(remaining);
    } else if (remaining !== undefined && remaining !== null) {
      setRemainingCases(Number(remaining));
    }

    if (data?.engine) {
      setEngine(String(data.engine));
    }
  };

  const handleResponse = (data) => {
    updateProgress(data);

    if (data?.question) {
      setFollowUpQuestion(data.question);
      return;
    }

    sessionStorage.setItem("diagnosisResponse", JSON.stringify(data));

    const historyEntry = {
      symptoms: ["Risk factor intake"],
      topPrediction: getTopPrediction(data),
      timestamp: new Date().toISOString(),
    };
    const existingHistory = JSON.parse(
      localStorage.getItem("diagnosisHistory") || "[]",
    );
    localStorage.setItem(
      "diagnosisHistory",
      JSON.stringify([historyEntry, ...existingHistory].slice(0, 10)),
    );

    navigate("/results");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFollowUpQuestion("");
    setFollowUpAnswer(null);

    setIsSubmitting(true);

    try {
      const payload = {
        age: Number(formValues.age),
        sex: formValues.sex,
        bmi: Number(formValues.bmi),
        blood_pressure: Number(formValues.bloodPressure),
        blood_sugar: Number(formValues.bloodSugar),
        diabetes_history: formValues.diabetesHistory === "yes",
        hypertension_history: formValues.hypertensionHistory === "yes",
        smoking: formValues.smoking === "yes",
        alcohol: formValues.alcohol === "yes",
        family_heart_disease: formValues.familyHeartDisease === "yes",
        recent_infection: formValues.recentInfection === "yes",
        chronic_disease: formValues.chronicDisease === "yes",
      };

      const response = await fetch(buildApiUrl("/api/diagnose"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Diagnosis request failed. Please try again.");
      }

      const data = await response.json();
      handleResponse(data);
    } catch (err) {
      setError(err.message ?? "Unable to submit symptoms.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAnswer = async (answer) => {
    setFollowUpAnswer(answer);
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/api/diagnose"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answer }),
      });

      if (!response.ok) {
        throw new Error("Diagnosis request failed. Please try again.");
      }

      const data = await response.json();
      handleResponse(data);
    } catch (err) {
      setError(err.message ?? "Unable to submit symptoms.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTopPrediction = (data) => {
    const candidates =
      data?.predictions ||
      data?.results ||
      data?.top_predictions ||
      data?.topPredictions ||
      [];

    if (!Array.isArray(candidates) || candidates.length === 0) {
      return "Unknown";
    }

    const normalized = candidates.map((item) => {
      const label = item.disease || item.label || item.name || "Unknown";
      const score = Number(
        item.probability ?? item.score ?? item.confidence ?? item.prob ?? 0,
      );
      return { label, score };
    });

    const sorted = normalized.sort((a, b) => b.score - a.score);
    return sorted[0]?.label || "Unknown";
  };

  return (
    <section className="fade-in space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
          Patient Intake
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Diagnosis
        </h1>
      </div>
      <form
        className="space-y-4 rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              type="number"
              min="0"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formValues.age}
              onChange={handleChange("age")}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="sex">
              Sex
            </label>
            <select
              id="sex"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formValues.sex}
              onChange={handleChange("sex")}
            >
              <option value="male">male</option>
              <option value="female">female</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700" htmlFor="bmi">
              BMI
            </label>
            <input
              id="bmi"
              type="number"
              min="0"
              step="0.1"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formValues.bmi}
              onChange={handleChange("bmi")}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="bloodPressure"
            >
              Blood Pressure
            </label>
            <input
              id="bloodPressure"
              type="number"
              min="0"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formValues.bloodPressure}
              onChange={handleChange("bloodPressure")}
            />
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-700"
              htmlFor="bloodSugar"
            >
              Blood Sugar
            </label>
            <input
              id="bloodSugar"
              type="number"
              min="0"
              className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
              value={formValues.bloodSugar}
              onChange={handleChange("bloodSugar")}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { key: "diabetesHistory", label: "Diabetes history" },
            { key: "hypertensionHistory", label: "Hypertension history" },
            { key: "smoking", label: "Smoking" },
            { key: "alcohol", label: "Alcohol use" },
            { key: "familyHeartDisease", label: "Family heart disease" },
            { key: "recentInfection", label: "Recent infection" },
            { key: "chronicDisease", label: "Chronic disease history" },
          ].map((field) => (
            <div className="space-y-2" key={field.key}>
              <label className="text-sm font-medium text-slate-700">
                {field.label}
              </label>
              <select
                className="w-full rounded-lg border border-rose-200 bg-rose-50/40 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-200"
                value={formValues[field.key]}
                onChange={handleChange(field.key)}
              >
                <option value="no">no</option>
                <option value="yes">yes</option>
              </select>
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-rose-600">{error}</p>}

        {isSubmitting && (
          <p className="text-sm text-rose-600">Analyzing symptoms...</p>
        )}

        <button
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition duration-200 ease-in-out hover:scale-105 hover:bg-rose-700 hover:shadow-lg active:scale-95"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Analyzing symptoms..." : "Start AI Diagnosis"}
        </button>
      </form>

      <div className="rounded-xl border border-rose-200 bg-white/70 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
        <h2 className="text-lg font-semibold text-slate-900">
          AI Analysis Progress
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Possible conditions remaining: {remainingCases ?? "--"}
        </p>
        {engine && (
          <p className="mt-2 text-sm text-slate-600">
            AI Engine: {formatEngine(engine)}
          </p>
        )}
        <p className="mt-2 text-sm text-slate-600">
          The AI is narrowing possible conditions based on your answers.
        </p>
      </div>

      {followUpQuestion && (
        <div className="fade-in rounded-xl border border-white/30 bg-white/60 p-6 shadow-xl backdrop-blur-md transition duration-200 hover:-translate-y-1 hover:shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-900">
            Follow-up Question
          </h2>
          <p className="mt-2 text-sm text-slate-600">{followUpQuestion}</p>
          <div className="mt-4 flex gap-3">
            {["Yes", "No"].map((label) => {
              const value = label.toLowerCase();
              const isActive = followUpAnswer === value;
              return (
                <button
                  key={label}
                  type="button"
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95 ${
                    isActive
                      ? "bg-rose-600 text-white"
                      : "border border-rose-200 bg-white text-rose-900"
                  }`}
                  onClick={() => handleAnswer(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};

const formatEngine = (engineValue) => {
  const normalized = engineValue.toLowerCase();
  if (normalized.includes("bayes")) {
    return "Bayesian Triage";
  }
  if (normalized.includes("entropy")) {
    return "Entropy Selection";
  }
  return engineValue;
};

export default Diagnosis;
