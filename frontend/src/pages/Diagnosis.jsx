import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildApiUrl } from "../services/api.js";
import { buildAuthHeaders, getToken } from "../services/auth.js";
import CustomDropdown from "../components/CustomDropdown.jsx";

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
    pregnancy: "no",
    chronicDisease: "no",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [followUpAnswer, setFollowUpAnswer] = useState(null);
  const [remainingCases, setRemainingCases] = useState(null);
  const [engine, setEngine] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [currentSymptom, setCurrentSymptom] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
    }
  }, [navigate]);

  const ageValue = Number(formValues.age);
  const isAdult = Number.isFinite(ageValue) ? ageValue >= 18 : false;
  const showPregnancy = formValues.sex === "female" && isAdult;

  useEffect(() => {
    if (!showPregnancy && formValues.pregnancy !== "no") {
      setFormValues((prev) => ({ ...prev, pregnancy: "no" }));
    }
  }, [showPregnancy, formValues.pregnancy]);

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

    if (data?.session_id) {
      setSessionId(data.session_id);
    }

    if (data?.symptom) {
      setCurrentSymptom(data.symptom);
    }

    if (data?.question) {
      setFollowUpQuestion(data.question);
      return;
    }

    const finalResult = data?.predictions ?? data;
    const historyId = data?.history_id ?? data?.historyId ?? finalResult?.history_id;
    sessionStorage.setItem("diagnosisResponse", JSON.stringify(finalResult));
    if (historyId) {
      sessionStorage.setItem("diagnosisHistoryId", String(historyId));
    } else {
      sessionStorage.removeItem("diagnosisHistoryId");
    }
    if (data?.positive_symptoms) {
      sessionStorage.setItem(
        "diagnosisSymptoms",
        JSON.stringify(data.positive_symptoms),
      );
    } else {
      sessionStorage.removeItem("diagnosisSymptoms");
    }

    navigate("/results");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setFollowUpQuestion("");
    setFollowUpAnswer(null);
    setSessionId(null);
    setCurrentSymptom("");

    setIsSubmitting(true);

    try {
      const optionalNumber = (value) => (value === "" ? undefined : Number(value));

      const payload = {
        age: optionalNumber(formValues.age),
        sex: formValues.sex,
        bmi: optionalNumber(formValues.bmi),
        bp: optionalNumber(formValues.bloodPressure),
        blood_sugar: optionalNumber(formValues.bloodSugar),
        diabetes: formValues.diabetesHistory === "yes",
        hypertension: formValues.hypertensionHistory === "yes",
        smoking: formValues.smoking === "yes",
        alcohol: formValues.alcohol === "yes",
        family_heart_disease: formValues.familyHeartDisease === "yes",
        recent_infection: formValues.recentInfection === "yes",
        pregnancy: showPregnancy ? formValues.pregnancy === "yes" : false,
        chronic_disease: formValues.chronicDisease === "yes",
      };

      const response = await fetch(buildApiUrl("/diagnosis/start"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAuthHeaders(),
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
    if (!sessionId || !currentSymptom) {
      setError("Diagnosis session not initialized. Please restart.");
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/diagnosis/answer"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...buildAuthHeaders(),
        },
        body: JSON.stringify({
          session_id: sessionId,
          symptom: currentSymptom,
          answer: answer === "yes",
        }),
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
    if (Array.isArray(data?.diseases) && Array.isArray(data?.probabilities)) {
      const paired = data.diseases.map((disease, index) => ({
        label: disease,
        score: Number(data.probabilities[index] ?? 0),
      }));
      const sorted = paired.sort((a, b) => b.score - a.score);
      return sorted[0]?.label || "Unknown";
    }

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
    <section className="fade-in min-h-[75vh] space-y-8 pb-16">
      <div>
        <p className="eyebrow">Patient intake</p>
        <h1 className="mt-2 font-display text-3xl text-slate-900">
          Clinical assessment
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Provide patient health parameters to begin AI diagnosis.
        </p>
      </div>

      {followUpQuestion ? (
        <div className="fade-in card p-8">
          <p className="eyebrow">Follow-up</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            Follow-up Question
          </h2>
          <p className="mt-2 text-sm text-slate-600">{followUpQuestion}</p>
          <div className="mt-6 flex gap-3">
            {"Yes,No".split(",").map((label) => {
              const value = label.toLowerCase();
              const isActive = followUpAnswer === value;
              return (
                <button
                  key={label}
                  type="button"
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition duration-200 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95 ${
                    isActive
                      ? "bg-teal-700 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                  onClick={() => handleAnswer(value)}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <form
          className="card mx-auto max-w-4xl space-y-4 p-8"
          onSubmit={handleSubmit}
        >
          <div className="border-t border-slate-200 pt-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg p-2 transition duration-150 hover:bg-slate-50">
                <label
                  className="mb-1 block text-sm font-medium text-slate-700"
                  htmlFor="age"
                >
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  value={formValues.age}
                  onChange={handleChange("age")}
                />
              </div>

              <div className="rounded-lg p-2 transition duration-150 hover:bg-slate-50">
                <label
                  className="mb-1 block text-sm font-medium text-slate-700"
                  htmlFor="sex"
                >
                  Sex
                </label>
                <CustomDropdown
                  id="sex"
                  value={formValues.sex}
                  onChange={(val) =>
                    setFormValues((prev) => ({ ...prev, sex: val }))
                  }
                  options={"male,female".split(",")}
                  placeholder="Select"
                />
              </div>

              <div className="rounded-lg p-2 transition duration-150 hover:bg-slate-50">
                <label
                  className="mb-1 block text-sm font-medium text-slate-700"
                  htmlFor="bmi"
                >
                  BMI
                </label>
                <input
                  id="bmi"
                  type="number"
                  min="0"
                  step="0.1"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  value={formValues.bmi}
                  onChange={handleChange("bmi")}
                />
              </div>

              <div className="rounded-lg p-2 transition duration-150 hover:bg-slate-50">
                <label
                  className="mb-1 block text-sm font-medium text-slate-700"
                  htmlFor="bloodPressure"
                >
                  Blood Pressure
                </label>
                <input
                  id="bloodPressure"
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  value={formValues.bloodPressure}
                  onChange={handleChange("bloodPressure")}
                />
              </div>

              <div className="rounded-lg p-2 transition duration-150 hover:bg-slate-50">
                <label
                  className="mb-1 block text-sm font-medium text-slate-700"
                  htmlFor="bloodSugar"
                >
                  Blood Sugar
                </label>
                <input
                  id="bloodSugar"
                  type="number"
                  min="0"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition duration-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  value={formValues.bloodSugar}
                  onChange={handleChange("bloodSugar")}
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {[
                { key: "diabetesHistory", label: "Diabetes history" },
                { key: "hypertensionHistory", label: "Hypertension history" },
                { key: "smoking", label: "Smoking" },
                { key: "alcohol", label: "Alcohol use" },
                { key: "familyHeartDisease", label: "Family heart disease" },
                { key: "recentInfection", label: "Recent infection" },
                ...(showPregnancy
                  ? [{ key: "pregnancy", label: "Pregnancy" }]
                  : []),
                { key: "chronicDisease", label: "Chronic disease history" },
              ].map((field) => (
                <div
                  className="rounded-lg p-2 transition duration-150 hover:bg-slate-50"
                  key={field.key}
                >
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    {field.label}
                  </label>
                  <CustomDropdown
                    value={formValues[field.key]}
                    onChange={(val) =>
                      setFormValues((prev) => ({ ...prev, [field.key]: val }))
                    }
                    options={"no,yes".split(",")}
                    placeholder="Select"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          {isSubmitting && (
            <p className="text-sm text-slate-500">Analyzing symptoms...</p>
          )}

          <div className="flex justify-center pt-2">
            <button className="btn-primary flex items-center gap-2" type="submit" disabled={isSubmitting}>
              <span>
                {isSubmitting ? "Analyzing symptoms..." : "Start AI Diagnosis"}
              </span>
              {!isSubmitting && <span aria-hidden="true">&rarr;</span>}
            </button>
          </div>
        </form>
      )}
    </section>
  );
};

const formatEngine = (engineValue) => {
  const normalized = engineValue.toLowerCase();
  if (normalized.includes("bayes") && normalized.includes("entropy")) {
    return "Bayesian Update + Entropy Selection";
  }
  if (normalized.includes("bayes")) {
    return "Bayesian Update";
  }
  if (normalized.includes("entropy")) {
    return "Entropy Selection";
  }
  return engineValue;
};

export default Diagnosis;
