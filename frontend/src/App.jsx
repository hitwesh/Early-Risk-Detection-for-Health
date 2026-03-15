import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Diagnosis from "./pages/Diagnosis.jsx";
import Results from "./pages/Results.jsx";
import UserPanel from "./pages/UserPanel.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 text-slate-900">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/results" element={<Results />} />
          <Route path="/user" element={<UserPanel />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
