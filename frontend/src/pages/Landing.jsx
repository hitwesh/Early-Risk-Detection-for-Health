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
    <section className="fade-in space-y-16">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="eyebrow">AI medical assistant</p>
          <h1 className="font-display text-4xl font-semibold text-slate-900 md:text-5xl">
            Clinical decision support for early risk detection.
          </h1>
          <p className="section-subtitle max-w-2xl">
            SymptoScan blends patient symptoms, risk factors, and explainable AI
            to surface early health insights. Built to feel like a professional
            medical workflow, not a tech demo.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/diagnosis" className="btn-primary">
              Start AI Diagnosis
            </Link>
            <Link to="/user" className="btn-secondary">
              View Patient Portal
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500">
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
              HIPAA-inspired workflows
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
              Audit-ready history
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">
              Explainable predictions
            </span>
          </div>
        </div>

        <div className="card p-8">
          <p className="eyebrow">Clinical snapshot</p>
          <h2 className="font-display text-2xl text-slate-900">
            Today&apos;s care overview
          </h2>
          <div className="mt-6 space-y-4">
            <div className="card-muted p-4">
              <p className="text-sm font-semibold text-slate-800">
                Active monitoring
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Track symptom progression, risk factors, and follow-up questions
                in one dashboard.
              </p>
            </div>
            <div className="card-muted p-4">
              <p className="text-sm font-semibold text-slate-800">
                Responsible AI
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Transparent reasoning highlights the strongest contributors to
                each prediction.
              </p>
            </div>
            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Readiness
                </p>
                <p className="mt-1 font-semibold text-slate-800">
                  Clinic-grade output
                </p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl text-slate-900">
              About SymptoScan
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              SymptoScan is an AI-enabled clinical support tool designed to help
              clinicians and patients detect early risks, prioritize follow-up,
              and retain a transparent audit trail of each assessment.
            </p>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Coverage
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">440+</p>
              <p className="text-xs text-slate-500">Conditions monitored</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">
                Efficiency
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">3.2x</p>
              <p className="text-xs text-slate-500">Faster triage</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-slate-900">How it works</h2>
          <p className="text-sm text-slate-500">Designed for clinical clarity</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="card-muted p-6">
              <p className="eyebrow">Step {index + 1}</p>
              <p className="mt-4 text-sm font-semibold text-slate-900">{step}</p>
              <p className="mt-2 text-sm text-slate-600">
                Guided prompts keep the workflow aligned with clinical history
                and risk factors.
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl text-slate-900">Key features</h2>
          <p className="text-sm text-slate-500">Evidence-based signal design</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="card p-6">
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

      <div className="card-muted p-5 text-xs text-slate-500">
        This system provides early health risk insights and is intended for
        educational purposes only. It does not replace professional medical
        diagnosis or advice from qualified healthcare providers.
      </div>
    </section>
  );
};

export default Landing;
