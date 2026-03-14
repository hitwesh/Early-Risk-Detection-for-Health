import { Link } from "react-router-dom";

const Landing = () => {
  const features = [
    {
      title: "AI Symptom Analysis",
      description:
        "Transforms symptom input into ranked disease predictions using machine learning models.",
    },
    {
      title: "Dynamic Question Engine",
      description:
        "Asks targeted follow-up questions to improve diagnostic accuracy.",
    },
    {
      title: "Explainable AI",
      description:
        "Highlights the symptoms contributing to each prediction so results remain transparent.",
    },
    {
      title: "Risk Factor Weighting",
      description:
        "Adjusts predictions using contextual factors such as patient history and risk indicators.",
    },
  ];

  const steps = [
    "Enter your symptoms",
    "AI asks follow-up questions",
    "Receive disease risk predictions",
  ];

  return (
    <section className="space-y-12">
      {/* HERO SECTION */}
      <div className="rounded-xl bg-white p-10 shadow-md">
        <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
          AI Medical Assistant
        </p>

        <h1 className="mt-2 text-4xl font-bold text-slate-900">SymptoScan</h1>

        <p className="mt-3 text-base text-slate-600">
          AI-Powered Early Health Risk Detection
        </p>

        <p className="mt-4 max-w-xl text-sm text-slate-600">
          SymptoScan analyzes symptoms using artificial intelligence to predict
          potential diseases early and help users understand possible health
          risks before conditions worsen.
        </p>

        <Link
          to="/diagnosis"
          className="mt-6 inline-flex rounded-lg bg-rose-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
        >
          Start AI Diagnosis
        </Link>
      </div>

      {/* ABOUT SECTION */}
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="text-lg font-semibold text-slate-900">
          About SymptoScan
        </h2>

        <p className="mt-3 text-sm text-slate-600">
          SymptoScan is an AI-powered system designed to help users gain early
          insights into potential health conditions. By analyzing symptoms and
          applying machine learning models, the system predicts possible
          diseases while also providing explainable insights into the reasoning
          behind each prediction.
        </p>
      </div>

      {/* HOW IT WORKS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">How It Works</h2>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="rounded-xl bg-white p-5 shadow-md">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-500">
                Step {index + 1}
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Key Features</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl bg-white p-5 shadow-md"
            >
              <p className="text-sm font-semibold text-slate-900">
                {feature.title}
              </p>

              <p className="mt-2 text-sm text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DISCLAIMER */}
      <p className="text-xs text-slate-500">
        This system provides early health risk insights and is intended for
        educational purposes only. It does not replace professional medical
        diagnosis or advice from qualified healthcare providers.
      </p>
    </section>
  );
};

export default Landing;
