const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800/60 bg-slate-900 text-slate-200">
      <div className="page-wrapper space-y-10 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">
              Team
            </p>
            <h3 className="font-display text-xl text-white">CTRL-C & CTRL-V</h3>
            <p className="text-sm text-slate-400">
              Hackathon project focused on early risk detection and explainable
              AI in clinical workflows.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">
              Team members
            </p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <a
                  href="https://www.linkedin.com/in/hiteshkumarroy"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-200 transition duration-200 hover:text-teal-200"
                >
                  Hitesh Kumar Roy (Team-Leader)
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/tamoghno-das/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-200 transition duration-200 hover:text-teal-200"
                >
                  Tamoghno Das
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/debadrita-chowdhury/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-200 transition duration-200 hover:text-teal-200"
                >
                  Debadrita Chowdhury
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">
              Links
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/hitwesh/Early-Risk-Detection-for-Health"
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-200 transition duration-200 hover:text-teal-200"
                >
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-800/70 pt-6 text-base text-slate-400 md:flex-row">
          <span>SymptoScan | Clinical decision support</span>
          <span>Copyright © {year} CTRL-C & CTRL-V. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
