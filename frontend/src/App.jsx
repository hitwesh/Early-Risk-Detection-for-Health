import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Diagnosis from "./pages/Diagnosis.jsx";
import Results from "./pages/Results.jsx";
import Dashboard from "./pages/Dashboard.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-rose-200 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/results" element={<Results />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
